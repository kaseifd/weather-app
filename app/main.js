import '../assets/sass/main.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoia2FzZWlmZCIsImEiOiJja29qcDk3NzQwZTM0Mm9ud3BwcTRkMW0yIn0.4XuTSFjZUS1tI0MGezz4Qw';


window.addEventListener("load", () => {
    loadMapView();
    
    //render
    renderApp()


    //eventos
    eventsMapView();
    
});

let map;

const app = document.querySelector(".app");
const header = app.querySelector(".header");
const main = app.querySelector(".main");
const footer = app.querySelector(".footer");
const overlay = app.querySelector(".overlay");
const blackOverlay = app.querySelector(".black_overlay");
let view;



const renderApp = () => {
    renderHeader();
    renderMap();
    renderFooter();
    
};



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
};

const renderHeader = () => {
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

const renderFooter = () => {
    footer.innerHTML = `
    <div class="categories">
        <div class="marked icon">
            <div class="fa fa-map-marker-alt"></div>
        </div>
        <div class="favs icon">
            <div class="fa fa-star"></div>
        </div>
        <div class="museums icon">
            <div class="fa fa-university"></div>
        </div>
        <div class="restaurants icon">
            <div class="fa fa-utensils"></div>
        </div>
        <div class="pub icon">
            <div class="fa fa-glass-martini-alt"></div>
        </div>
        <div class="forest icon">
            <div class="fa fa-tree"></div>
        </div>
        <div class="shop icon">
            <div class="fa fa-shopping-bag"></div>
        </div>
    </div>
    <div class="go_position">
        <div class="position ">
            <div class="fa fa-crosshairs "></div>
            <p>Go to my position</p>
        </div>
    </div>
`
}

const renderOverlay = () => {
    overlay.innerHTML = `
        <header>
            <h1 class="place">${weather.name} </h1>
            <div class="close">
                <div class="fa fa-times"></div>
            </div>
        </header>

        <main>
            <div class="weather_list">
                <div class="weather_list_item">

                    <div class="time">14:00</div>

                    <div class="weather">
                        <div class="weather_icon">
                            <div class="fa fa-cloud"></div>
                        </div>
                        <div class="temperature">22°C</div>
                    </div>

                    <div class="wind">
                        <div class="direction">
                            <div class="fa fa-location-arrow"></div>
                        </div>
                        <div class="velocity">14.78mph</div>
                    </div>

                </div>
                <div class="weather_list_item">

                    <div class="time">14:00</div>

                    <div class="weather">
                        <div class="weather_icon">
                            <div class="fa fa-cloud"></div>
                        </div>
                        <div class="temperature">22°C</div>
                    </div>

                    <div class="wind">
                        <div class="direction">
                            <div class="fa fa-location-arrow"></div>
                        </div>
                        <div class="velocity">14.78mph</div>
                    </div>

                </div>


            </div>
        </main>

        <footer>
            <div class="close">
                <div class="back">
                    <div class="fa fa-arrow-left"></div>
                    <p>Get back to map</p>
                </div>
            </div>
            <div class="save_place">
                <div class="save">
                    <div class="fa fa-save"></div>
                    <p>Save place</p>
                </div>
            </div>
        </footer>    
    `

}





// 

const eventsMapView = () => {
    goPosition();
    weatherConsult();

};

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

const weatherConsult = () => {
    map.on("click", async (ev) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${ev.lngLat.lat}&lon=${ev.lngLat.lng}&appid=083f19514de775916c615a6d803b575e`;
        const weather = await fetch(url).then(d => d.json()).then(d => d);
        console.log(weather.name);
        loadSingleView();  
    })
}






//

const loadSingleView = () => {
    
    overlay.classList.add("opened");
    blackOverlay.classList.add("opened");

    location.hash = "single";

    blackOverlay.addEventListener("click", () => {
        overlay.classList.remove("opened");
        blackOverlay.classList.remove("opened");
        location.hash = "map";
    })


    //
    // const closeButtons = overlay.querySelectorAll(".close");

    // closeButtons.addEventListener("click", () => {
    //     loadMapView();
    // })
}




// const loadMapView = () => {

//     // init procedures
//     overlay.classList.remove("opened");
//     blackOverlay.classList.remove("opened");
//     location.hash = "map";
//     view = "map";


//     //render
//     renderMap();


//     //events
//     eventsMapView();
// };








//ORGANIZACIÓN 
