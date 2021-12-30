<script>
    import FaHome from 'svelte-icons/fa/FaHome.svelte'
	export let activeHome = false
    export let activeAddStudent = false
    export let activeProfile = false
    export let activeViewStudent = false
    let active = false

    console.log(active)
</script>

<main>
    <div class="logo">
        SMART ID
    </div>

    <div class="nav">
        <a class="link" class:active={activeHome == true} href="http://localhost:5000">
            <div class="icon" class:active-color={activeHome == true}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeHome == true}>
                Dashboard
            </p>

        </a>

        <a class="link" class:active={activeProfile} href="http://localhost:5000/staff-profile">
            <div class="icon" class:active-color={activeProfile}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeProfile}>
                Profile
            </p>

        </a>
        <a class="link" class:active={activeAddStudent} href="http://localhost:5000/add-student">
            <div class="icon" class:active-color={activeAddStudent}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeAddStudent}>
                Add Student
            </p>

        </a>

        <a class="link" class:active={activeViewStudent} href="http://localhost:5000/view-student">
            <div class="icon" class:active-color={activeViewStudent}>
                <FaHome/>
            </div>
            <p class="text" class:active-color={activeViewStudent}>
                View Student
            </p>

        </a>

        <a class="link" class:active={active} href="http://localhost:5000/login">
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