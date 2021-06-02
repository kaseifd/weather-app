import '../assets/sass/main.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzZWlmZCIsImEiOiJja29qcDk3NzQwZTM0Mm9ud3BwcTRkMW0yIn0.4XuTSFjZUS1tI0MGezz4Qw';
import logo from '../assets/img/logo.png';
import cloudy from '../assets/img/cloudy.jpg';
import drizzle from '../assets/img/drizzle.jpg';
import snow from '../assets/img/snow.jpg';
import storm from '../assets/img/storm.jpg';
import sunny from '../assets/img/sunny.jpg';



//ORGANIZACIÓN 

window.addEventListener("load", () => {
    loadMapView();
    


});




let map;

const app = document.querySelector(".app");
const header = app.querySelector(".header");
const footer = app.querySelector(".footer");
const overlay = app.querySelector(".overlay");
const blackOverlay = app.querySelector(".black_overlay");
const spinner = document.querySelector(".spinner")


let weather
let center
let zoom





//TAREA 1: CARGAR MAPVIEW

let markersPosition;




const loadMapView = () => {
    loadMarkers();
    initCenter();

    renderMapViewHeader();
    renderMapViewMain();
    renderMapViewFooter();


}


const loadMarkers = () => {
    const storedMarkers = localStorage.getItem("markers")
    if (storedMarkers == null) {
        markersPosition = [];
    } else {
        markersPosition = JSON.parse(storedMarkers)
    }

}

const initCenter = () => {
    const storedCenter = localStorage.getItem("center")
    if (storedCenter) {
        center = [JSON.parse(storedCenter).lng, JSON.parse(storedCenter).lat],
        zoom = JSON.parse(storedCenter).zoom

    } else {
        center = [34, 23],
        zoom = 5
    }
}

const renderMapViewHeader = () => {
    header.innerHTML = `
        <div class="header_brand">
        <img src="${logo}" alt="";
        </div>
        <div class="profile">
            <div class="user">
                <div class="fa fa-user-circle"></div>
            </div>
        </div> 
    `
}

const renderMapViewMain = () => {
    renderMap()
    renderMarkers();
    initMapEvents();
}

const renderMapViewFooter = () => {
    footer.innerHTML = `
    <div class="categories">
        <div class="marked icon">
            <div class="fas fa-map-marker-alt"></div>
        </div>
        <div class="favs icon">
            <div class="fas fa-star"></div>
        </div>
        <div class="museums icon">
            <div class="fas fa-university"></div>
        </div>
        <div class="restaurants icon">
            <div class="fas fa-utensils"></div>
        </div>
        <div class="pub icon">
            <div class="fas fa-glass-martini-alt"></div>
        </div>
        <div class="forest icon">
            <div class="fas fa-tree"></div>
        </div>
        <div class="shop icon">
            <div class="fas fa-shopping-bag"></div>
        </div>
    </div>
    <div class="go_position">
        <div class="position ">
            <div class="fas fa-crosshairs"></div>
            <p>Go to my position</p>
        </div>
    </div>
`
    goPosition();
}

const renderMap = () => {

    map = new mapboxgl.Map({
        container: "mapa",
        style: "mapbox://styles/kaseifd/ckp11we8w0mx318qu3kurtnfq",
        center: center,
        zoom: zoom,
    });

}


const renderMarkers = () => {
    markersPosition.forEach(m => {
        const marker = new mapboxgl.Marker().setLngLat([m.coord.lon, m.coord.lat]).addTo(map);

    })
}





//TAREA 3: IR A POSICION (boton del footer)

const goPosition = () => {
    const goPosition = document.querySelector(".go_position");
    goPosition.addEventListener("click", () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lng = position.coords.longitude;
            const lat = position.coords.latitude;

            //
            map.flyTo({
                center: [lng, lat],
                zoom: 15
            })
        });
    });
}






//TAREA 2: NAVEGAR EN EL MAPA (eventos del mapa: guardar ultima posicion en localStorage y al hacer click: abrir modal)

const initMapEvents = () => {
    //move
    map.on("move", (ev) => {
        const center = ev.target.getCenter();
        const zoom = ev.target.getZoom();
        const storingObj = {
            lat: center.lat,
            lng: center.lng,
            zoom: zoom,
        };
        localStorage.setItem("center", JSON.stringify(storingObj))
    })
    //click
    map.on("click", async (ev) => {
        loadSingleView(ev.lngLat);
    }
    )
}





