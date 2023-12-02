<script>
    export let code = ''
    let copyCode=()=>{
        navigator.clipboard.writeText(code).then(()=>{

        }).catch((e)=>{

        })
    }
</script>
<button on:click={copyCode}>Copy</button>
<style>
    button {
        position:absolute;
        top:0;
        right: 0;
        background-color: blueviolet;
        padding: 5px;
        cursor: pointer;
        font-size: 14px;
    }
</style>