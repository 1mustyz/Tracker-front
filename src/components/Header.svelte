<script>
    import FaSearch from 'svelte-icons/fa/FaSearch.svelte'
    import FaRegBell from 'svelte-icons/fa/FaRegBell.svelte'
    import FaFacebookMessenger from 'svelte-icons/fa/FaFacebookMessenger.svelte'

    import Avatar from "../shared/Avatar.svelte";
</script>

<header>
    <div class="text-field">
        <div class="search-icon">

            <FaSearch />
        </div>
        <input type="text" placeholder="Search here..">
    </div>

    <div class="right">
        <div class="noti-icon">
            <FaRegBell />
        </div>
        
        <div class="noti-icon">
            <FaFacebookMessenger />
        </div>
    
        <Avatar type="small">
            <img class="img-avatar" src="../musty-avatar.jpg" alt="">
        </Avatar>
    </div>
</header>



<style>
    .text-field {
        border-radius: 20px;
        width: 35rem;
        height: 50px;
        padding: 2rem;
        background-color: #F7FAFF;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .search-icon {
        width: 20px;
        height: 20px;
        color: #a4b1c7;
    }

    input {
        width: 90%;
        background-color: #F7FAFF;
    }

    .right {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 20rem;
    }

    .noti-icon {
        width: 40px;
        height: 40px;
        color: #a4b1c7;
    }

    header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 1.7rem;
        background-color: white;
        border-radius: 10px;
        margin-top: 1.9rem;
        margin-left: 2rem;
        margin-right: 2rem;
        margin-bottom: 2.7rem;
        width: 93%;
    }

    .img-avatar {
        border-radius: 35px;
        width: 65px;
        height: 64px;
    }
</style>