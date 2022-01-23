<script>
	import "smelte/src/tailwind.css" ;
	import router from "page"
	import Home from "./components/Home.svelte"
	import LoginPage from "./components/LoginPgae.svelte";
	import AddVehicle from "./components/AddVehicle.svelte";
	import StaffProfile from "./components/StaffProfile.svelte";
	import Registration from "./components/Registration.svelte";
	import Map from './Map.svelte';
	import VehicleDetails from "./components/VehicleDetails.svelte";
	export let ready;
	

		
	let page

 

	router('/', () => page = Registration)
	router('/dashboard', () => page = Home)
	router('/login', () => page = LoginPage)
	router('/add-vehicle', () => page = AddVehicle)
	router('/staff-profile', () => page = StaffProfile)
	router('/map', () => page = MapPage)
	router('/vehicle-detail', () => page = VehicleDetails)


	let active = true

router.start()
</script>


<main>
	<svelte:component this={page} {ready}/>
	<!-- { #if ready }
	<Map></Map>
	{ /if } -->

</main>

<style>
	:global(body) {
	padding: 0;}
</style>