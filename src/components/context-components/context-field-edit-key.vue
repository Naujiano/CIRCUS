<template>
    <div class="context-field-edit-key">
        <div class="encabezado">
            <div style="text-transform:uppercase">Cambiar sintaxis SQL<br></div>
            <b>{{componentProps.reference}}</b>
        </div>
        <textarea ref="textarea" style="resize:none; overflow: hidden;" @input="oninput()" :value="qeParam.key"></textarea>  
        <div class="encabezado">
            <div style="text-transform:uppercase">Filtrar por esta vista<br></div>
            <b>{{componentProps.reference}}</b>
        </div>
        <textarea ref="textareaVista" style="resize:none; overflow: hidden;" @input="oninput('vista')" :value="qeParam.vista"></textarea>  
    </div>
</template>
<script>
export default {
    components: {  },
    props: {
        componentProps: { type: Object, required: true }
    },
    data () {
        return {
            listsModels : JSON.cc(this.$store.state.database.listsModels)
            , lists : JSON.cc(this.$store.state.database.lists)
        }
    },
    computed: {
        qeParam () {
            return this.$store.state.contextDialog.props
        },
        rows () {
            const listsModels = this.listsModels
            , rows = Object.keys ( listsModels ).map ( key =>{
                return {nombre:key}
            } )
            return rows
        }
        , checkedRows () {
            const listsModels = this.listsModels
            , lists = this.lists
            , reference = this.componentProps.reference
            , listModelName = lists[reference]
            , checkedRows = []
            Object.keys(listsModels).forEach ( (key,i) => {
                if ( key == listModelName ) checkedRows.push ( i )
            })
            return checkedRows
        }
    },
    mounted () {
        this.auto_grow(this.$refs.textarea)
    },
    methods: {
        editKey (event){
            const  reference = this.componentProps.reference
            ,  qeParam = this.componentProps.qeParam
            qeParam.key = event.target
        },
        oninput(opcion) {
            let txt 
            , element 
            console.log('opcion'+opcion)
            if ( opcion == 'vista' ) {
                element = this.$refs.textareaVista
                txt = [element.value]
            } else {
                element = this.$refs.textarea
                txt = element.value
            }
            this.auto_grow(element)
            if ( this.componentProps.cb ) this.componentProps.cb(txt)
        },
        auto_grow(element) {
            element.style.height = "5px";
            element.style.height = (element.scrollHeight)+"px";
        }       
    }
}
</script>
<style>
    .context-field-edit-key {
        height: 100%;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .encabezado {
        padding: 5px;
        background: #ddd;
    }
</style>