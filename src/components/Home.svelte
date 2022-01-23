<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
	import Table from "../shared/Table.svelte"
	import SpinnerLoader from "../shared/loader/SpinnerLoader.svelte";
	import { user } from "../stores";
	console.log($user)

	const logUser = $user
	export let active

	let activeHome = active
</script>

<div class="main">
	<Nav activeHome/>
	<Vertical/>

	
    <div class="align">
        <Header/>
		{#await logUser}
		<p class="waiting"><SpinnerLoader /></p>
		{:then}
			<Table {logUser} />
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
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

	.waiting {
		width: 30%;
		margin: auto;
		margin-left: 28rem;
		border-radius: 10px;
		margin-top: 10rem;
		
	}
</style>