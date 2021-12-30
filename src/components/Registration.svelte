<script>
    import FaRegUser from 'svelte-icons/fa/FaRegUser.svelte'
    import { TextField } from "smelte";
    import {Button,Icon} from "smelte";

    let fields = {firstName: "", lastName: "", address:"", phone:"", email:"", password:"", confirmPassword:""}
    let errors =  {firstName: "", lastName: "", address:"", phone:"", email:"", password:"", confirmPassword:""}
    let valid = false

    const submitHandler = () => {
        valid = true

      
        if(fields.firstName.trim().length < 1){
            valid = false
            errors.firstName = 'First Name A must not be empty'
        }else{
            errors.firstName = ''
        }

        if(fields.lastName.trim().length < 1){
            valid = false
            errors.lastName = 'Last Name must not be empty'
        }else{
            errors.lastName = ''
        }

        if(fields.address.trim().length < 1){
            valid = false
            errors.address = 'Address must not be empty'
        }else{
            errors.address = ''
        }

        if(fields.phone.trim().length < 1){
            valid = false
            errors.phone = 'Phone Number must not be empty'
        }else{
            errors.phone = ''
        }

        if(fields.email.trim().length < 1){
            valid = false
            errors.email = 'Email must not be empty'
        }else{
            errors.email = ''
        }

        
        if(fields.password.trim().length < 1){
            valid = false
            errors.password = 'password must not be empty'
        }else{
            errors.password = ''
        }

        if(fields.confirmPassword.trim().length < 1){
            valid = false
            errors.confirmPassword = 'Confirm Password must not be empty'
        }else{
            errors.confirmPassword = ''
        }

        if(fields.password != fields.confirmPassword){
            valid = false
            errors.confirmPassword = 'password and confirm password does not match'
        }else{
            errors.confirmPassword = ''
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
        <h6 class="text">Don't have an account?</h6>
    </div>

    <form action="" class="login" >
        <TextField label="First Name" outlined hint="John " bind:value={fields.idNumber} />
        <TextField label="Last Name" outlined hint="Doe " bind:value={fields.idNumber} />
        <TextField label="Address" outlined hint="Jimeta " bind:value={fields.idNumber} />
        <TextField label="phone" outlined hint="+234" bind:value={fields.idNumber} />
        <TextField label="mail" outlined hint="@xyz.com " bind:value={fields.idNumber} />
        <TextField label="Password" outlined hint="Password" bind:value={fields.password} />
        <TextField label="Confirm Password" outlined hint="John " bind:value={fields.idNumber} />

    </form>

    <div class="signin">
        <a class="text1" href="http://localhost:5000/login">Log In</a>
        <div class="btn" >
            <Button color="primary" dark block on:click={submitHandler}>Sign In</Button>
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
</style>