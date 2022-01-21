<script>
    // import mapStyles from './map-styles'; // optional


   let container;
   let map;
   let zoom = 13;
   let center = {lat: 12.3984, lng: 9.3265};
   
   import { onMount } from 'svelte';
   
   onMount(async () => {
       map = new google.maps.Map(container, {
           zoom,
           center,
        //    styles: mapStyles // optional
       });

       marker = new google.maps.Marker({
           position:{lat: 12.4495, lng: 9.2485},
           map:map
       })
   });
</script>

<style>
.full-screen {
   width: 50vw;
   height: 50vh;
}
</style>

<div class="full-screen" bind:this={container}></div>