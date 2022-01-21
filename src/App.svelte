<script>
	import "smelte/src/tailwind.css" ;
	import router from "page"
	import Home from "./components/Home.svelte"
	import LoginPage from "./components/LoginPgae.svelte";
	import AddVehicle from "./components/AddVehicle.svelte";
	import StaffProfile from "./components/StaffProfile.svelte";
	import Registration from "./components/Registration.svelte";
	import MapPage from "./components/MapPage.svelte";
	import Map from './Map.svelte';
	export let ready;
	

		
	let page

 

	router('/', () => page = Registration)
	router('/dashboard', () => page = Home)
	router('/login', () => page = LoginPage)
	router('/add-vehicle', () => page = AddVehicle)
	router('/staff-profile', () => page = StaffProfile)
	router('/map', () => page = MapPage)


	let active = true

router.start()
</script>
<svelte:head>
	<script defer async
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8W_n9m3E2j2CvAp6iOO0R_tVFFTdnS40&callback=initMap">
	</script>
</svelte:head>

<main>
	<svelte:component this={page} />
	<!-- { #if ready }
	<Map></Map>
	{ /if } -->

</main>

<style>
	:global(body) {
	padding: 0;}
</style>