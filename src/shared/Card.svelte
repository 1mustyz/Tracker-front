<script>
    export let type;
    

</script>

<div  class={type}>
    <slot></slot>
</div>

<style>
    

    .blue {
        background-color: #3B76EF;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
    }

    .lightblue {
        background-color: #63C7FF;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
    }

    .purple {
        background-color: #A66DD4;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
    }

    .green {
        background-color: #6DD4B1;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
    }
</style>