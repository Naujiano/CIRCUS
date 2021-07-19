<template>
    <div ref="container" style="display: none; position:absolute; margin: -5px 0px 0 -5px; padding: 10px;width: calc(100% - 16px); height: calc(100% - 17px); background: #f2f2f2; border:1xp solid gray;z-index:99999; box-sizing:border-box">
        <div class="custom-title" style="padding:10px; font-size: 17px">{{operation}} serie de registros</div>
        <br>
        <table style="width:100%;">
            <tr>
                <td>
                    <ul>
                        <li>- Sólo se pueden modificar campos de la tabla principal (los demás no se muestran en este formulario).</li>
                        <li>- Actua sobre la serie de registros seleccionados.</li>
                        <li>- Sólo altera el contenido de los campos aquí cumplimentados.</li>
                    </ul>
                </td>
                <td style="width:50%;text-align:right;align:right">
                    <button class="btn btn-primary" style="float:right; margin-left:20px;" @click="hide()">Cerrar</button>
                    <button class="btn btn-primary" style="float:right; margin-left:20px;" @click="clear()">Borrar</button>
                    <button class="btn btn-primary" @click="operate()" style="float:right; text-transform: capitalize; margin-left:20px;">{{operation}}</button>
                </td>
            </tr>
        </table>
        <br>
        <div style="overflow:auto; height: calc(100% - 120px);">
            <div v-for="(param,i) in parameters">
                <label style="font-weight: normal">{{param.alias}}</label>
                <!--
                <textarea class="form-control" style="height:24px; width: 400px; resize: none; font-size:11px" @blur="setState($event, param)" @focus="openContext(i,$event,param)" v-model="param.text"></textarea>
                -->
                <Field style="height:24px; width: 400px;" @input="setState" :keyName="keyParam(param)" :type="param.type" :singlecheck="true" :value="{value:param.series.replaceValue,text:param.text,paramIndex:i}"></Field>
            </div>
            <div style="float:none;clear:both"></div>
        </div>
    </div>
</template>
<script>
import Field from './field.vue'

export default {
    components: { Field }
    , props: {
        operation: String,
        fields: Array
    }
    , data() {
        return {
            parameters: []//JSON.cc ( this.fields )
        }
    },
    computed: {
    },
    watch: {
        fields: function (val, oldVal ) { 
            // Esto fabrica la variable interna 'parameters' a partir de los campos recibidos desde el listado pero manteniendo los valores introducidos para la sustitución anterior.
            val.forEach ( par1 => {
                this.clearParam ( par1 )
                const key1 = this.keyParam ( par1 )
                this.parameters.forEach ( par2 => {
                    const key2 = this.keyParam ( par2 )
                    if ( key1 == key2 ) { this.copyParam ( par1, par2 ) }
                })
            })
            this.parameters = JSON.cc ( val )
            //this.parameters.forEach ( param => { param.value = ""; param.text = ""; delete param.series } )
            //console.log('aa')
        }
    }
    , methods: {
        show () {
            $(this.$refs.container).show()
        },
        hide () {
            $(this.$refs.container).hide()
        },
        clear () {
            this.parameters.forEach ( par => { this.clearParam(par) } )
        },
        operate() {
            if ( ! confirm ('Alterar la serie de registros?') ) return false
            this.$emit('operate', this.parameters)
        },
        clearParam (par) {
            par.value=""
            par.text="" 
            par.series={}
            par.series.replaceValue=""
        },
        copyParam (par1,par2) {
            par1.value = par2.value
            par1.text = par2.text
            if ( par1.series && par2.series ) par1.series.replaceValue = par2.series.replaceValue
        },
        keyParam ( par ) {
            return ( par.reference ? par.reference : par.key )
        },
        setState(state) {
            state = JSON.cc(state)
            const field = this.parameters[state.paramIndex]
            field.text = state.text
            console.log(state)
            if ( ! field.series ) field.series = {}
            field.series.replaceValue = state.value
            //window.contextList.closeContext()
        },
        /*
        openContext(i,event,param) {
            let parVal = param.value
            //if ( typeof parVal == 'object' ) parVal = JSON.stringify ( parVal )
            $(event.target).text(parVal)
            const keyName = this.keyParam ( param )
            , val = $(event.target).text()
            , type = param.data_type
            , singlecheck = true
            this.focusedParamIndex = i
            window.contextList.openContext(keyName,$(event.target),val,type,this.contextListCheckClick,false,singlecheck)
        },
        contextListCheckClick(checkedRows){
            const i = this.focusedParamIndex
            , par = this.parameters[i]
            , literal = checkedRows.map ( row => row[Object.keys(row)[1]] )
            , row = checkedRows[0]
            , id = row[Object.keys(row)[0]]
            console.log(JSON.stringify ( literal ))
            //console.log(par)
            if ( ! par ) return 
            par.value = JSON.stringify ( literal )
            par.text = JSON.stringify ( literal )
            par.series.replaceValue = id
            //this.emitParameters()
        },
        */
    }
}
</script>