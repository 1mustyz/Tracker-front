
<div id='map' style='width: 400px; height: 300px;'></div>
<script>
mapboxgl.accessToken = 'pk.eyJ1IjoiMW11c3R5eiIsImEiOiJja3h0aWNnMDMxMjkyMnZvMG03OWlyc29qIn0.rqER_52zodUh9hj6ZjPIhg';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});
</script>