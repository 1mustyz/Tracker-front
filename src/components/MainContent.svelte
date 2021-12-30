<script>
    import Card from "../shared/Card.svelte"
</script>

<main>
    <Card type="blue">
        <div class="stat">
            <p class="name">Total Student</p>
            <p class="number">1400</p>
        </div>
    </Card>

    <Card type="lightblue">
        <div class="stat">
            <p class="name">Total Student</p>
            <p class="number">1400</p>
        </div>
    </Card>

    <Card type="purple">
        <div class="stat">
            <p class="name">Total Student</p>
            <p class="number">1400</p>
        </div>
    </Card>
    
    <Card type="green">
        <div class="stat">
            <p class="name">Total Student</p>
            <p class="number">1400</p>
        </div>
    </Card>
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: 1.5rem;
        column-gap: 1.5rem;
        justify-content: center;
    }

    .stat {
        width: 28rem;
        height: 10rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 2rem;
        color: white;
    }

    .number {
        font-size: 2rem;
    }

    
</style>