<script>
	import Header from "./Header.svelte";
	import SpinnerLoader from "../shared/loader/SpinnerLoader.svelte";
    import Map from "../Map.svelte";
    import {Button,Icon} from "smelte";
    import FacebookLoader from "../shared/loader/FacebookLoader.svelte"
	import router from "page"
    import { vehicleStore,user } from '../stores';
	import { alert, notice, info, success, error, defaultModules } from '@pnotify/core';
    import * as PNotifyMobile from '@pnotify/mobile';

    defaultModules.set(PNotifyMobile, {});

    function myErrorAlert(errorMsg){
            error({
            text: errorMsg
        });
    }

	let load = false


	console.log($vehicleStore)

	// const logUser = $user
	export let active
	export let ready;
	let location
	let locationTime

	if ($vehicleStore.location == null){
		location = {lat:1, lng: 1}
		locationTime = "Time 0"
	}else{
		location = $vehicleStore.location
		location.lat = parseFloat(location.lat)
		location.lng = parseFloat(location.lng)
		locationTime = new Date($vehicleStore.locationTime).toDateString()
	}


	let activeHome = active

	const handleDelete = async () => {
			load = true
			try {

				const data = {vehicleId:$vehicleStore.vehicleId, username:$user.username }
				console.log(data)
				const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/remove-vehicle', {
				method: 'PUT',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
				});
				const content = await rawResponse.json(data);

				// console.log(content)
				if(content.success == true){

					user.set(content.user)
					router.redirect('/dashboard')
				}
				
					
			} catch (error) {
			console.log(error)
			myErrorAlert(error)
			load = false
			}
	}
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

		<Map {location}{locationTime}></Map>

		<div class="btn">

			<Button color="primary" dark block disabled={load}  on:click={handleDelete}>
				{#if load}
				<div class="loader">
					<FacebookLoader />
				</div>
				{:else} 
				DELETE VEHICLE
				{/if}
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
	.loader {
        width: 100%;
        padding-right: 4rem;
    }
    
</style>