<script>
	import "smelte/src/tailwind.css" ;
	import router from "page"
	import Home from "./components/Home.svelte"
	import ViewStudent from "./components/ViewStudent.svelte";
	import LoginPage from "./components/LoginPgae.svelte";
	import AddStudent from "./components/AddStudent.svelte";
	import StaffProfile from "./components/StaffProfile.svelte";
	import StudentProfile from "./components/StudentProfile.svelte";
	
	
	let page

	router('/', () => page = Home)
	router('/view-student', () => page = ViewStudent)
	router('/login', () => page = LoginPage)
	router('/add-student', () => page = AddStudent)
	router('/staff-profile', () => page = StaffProfile)
	router('/student-profile', () => page = StudentProfile)

	let active = true

router.start()
</script>

<main>
	<svelte:component this={page} />
</main>

<style>
		
</style>