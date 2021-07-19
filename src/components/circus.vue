<template>
    <div id="circus" style="overflow:hidden; background: #292C3A; background:transparent">
        <div class="login-container" style="" v-show="!sessionId">
            <div class="login-form" style="">
                <h1>CIRCUS - Login</h1>
                <form onsubmit="return false">
                <div class="form-group">
                    <label>Usuaurio</label>
                    <input class="form-control" ref="controlUsuario" :value="getLoginCookie('usr')">
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" class="form-control" ref="controlContrasena" :value="getLoginCookie('pass')">
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" @click="login()">Login</button>
                </div>
                </form>
            </div>
        </div>
        <contextDialog :components="contextDialog.components" :componentProps="contextDialog.componentProps" v-show="contextDialog.show"/>
        <!--<contextDialog componentName="contextFieldEditor" :componentProps="{key:'CLI_Estado',target:{}}" />-->
        <!--<SimpleTable style="z-index:1000;position:absolute;width:100px;height:100px;background:green" :rows="[{nombre:'juan'},{nombre:'raul'}]" :searchable="true"/>-->
            <div v-show="showHelpState" class="panel-envelope" style=";height:auto;width:auto;background: transparent;color:;font-weight:500;font-size:11px;position:absolute;bottom:0;z-index:100;display:; align-self: flex-end">
                <div style="height:50%;width:100%;background: white" ref="helpCuadrant" v-html="helpText"></div>
                <div class="custom-title" style="position:absolute; width: 176px; margin-top: -20px;display:none">LOG</div>
                <div style="height:50%;width:100%;overflow-y:auto;overflow-x:none;display:none;" ref="logCuadrant">
                    <div v-for="msg in logText" style="margin-bottom:7px" v-html="msg"></div>
                </div>
            </div>

        <ly flexbox=1 column=1 height=1 style="position:relative">
          <ly v-show="show.formlist" width=1 style="height:70%;position:relative;z-index:10;border:0px solid red" grow=1 id="containers" ref="contents">
           <ly flexbox=1 height=1  >
             <ly grow=1 height=1>
                 <ly flexbox=1 column=1 height=1>
                     <ly grow=1 v-for="area in visibleAreas" :style="areaHeight"><Containers :containers="containersFromArea(area)" @panelSwitch="panelSwitch" :panels="panels"/></ly>
                </ly>
             </ly>
           </ly>
           <!--
           <button v-show="admin" @click="show.queries=!show.queries" style="position:absolute;bottom:15px;right:15px;background:;padding: 3px;z-index:1">
            <div :class="{'arrow-up':!show.queries,'arrow-down':show.queries}"></div>
            </button>
            -->
         </ly>
         
         <!--
         <div v-show="show.formlist" style="display:flex; height:70%; width:100%;">
            <div v-for="area in visibleAreas" style="width:100%;"><Containers :containers="containersFromArea(area)" @panelSwitch="panelSwitch" :panels="panels"/></div>
           <button v-show="admin" @click="show.queries=!show.queries" style="position:absolute;bottom:15px;right:15px;background:;padding: 3px;z-index:1">
            <div :class="{'arrow-up':!show.queries,'arrow-down':show.queries}"></div>
            </button>
        </div>
        -->
         <div :style="{display:'flex',height:(show.formlist?'30%':'100%')}" v-show="panels.bottom&&admin">
         
        
            <div class="panel-envelope" style=";flex-grow:1;height:100%;border:0px solid red; max-height:calc(100% - 0px);position:relative;min-width:100%" id="queriesList">
                <button  @click="show.formlist=!show.formlist" style="position:absolute;top:15px;right:15px;background:;padding: 3px;z-index:1">
                    <div :class="{'arrow-up':show.formlist,'arrow-down':!show.formlist}"></div>
                </button>
                <SimpleTable
                    style="border:1px solid gray;border-width:0px 0;padding:5px"
                    :nowrap="false" 
                    :searchable="true" 
                    :editablekeys="['Nombre']" 
                    :hiddenKeys="['id']" 
                    :rows="queries" 
                    v-on:rowEdit="queriesTableOnChange" 
                    v-on:rowClick="queriesRowClick" 
                    :actions="gridActions"
                    cellMaxHeight="40px"
                />
            </div>
            </div>
        </ly>
        <ContextList/>
        <!--
        <div style="position:absolute;z-index:10000; width: 100vw; height: 100vh; background: pink; top:0;left:0;display:none;overflow:auto">
            <treeMenu :treedata="treedata_tables"/>
        </div>
        -->

        <!--<context-menu ref="contextMenu" v-show="Object.keys($store.state.contextMenu).length"/>-->
    </div>
