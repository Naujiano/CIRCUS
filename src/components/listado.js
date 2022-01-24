import SimpleTable from 'c:/data/iis/simple-table/src/components/simple-table.vue'
import Ly from './layout.vue'
import ItemEditor from './item-editor.vue'
import Queryeditor  from './query-editor.vue'
//import RowEditor  from './row-editor.vue'
import Toolbar from './tool-bar.vue'
import Series from './Series.vue'
import { _ } from 'core-js'

export default {
    components: { ItemEditor, SimpleTable, Queryeditor, Toolbar, Ly, Series },
    props: {
        multiline: String,
        ventana: Object,
        filter: Array,
        overflow: Boolean,
        formSetValues: Function,
        keysSettings: Object,
        resetVentana: Function
    },
    data: function () {
        return {
            showAdvanced: false,
            series: {
                operation: "sobreescribir"
                , show: false
            },
            checkedIndexes: [],
            admin: this.api.parsedSearch.admin,
            show: {
                queryEditor: false
            },
            selected_pk_id: "",
            selected_row: "",
            custom_buttons : this.api.$buttonsForTable ( this.ventana.data.table ),
            buttons: [
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 44 44"><g><circle cx="20" cy="20" r="7"></circle><path d="m22,0c-12.2,0-22,9.8-22,22s9.8,22 22,22 22-9.8 22-22-9.8-22-22-22zm12.7,33.3l-1.4,1.4c-0.4,0.4-1,0.4-1.4,0l-5.4-5.4c-0.2-0.2-0.4-0.2-0.6-0.1-1.7,1.1-3.7,1.7-5.9,1.7-6.1,0-11-4.9-11-11s4.9-11 11-11 11,4.9 11,11c0,2.2-0.6,4.2-1.7,5.9-0.1,0.2-0.1,0.5 0.1,0.6l5.4,5.4c0.3,0.5 0.3,1.1-0.1,1.5z"></path></g></svg>`,
                    onClick: ()=>this.loadPage()
                    , helpCode: "list-toolbar-loadpage"
                },
                {
                    label: `<svg data-help-code="list-toolbar-clear" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330.5 330.5"><path d="M178.3 136.6l16.4 16.4 69.7-69.7c2.3-2.3 3.4-5.2 3.4-8.2 0-3-1.1-5.9-3.4-8.2 -4.5-4.5-11.8-4.5-16.4 0L178.3 136.6zM172.3 140.2l-0.7-0.7 -12.4 12.4 -7.7 7.7 20.4 20.4 8.3-8.3 11.8-11.8 -0.9-0.9 -1.2-1.2 -16.4-16.4L172.3 140.2zM66.8 197.2c-0.1 0-0.2 0.1-0.3 0.1 -0.5 0.1-0.9 0.3-1.3 0.6l-0.2 0.1L65 198c-0.5 0.3-0.8 0.7-1.2 1.2 -0.3 0.5-0.6 1-0.8 1.6 -0.5 1.7-0.3 3.7 1.3 4.9 3.8 3 7.7 6 11.6 8.9l0.7-0.3 1.7-0.7L80 213l14.1-5.4 20.6-7.9 -14.3 16.6 -8 9.2 -1.1 1.3 -1.1 1.3 -1.1 1.3c0.8 0.3 1.6 0.4 2.5 0.2 0.5-0.1 1-0.3 1.6-0.5 0.1 0 0.1-0.1 0.2-0.1 0.6-0.3 1.1-0.5 1.7-0.7l3.3 3.3c0 0.8-0.1 1.5-0.1 2.3 -0.1 0.7-0.1 1.5-0.2 2.2 -0.1 1.1-0.3 2.2-0.6 3.3 -0.6 2.5 0.8 5.7 3.5 6.2 4.4 0.9 8 2.4 11.1 4.5 3.5 2.4 6.4 5.4 9.1 9.1 1.3 1.8 2.6 3.6 3.9 5.6 1 1.6 2.6 2.3 4.1 2.3 0.7 0 1.4-0.1 2-0.4 2.4-0.9 4.2-3.4 3.1-6.2l32.3-75.5 -20.2-20.2L66.8 197.2zM165.2 330.5L165.2 330.5C74 330.5 0 256.5 0 165.2v0C0 74 74 0 165.2 0h0c91.3 0 165.2 74 165.2 165.2v0C330.5 256.5 256.5 330.5 165.2 330.5z"/></svg>`,
                    onClick: function () { 
                        if ( ! confirm ( '¿Borrar los parámetros de filtrado?' ) ) return false
                        this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:[]} )
                        this.$refs.qe.clear() 
                        this.clearSimpleTable()
                    }.bind(this)
                    //, title: "Borrar los parámetros de filtrado"
                },
                {
                    label: `<svg data-help-code="list-toolbar-excel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.5 128h-67.6L256 198.5 208.1 128h-67.6l81.1 121.2L130.1 384h131.1v-45.8h-30.3l25.1-37.5 55.7 83.3h70.2l-91.5-134.8L371.5 128zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0 512 114.6 512 256z"/></svg>`,
                    onClick: function () { this.downloadListAsFile() }.bind(this)
                    //, title: "Obtener un Excel con la totalidad del listado."
                },
                {
                    label: `<svg data-help-code="list-toolbar-excel" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M371.5 128h-67.6L256 198.5 208.1 128h-67.6l81.1 121.2L130.1 384h131.1v-45.8h-30.3l25.1-37.5 55.7 83.3h70.2l-91.5-134.8L371.5 128zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0 512 114.6 512 256z"/></svg>`,
                    onClick: function () { this.editRecord() }.bind(this)
                    //, title: "Obtener un Excel con la totalidad del listado."
                }
            ],
            buttonsVistas:[
                {
                    label: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style="transform:rotate(180deg)"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    helpCode:"list-toolbar-loadvista",
                    onClick: function(){
                        const query = this.$store.state.selectedQuery
                        , qeParams = JSON.cc(query.queryEditor.params)
                        let actualQeParams = this.$store.getters.qeParams(this.ventana.index)
                        if ( ! actualQeParams ) actualQeParams = []
                        this.clearSimpleTable()
                        //this.$refs.qe.setQuery(qeParams)
                        this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:actualQeParams.concat(qeParams)} )
                    }.bind(this)
                    //, title: "Cargar Vista"
                },
                {
                    label: `<svg data-help-code="list-toolbar-savevista" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M180.52,149v33.92H76.75V149H56.81v43.9a10,10,0,0,0,10,10H190.47a10,10,0,0,0,10-10V149H180.52Zm-48.3-3.08c3.39-3.38,27.68-35.63,27.68-35.63s4.3-4.29-1.41-4.29H143.63V56.41s0.06-2.06-2.6-2.06H118.39c-3.69,0-3,2.45-3,2.45V107H99.25c-4.71,0-.37,4.1-0.37,4.1l28.55,34.5S129.78,148.37,132.22,145.92ZM128,256h0A128,128,0,0,1,0,128H0A128,128,0,0,1,128,0h0A128,128,0,0,1,256,128h0A128,128,0,0,1,128,256Z"></path></svg>`,
                    //title: "Guardar Vista",
                    onClick: function() { 
                        if ( ! confirm ( '¿Crear una vista con este filtro?' ) ) return false
                        const table = this.ventana.data.table
                        , queryEditor = JSON.cc(this.$refs.qe.settings)//JSON.cc(this.queryEditor)
                        , orderby = JSON.cc(this.orderby)
                        , tablesRelation = this.tablesRelation
                        , joinSyntax = tablesRelation.joinSyntax
                        , uniqueid = new Date().valueOf().toString()
                        , vista = { table, joinSyntax, queryEditor, orderby }
                        this.api.getIdentitiesForTableSet ( table , function( identities ) {
                            vista.identities = identities
                            vista.whereSql = this.grid.whereSql
                            //vista.whereText = this.$refs.qe.queryEditor.getWhereText()
                            //vista.name = this.$refs.qe.settings.whereText
                            vista.name = uniqueid
                            vista.customName = ''//uniqueid
                            vista.tableNames = tablesRelation.names
                            vista.descripcion = ""
                            vista.fecha = this.utils.getSpDate(new Date())
                            vista.tipo = "Normal"
                            this.$store.commit ( 'Query_add' , {query:vista,cb:(recordset)=>{console.log(recordset);window.circus.loadQueries();window.circus.showHelpBox ( {title:'Vista creada',text:'Se ha creado una nueva vista con el filtro actual.'}, true )}} )
                            
                            //this.$store.state.queries.push (vista)
                        }.bind(this))
                     }.bind(this)
                },
            ],
            grid: {
                rows: [],
                rowCount: 0,
                page: 0,
                recXPag: 100,
                loadedRecsNumber: 0,
                //rowIds: [],
                whereSql: "",
                selectSql: "",
                columns: {
                    names: []
                    , widths: []
                    , types: []
                }
            },
            queryEditor: {
                params: {}//this.injectedParams
            },
            orderby: {},
            //showComputer: false
            
        }
    },
    watch: {
        filter: function (object, oldVal ) {
            object = JSON.cc(object)
            //convierto objeto con campos del formulario a array para el QE.
            //const qeParams = Object.keys(object).map ( key => ( Object.assign ( {}, object[key], { 
            const qeParams = object.map ( par => {
                const key = par.column_name
                //, parKey = this.api.getListColumnSql ( par )
                , alias = par.label // this.shortAlias ( this.api.getLiteral ( key ) )
                , data_type = this.utils.getBasicDataType(par.data_type) 
                const newPar = Object.assign ( 
                    {}
                    , par
                    , { 
                        alias
                        //, key: parKey
                        , reference: key
                        , operator: "AND"
                        , leftText: ""
                        , rightText: ""
                        //, _active: (object[key].value === '%' ? false : true)
                        , _active: false //(object[key].value === '%' ? false : true)
                        , _inlist: true
                        //, data_type: this.utils.getBasicDataType(object[key].data_type) 
                        , data_type
                        , _extended : this.showAdvanced
                        , _extendKey : this.showAdvanced
                        , _orderby: '-'
                    }
                ) 
                this.api.setFieldListSettings ( newPar )
                return newPar
            })
            qeParams[0].text = ""
            qeParams[0].value = ""
            let actualQeParams = this.$store.getters.qeParams(this.ventana.index)
            if ( ! actualQeParams ) actualQeParams = []
            //const newParams = actualQeParams.concat(qeParams)
            const newParams = qeParams.concat(actualQeParams)
            //RENOMBRO LOS ALIAS REPETIDOS
            /*
            const aliases = []
            _.reverse(newParams)
            newParams.forEach ( column => {
                while ( aliases.indexOf ( column.alias ) != -1 ) {
                    column.alias += "_2"
                }
                //if ( aliases.indexOf ( alias ) != -1 ) column.alias += "_2"
                aliases.push ( column.alias )
            })
            _.reverse(newParams)
            */
            this.utils.unifyObjectKey ( {array: newParams, key: 'alias'} )
            this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:newParams} )
        },
        qeParams(){
            this.$nextTick(()=>{this.compute()})
        }
        /*
        , ventana(){
            this.compute()
            console.log('a')
        }
        */
    },
    computed : {
        buttonsUser() {
            const buttonsUser = []
            this.buttons.forEach ( (button,i) => {
                if ( i == 0 || i == 2 ) buttonsUser.push ( button )
            })
            return buttonsUser
        },
        distinct: {
            get(){
                const distinct = this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
                return distinct //? distinct : false
            },
           set(v){
                this.$store.commit ( 'set_distinct' , {indexVentana:this.ventana.index, value: v } )
                //this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct = v
            }
        },
        qeParams: {
            get(){
                //const params = this.$store.state.ventanas.data[this.ventana.index].queryeditor.parameters
                const params = this.$store.state.qeParams[this.ventana.index] 
                return params
            },
            set(newParams){
                this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:newParams} )
            }
        },
        series_parameters() {
            if ( ! this.qeParams ) return []
            const mainTable = this.tablesRelation.joinSyntax.split(" INNER JOIN ")[0]
            , series_parameters = JSON.cc ( this.qeParams.filter(param => {
                //const paramKey = param.reference ? param.reference : param.key
                const paramTable = param.table_name
                //console.log(paramTable)
                //return paramKey.toLowerCase().indexOf(mainTable.toLowerCase()) != -1 
                //return paramTable.toLowerCase().indexOf(mainTable.toLowerCase()) != -1 
                return 1
            }))
            //series_parameters.forEach ( param => { param.value = ""; param.text = "" } )
            return series_parameters
        },
         columns () {
             if ( ! this.$refs.qe ) return []
            const table = this.ventana.data.table
            , tableConfig = window.tablesMap.get (table)
            , fields = this.ventana.data.fields
            , identities = this.ventana.data.identities
            , idField = identities[0]
            , distinct = this.distinct // this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            , columns = distinct ? ['1 as PK_ID'] : [`[${tableConfig.table_alias}].[${tableConfig.table_pkname}] as PK_ID`]
            const qeColumns = this.$refs.qe.settings.columns
            qeColumns.forEach ( key => {
                //if ( columns.indexOf(key.toLowerCase()) == -1 ) 
                
                    columns.push ( key  )
            })
            return (columns)
        },
        pkName(){
            const table = this.ventana.data.table
            , tableConfig = window.tablesMap.get (table)
            return tableConfig.table_pkname
        },
        tablesRelation(){
            return this.api.getTablesRelation ( this.ventana.data.table )
        },
        tablaPrincipal(){
            const dbNames = this.tablesRelation.dbnames
            , tableName = dbNames[0][0]
            , tableAlias = dbNames[0][1]
            return { tableName, tableAlias }
        }
    }
    , beforeUpdate(){
        //console.time('listadoRender'+this.ventana.index)
    }
    , updated() {
        //console.timeEnd('listadoRender'+this.ventana.index)
    },
    mounted: function () {
        //console.log("distinct"+this.distinct)
        //this.qeHasChanged.changed = false
        $(this.$refs.computer).sortable({
            handle: '.cell-title'
            , start: this.clearSimpleTable
            , stop: this.sortableStop
            , placeholder: "ui-state-highlight"
            , revert: 200
            , scroll: true
        })

        window.compute = this.compute
        this.compute()

     },
    methods: {
        changeOperator (i) { this.$refs.qe.changeOperator(i) },
        changeText(i,event,t) { this.$refs.qe.changeText(i,event,t) },
        textKeyPress(event,t,i) { this.$refs.qe.textKeyPress(event,t,i) },
        extendParam (i) { this.$refs.qe.parameters.data[i]._extended=!this.$refs.qe.parameters.data[i]._extended;this.$refs.qe.emitParameters() },
        extendParams () { 
            const newState = !this.$refs.qe.parameters.data[0]._extended
            this.$refs.qe.parameters.data.forEach ( param => param._extended = newState ) //[i]._extended=!this.$refs.qe.parameters.data[i]._extended;
            this.$refs.qe.emitParameters() 
            this.showAdvanced=newState
        },
        showFormulario ( ) {
            window.showForm()
            
        },
        editAlias(event,i) {
            $(event.target).focus()
        },
        saveAlias(event,i) {
            this.$refs.qe.parameters.data[i].alias = event.target.innerHTML
            this.$refs.qe.emitParameters() 

        },
        clearSimpleTable(){
            /*
            if ( ! this.grid.rows.length ) return false
            const row = JSON.cc(this.grid.rows[0])
            rows.forEach ( row => {
                Object.keys ( row ).forEach ( key => {
                    row[key] = ""
                } )
            })
            */
            this.grid.rows = []
            this.resizeHeaders(false,true)
            //this.compute()
            //console.log('cba')
        },
        negateParam(i){
            this.$refs.qe.negateParam(i)
        },
        deleteParam(i) {
            this.$refs.qe.deleteParam(i)
        },
        paramDelete ( j ) {
            const actualRows = this.grid.rows
            if ( ! actualRows ) return false
            const rows = []//JSON.cc ( this.grid.rows )
            actualRows.forEach ( fila => {
                //const fila = JSON.cc ( row )
                const newLine = {}
                Object.keys(fila).forEach ( (key,i)=>{
                    if ( i != (j+1) )
                        newLine[key] = fila[key]
                })
                rows.push ( newLine )
            })
            this.grid.rows = rows

            if ( rows.length && Object.keys(rows[0]).length < 2 )  //Ha eliminado todos los parámetros por lo que limpio la tabla.
                this.clearSimpleTable()
        },
        activateParam (i) {
            this.$refs.qe.activateParam(this.$refs.qe.parameters.data[i])
            this.$nextTick( () => { if ( this.$refs.qe.parameters.data[i]._active ) $('.search-field').eq(i).focus() } )
        },
        setNewOrder (i) {
            this.$refs.qe.setNewOrder(i)
        },
        shortAlias (alias) {
            const aliasArr = alias.split(".") 
            return aliasArr[aliasArr.length-1]
        },
        clickFunc ( func, event, i ) {
            console.log('target')
            event.stopPropagation()
            const target = event.target.tagName == "path" ? event.target.closest('svg') : event.target
            const $slot = $(target).closest('div.header-cell')
            if ( $slot.attr('type') != "number" ) return false
            switch ( func ) {
                case 'SUM':
                    func = "AVG"
                    break;
                case 'AVG':
                    func = "DISTINCT"
                    break;
                case 'DISTINCT':
                    func = "SUM"
                    break;
            }
            //func = func == "SUM" ? "AVG" : "SUM"
            //debugger
            //$slot.find('select').val(func)
            if ( func == "SUM" )
                $slot.find('.button-operation svg').addClass('hidden').eq(0).removeClass('hidden')
            if ( func == "AVG" )
                $slot.find('.button-operation svg').addClass('hidden').eq(1).removeClass('hidden')
            if ( func == "DISTINCT" )
                $slot.find('.button-operation svg').addClass('hidden').eq(2).removeClass('hidden')
            //$(target).removeClass('hide')
            this.$refs.qe.parameters.data[i].aggregate_function = func
            this.$refs.qe.emitParameters()
            
        },
        open_serie ( event ) {
            this.$refs.popup.show()
        },
        operate_serie2 ( ) {
            console.log(this.checkedIds)
            //return 
            const txt = this.$refs.input_mass.value
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            , joinSyntax = this.tablesRelation.joinSyntax
            //, dbNames = this.tablesRelation.dbnames
            , tableName = this.tablaPrincipal.tableName //dbNames[0][0]
            , tableAlias = this.tablaPrincipal.tableAlias //dbNames[0][1]
            , field = this.$refs.field_mass.value
            , where = this.checkedIds.length ? `WHERE ${this.pkName} IN ( ${this.checkedIds.toString()} )` : ( qeSyntax?'WHERE '+qeSyntax:'' )
            , query = `set dateformat dmy UPDATE ${tableName} SET ${field} = ${txt} FROM ${joinSyntax}  ${where}`
            , historySelect = `SELECT (select max ( cm_id ) FROM CIRCUS_mass),${this.pkName},${field} FROM ${tableName} WHERE ${this.pkName} IN ( SELECT ${this.distinct?'DISTINCT ':''} [${tableAlias}].${this.pkName} FROM ${joinSyntax}  ${where})`
            , historyCount = `set dateformat dmy SELECT count(${this.pkName}) as count FROM ${tableName} WHERE ${this.pkName} IN ( SELECT ${this.distinct?'DISTINCT ':''} [${tableAlias}].${this.pkName} FROM ${joinSyntax}  ${where})`
            , circusMassInsert = `set dateformat dmy INSERT INTO CIRCUS_mass ( cm_table_name , cm_pkfield, cm_field_name , cm_replace_value , cm_update_sql ) VALUES ( '${tableName}', '${this.pkName}', '${field}', '${txt.replace(/'/g,"''")}', '${query.replace(/'/g,"''")}' )`
            , circusMassHistoryInsert = `set dateformat dmy INSERT INTO CIRCUS_mass_history ( cmh_cm_id, cmh_pkid,  cmh_value ) ${historySelect}`
            , revertDelete = `set dateformat dmy delete CIRCUS_mass_history WHERE cmh_cm_id = ( SELECT max ( cm_id ) FROM CIRCUS_mass ) delete CIRCUS_mass WHERE cm_id = ( SELECT max ( cm_id ) FROM CIRCUS_mass )`
            console.log(query)
            //console.log(historySelect)
            //console.log(historyCount)
            //console.log(circusMassInsert)
            //console.log(circusMassHistoryInsert)
            //return
            this.api.$dbq ({
                sqlSyntax: historyCount
                , dbID: this.api.getTableConnectionId(this.ventana.data.table)
            }, data => {
                const count = data[0].count
                if ( confirm ( `Si continua modificará ${count} registros con la siguiente asignación:
                
                ${field} = ${txt}
                
                `))
                //INSERT EN CIRCUS_mass
                this.api.$dbq ({
                    sqlSyntax: circusMassInsert 
                    , dbID: this.api.getTableConnectionId(this.ventana.data.table)
                }, data => {
                    //console.log(data)
                    if ( data.length ) {
                        console.log(data[0])
                        alert ( '\n\nERROR !!!!!!!! \n\n La sentencia no se ha podido ejecutar.')
                    } else {    
                        //INSERT EN CIRCUS_mass_history
                        this.api.$dbq ({
                            sqlSyntax: circusMassHistoryInsert
                            , dbID: this.api.getTableConnectionId(this.ventana.data.table)
                        }, data => {
                            //console.log(data)
                            if ( data.length ) {
                                console.log(data[0])
                                alert ( '\n\nERROR !!!!!!!! \n\n La sentencia no se ha podido ejecutar.')
                            } else {    
                                //MODIFICACION EFECTIVA DE LOS DATOS
                                this.api.$dbq ({
                                    sqlSyntax: query
                                    , dbID: this.api.getTableConnectionId(this.ventana.data.table)
                                }, data => {
                                    //console.log(data)
                                    if ( data.length ) {
                                        console.log(data[0])
                                        //REVIERTO EL HISTORICO PORQUE HUBO ERROR EN LA MODIFICACION.
                                        this.api.$dbq ({
                                            sqlSyntax: revertDelete
                                            , dbID: this.api.getTableConnectionId(this.ventana.data.table)
                                        }, data => {
                                            //console.log(data)
                                            if ( data.length ) {
                                                console.log(data[0])
                                                alert ( '\n\nERROR !!!!!!!! \n\n La sentencia no se ha podido ejecutar.')
                                            } else {   
                                            }
        
                                        }, true
                                        , true)  
        
                                        alert ( '\n\nERROR !!!!!!!! \n\n La sentencia no se ha podido ejecutar.')
                                    } else {    
                                        alert ( 'Registros modificados correctamente.')
                                    }

                                }, true
                                , true)  
                            }
                                
                        }, true
                        , true)  
        
                    }
                        
                }, true
                , true)  
            }, true
            , true)            
        },
        operate_serie ( params ) {
            console.log(this.series.operation)
            console.log(JSON.cc(params))
            console.log(this.checkedIds)
            if ( ! this.checkedIds || ! this.checkedIds.length ) {
                alert('a')
                window.log ( 'Operación cancelada. No hay ningún registro seleccionado.', 'darkorange' )
                return false
            }
            const mainTable = this.tablesRelation.joinSyntax.split(" INNER JOIN ")[0]
            , assigns = params.filter ( param  => ( param.series && param.series.replaceValue != "" ) ).map ( param => {
                const name = param.reference ? param.reference : param.key
                , value = param.series.replaceValue
                if ( this.series.operation.toLowerCase() == "sobreescribir" ) {
                    return name + " = '" + value + "'"
                } else {
                    return name + " = NULL"
                }
            })
            , sql = "UPDATE " + mainTable + " SET " + assigns
            , identities = this.ventana.data.identities
            , idField = identities[0]
            if ( ! assigns.length ) {
                window.log ( 'Operación cancelada. No ha rellenado ningún campo.', 'darkorange' )
                alert('b')
                return false
            }
            const updates = this.checkedIds.map ( id => `${sql} WHERE ${idField} = ${id}` )
            var sqlSyntax = ""
            updates.forEach ( update => sqlSyntax += update + ' ')
            console.log('sqlSyntax')
            return
            this.api.$dbq ({
                sqlSyntax
                , dbID: this.api.getTableConnectionId(this.ventana.data.table)
            }, data => {
                window.log ( updates.length + ' registros alterados.', 'green' )
            }, true
            , true)
            //this.api.$serie_overwrite ( this.ventana.)
        },
        scrollHeaders ( leftScroll ) {
            $(this.$refs.computer).css({'margin-left':leftScroll*-1})
        },
        resizeHeaders ( widths , reset ) {
            const $cols = $(this.$refs.computer).find('div.header-cell')
            this.grid.columns.widths=widths
            $cols.each ( function(i) {
                if ( ! reset )
                    $(this).css({'max-width':(widths[i+1]+12)+'px','min-width':(widths[i+1]+12)+'px','width':(widths[i+1]+12)+'px'})
                else
                    $(this).css({'max-width':'','min-width':'','width':''})
            })
        },
        qeParamUpdate (params) {
            //console.log('parem:'+params)
            //return
            
            if ( params == 'resorted' ) {
                //this.clearSimpleTable()
                return false
            }
            
            this.$store.commit ( 'Ventana_injectQE' , {indexVentana:this.ventana.index,qeParams:params} )

        },
        tabulator ( jsonRecordset ) {
           if ( !jsonRecordset.length ) return ""
           jsonRecordset.forEach ( row => delete row[Object.keys(row)[0]] )
           const $tabla = $('<table/>')
           , cellStyle = {border:"1px solid #eee",padding:"5px"}
           , firstRecord = jsonRecordset[0]
           //Creo encabezados
           , $headRow = $('<tr/>')
           $tabla.append($headRow)
           Object.keys(firstRecord).forEach ( key => {
               const $cell = $('<td/>').css(cellStyle)
               $headRow.append($cell.text(key))
           })
           jsonRecordset.forEach ( record => {
               const $row = $('<tr/>')
               $tabla.append($row)
               Object.keys(record).forEach ( key => {
                   const $cell = $('<td/>').css(cellStyle)
                   $row.append($cell.text(record[key]))
               })
               
           })
           return $tabla.wrap('<div/>').parent().html()
        }
        , downloadListAsFile() {
            /*
            const tabla = JSON.cc(this.grid.rows)
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            , whereSyntax = qeSyntax.length ? qeSyntax : ''
            , sqlParams = {
                columns: this.$refs.qe.settings.columns
                , schemaSyntax: this.tablesRelation.joinSyntax
                , whereSyntax
                , orderbyColumns: this.$refs.qe.settings.orderBy != "" ? this.$refs.qe.settings.orderBy:this.pkName
            }
            , types = {}
            console.log(sqlParams)
            JSON.cc(this.$refs.qe.settings.params).forEach ( param => {
                types[param.reference] = param.data_type
            })
            //console.log(types)
            this.api.downloadExcel ( sqlParams, types )
            return
            */
            this.loadPage(2,()=>{
                var blob = new Blob(["\ufeff",this.tabulator(JSON.cc(this.grid.rows))], { type: 'text/plain' })
                , url = window.URL.createObjectURL(blob)
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = url;
                a.download = 'Listado.xls';
                a.click();
            })
        },
        editRecord( ) {
            const row = this.selected_row
        },
        containerResize () {
            this.$refs.Tabla.resizeHeaders()
        },
        headerClick ( index, event ) {
            const qeParam = this.qeParams[index]//.field_full_name
            , qe = this.$refs.qe
            , that = this
            event.stopPropagation();
            that.$store.commit ( 'set_contextDialogProps', qeParam )
            window.contextDialog (
                { qeParam, value: qe.parameters.data[index].key, cb: (txt)=>{
                    if ( txt.length == 1 ) { //Viene de nombre de la vista
                        console.log('a')
                        qe.parameters.data[index].vista = txt[0]
                        qe.emitParameters()
                    } else if ( txt ) { //VIENE DEL COMPONENTE contextFieldEditKey
                        console.log('j')
                        qe.parameters.data[index].key = txt
                        qe.emitParameters()
                    } else { // viene dl componente contextFieldEditList
                        that.$store.commit ( 'set_contextDialogProps', qeParam )
                    }
                } }
                , [ {componentName: "contextFieldEditList", componentLabel: "Configuración de lista"}, {componentName: "contextFieldEditKey", componentLabel: "Configuración SQL"} ]
            )
        },
        checkClick(checklist){
            //return
            //console.log(checklist)
            const checked_pk_id = []
            /*
            this.grid.rows.forEach ( ( row, i ) => {
                if ( $.inArray ( i, checklist ) != -1 ) checked_pk_id.push ( row.PK_ID )
            })
            */
           checklist.forEach ( ( ele, index ) => {
               checked_pk_id.push ( this.grid.rows[index].PK_ID )
            })
            //return
            //console.log(checked_pk_id)
            //this.$store.commit ( 'checked_assign', { indexVentana: this.ventana.index, ids: checked_pk_id } )
            this.checkedIds = checked_pk_id
            console.log(checked_pk_id)
            //this.checkedIndexes = checklist
            //this.$store.commit ( 'log', checklist.length + ' registros marcados.' )
        },
        custom_button_click ( boton ) {
            customjs.buttons.onclick[boton.onclick](this.api,this.selected_pk_id)
            return
            if ( ref == "getDocument" ) customjs.buttons.onclick.getDocument(this.api,this.selected_pk_id)
            if ( ref == "editRecord" ) customjs.buttons.onclick.editRecord(this.api,this.selected_pk_id)
        },
        rowClick(row){
            this.selected_pk_id = row.PK_ID
            this.selected_row = row
            return
            const identities = this.ventana.data.identities
            , idField = identities[0]
            , joinSyntax = this.tablesRelation.joinSyntax
            //, fields = this.tablesRelation.names.map ( tblName => `${tblName}.*`)
            , asArr = []
            , fields = Object.keys(this.keysSettings).map ( fieldName => {
                //Esto es para cargar el texto en lugar de el ID en el caso de lista dinámica. Habrá que quitarlo cuando el programa pretenda escribir o implemente inline-search.
                const columnSql = this.api.getListColumnSql ( fieldName )
                if ( fieldName.length > 128 ) { //SQL Server no acepta alias de más de 128 caracteres. Tengo que generar uno en ese kso. 
                    const uniqueid = this.uniqueid()
                    asArr.push ({
                        fieldName
                        , uniqueid
                    })
                    fieldName = uniqueid
                }
                return `(${columnSql}) AS [${fieldName}]`
            })
            , sql = `sql=SELECT ${fields} FROM ${joinSyntax} WHERE ${idField}=${pk_id}` 
            //console.log(sql)
            /*
            $get ( sql, table, data => {
                this.$emit('rowClick',data[0])
            })
            */
            this.api.$dbq ({
                operation: 'select'
                , columns: fields
                , schemaSyntax: joinSyntax
                , whereSyntax: `${table}.${idField}=${pk_id}`
                , dbID: this.api.getTableConnectionId(table)
            }, data => {
                const row = data[0]
                asArr.forEach ( asid => {
                    row[asid.fieldName] = row[asid.uniqueid]
                })
                //Object.keys(row).for
                this.$emit('rowClick',row)
            })
        },
        paramsToForm ( ) {
            //log(this.queryEditor.params)
        },
        orderBy ( orderby ) {
            this.orderby = JSON.cc(orderby)
            console.log(JSON.cc(orderby))
            //Object.keys( orderby )
        },
        qeHasChanged () {
            const hasChanged = ( this.$refs.qe.settings != this.grid.qeSettings ) || ( this.qeHasChanged.changed )
            this.qeHasChanged.changed = false
            //this.distinct = this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            //console.log('QE has Changed: '+hasChanged)
            return hasChanged
        },
        /*
        clickShowComputer(event) {
            //event.stopPropagation();
            console.log(this.showComputer)
            this.showComputer=!this.showComputer;
        },
        */
        telon(show) {
            const buttons = $(this.$refs.toolbar).find('button')
            , butSel = buttons.eq(1).add(buttons.eq(2)).add(buttons.eq(6))
            if ( show ) {
                butSel.prop('disabled',true).css({'text-decoration':'line-through'})
                //$(this.$refs.listado).css({cursor:'progress'})
                //$('body').css({cursor:'progress'})
                window.working(1)

            } else {
                //butSel.each ( () => {$(this).text('this.value');console.log(this)} )
                butSel.prop('disabled',false).css({'text-decoration':'none'})
                //$(this.$refs.listado).css({cursor:'default'})
                //$('body').css({cursor:'default'})
                window.working(0)
            }
            //$('body').css({cursor:'pointer'})
        },
        compute ( params ) {
            // COMPUTO
            // OBTENGO LOS NOMBRES DE LAS COLUMNAS
            //debugger
            const colNames = this.columns.map ( column => {
                const cSplit = column.toLowerCase().split ( " as " )
                , sql = cSplit[0]
                , label = cSplit.length > 1 ? cSplit[1] : cSplit[0]
                , qeParams = JSON.cc(this.qeParams)

                // BUSCO EN LOS PARÁMETROS DEL QUERY EDITOR LA REFERENCIA (EL NOMBRE ORIGINAL DEL CAMPO) CORRESPONDIENTE AL ALIAS PARA UTILIZARLA EN LUGAR DE LA POTENCIAL SUBQUERY DE LOS CAMPOS DE LISTAS, YA QUE NO SE PUEDE USAR FUNCIONES DE AGREGADO SOBRE SUBQUERYS.
                let reference
                Object.keys(qeParams).forEach ( key => {
                    const alias = qeParams[key].alias
                    if ( '['+alias.toLowerCase()+']' == label.toLowerCase() ) reference = qeParams[key].field_full_name
                })
                return { sql:reference, label }
            })
            colNames.splice(0,1) // quito pk_id (la primera columna que nunca se ve)
            

            //obtengo los data type de las columnas del listado
            colNames.forEach ( (name,i) => {
                this.grid.columns.types[i] = "text"
                Object.keys(this.keysSettings).forEach ( key => {
                    if ( name.sql.toLowerCase() == key.toLowerCase() ) this.grid.columns.types[i] = this.utils.getBasicDataType(this.keysSettings[key].data_type)
                })
            })

            const computedColumns = []
            colNames.forEach ( (name,i) => {
          //      if ( i > 0 ) {
                    //computedColumns.push ( "" )
                    const type = this.qeParams[i].basic_data_type //this.grid.columns.types[i]
                    , func = this.qeParams[i].aggregate_function //$(this.$refs['computed_'+name.label]).find('select option:selected').val()
                    //debugger
                    //console.log(name)
                    if ( name.sql.toLowerCase().indexOf ( 'select' ) == -1 ) { //SI TIENEN SELECT ES QUE ES UNA SUBQUERY DE UN CAMPO COMPUTADO. NO SE PUEDEN CONTAR LAS SUBQUERIES POR RESTRICCIÓN DE SQL SERVER.
                        if ( type == "number" ) {
                            if ( func )  { 
                                if ( func != "DISTINCT" )
                                    computedColumns.push ( func + "(" + name.sql + ") as " + name.label ) 
                                else
                                    computedColumns.push ( "COUNT(DISTINCT(" + name.sql + ")) as " + name.label ) 
                            } else { 
                                computedColumns.push ( "'' as " + name.label ) 
                            }
                        } else if ( func == "DISTINCT" ) {
                            computedColumns.push ( "COUNT(DISTINCT(" + name.sql + ")) as " + name.label ) 
                        }
                    } else {
                        computedColumns.push ( "'' as " + name.label ) 
                    }
          //      }
            })
            this.grid.columns.names = colNames

            if (!computedColumns.length || !params) return false

            const paramsComputedCols = JSON.cc(params)
            paramsComputedCols.columns = computedColumns
            console.log(paramsComputedCols)
            this.api.$dbq (paramsComputedCols , data => {
                const results = JSON.cc(data[0])
                Object.keys(results).forEach ( key => {
                    let result = results[key]
                    result = ( result && result != "" ) ? result : "[No disponbible]"
                    $(this.$refs['computed_['+key+']']).find('span').html( result ).attr ( 'title', result )
                    $(this.$refs['computed_['+key+']']).find('.button-operation *').attr ( 'title', result )
                })
                //console.log(data[0])
            })
        },
        set_distinct () {
            //console.log('aaaaa')
            //this.distinct = ! this.distinct
            this.$store.commit ( 'set_distinct' , {indexVentana:this.ventana.index, value: !this.distinct} )
            this.qeHasChanged.changed = true
            return
            const data = this.grid.rows
            data.forEach ( thing => {thing.PK_ID=1})
            const uniqueArray = data.filter((thing, index) => {
              const _thing = JSON.stringify(thing);
              return index === data.findIndex(obj => {
                return JSON.stringify(obj) === _thing;
              });
            });
            this.grid.rows = uniqueArray
            this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct = true
        },
        keyDownSearchField (event,i) {
            if(event.keyCode === 13){  event.preventDefault(); return false }
        },
        positionContext ( event, i ) {
            // SI ES UNA SELECT DESCRITA, CANCELO LA CONTEXTLIST
            const $field = $(event.target)
            , text = $field.text()
            const descriptedSelect = this.descriptedSelect( text ) 
            if ( descriptedSelect.descripcion ) return false
            // /SI ES UNA SELECT DESCRITA, CANCELO LA CONTEXTLIST

            this.$refs.qe.positionContext(i,event,this.getParam(i));
        },
        alterSearchString (event,i) {
            const val = $(event.target).text() //event.target.innerHTML
            , qep = JSON.cc ( this.$refs.qe.parameters.data)
            //console.log($(event.target).text())
            qep[i].text = val
            qep[i].value = val
            this.$refs.qe.parameters.data = qep
            this.$refs.qe.emitParameters()
            /*
            , qep = JSON.cc ( this.qeParams )
            qep[i].text = val
            qep[i].value = val
            this.qeParams = qep
            */
        },
        focusSearchField (event,i,remove) {
            const $field = $(event.target)
            , text = $field.text()
            , descriptedSelect = this.descriptedSelect( text )
            let descripcion = text
            if ( descriptedSelect.descripcion ) descripcion = descriptedSelect.descripcion
            if (remove) {
                //$field.removeClass('focused')
                window.contextList.closeContext()
                this.alterSearchString(event,i)
                $field.text(descripcion)
            } else {
                $field.addClass('focused')
                this.$refs.qe.openContext(i,event,this.$refs.qe.parameters.data[i],function(){$field.removeClass('focused') })
                $field.text(this.$refs.qe.parameters.data[i].text)
            }

        },
        descriptedSelect ( val ) {
            try {
                const obj = JSON.parse ( val )
                , sql = obj.sql
                , descripcion = obj.descripcion
                return obj
            } catch ( err ) {return val}

        },
        getParamSearchString ( i ) {
            let str = this.$refs.qe.parameters.data[i].text
            if ( str == "[]" ) str = ""
            const descriptedSelect = this.descriptedSelect( str ) 
            if ( descriptedSelect.descripcion ) str = descriptedSelect.descripcion
            return str

        },
        getParam ( i ) {
            let par = this.$refs.qe.parameters.data[i]
            return par

        },
        sortableStop (event,ui) {
            //const $li = $(ui.item)
            //, $lis = $li.parent().find('li')
            const $lis = $(this.$refs.computer).find('.header-cell')
            , params = []
            $lis.each ( function () {
                params.push ( JSON.parse($(this).attr('param')) )
            })
            $(this.$refs.computer).sortable('cancel')
            this.$refs.qe.parameters.data = params//_.reverse(params)
            this.$refs.qe.emitParameters()
            this.$refs.qe.$emit ( 'paramUpdate', 'resorted' )
        },
        loadList (o,cb) {
           
            //this.grid.rows = []
            //return
            const table = this.ventana.data.table
            , joinSyntax = this.tablesRelation.joinSyntax
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            , whereSyntax = qeSyntax.length ? 'WHERE ' + qeSyntax : ''
            , pkName = this.pkName
            , whereListado = `pkname = '${table}.${pkName}'`
            , insertIds = `sql=delete DBH_listado INSERT INTO DBH_listado (sessionId,idusuario,idlistado,pkname) 
            select 1,1,${pkName},'${table}.${pkName}' FROM ${joinSyntax} ${whereSyntax} 
            SELECT count(idlistado) as noFilas FROM DBH_listado WHERE ${whereListado}` 
            , rowIdsSql = `sql=select ${pkName} as id FROM ${joinSyntax} ${whereSyntax}`
            , dbID = this.api.getTableConnectionId(table)
            , selectSql = `SELECT ${this.distinct?'DISTINCT ':''} ${this.columns} FROM ${joinSyntax}  ${qeSyntax?'WHERE '+qeSyntax:''}`
            this.grid.loadedRecsNumber = 0
            
            console.log(selectSql)
            //this.qeHasChanged.changed = true
            this.api.$dbq ({
                sqlSyntax: "set language spanish SELECT COUNT(*) as recnum FROM (" + selectSql + ") as a"
				, dbID: this.api.getTableConnectionId(table)
            }, data => {
                if ( data[0].Error ) { 
                    console.log('Error')
                    console.log(data)
                    window.circus.showHelpBox ( {title:'Error SQL', text:data[0].Error})
                    this.telon(0)
                    return
                }
                this.grid.rowCount = data[0].recnum ? data[0].recnum : 0
                this.grid.whereSql = whereSyntax
                this.grid.qeSettings = this.$refs.qe.settings
                this.grid.page = 0
                this.grid.rows = []
                this.checkedIds = []
                this.checkedIndexes = []
                this.loadPage(o,cb)

                //if ( ! this.grid.rowCount ) console.log(queryPars)
            },false,true)
            return
            
            const queryPars = {
                columns: [`count(${table}.${pkName}) as recnum`]
                , schemaSyntax: joinSyntax
                , whereSyntax: qeSyntax
                , dbID
            }
            this.api.$dbq (queryPars, data => {
                //console.log(data)
                //this.grid.rowIds = data[0].recnum//data.map ( field => field.id )
                this.grid.rowCount = data[0].recnum ? data[0].recnum : 0
                this.grid.whereSql = whereSyntax
                this.grid.qeSettings = this.$refs.qe.settings
                this.grid.page = 0
                this.grid.rows = []
                this.checkedIds = []
                this.checkedIndexes = []
                //console.log('a')
                this.loadPage(o,cb)

                //if ( ! this.grid.rowCount ) console.log(queryPars)
            })
        },
        loadPage (o,cb) {
            this.telon(1)
            window.circus.panels.form = false
            window.circus.panels.bottom = false
            const table = this.ventana.data.table
            , columns = this.columns
            , joinSyntax = this.tablesRelation.joinSyntax
            , qeSyntax = this.$refs.qe.settings.sqlSyntax
            //, whereSyntax = qeSyntax.length ? 'WHERE ' + qeSyntax : ''
            , whereSyntax = qeSyntax.length ? qeSyntax : ''
            this.compute({
                 schemaSyntax: joinSyntax
                , whereSyntax: whereSyntax
                , dbID: this.api.getTableConnectionId(table)
            })
            if ( this.qeHasChanged() ) {
                //console.log('has changed')
                this.loadList(o,cb)
                return
            }
            if ( ! this.grid.rowCount ) {
                //this.grid.rows = [{[' ']:'No hay coincidencias'}]
                this.telon(0)
                window.circus.showHelpBox ( {title:'No hay resultados', text:'La consulta no ha devuelto ningún resultado.'})
                return false
            }
            if ( this.grid.rowCount == this.grid.loadedRecsNumber ) {
                if ( o==2 ) { //viene de solicitar Excel
                    if ( cb ) cb()
                    this.telon(0)
                    return
                }
                if ( ! confirm ( "Se han cargado la totalidad de los registros de este listado.\n\nDesea comenzar la carga del listado nuevamente desde el principio?") ) {
                    if ( cb ) cb()
                    this.telon(0)
                } else {
                    this.loadList(o)
                }
                return false
                
            }
            const pkName = this.pkName
            , tableConfig = window.tablesMap.get(table)
            , whereListado = `pkname = '${table}.${pkName}'`
            , orderbyStr = this.$refs.qe.settings.orderBy != "" ? this.$refs.qe.settings.orderBy:`[${tableConfig.table_alias}].[${pkName}]`
            , recXPag = this.grid.recXPag
            , offset = this.grid.page * recXPag
            , selectSql = `sql=SELECT ${this.distinct?'DISTINCT ':''} ${columns} FROM ${joinSyntax} ${this.grid.whereSql} ORDER BY ${orderbyStr} OFFSET ${offset} ROWS FETCH NEXT ${recXPag} ROWS ONLY`
            this.grid.page++
            let loadedRecsNumber = this.grid.page*this.grid.recXPag
            if ( ( loadedRecsNumber > this.grid.rowCount ) || o ) loadedRecsNumber = this.grid.rowCount
            this.grid.selectSql = selectSql.substring(4)
            console.log(this.grid.selectSql)
            const params = {
                columns: columns
                , schemaSyntax: joinSyntax
                , whereSyntax: whereSyntax
                , orderbyColumns: orderbyStr
                , offset: offset
                , pageSize: recXPag
                , dbID: this.api.getTableConnectionId(table)
                , distinct: this.distinct // this.$store.state.ventanas.data[this.ventana.index].queryeditor.distinct
            }
            if ( o ) {
                params.pageSize=999999999
            }
            this.api.$dbq (params , data => {
                this.grid.rows =  this.grid.rows.concat(data)
                this.grid.loadedRecsNumber = loadedRecsNumber
                //this.grid.columns.names = Object.keys(this.grid.rows[0]).splice(1)
                //this.grid.columns.types = [2]
               // console.log(JSON.cc(this.filter))
                this.telon(0)
                window.circus.showHelpBox ({title:`Cargados ${loadedRecsNumber} registros`,text:`Se han cargado los siguientes ${loadedRecsNumber} registros`} )
                if ( cb ) cb()
                /*
                if ( loadedRecsNumber == this.grid.rowCount ) {
                    Object.assign(this.buttons[0],{disabled:true})
                    Object.assign(this.buttons[1],{disabled:true})
                    this.buttons.push('a')
                    this.buttons.length = this.buttons.length - 1
                }
                */
            })

        }
    }
  }
