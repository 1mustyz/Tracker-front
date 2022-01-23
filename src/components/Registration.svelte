<script>
    import FaRegUser from 'svelte-icons/fa/FaRegUser.svelte'
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";
    import FacebookLoader from "../shared/loader/FacebookLoader.svelte"
    import { alert, notice, info, success, error, defaultModules } from '@pnotify/core';
    import * as PNotifyMobile from '@pnotify/mobile';

    defaultModules.set(PNotifyMobile, {});

    function myErrorAlert(errorMsg){
            error({
            text: errorMsg
        });
    }



    let fields = {firstName: "", lastName: "", address:"", phone:"", username:"", password:"", confirmPassword:""}
    let valid = false
    let load = false

    const submitHandler = async () => {
        valid = true
        load = true
      
        if(fields.firstName.trim().length < 1){
            valid = false
            myErrorAlert('First Name must not be empty')
            return 
        }
        if(fields.lastName.trim().length < 1){
            valid = false
            myErrorAlert('Last Name must not be empty')
            return 


        }

        if(fields.address.trim().length < 1){
            valid = false
            myErrorAlert('Address must not be empty')
            return 


        }

        if(fields.phone.trim().length < 1){
            valid = false
            myErrorAlert('Phone Number must not be empty')
            return 

            
        }

        if(fields.username.trim().length < 1){
            valid = false
            myErrorAlert('Email must not be empty')
            return 

        }

        
        if(fields.password.trim().length < 1){
            valid = false
            myErrorAlert('password must not be empty')
            return 
            
        }

        if(fields.confirmPassword.trim().length < 1){
            valid = false
            myErrorAlert('Confirm Password must not be empty')
            return 

        }
        if(fields.password != fields.confirmPassword){
            valid = false
            myErrorAlert('password and confirm password does not match')
            return 

        }

        
        if(valid){
            console.log(valid)
            console.log(fields)
            try {

                const data = fields
                const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/register', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
                const content = await rawResponse.json(data);

                console.log(content)
                if(content.success == true){

                    myErrorAlert('Registration sucessfull!!')
                    load = false

                }
                else {
                    myErrorAlert('A user with the given username is already registered')
                    load = false
                }
                    
            } catch (error) {
                myErrorAlert(error)
                load = false
            }
           

        }
    }

</script>

<div class="main">
    <div class="icon">
        <div class="avatar-icon">
            <FaRegUser />
        </div>
        <h6 class="text">Don't have an account?</h6>
    </div>

    <form action="" class="login" >
        <TextField label="First Name" outlined hint="John " bind:value={fields.firstName} />
        <TextField label="Last Name" outlined hint="Doe " bind:value={fields.lastName} />
        <TextField label="Address" outlined hint="Jimeta " bind:value={fields.address} />
        <TextField label="phone" outlined hint="+234" bind:value={fields.phone} />
        <TextField label="mail" outlined hint="@xyz.com " bind:value={fields.username} />
        <TextField label="Password" outlined hint="Password" type="password" bind:value={fields.password} />
        <TextField label="Confirm Password" outlined hint="password" type="password" bind:value={fields.confirmPassword} />

    </form>

    <div class="signin">
        <a class="text1" href="/login">Log In</a>
        <div class="btn" >
            <Button color="primary" dark block disabled={load} on:click={submitHandler}>
                {#if load}
                <div class="loader">
                    <FacebookLoader />
                </div>
                {:else}
                SIGN IN
                {/if}
            </Button>
        </div>
    </div>

   
</div>

<style>
    .main {
        width: 30%;
        padding: 2rem;
        margin: auto;
        margin-top: 6rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: white;
        border-radius: 0.7rem;
        box-shadow: 0 10px 34px -15px rgb(0 0 0 / 24%);
}



    .icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
        margin-bottom: 1rem;
        color: #8d448b;

    }
    .avatar-icon{
        padding: 1.7rem;
        border-radius: 2.5rem;
        width: 5rem;
        height: 5rem;
        margin-bottom: 0.7rem;
        background-color: #8d448b;
        color: white;
    }

    .login {
        width: 100%;
    }

    .signin {
        width: 100%;
        align-self: flex-start;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

     

    .text {
        font-size: 0.9rem;
        font-weight: 600;
        text-decoration: none;
    }

    .text1 {
        color: #8d448b;
        font-weight: 600;
    }

    .btn {
        width: 50%;
    }
    .loader {
        width: 100%;
        padding-right: 4rem;
    }
</style>