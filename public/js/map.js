
{/* let mapToken = mapToken; */ }
{/* console.log("Map token:", mapToken); */ }

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [77.22445, 28.63576],
    zoom: 9
});
