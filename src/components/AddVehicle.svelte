<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";
    import FacebookLoader from "../shared/loader/FacebookLoader.svelte"
    import { user } from '../stores';
    import { alert, notice, info, success, error, defaultModules } from '@pnotify/core';
    import * as PNotifyMobile from '@pnotify/mobile';


    defaultModules.set(PNotifyMobile, {});

    function myErrorAlert(errorMsg){
            error({
            text: errorMsg
        });
    }

    export let active

	let activeAddVehicle = active

    let fields = {vehicleName:"", brandName:"", yearOfPurchase:"", color:""}
    let valid = false
    let load = false

    const submitHandler = async () => {
    console.log($user)

        valid = true
        load = true
        console.log('hello')
       
        if(fields.vehicleName.trim().length < 1){
            valid = false
            myErrorAlert('Vehicle Name must not be empty')
            load = false
            return
        }

        if(fields.brandName.trim().length < 1){
            valid = false
            myErrorAlert('Brand Name must not be empty')
            load = false
            return
        }

        if(fields.yearOfPurchase.trim().length < 1){
            valid = false
            myErrorAlert('Year of purchase must not be empty')
            load = false
            return
        }

        if(fields.color.trim().length < 1){
            valid = false
            myErrorAlert('Color must not be empty')
            load = false
            return
        }
        
        if(valid){
            console.log(fields)
            try {

                const data = {username: $user.username, vehicle: fields}
                const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/add-vehicle', {
                method: 'PUT',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
                const content = await rawResponse.json(data);

                console.log(content)
                if(content.success == true){
                    console.log('vehicle added')
                    myErrorAlert('Vehicle Added!!')
                    load = false
                    
                }
                
                    
            } catch (error) {
                console.log(error)
                myErrorAlert(error)
                load = false
            }
        }
    }
</script>

<div class="main">
	<Nav activeAddVehicle/>
	<Vertical/>

	
    <div class="align">
        <Header/>
        <form action="" class="form" >
            <div>
                <TextField label="Vehicle Name" outlined hint="Toyota" bind:value={fields.vehicleName} />

            </div>

            <div>

                <TextField label="Brand Name" outlined hint="Toyota camry" bind:value={fields.brandName}/>
            </div>

            <div>

                <TextField label="Year of purchase" outlined hint="year" bind:value={fields.yearOfPurchase}/>
            </div>

            <div>

                <TextField label="Color" outlined hint="grey" bind:value={fields.color}/>
            </div>

           
            <div class="btn">

                <Button color="primary" dark block disabled={load} on:click={submitHandler}>
                    {#if load}
                        <div class="loader">
                            <FacebookLoader />
                        </div>
                        {:else}
                        ADD VEHICLE
                    {/if}
                </Button>
            </div>
        </form>
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
		max-width: 80vw;
	}

    .form {
        background-color: white;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 1rem;
        padding: 2rem;
        margin-left: 2rem;
        margin-right: 2.3rem;
        border-radius: 10px;
    }

    .form > * {

        width: 30%;
    }

    .btn {
        margin-top: 1.9rem;
    }

    .loader {
        width: 100%;
        padding-right: 4rem;
    }
</style>