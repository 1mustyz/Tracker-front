<script>
    // import mapStyles from './map-styles'; // optional


   let container;
   let map;
   let zoom = 15;
   let center = {lat: 9.1992, lng: 12.4988};
   
   import { onMount } from 'svelte';
   
   onMount(async () => {
       map = new google.maps.Map(container, {
           zoom,
           center,
        //    styles: mapStyles // optional
       });

       let marker = new google.maps.Marker({
           position:center,
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