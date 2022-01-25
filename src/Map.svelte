<script>
    // import mapStyles from './map-styles'; // optional

   export let rLocation 
   export let rLocationTime 

   let container;
   let map;
   let zoom = 15;
   let center = rLocation;
   
   import { onMount } from 'svelte';
   
   onMount(async () => {
       map = new google.maps.Map(container, {
           zoom,
           center,
        //    styles: mapStyles // optional
       });

       let marker = new google.maps.Marker({
           position:center,
           title: rLocationTime,
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