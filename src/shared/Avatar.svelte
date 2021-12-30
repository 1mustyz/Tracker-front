<script>
    export let type;
</script>

<div class={type}>
    <slot ></slot>
</div>

<style>
    .small {
        border: 3px solid #a4b1c7;
        border-radius: 35px;
        width: 70px;
        height: 70px;
    }

    .medium {
        border: 3px solid #a4b1c7;
        border-radius: 75px;
        width: 10rem;
        height: 10rem;
    }
   
</style>