<script>
    import { rLocation,rLocationTime } from "./stores";
    import { tick } from 'svelte';
    import { beforeUpdate } from 'svelte';
  
    $: console.log($rLocation, $rLocationTime)
   let container;
   let map;
   let zoom = 15;
   $: center = $rLocation;
   
   
   beforeUpdate(async () => {
       await tick()
       map = new google.maps.Map(container, {
           zoom,
           center,
        //    styles: mapStyles // optional
       });

       let marker = new google.maps.Marker({
           position:center,
           title: $rLocationTime,
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