</template>


<script>
import Vue from 'vue'
//import * as store from '../store.js'
import * as api from '../api.js'
import actions_global from '../actions_global.js'
const {$fieldsForTable,saveTree,tablesFromConnection,keepDBConnAlive} = api
import uuidV1 from 'uuid/v1'
//import * as helpers from '../helpers.js'
//import $ from 'jquery'
//import _ from 'lodash'
import ContextList from './context-list.vue'
import ToolBar from './tool-bar.vue'
import Containers from './containers.vue'
//import ItemList from './item-list.vue'
//import ItemEditor from './item-editor.vue'
import Ly from './layout.vue'
import ContextMenu from './context-menu.vue'
//import Tabla from './grid-record.vue'
import SimpleTable from 'c:/data/iis/simple-table/src/components/simple-table.vue'
import queryEditor from './query-editor.js'
import treeMenu from './tree-menu.vue'
import contextDialog from './context-components/context-dialog.vue'


window.bus = new Vue()
JSON.cc = function (object) {
    if ( typeof object != 'object' ) return object
    return JSON.parse ( JSON.stringify ( object ) ) 
} 
const plugin = {}
plugin.install = function (Vue, options) {
  //Vue.api = api
  //Vue.prototype.helpers = helpers
    Vue.prototype.api = api
    Vue.prototype.utils = {
        getBasicDataType: function dataType ( data_type ) {
            //console.log(data_type)
            const text = 'text'
            , number = 'number'
            , date = 'date'
            switch ( data_type ) {
                case 'number':
                    return number
                case 'int':
                    return number
                case 'float':
                    return number
                case 'money':
                    return number
                case 'datetime':
                    return date
                case 'date':
                    return date
                default:
                    return text
            }
        },
        getSpDate: function ( date ) {
            const options = {
            		day: '2-digit',
            		month: '2-digit',
            		year: 'numeric',
            		hour: '2-digit',
            		minute: '2-digit',
            		second: '2-digit'
            	}
            , l10nDE = new Intl.DateTimeFormat("es-ES",options)
            //, dateFormated = l10nDE.format( new Date() ).toString() + _.escape(txt) + '<br>'
            return l10nDE.format (date)
        },
        setTextareaHeight: function (ta){
        	if ( ta.tagName != 'TEXTAREA' ) return
        	ta.style.height=0
        	var hcv=ta.scrollHeight*1
        	var corr = 2.8;
        	var hh = hcv+corr
        	hh = Math.round(hh)
        	if ( hh < 18 ) hh = 18
        	ta.style.height=(hh)+'px'
        },
        unifyObjectKey: function ({array,key}) {
            const keyValues = []
            _.reverse(array)
            array.forEach ( column => {
                while ( keyValues.indexOf ( column[key] ) != -1 ) {
                    column[key] += "_2"
                }
                //if ( aliases.indexOf ( alias ) != -1 ) column.alias += "_2"
                keyValues.push ( column[key] )
            })
            _.reverse(array)
            return array
        }
    }
    Vue.prototype.uniqueid = uuidV1
}
Vue.use(plugin)

