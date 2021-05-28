import '../assets/sass/main.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzZWlmZCIsImEiOiJja29qcDk3NzQwZTM0Mm9ud3BwcTRkMW0yIn0.4XuTSFjZUS1tI0MGezz4Qw';


//ORGANIZACIÓN 

window.addEventListener("load", () => {
    loadMapView();
    renderMap();
    // renderMarkers();
    initMapEvents();

});

let map;

const app = document.querySelector(".app");
const header = app.querySelector(".header");
const main = app.querySelector(".main");
const footer = app.querySelector(".footer");
const overlay = app.querySelector(".overlay");
const blackOverlay = app.querySelector(".black_overlay");

let weather 




//TAREA 1: CARGAR MAPVIEW

let markers;
let mapPosition;

const loadMarkers = () => {
    //localStorage
}

const loadMapInfo = () => {
    //localStorage
}


const loadMapView = () => {
    loadMarkers();
    loadMapInfo();
    renderMapViewHeader();
    renderMapViewMain();
    renderMapViewFooter();
}

const renderMapViewHeader = () => {
    header.innerHTML = `
        <div class="header_brand">
            <img src="/assets/img/logo.png" alt="">
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
            <div class="fas fa-crosshairs "></div>
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
        center: [0, 60],
        zoom: 9,
    });

    navigator.geolocation.getCurrentPosition(({ coords }) => {
        map.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 15
        });
    });

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






//TAREA 2 Y 4: NAVEGAR EN EL MAPA (eventos del mapa: guardar ultima posicion en localStorage y al hacer click: abrir modal y poner la temperatura del lugar)

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



//AQUI ME HE PERDIDO NO SE QUE HAGO :(

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
        })
    })
}

const fetchWeather = async (lngLat) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lngLat.lat}&lon=${lngLat.lng}&appid=083f19514de775916c615a6d803b575e&units=metric`;
        weather = await fetch(url).then(d => d.json()).then(d => d);
        console.log(weather);
}




const renderOverlay = () => {
    overlay.innerHTML = `
        <header>
            <h1 class="place">${weather.name} </h1>
            <div class="close">
                <div class="fas fa-times"></div>
            </div>
        </header>

        <main>
            <div class="weather_list">
                <div class="weather_list_item">

                    <div class="humidity">${weather.main.humidity}%</div>

                    <div class="weather">
                        <div class="weather_icon">
                            <div class="fas fa-cloud"></div>
                        </div>
                        <div class="temperature">${weather.main.temp}°C</div>
                    </div>

                    <div class="wind">
                        <div class="direction">
                            <div class="fas fa-location-arrow" style = "transform: rotate(${weather.wind.deg}deg)"></div>
                        </div>
                        <div class="velocity">${weather.wind.speed}mph</div>
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

}


























