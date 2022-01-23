<script>
	import Header from "./Header.svelte";
	import SpinnerLoader from "../shared/loader/SpinnerLoader.svelte";
    import Map from "../Map.svelte";
    import {Button,Icon} from "smelte";

	// import { user } from "../stores";
	// console.log($user)

	// const logUser = $user
	export let active
	export let ready;


	let activeHome = active
</script>
<svelte:head>
	<script defer async
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD8W_n9m3E2j2CvAp6iOO0R_tVFFTdnS40&callback=initMap">
	</script>
</svelte:head>

<div class="main">
    <Header/>
    { #if ready }
	<div class="sec">

		<Map></Map>

		<div class="btn">

			<Button color="primary" dark block  >
				<!-- {#if load}
				<div class="loader">
					<FacebookLoader />
				</div>
				{:else} -->
				DELETE VEHICLE
				<!-- {/if} -->
			</Button>
		</div>
	</div>
	{ /if }
		 
</div>


<style>
    .main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #F7FAFF;
	}

	.sec{
		height: 80%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.btn {
		width: 30%;
		margin-bottom: 1rem;
		align-self: center;
	}

    
</style>