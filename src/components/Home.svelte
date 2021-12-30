<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
	import MainContent from "./MainContent.svelte";

	export let active

	let activeHome = active
</script>

<div class="main">
	<Nav activeHome/>
	<Vertical/>

	
    <div class="align">
        <Header/>
        <MainContent/>
    </div>
</div>


<style>
    .main {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		background-color: #F7FAFF;
	}

    .align {
		max-width: 100vw;
	}
</style>