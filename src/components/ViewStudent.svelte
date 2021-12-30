<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
	import MainContent from "./MainContent.svelte";
	import Table from "../shared/Table.svelte"

	export let active

    let activeViewStudent = active
</script>

<div class="main">
	<Nav activeViewStudent/>
	<Vertical/>

	
    <div class="align">
        <Header />
        <Table />
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
		min-width: 78vw;
	}
</style>