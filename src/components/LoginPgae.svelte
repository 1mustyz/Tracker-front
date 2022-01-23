<script>
    import FaRegUser from 'svelte-icons/fa/FaRegUser.svelte'
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";
    import FacebookLoader from "../shared/loader/FacebookLoader.svelte"
    import { user } from '../stores';
	import router from "page"
    import { alert, notice, info, success, error, defaultModules } from '@pnotify/core';
    import * as PNotifyMobile from '@pnotify/mobile';

    defaultModules.set(PNotifyMobile, {});

    function myErrorAlert(errorMsg){
            error({
            text: errorMsg
        });
    }


    let fields = {username: "", password: ""}
    let valid = false
    let load = false

    const submitHandler = async () => {
        valid = true
        load = true
      
        if(fields.username.trim().length < 1){
            valid = false
            myErrorAlert('You need an email')
            return
        }
        if(fields.password.trim().length < 1){
            valid = false
            myErrorAlert('Insert a password')
            return
        }

        if(valid){
            try {

                const data = {username:fields.username, password:fields.password}
                const rawResponse = await fetch('https://tracker-back.herokuapp.com/admin/login', {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                });
                const content = await rawResponse.json(data);

                // console.log(content)
                if(content.success == true){

                    user.set(content.newUser)
                    router.redirect('/dashboard')
                }
                else {
                console.log('incorrect username or password')
                    myErrorAlert('incorrect username or password')
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
    <div class="icon">
        <div class="avatar-icon">
            <FaRegUser />
        </div>
        <h6 class="text">Have an account?</h6>
    </div>

    <form action="" class="login" >
        <TextField label="Email" outlined hint="@xyz.com" bind:value={fields.username} />
        <TextField label="Password" outlined hint="Password" type=password bind:value={fields.password} />
    </form>

    <div class="signin">
        <a class="text1" href="/">Sign In</a>
        <p class="text1">Forget Password</p>
    </div>

    <div class="btn" >
        <Button color="primary" dark block disabled={load} on:click={submitHandler}>
            {#if load}
            <div class="loader">
                <FacebookLoader />
            </div>
            {:else}
            Log In
            {/if}
        </Button>
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

    .btn {
        align-self: flex-start;
        position: absolute;
        margin-top: 22.7rem;
        width: 8rem;
    }

    

    .text {
        font-size: 1.2rem;
        font-weight: 800;
    }

    .text1 {
        color: #8d448b;
        font-weight: 600;
    }

    .loader {
        width: 100%;
        padding-right: 4rem;
    }
</style>