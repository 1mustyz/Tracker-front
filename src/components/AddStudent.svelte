<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
	import MainContent from "./MainContent.svelte";
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";

    export let active

	let activeAddStudent = active

    let fields = {firstName:"", surname:"", otherName:"", idNumber:"", gender:"", department:"", faculty:"", state:"", level:""}
    let errors = {firstName:"", surname:"", otherName:"", idNumber:"", gender:"", department:"", faculty:"", state:"", level:""}
    let valid = false

    const submitHandler = () => {
        valid = true
console.log('hello')
       
        if(fields.firstName.trim().length < 1){
            valid = false
            errors.firstName = 'First Name must not be empty'
        }else{
            errors.firstName = ''
        }

        if(fields.surname.trim().length < 1){
            valid = false
            errors.surname = 'surname must not be empty'
        }else{
            errors.surname = ''
        }

        if(fields.otherName.trim().length < 1){
            valid = false
            errors.otherName = 'Other Name must not be empty'
        }else{
            errors.otherName = ''
        }

        if(fields.idNumber.trim().length < 1){
            valid = false
            errors.idNumber = 'ID Number must not be empty'
        }else{
            errors.idNumber = ''
        }

        if(fields.faculty.trim().length < 1){
            valid = false
            errors.faculty = 'Faculty must not be empty'
        }else{
            errors.faculty = ''
        }

        if(fields.department.trim().length < 1){
            valid = false
            errors.department = 'Department must not be empty'
        }else{
            errors.department = ''
        }

        if(fields.state.trim().length < 1){
            valid = false
            errors.state = 'state must not be empty'
        }else{
            errors.state = ''
        }

        if(fields.gender.trim().length < 1){
            valid = false
            errors.gender = 'Gender must not be empty'
        }else{
            errors.gender = ''
        }

        if(fields.level.trim().length < 1){
            valid = false
            errors.level = 'Level Name must not be empty'
        }else{
            errors.level = ''
        }
        if(valid){
            console.log(fields)
        }
    }
</script>

<div class="main">
	<Nav activeAddStudent/>
	<Vertical/>

	
    <div class="align">
        <Header/>
        <form action="" class="form" >
            <div>
                <TextField label="First Name" outlined hint="First Name" bind:value={fields.firstName} />

            </div>

            <div>

                <TextField label="Surname" outlined hint="Surname" bind:value={fields.surname}/>
            </div>

            <div>

                <TextField label="Other Name" outlined hint="Other Name" bind:value={fields.otherName}/>
            </div>

            <div>

                <TextField label="ID Number" outlined hint="ID" bind:value={fields.idNumber}/>
            </div>

            <div>

                <TextField label="Gender" outlined hint="Male" bind:value={fields.gender}/>
            </div>

            <div>

                <TextField label="State" outlined hint="State" bind:value={fields.state}/>
            </div>

            <div>

                <TextField label="Department" outlined hint="Department" bind:value={fields.department}/>
            </div>

            <div>

                <TextField label="Faculty" outlined hint="Faculty" bind:value={fields.faculty}/>
            </div>

            <div>

                <TextField label="Level" outlined hint="Level" bind:value={fields.level}/>
            </div>

            <div>

                <Button color="primary" dark block on:click={submitHandler}>ADD STUDENT</Button>
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
</style>