<script>
	
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";
    import Avatar from "../shared/Avatar.svelte";

    
    let fields = {firstName:"", surname:"", otherName:"", idNumber:"", gender:"", department:"", faculty:"", state:"", level:""}
</script>

	
	
    <div class="align">

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

            <div>

                <TextField label="Faculty" outlined hint="Faculty" disabled bind:value={fields.faculty}/>
            </div>

            <div>

                <TextField label="Level" outlined hint="Level" disabled bind:value={fields.level}/>
            </div>

            <div>

                <Button color="primary" dark block >Print ID</Button>
            </div>
        </form>
    </div>


<style>
    

    .align {
		max-width: 90vw;
        display: flex;
		flex-direction: row;
		background-color: #F7FAFF;
        justify-content: space-between;
        padding: 7rem;
	}

    .form {
        background-color: white;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 1rem;
        padding: 2rem;
        width: 60%;
        /* margin-left: 2rem;
        margin-right: 2.3rem; */
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
        /* margin: auto;
        margin-bottom: 2rem; */
        background-color: white;
        border-radius: 10px;
    }
</style>