const loadSingleView = async (lngLat) => {
    await fetchWeather(lngLat);
    renderOverlay();


    overlay.classList.add("opened");
    blackOverlay.classList.add("opened");

    location.hash = "single";

    blackOverlay.addEventListener("click", () => {
        overlay.classList.remove("opened");
        blackOverlay.classList.remove("opened");
        location.hash = "map";
    })



    const closeButtons = overlay.querySelectorAll(".close");

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener("click", () => {
            overlay.classList.remove("opened");
            blackOverlay.classList.remove("opened");
            location.hash = "map";
        })
    })
}



const loadSpinner = () => {
    spinner.classList.add("opened")
}

const unloadSpinner = () => {
    spinner.classList.remove("opened")
    
}



//TAREA 4: CONSULTAR TEMPERATURA (conectar a la api con fetch, recuperar los datos y pintarlos en el modal)

const fetchWeather = async (lngLat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=083f19514de775916c615a6d803b575e&units=metric`;
    weather = await fetch(url).then(d => d.json()).then(d => d);
}

let icon 
let weatherImage
const changeIcon = () => {
    
    if (weather.weather[0].main == "Clouds") {
        icon = '<div class="fas fa-cloud"></div>' 
    }
    if (weather.weather[0].main == "Clear") {
        icon = '<div class="fas fa-sun"></div>' 
    }
    if (weather.weather[0].main == "Snow") {
        icon = '<div class="fas fa-snowflake"></div>' 
    }
    if (weather.weather[0].main == "Thunderstorm" || weather.weather[0].main == "Rain") {
        icon = '<div class="fas fa-cloud-showers-heavy"></div>' 
    }
    if (weather.weather[0].main == "Drizzle") {
        icon = '<div class="fas fa-cloud-rain"></div>' 
    }
}


const changeImage = () => {
    
    if (weather.weather[0].main == "Clouds") {
        weatherImage = `<img src="${cloudy}" alt="">`
    }
    if (weather.weather[0].main == "Clear") {
        weatherImage = `<img src="${sunny}" alt="">` 
    }
    if (weather.weather[0].main == "Snow") {
        weatherImage = `<img src="${snow}" alt="">`
    }
    if (weather.weather[0].main == "Thunderstorm" || weather.weather[0].main == "Rain") {
        weatherImage = `<img src="${storm}" alt="">`
    }
    if (weather.weather[0].main == "Drizzle") {
        weatherImage = `<img src="${drizzle}" alt="">` 
    }
}



const renderOverlay = () => {
    changeIcon()
    changeImage()
    overlay.innerHTML = `
    <div class="weather_image">${weatherImage}</div>
        <header>
            <h1 class="place">${weather.name}</h1>
            <div class="close">
                <div class="fas fa-times"></div>
            </div>
        </header>

        <main>
            <div class="weather_list">
                <div class="weather_list_item">

                    <div class="humidity">
                        <div class="drop">
                            <div class="fas fa-tint"></div>
                        </div>
                        <p class="humidity_percentage">${weather.main.humidity}%</p>
                    </div>

                    <div class="weather">
                        <div class="weather_icon">
                            ${icon}
                        </div>
                        <p class="temperature">${weather.main.temp}°C</p>
                    </div>

                    <div class="wind">
                        <div class="direction">
                            <div class="fas fa-location-arrow" style = "transform: rotate(${weather.wind.deg}deg)"></div>
                        </div>
                        <p class="velocity">${weather.wind.speed}mph</p>
                    </div>

                </div>
            </div>
        </main>

        <footer>
            <div class="close">
                <div class="back">
                    <div class="fas fa-arrow-left"></div>
                    <p>Get back to map</p>
                </div>
            </div>
            <div class="save_place">
                <div class="save">
                    <div class="fas fa-save"></div>
                    <p>Save place</p>
                </div>
            </div>
        </footer>    
    `
    saveMarker()
}


//eventos del footer: go back (la funcion esta mas arriba) y save place (guardar marcado en localStorage y volver al mapView) 

const saveMarker = () => {
    const save = overlay.querySelector(".save_place")
    save.addEventListener("click", () => {
        markersPosition.push(weather)

        loadSpinner()
        setTimeout(() => {
            unloadSpinner()
            loadMapView();
        }, 800)
        overlay.classList.remove("opened");
        blackOverlay.classList.remove("opened");
        location.hash = "map";

        localStorage.setItem("markers", JSON.stringify(markersPosition))
    })
}


