export default {
    store: api.vuexStore,
    components: { Ly, ToolBar, Containers, SimpleTable, ContextList, treeMenu, contextDialog },
    data () {
        return { 
            panels: {
                form: true,
                parameters: true,
                top: true,
                bottom: true
            },
            treedata_tables: [],
            sessionId: sessionStorage["logged"],
            helpText: ""
            , showHelpState: false
            , logText: []
            , admin: this.api.parsedSearch.admin
            , queries: []
            , contextListData: []
            , contextList: {
                contextListData: []
                , contextListHiddenKeys: []
                , top: 400
                , left: 100
                , height: 300
                , checkedRows: []
                , type: "text"
                , comparation: 0
                , leftVal: ""
                , rightVal: ""
                , searchString: ""
            }
            , contextDialog: {show: false, componentProps: {} } 
            , show: {queries:true,list:true,formlist:true}
            , buttons: [
                { 
                    label: "Save Tree",
                    onClick: ()=>saveTree()
                },
             ],
            lists: [
                {
                    key: "areas",
                    multiple: true,
                    values: (() => {
                        return this.$store.state.areas.map ( ( area, index ) => ({ value:index, text: area.name }))
                    })()
                },
                {
                    key: "container",
                    multiple: true,
                    values: (() => {
                        return this.$store.state.containers.map ( ( container, index ) => ({ value:index, text: container.name }))
                    })()
                },
                {
                    key: "table",
                    values: (() => {
                        return Object.keys(this.api.circusConfig.tables).map ( ( key ) => ({ value:key, text: key }))
                    })()
                }
            ],
            keysSettings: {
                areas: { list: {
                    multiple: true,
                    values: (() => {
                        //return this.$store.state.areas.map ( ( area, index ) => ({ value:]index, text: area.name }))
                        return this.$store.state.areas.map ( ( area, index ) => [index, area.name ] )
                    })()
                }},
                container: { list: {
                    multiple: true,
                    values: (() => {
                        //return this.$store.state.containers.map ( ( container, index ) => ({ value:index, text: container.name }))
                        return this.$store.state.containers.map ( ( container, index ) => [index, container.name ] )
                    })()
                }},
                table: { list: {
                    values: (() => {
                        return tablesFromConnection ()
                    })()
                }}/*,
                connection: { list: {
                    values: (() => {
                        return Object.keys(this.api.circusConfig.connections).map ( ( key ) => [key, key] )
                    })()
                }}*/
            },
            gridActions: [
                {
                    button: `<svg style="width:20px;opacity:inherit" data-help-code="general-sql-get" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><path d="M28 0C12.6 0 0 12.6 0 28s12.6 28 28 28 28-12.6 28-28S43.4 0 28 0zM40 41H16c-1.1 0-2-0.9-2-2s0.9-2 2-2h24c1.1 0 2 0.9 2 2S41.1 41 40 41zM40 30H16c-1.1 0-2-0.9-2-2s0.9-2 2-2h24c1.1 0 2 0.9 2 2S41.1 30 40 30zM40 19H16c-1.1 0-2-0.9-2-2s0.9-2 2-2h24c1.1 0 2 0.9 2 2S41.1 19 40 19z"/></svg>`
                    , func: function (event,_rowIndex) {
                        event.stopPropagation();
                        const queries = this.$store.state.queries
                        , query = queries[queries.length-_rowIndex-1]
                        , sql = `SELECT ${query.queryEditor.columns} FROM ${query.joinSyntax} ${query.queryEditor.sqlSyntax?' WHERE '+query.queryEditor.sqlSyntax:''} ${query.queryEditor.orderBy?' ORDER BY '+query.queryEditor.orderBy:''}`
                        console.log(sql)
                        window.prompt("Presione CTRL+C para copiar en el portapapeles. Luego ENTER.",sql)
                    }.bind(this)
                },
                {
                    button: `<svg style="width:20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><path d="M26 0C11.7 0 0 11.7 0 26s11.7 26 26 26 26-11.7 26-26S40.3 0 26 0zM38.5 28h-25c-1.1 0-2-0.9-2-2s0.9-2 2-2h25c1.1 0 2 0.9 2 2S39.6 28 38.5 28z"/></svg>`
                    , func: function (event,_rowIndex) {
                        event.stopPropagation();
                        if ( !confirm('Eliminar la vista?') ) return false
                        this.queriesRowDelete(_rowIndex)
                    }.bind(this)
                }
            ]
        }
    },
    computed: {
        globalState () {
           return this.$store.state
        },
        queries_old () {
            this.api.$dbq ({
                schemaSyntax: "circus.dbo.views"
                , columns: ["v_id","v_nombre","v_identificador","v_json"]
                , orderbyColumns: ["v_id"]
                , language: "spanish"
            },(recordset)=>{
                console.log(recordset)
            })
            //this.$store.commit ( 'Queries' , JSON.cc(this.$store.state.queries) )
            const queries = this.$store.state.queries
            //console.log(JSON.cc(this.$store.state))
            , qq = queries.map ( query => {
                const params = query.queryEditor.params
                //console.log(JSON.cc(params))
                , qe = new queryEditor(params, this.$store.state.queries)
                , whereText = qe.getWhereText()
                return {
                    Nombre: query.customName
                    , Identificador: query.name
                    , Fecha: query.fecha
                    , Tabla: query.tableNames[0].toUpperCase()
                    , Columnas: query.queryEditor.params.map ( param => param.alias.split(".")[1] ).toString().replace(/,/g,", ")
                    , Condiciones: whereText
                    //, Tipo: query.tipo
                    //, Descripcion: query.descripcion
                }
            })
            
            return _.reverse(qq)
        },
        areas () {
            const areas = this.$store.state.areas.map ( (area, i) => ({data:area, index:i}) )
            return areas
        },
        visibleAreas () {
            const visibleAreas = this.areas.filter ( area => area.data.visible )
            //console.log('vsibles'+visibleAreas.length)
            return visibleAreas
        },
        containers () {
            const containers = this.$store.state.containers.map ( (container, i) => ({data:container, index:i}) )
            return containers
        },
        areaHeight() {
            const noAreas = this.visibleAreas.length
            return {height: `calc(100% / ${noAreas})`}
        }
    },
    methods: {
        login() {
            const usr = this.$refs.controlUsuario.value
            , pass = this.$refs.controlContrasena.value
            if ( usr != "nauj" || pass != "juan" ) {
                alert( "Usuario no válido." )
                return false
            } else {
                this.sessionId = true
                localStorage["usr"] = "nauj"
                localStorage["pass"] = "juan"
                sessionStorage["logged"] = true
            }
        },
        getLoginCookie (cookie) {
            return localStorage[cookie]
        },
        autoShowForm (event) {
        
            //console.log(event.target)
            if ( $(event.target).closest('[data-component="Formulario"]').length > 0 ) alert ('b')
        }
        , loadQueries () {
            this.api.$dbq ({
                schemaSyntax: "views"
                , columns: ["v_id","v_nombre","v_identificador","convert(char(10),v_fecha,103) as v_fecha","v_json"]
                , orderbyColumns: ["v_id"]
                , language: "spanish"
                , dbID: "circus"
            },(recordset)=>{
                //console.log(recordset)
                const queries = recordset.map ( view => {
                    let obj = false
                    try {
                        obj = JSON.parse ( view.v_json )
                        if ( typeof obj != "object" || obj == null ) {
                            obj = false
                        } else {
                            obj.customName = view.v_nombre
                            obj.name = view.v_identificador
                            obj.fecha = view.v_fecha
                            obj.id = view.v_id
                        }
                    } catch ( err ) {}
                    return obj
                })
                //console.log(queries)
                //return
                const qq = queries.filter(query=>query).map ( query => {
                    const params = query.queryEditor.params
                    , qe = new queryEditor(params, this.$store.state.queries)
                    , whereText = qe.getWhereText()
                    return {
                        id: query.id
                        , Nombre: query.customName
                        , Identificador: query.name
                        , Fecha: query.fecha
                        , Tabla: query.tableNames[0].toUpperCase()
                        , Columnas: query.queryEditor.params.map ( param => param.alias ).toString().replace(/,/g,", ")
                        , Condiciones: whereText
                    }
                })
                //console.log(qq)
                this.queries = _.reverse(qq)
            })
        },
        /*
        contextListSwitchComparation(){
            const comparation = this.$refs.comparation.selectedIndex
            , rangodivs = $(this.$refs.contextList_rango)
            , igualadivs = $(this.$refs.contextList_iguala)
            rangodivs.hide()
            igualadivs.hide()
            if ( comparation != 1 )
                rangodivs.show()
            else
                igualadivs.show()
        },
        */
        queriesRowClick (row) {
            const name = row.Identificador
            this.api.$dbq ({
                schemaSyntax: "views"
                , columns: ["v_json"]
                , whereSyntax: "v_identificador = '" + name + "'"
                , language: "spanish"
                , dbID: "circus"
            },(recordset)=>{
                const v_json = recordset[0].v_json
                , query = JSON.parse ( v_json )
                this.$store.state.selectedQuery = query
                //console.log(query)
            })
/*
            , qe = new queryEditor([], this.$store.state.queries)
            , query = qe.getQueryByName ( name )
            this.$store.state.selectedQuery = query
            console.log(query  )
            */
        },
         containersFromArea (area) {
            const areaIndex = area.index
            , containers = this.containers.map ( ( container, index ) => ({data:container, index}) )
            , containersFromArea = this.containers.filter ( ( container, i ) => {
                if ( container.data.areas.indexOf(areaIndex) != -1 ) return true
                return false
            })
            return containersFromArea
        },
        queriesTableOnChange ({rowIndex,key,value}){
            //const queries = JSON.cc(this.$store.state.queries)
            switch ( key ) {
                case 'Descripcion':
                    key = 'descripcion'
                    break;
                case 'Nombre':
                    key = 'customName'
                    break;
                case 'Tipo':
                    key = 'tipo'
                    break;
                
            }
            const query = this.queries[rowIndex]
            this.$store.commit ( 'Query_setKey' , {id:query.id,key,value} )
        },
        queriesRowDelete (rowIndex){
            const id = this.queries[rowIndex].id
            //console.log(queries.length+'/'+(queries.length-1-rowIndex))
            this.$store.commit ( 'Query_delete' , id )
            const splicedQ = JSON.cc(this.queries)
            splicedQ.splice(rowIndex,1)
            this.queries = splicedQ
        },
        panelSwitch(panel){
            //console.log('panel'+this.panels[panel])
            this.panels[panel] = ! this.panels[panel]
            window.compute()
        }
    },
    mounted: function () {
        const help = this.api.circusConfig.help
        , helpCuadrant = this.$refs.helpCuadrant
        , that = this
        window.log = function ( msg, color ) {
            var event = new Date()
            , offset = event.getTimezoneOffset()
            , fecha = new Date() - offset
            , fechaTxt = fecha.toLocaleString('en-GB', { timeZone: 'UTC' })
            , options = {
              year: 'numeric', month: 'numeric', day: 'numeric',
              hour: 'numeric', minute: 'numeric', second: 'numeric',
              hour12: false
            }
            , currentTime = new Intl.DateTimeFormat('es-ES', options).format(event)
            that.logText.forEach ( (t,i) => that.logText[i] = t.replace ( "blink_me", "" ) )
            that.logText.unshift ( `${currentTime}<br><span class="${color} blink_me">${msg}</span>` ) 
        }
        window.contextDialog = function (props,components) {
            that.contextDialog.componentProps = props
            that.contextDialog.components = components
            that.contextDialog.show = true
        }
        window.logout = function () {
            sessionStorage.removeItem("logged");
            that.sessionId = false
        }
        window.working = function (state) {
            if ( state ) 
                $('body').addClass('progress-on')
            else
                $('body').removeClass('progress-on')
        }
        window.commit = ( commitKey, payload )  => {
            const { path, value } = actions_global[commitKey] ( payload )
            this.api.saveGlobalConfig ( { path, value } )
            this.$store.commit ( 'set_databaseConfig', { path, value } )
            this.api.databaseMaps.setTablesMap()
        }
        this.loadQueries()

        window.addEventListener('endcache', (e) => { 
            this.$store.commit ( 'set_tablesMap' )
        }, false);

            //$.getScript ( '../../public/custom-code.js' )
            /*
jQuery.ajax({
  url: 'test.js',
  dataType: "script"
});
*/
// console.log(this.$store.state.custom_js)
//console.log('window.location.hostname' + console.log(window))
$( document ).ready(function() {
    //console.log('window.location.hostname' + console.log(window.location.hostname))
    //const url = api.hostname + that.api.circusConfig.custom_js
    const urls = that.api.circusConfig.custom_js
    //return
    urls.forEach ( url => {
        url = api.hostname + url
        console.log(url)
        const $script = $('<script/>').attr('type','text/javascript').attr('src', url)
        $('body').append($script)
    })
});
            

        if ( help ) {
            
            $(window.document)
            .on('contextmenu', function(event) {
                showHelp(event);
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
                return false
            })
            .on('click', function(event) {
                const $ele = $(event.target)
                , dontHide = $ele.closest ( '.context-dialog-container' ).length || $ele.closest ( 'table.header' ).length
                if(!dontHide) that.contextDialog.show = false
            })


            /*
            .on('mouseover',function(event){
                //if ( event.target.tagName == "circle" || event.target.tagName == "path" || event.target.tagName == "svg" ) return false
                if ( typeof this.globalHoverTimer != 'undefined' ) clearTimeout ( this.globalHoverTimer )
                this.globalHoverTimer = setTimeout ( function(){showHelp(event)} , 70 )
            }.bind(this) )
            */
            /*
            .on('mouseleave','[data-help-code][data-help-code!=""]',function(event){
                //console.log( 'leave: '+event.target.tagName)
                this.helpText = `<titulo>&nbsp;</titulo><texto>&nbsp;</texto>`
            }.bind(this) )
            */
        }
        function showHelp (event) {
            let $item = $(event.target)
            , itemHelpCode = $item.data('help-code') // $item.attr('data-help-code')
            
            if ( ! itemHelpCode ) {
                $item = $item.closest('[data-help-code][data-help-code!=""]')
                itemHelpCode = $item.attr('data-help-code')
            }
            
            //if ( ! itemHelpCode ) return false
            //console.log('enter: '+event.target.tagName)
            const helpText = itemHelpCode ? help[itemHelpCode] : ''
            , finalHelpText = typeof helpText != 'undefined' ? helpText : itemHelpCode
            , $html = $('<div/>').html ( finalHelpText )
            , title = $html.find('titulo').html()
            $html.find('titulo').remove()
            const text = $html.html()
            //showHelpBox(`<div style="height:100%;"/><titulo>${itemHelpCode?title:'&nbsp;'}</titulo><texto>${text}</texto></div>`)
            showHelpBox({title:itemHelpCode?title:'&nbsp;',text})
        }
        function showHelpBox ( text, log ) {
            if ( log )  window.log ( text.text )
            if (typeof text === 'object') {
                text = `<div style="height:100%;"/><titulo>${text.title}</titulo><texto>${text.text}</texto></div>`
            }
            that.helpText = text
            that.showHelpState = true
            if ( window.circus.helpBoxCloseTimer ) clearTimeout ( window.circus.helpBoxCloseTimer )
            window.circus.helpBoxCloseTimer = setTimeout ( ()=>that.showHelpState = false , 7000 )
        }
        /*
        $(helpCuadrant).resizable({
            handles: 'e'
            , resize: function(){
                window.dispatchEvent(new Event('resize'));
            }
        })
        //$('#containers').resizable({
        $('#containers').resizable({
            handles: 's'
        })
        */
         window.circus = this
         window.circus.showHelpBox = showHelpBox
         //this.panels.form = false
         function moumove (event) {
                /*
            if ( $(event.target).closest('[data-component="Formulario"]').length > 0 ) {
                //console.log('enter')
                if ( window.circus.hoverFormTimer ) { clearTimeout ( window.circus.hoverFormTimer ); window.circus.hoverFormTimer = false }
            } else {
                    //console.log(false)
                if ( !window.circus.hoverFormTimer && window.circus.panels.form && !this.gracePeriod ) {
                    window.circus.hoverFormTimer = setTimeout ( function () {
                        //console.log('close')
                        window.circus.panels.form = false   
                    }, 200)
                }
            }
                */
        }
        window.showForm = showForm
        function showForm() {
            if ( that.panels.form ) return
            window.circus.panelSwitch('form')
            //console.log(  $('[data-component="Formulario"]').find('input').eq(1).val())
            setTimeout(function(){
                $('[data-component="Formulario"]').find('input').eq(1).focus()
                //console.log('focus')
            },100)
            //window.circus.gracePeriod = true
            //setTimeout ( function () {window.circus.gracePeriod = false}, 100 )
        }
        window.showQueries = showQueries
        function showQueries() {
            window.circus.panels.bottom = true
            //window.circus.gracePeriod = true
            //setTimeout ( function () {window.circus.gracePeriod = false}, 100 )
        }
       $(window).mousemove ( moumove )
                    
     },
     updated() {
         /*
        $(this.$refs.helpCuadrant).resizable({
            handles: 'e'
            , resize: function(){
                window.dispatchEvent(new Event('resize'));
            }
        })  
        //return       
        $('#containers').resizable({
            handles: 's'
        })
        */
     }
}
</script>
<style>
    titulo,.custom-title {
        display:block;
        padding: 3px 6px;
        background:#b5b2b1;
        margin: 0 0 0px 0;
        font-weight:bold;
        font-size: 10px;
        text-transform: uppercase;
    }
    texto {
        padding: 3px 6px;
        display:block;
        height: calc(100% - 40px);
        overflow-y: auto;
        overflow-x: none;
    }
    input.form-control {
        font-size:11px;
        box-shadow: none;
        border-radius: 2px;
        background: white;
    }
    #circusContextList button {
        width: 20px;
        height:20px;
        background-color: transparent;
        box-shadow:none;
        border:0;
    }
    #circusContextList button:hover {
        background-color:#ddd;
    }
    .login-container {
        position:absolute;
        z-index:9999999;
        top:0;
        left:0;
        width:100vw;
        height:100vh;
        background:rgba(0,0,0,0.6);
        display:flex;
        align-items: center;
        justify-content: center;
    }
    .login-form {
        width:300px;
        border:1px solid #ddd;
        background:white;
        padding:20px;
        margin:;
        box-shadow: 2px 2px 20px 2px #444;
    }
    .login-form input {
        padding: 10px;
    }
    .login-form label {
        padding: 0px;
        font-size: 14px;
    }
</style>