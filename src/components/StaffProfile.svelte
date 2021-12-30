<script>
	import Header from "./Header.svelte";
	import Vertical from "../shared/Vertical.svelte"
	import Nav from "./Nav.svelte"
	import MainContent from "./MainContent.svelte";
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";
    import Avatar from "../shared/Avatar.svelte";

    export let active

    let activeProfile = active

    let fields = {firstName:"", surname:"", otherName:"", idNumber:"", gender:"", department:"", faculty:"", state:"", level:""}
</script>

<div class="main">
	<Nav activeProfile/>
	<Vertical/>

	
    <div class="align">
        <Header />

        <div class="profile-pic">
            <Avatar type="medium">
                <img class="img-avat" src="../musty-avatar.jpg" alt="">
            </Avatar>
            <TextField  outlined type="file"  />
            <Button color="primary" light flat >set</Button>


        </div>

        <form action="" class="form" >
            <div>
                <TextField label="First Name" outlined hint="First Name" disabled bind:value={fields.firstName} />

            </div>

            <div>

                <TextField label="Surname" outlined hint="Surname" disabled bind:value={fields.surname}/>
            </div>

            <div>

                <TextField label="Other Name" outlined hint="Other Name" disabled bind:value={fields.otherName}/>
            </div>

            <div>

                <TextField label="ID Number" outlined hint="ID" disabled bind:value={fields.idNumber}/>
            </div>

            <div>

                <TextField label="Gender" outlined hint="Male" disabled bind:value={fields.gender}/>
            </div>

            <div>

                <TextField label="State" outlined hint="State" disabled bind:value={fields.state}/>
            </div>

            <div>

                <TextField label="Department" outlined hint="Department" disabled bind:value={fields.department}/>
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
		max-width: 78vw;
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

    .img-avat {
        border-radius: 75px;
        width: 10rem;
        height: 9.6rem;
    }

    .profile-pic {
        width: 30%;
        height: 20rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin: auto;
        margin-bottom: 2rem;
        background-color: white;
        border-radius: 10px;
    }
</style>