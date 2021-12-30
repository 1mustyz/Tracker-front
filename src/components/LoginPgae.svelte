<script>
    import FaRegUser from 'svelte-icons/fa/FaRegUser.svelte'
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";

    let fields = {idNumber: "", password: ""}
    let errors = {idNumber: "", password: ""}
    let valid = false

    const submitHandler = () => {
        valid = true

      
        if(fields.idNumber.trim().length < 1){
            valid = false
            errors.idNumber = 'id number A must not be empty'
        }else{
            errors.idNumber = ''
        }

        if(fields.password.trim().length < 1){
            valid = false
            errors.password = 'password must not be empty'
        }else{
            errors.password = ''
        }

        if(valid){
            // let poll = {...fields, votesA: 0, votesB: 0, id: Math.random()}

            // PollStore.update(currentPolls => {
            //     return [poll, ...currentPolls]
            // })
            // dispatch('add', poll)

            console.log(fields,errors)
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
        <TextField label="ID NO." outlined hint="ID NO." bind:value={fields.idNumber} />
        <TextField label="Password" outlined hint="Password" bind:value={fields.password} />
    </form>

    <div class="signin">
        <p class="text1">Sign In</p>
        <p class="text1">Forget Password</p>
    </div>

    <div class="btn" >
        <Button color="primary" dark block on:click={submitHandler}>Log In</Button>
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
</style>