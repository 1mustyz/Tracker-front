<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";

    export let active

	let activeAddVehicle = active

    let fields = {vehicleName:"", brandName:"", yearOfPurchase:"", color:"", trackerId:"", department:"", faculty:"", state:"", level:""}
    let errors = {vehicleName:"", brandName:"", yearOfPurchase:"", color:"", trackerId:"", department:"", faculty:"", state:"", level:""}
    let valid = false

    const submitHandler = () => {
        valid = true
console.log('hello')
       
        if(fields.vehicleName.trim().length < 1){
            valid = false
            errors.vehicleName = 'First Name must not be empty'
        }else{
            errors.vehicleName = ''
        }

        if(fields.brandName.trim().length < 1){
            valid = false
            errors.brandName = 'Brand Name must not be empty'
        }else{
            errors.brandName = ''
        }

        if(fields.yearOfPurchase.trim().length < 1){
            valid = false
            errors.yearOfPurchase = 'Year of purchase must not be empty'
        }else{
            errors.yearOfPurchase = ''
        }

        if(fields.color.trim().length < 1){
            valid = false
            errors.color = 'Color must not be empty'
        }else{
            errors.color = ''
        }

       
        if(fields.trackerId.trim().length < 1){
            valid = false
            errors.trackerId = 'Gender must not be empty'
        }else{
            errors.trackerId = ''
        }

        
        if(valid){
            console.log(fields)
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

            <div>

                <TextField label="Tracker ID" outlined hint="tracker" bind:value={fields.trackerId}/>
            </div>

           
            <div class="btn">

                <Button color="primary" dark block on:click={submitHandler}>ADD VEHICLE</Button>
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
</style>