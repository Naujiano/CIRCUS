<template>
    <div class="context-field-edit-list">
        <div class="encabezado">
            <div style="text-transform:uppercase">Cambiar modelo de lista desplegable<br></div>
            <b>{{componentProps.qeParam.is_computed?componentProps.qeParam.label:componentProps.qeParam.field_full_name}}</b>
        </div>
        <SimpleTable style=""
            ref="simpleTable"
            :rows="rows"
            :hiddenKeys="['listModelName']"
            :checkable="true"
            :searchable="true"
            :selectable="true"
            :showHeaders="false"
            :checkedRows="checkedRows"
            :singlecheck="true"
            :editablekeys="['nombre']"
            v-on:rowClick="rowClick"
            v-on:rowEdit="rowEdit"
            v-on:checkClick="checkClick"
            searchString=""
        />
    </div>
</template>
<script>
import SimpleTable from 'c:/data/iis/simple-table/src/components/simple-table.vue'
export default {
    components: { SimpleTable },
    props: {
        componentProps: { type: Object, required: true }
    },
    data () {
        return {
            listsModels : this.$store.state.database.listsModels
            , lists : this.$store.state.database.lists
        }
    },
    computed: {
        rows () {
            const listsModels = this.listsModels
            , rows = Object.keys ( listsModels ).map ( key =>{
                return {nombre:listsModels[key].alias ? listsModels[key].alias : key , listModelName: key }
            } )
            return rows
        }
        , checkedRows () {
            const listsModels = this.listsModels
            , lists = this.lists
            , qeParam = this.componentProps.qeParam
            , listModelName = qeParam.listModel //lists[qeParam.field_full_name]
            , checkedRows = []
            Object.keys(listsModels).forEach ( (key,i) => {
                if ( key == listModelName ) checkedRows.push ( i )
            })
            return checkedRows
        }
    },
    methods: {
        rowClick(){},
        rowEdit( row ){
            const modifiedRowIndex = row.rowIndex
            const editedKeyName =  row.__editedKeyName__
            , listModelName = row.listModelName
            , value = row[editedKeyName]
            this.$store.commit ( 'set_listModelAlias' , {listModelName, value})

        },
        checkClick(checklist){
            const { field_full_name, table_config_keyname, column_name } = this.componentProps.qeParam
            let listModelName = false
            if ( checklist.length ) {
                listModelName = checklist[0].listModelName
            }
                //listModelName = checklist[0].nombre //this.rows[checklist.].nombre
//                debugger
/*
            if ( ! confirm ( 'Asignar modelo de lista\n\n' + field_full_name + ' = ' + listModelName ) ) {
                this.$refs.simpleTable.reset()
                return false
            } else {
                */
                const store = JSON.cc(this.$store.state)
                //debugger
                window.commit ( 'set_listModelNameToField' , { listModelName, tableName: table_config_keyname, fieldName: column_name } )
                window.circus.showHelpBox({title:'Modelo de lista cambiado',text:`Se ha canbiado el modelo de lista asignado al campo ${field_full_name} a ${listModelName}`})
                if ( this.componentProps.cb ) this.componentProps.cb()
            //}
        },
    },
    mounted () {
        //console.log(JSON.cc(this.$store.state.database.listsModels))
    }
}
</script>
<style>
    .context-field-edit-list {
        height: ;
        max-height: 100%;
        display: flex;
        flex-direction: column;
    }
    .encabezado {
        padding: 5px;
        background: #ddd;
    }
</style>