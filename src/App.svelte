<script>
	import "smelte/src/tailwind.css" ;
	import router from "page"
	import Home from "./components/Home.svelte"
	import LoginPage from "./components/LoginPgae.svelte";
	import AddVehicle from "./components/AddVehicle.svelte";
	import StaffProfile from "./components/StaffProfile.svelte";
	import Registration from "./components/Registration.svelte";
	import { user } from "./stores";
	import Map from './Map.svelte';
	import VehicleDetails from "./components/VehicleDetails.svelte";
	export let ready;
	
	Pusher.logToConsole = true;

    

		
	let page

 

	router('/', () => page = Registration)
	router('/dashboard', () => {
		if(localStorage.getItem('user') == null){
			router.redirect('/login')
		} 
		page = Home
	})

	router('/login', () => {
		localStorage.removeItem('user')
		localStorage.removeItem('vehicle')

		page = LoginPage
	})

	router('/add-vehicle', () => {
		if(localStorage.getItem('user') == null){
			router.redirect('/login')
		} 
		page = AddVehicle
	})

	router('/staff-profile', () => {
		if(localStorage.getItem('user') == null){
			router.redirect('/login')
		} 
		page = StaffProfile
	})
	router('/map', () => page = MapPage)
	router('/vehicle-detail', () => {
		if(localStorage.getItem('user') == null){
			router.redirect('/login')
		} 
		page = VehicleDetails
	})


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