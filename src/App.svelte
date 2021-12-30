<script>
	import "smelte/src/tailwind.css" ;
	import router from "page"
	import Home from "./components/Home.svelte"
	import LoginPage from "./components/LoginPgae.svelte";
	import AddVehicle from "./components/AddVehicle.svelte";
	import StaffProfile from "./components/StaffProfile.svelte";
	import Registration from "./components/Registration.svelte";
	
	
	let page

	router('/', () => page = Registration)
	router('/dashboard', () => page = Home)
	router('/login', () => page = LoginPage)
	router('/add-vehicle', () => page = AddVehicle)
	router('/staff-profile', () => page = StaffProfile)

	let active = true

router.start()
</script>

<main>
	<svelte:component this={page} />
</main>

<style>
		
</style>