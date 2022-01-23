<script>
    import FaHome from 'svelte-icons/fa/FaHome.svelte'
	export let activeHome = false
    export let activeAddVehicle = false
    export let activeProfile = false
    let active = false

    console.log(active)
</script>

<main>
    <div class="logo">
        TRACKER
    </div>

    <div class="nav">
        <a class="link" class:active={activeHome == true} href="/dashboard">
            <div class="icon" class:active-color={activeHome == true}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeHome == true}>
                Dashboard
            </p>

        </a>

        <a class="link" class:active={activeProfile} href="/staff-profile">
            <div class="icon" class:active-color={activeProfile}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeProfile}>
                Profile
            </p>

        </a>
        <a class="link" class:active={activeAddVehicle} href="/add-vehicle">
            <div class="icon" class:active-color={activeAddVehicle}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeAddVehicle}>
                Add Vehicle
            </p>

        </a>

        
        <a class="link" class:active={active} href="/login">
            <div class="icon" class:active-color={active}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={active}>
                Logout
            </p>

        </a>
    </div>
</main>

<style>
    .nav {
    }

    .link {
        display: flex;
        flex-direction: row;
        justify-content:flex-start;
        align-items: center;
        padding: 1rem 1.7rem;

    }

    .icon {
        width: 20px;
        height: 20px;
        margin-right: 2.3rem;
        color: #7d8ba5;
    }

    main {
        width: 32%;
        padding: 1.7rem;
    }

    .logo {
        background-color: white;
        padding: 3rem 3rem;
        margin-bottom: 3rem;
        color: #3B76EF;
        border-radius: 10px;

    }

    .link:hover {
        background-color: white;
        color: black;
    }

    .link:hover > .text {
        color: #3B76EF;
    }
    
    .text {
        color: #7d8ba5;

    }

    .active {
        background-color: white;
        color: #3B76EF;
    }
    .active-color {
        color: #3B76EF;
    }
</style>