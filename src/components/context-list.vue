<template>
    <div ref="contextList"
        id="circusContextList"
        class="context-list"
        :style="{
            left: right ? '' : ( left+'px' ),
            right: right ? ( right+'px' ) : '',
            top:top+'px',
            'max-height':maxheight+'px',
            'margin-left': right ? '20px' : '',
            'margin-right': ! right ? '20px' : '',
        }"
    >
        <!--<div style="position:absolute;border:1px solid red;min-width:50px;background:#f2f2f2;max-height:300px;">-->
        <div style="padding: 4px 0 6px 6px;width:100%;background: #ccc; font-weight: bold;border:0px solid transparent;border-width-top:0px">{{qeParam.alias}}</div>
        <div style="clear:both;float:none;width:100%;border:0px solid red;height:21px;padding-top:1px">
            <button @click='emptySearchString()' style="float:left;margin-left:4px" data-help-code="context-list-button-filled">
                <svg height="50px" viewBox="-48 0 407 407" width="50px" style="width:12px; margin: -2px 0 0 -4px" xmlns="http://www.w3.org/2000/svg"><path d="m89.199219 37c0-12.132812 9.46875-21 21.601562-21h88.800781c12.128907 0 21.597657 8.867188 21.597657 21v23h16v-23c0-20.953125-16.644531-37-37.597657-37h-88.800781c-20.953125 0-37.601562 16.046875-37.601562 37v23h16zm0 0"/><path d="m60.601562 407h189.199219c18.242188 0 32.398438-16.046875 32.398438-36v-247h-254v247c0 19.953125 14.15625 36 32.402343 36zm145.597657-244.800781c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm-59 0c0-4.417969 3.582031-8 8-8s8 3.582031 8 8v189c0 4.417969-3.582031 8-8 8s-8-3.582031-8-8zm0 0"/><path d="m20 108h270.398438c11.046874 0 20-8.953125 20-20s-8.953126-20-20-20h-270.398438c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20zm0 0"/></svg>
            </button>
            <button @click='contextListButton("empty")' data-help-code="context-list-button-empty" style="float:left">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="50.613px" height="50.613px" viewBox="0 0 50.613 50.613" style="enable-background:new 0 0 50.613 50.613;;zoom:0.6;margin-left:-4px;margin-top:3px"	 xml:space="preserve"><g>	<g>		<g><circle cx="22.724" cy="43.575" r="4.415"/>			<circle cx="41.406" cy="43.63" r="4.415"/>			<path d="M46.707,32.312H20.886L10.549,2.568H2.5c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h4.493L17.33,37.312h29.377				c1.381,0,2.5-1.119,2.5-2.5S48.088,32.312,46.707,32.312z"/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
            </button>
            <button @click='contextListButton("filled")' style="float:left" data-help-code="context-list-button-filled">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="50.613px" height="50.613px" viewBox="0 0 50.613 50.613" style="enable-background:new 0 0 50.613 50.613;;zoom:0.6;margin-left:-4px;margin-top:3px"	 xml:space="preserve"><g>	<g>		<g>			<path d="M49.569,11.145H20.055c-0.961,0-1.508,0.743-1.223,1.661l4.669,13.677c0.23,0.738,1.044,1.336,1.817,1.336h19.35				c0.773,0,1.586-0.598,1.814-1.336l4.069-14C50.783,11.744,50.344,11.145,49.569,11.145z"/>			<circle cx="22.724" cy="43.575" r="4.415"/>			<circle cx="41.406" cy="43.63" r="4.415"/>			<path d="M46.707,32.312H20.886L10.549,2.568H2.5c-1.381,0-2.5,1.119-2.5,2.5s1.119,2.5,2.5,2.5h4.493L17.33,37.312h29.377				c1.381,0,2.5-1.119,2.5-2.5S48.088,32.312,46.707,32.312z"/>		</g>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
            </button>
            &nbsp;
        </div>
            <div style="height: auto;width:100%;border:0px solid #ddd; padding: 2px 5px; min-height:21px; max-width:500px;margin-bottom: 4px" class="blobs">
                <div class="blob" v-for="blob in firstSearchStringArray" @click="uncheckRow(blob,$event)">
                    {{blob}}
                </div>
                
            </div>
            <input 
                contenteditable="true" 
                style="height: 21px;width:100%;border:1px solid #ddd; padding: 15px 5px; margin: 0px; background: white;cursor:text;box-shadow: 0 0 5px 0px inset #ccc;border-radius:1px"
                placeholder="Buscar..."
                v-model = "searchString"
                @keyup = "updateContext($event)"
            >
                
            
        <SimpleTable
            v-if="type=='list'"
            ref="simpleTable"
            :rows="rows"
            :hiddenKeys="hiddenKeys"
            :checkable="true"
            :searchable="searchable"
            :selectable="false"
            :showHeaders="false"
            :checkedRows="checkedRows.map(ele=>ele.i)"
            :singlecheck="singlecheck"
            :searchString="searchString"
            :showSearchField="false"
            v-on:rowClick="contextListRowClick"
            v-on:checkClick="contextListCheckClick"
            v-on:search="contextListSearch"
        />
        <div
            v-else-if="type=='date'||type=='number'"
            style="width:100%;height:100%;background:white;padding:5px; border:1px solid #ddd"
        >
            <div ref="contextList_rango" style="min-width:100px">
            <label style="font-weight:normal">Desde</label>
            <input class="form-control" @blur="contextListKeyUp()" ref="desde" v-model="leftVal" data-help-code="search-parameter-value">
            <label style="font-weight:normal">Hasta</label>
            <input class="form-control" @blur="contextListKeyUp()" ref="hasta" v-model="rightVal" data-help-code="search-parameter-value">
            </div>
        <!--</div>-->
        </div>
    </div>
</template>
<script>
import SimpleTable from 'c:/data/iis/simple-table/src/components/simple-table.vue'
import * as qe from './query-editor.js';


/*
window.bus.$on('contextListBlur',function(){
    window.contextListFocused = false
})
*/
export default {
    components: { SimpleTable }
    , props: {
    }
    , data() {
        return {
            rows: []
            , hiddenKeys: []
            , top: 400
            , left: 100
            , right: false
            , height: 300
            , maxheight: 300
            , checkedRows: []
            , type: "text"
            , comparation: 0
            , leftVal: ""
            , rightVal: ""
            , searchString: ""
            , firstSearchString: ""
            , searchable: true
            , qeParam : {}
        }
    },
    watch: {
        searchString (object,oldVal) {
            this.searchString = this.simpleTableSearchString()
            /*
            const simpleSS = this.simpleTableSearchString()
            if ( simpleSS != "" ) {
                this.searchString = simpleSS
            } else {
                this.searchString = oldVal
            }
            */
        }
    }
    , mounted () {
        window.contextList = this
    }
    , computed : {
        firstSearchStringArray(){
            const firstSearchString = this.firstSearchString
            let firstSearchStingArray
            try {
                const arr = JSON.parse(firstSearchString)
                if ( arr.length ) return arr
            } catch ( err ) {}
            return [firstSearchString]
        }
    }
    , methods: {
        emptySearchString(){
            //this.searchString = ""
            //const checkedRows = []
            //this.checkedRows = checkedRows
            this.checkedRows = []
            this.onChange("")
        },
        uncheckRow ( label , event) {
            $(event.target).addClass('removing')
            setTimeout ( ()=> {
                event.stopPropagation()
                const simpleTable = this.$refs.simpleTable
//contextLi     t.checkedRows = checkedRows.map ( row => ({ row, i: row._rowIndex }) )
                //debugger
                const labelKey = Object.keys(this.checkedRows[0].row)[1]
                //const checkedRows = this.checkedRows.filter ( row => row.row[labelKey] != label ).map ( row => ( { i:1 , [labelKey] : row.row[labelKey] } ) )
                const checkedRows = this.checkedRows.filter ( row => row.row[labelKey] != label )//.map ( row => row.row )
                //getCheckedRowsFromInput ( val, contextList.rows ) {
                this.checkedRows = checkedRows
                this.onChange(checkedRows,"remove",label)
                //this.contextListCheckClick ( checkedRows )
                $(event.target).removeClass('removing')
            }, 300)
        },
        simpleTableSearchString (searchString) {
            const st = searchString ? searchString : this.searchString
            let obj = false
            try {
                obj = JSON.parse ( st )
                if( !obj.length ) return st
            } catch ( err ) {return st }
            if ( obj ) return "";

        },
        contextListKeyUp(){
            const desde = this.$refs.desde.value
            , hasta = this.$refs.hasta.value
            //, iguala = this.$refs.iguala.value
            //, comparation = this.$refs.comparation.selectedIndex
            let val = ""
            if ( desde != "" && hasta == "" ) val = ">= " + desde
            if ( desde == "" && hasta != "" ) val = "<= " + hasta
            if ( desde != "" && hasta != "" ) {
                if ( desde == hasta )
                    val = "= " + desde
                else
                    val = desde + " - " + hasta
            }
            this.onChange(val)
        },
        contextListButton(option){
            if(option=="empty")this.onChange(`""`)
            if(option=="filled")this.onChange(`_`)
        },
        contextListRowClick(row){
            
        },
        contextListCheckClick(checkedRows){
            /*
            console.log(checkedIndexes)
            const checkedRows = JSON.cc(this.rows).filter ( (ele,i) => {
                const exists = checkedIndexes.filter ( cr => {
                    if ( cr._ROW_NUMBER == ele._ROW_NUMBER ) return true
                })
                //if ( checkedIndexes._ROW_NUMBER == ele._ROW_NUMBER ) return true
                return exists.length
            })
            console.log(checkedRows)
            */
            //const checkedRows = checkedIndexs
            //debugger
            //const checkedIds = checkedRows.map ( row => row[Object.keys(row)[0]] )
            const oldCheckedRows = contextList.checkedRows.map ( ele => ele.row )
            //, oldCheckedIds = oldCheckedRows.map ( row => row[Object.keys(row)[0]] )
            const checkedLiterals = checkedRows.map ( row => row[Object.keys(row)[1]] )
            , oldCheckedLiterals = oldCheckedRows.map ( row => row[Object.keys(row)[1]] )
            let operation = "none"
            , differenceIndex
            , differenceLiteral
            , removedElement

            //if ( !this.oldCheckedRows ) this.oldCheckedRows = checkedRows
            if ( checkedRows.length > oldCheckedRows.length ) operation = "add"
            if ( checkedRows.length < oldCheckedRows.length ) operation = "remove"
            //differenceIndex = oldCheckedIds.filter(x => !checkedIds.includes(x))[0];
            differenceLiteral = oldCheckedLiterals.filter(x => !checkedLiterals.includes(x))[0];
            //removedElement = JSON.cc ( this.rows ).filter( row => row[Object.keys(row)[0]] == differenceIndex )[0]
            removedElement = differenceLiteral
            //this.oldCheckedIds = checkedIds
            contextList.checkedRows = checkedRows.map ( row => ({ row, i: row._rowIndex }) )
            this.onChange(checkedRows,operation,removedElement)
            //this.onChange(checkedRows)
        },      
        contextListSearch(searchStrings) {
            //console.log(searchStrings)
            const searchString = searchStrings[0]
        },
        updateContext (event) {
            if ( this.searchTimer ) clearTimeout ( this.searchTimer )
            const that = this
            this.searchTimer = setTimeout ( function () {
                that.openContextParameters.searchString = that.searchString
                that.reloadContext ( )
            } , 300 )
        },
        reloadContext ( ) {
            this.open ( this.openContextParameters, true )
        },
        open ( {keyName,$field,val,type,onChange,cb, singlecheck, pkName,dbname,ownername,tablename,fieldname,dbID, searchString, cbWhenClose, qeParam  }, onlyReload ) {
            this.openContext (keyName,$field,val,type,onChange,cb, singlecheck, {pkName,dbname,ownername,tablename,fieldname,dbID, searchString,cbWhenClose, qeParam }, onlyReload )
        },
        openContext (keyName,$field,val,type,onChange,cb, singlecheck, {pkName,dbname,ownername,tablename,fieldname,dbID, searchString,cbWhenClose, qeParam }, onlyReload ) {
            this.openContextParameters = {keyName,$field,val,type,onChange,cb, singlecheck, pkName,dbname,ownername,tablename,fieldname,dbID, searchString,cbWhenClose, qeParam }
            this.qeParam = qeParam
            this.singlecheck = singlecheck
        	//if ( this.simpleTableSearchString(searchString) != "" )  
            this.searchString = searchString
            if ( ! onlyReload ) {
                this.firstSearchString = searchString
                this.contextListFocused = true
            }
            this.onChange = (val,operation,removedElement) => {
                onChange(val,operation,removedElement)
                setTimeout(this.positionContext,0)
            }
            this.$field = $field
        	const contextList = this
            contextList.rows = []
            //return
        	//const listModel = this.api.getListModel(keyName)
        	const listModel = qeParam.list
        	if ( listModel ) { 
        		let contextListData, contextListHiddenKeys
        		if ( !listModel.length ) { //Es lista dinámica
        			const {sqlListGrid,connection} = listModel
        			, sql = sqlListGrid.toLowerCase()
        			, columns = sql.substring ( sql.indexOf('select') + 6, sql.indexOf('from') ).trim().split(",")
        			, schemaSyntax = sql.substring ( sql.indexOf('from') + 4, sql.indexOf('where') ).trim()
        			, whereSyntax = sql.substring ( sql.indexOf('where') + 5, sql.indexOf('order by') ).trim()
        			, orderbyColumns = sql.substring ( sql.indexOf('order by') + 8 ).trim()
        			, dbqParams = {
        				operation: 'select'
        				, columns
        				, schemaSyntax
        				, whereSyntax
        				, orderbyColumns
                        , dbID: connection
        			}
                    window.working(1)
        			this.api.$dbq ( dbqParams, data => {
        				contextListData = data
        				contextListHiddenKeys = [columns[0]]
        				feedList()
                        window.working(0)
        			})
        		} else { //Es lista estática
        			const data = listModel.map ( ele => ({
        				id: ele[0]
        				, Literal: ele[1]
        			}))
        			contextListData = data
        			contextListHiddenKeys = ['id']
        			feedList()
        		}
        		function feedList() {
        			const top = $field.offset().top + $field.outerHeight()
        			, left = $field.offset().left
                    , checkedRows = getCheckedRowsFromInput(contextList.firstSearchString,contextListData)
                    /*
        			, checkedRows = []
        			let json = false
        			try {
        				const checkedLiterals = JSON.parse ( val )
        				contextListData.forEach ( (row,i) => {
        					if ( checkedLiterals.indexOf(row[Object.keys(row)[1]]) != -1 ) checkedRows.push ( i ) 
        				})
        			} catch (err){ }
                    */
        			contextList.rows = contextListData
        			contextList.hiddenKeys = contextListHiddenKeys
        			contextList.checkedRows = checkedRows
                    contextList.searchable = true
        			open('list')
        		}
        	} else {
        		const parsedHandy = qe.parseHandy ( val )
        		, leftVal = parsedHandy.leftVal
        		, operator = parsedHandy.operator
        		if ( ! operator ) {
        			contextList.leftVal = parsedHandy.val1
        			contextList.rightVal = parsedHandy.val2
        		} else {
        			if ( operator.indexOf ( ">" ) != -1 ) {
        				contextList.leftVal = parsedHandy.val1
        				contextList.rightVal = ""
        			} else if ( operator.indexOf ( "<" ) != -1 ) {
        				contextList.leftVal = ""
        				contextList.rightVal = parsedHandy.val1
        			} else {
        				contextList.leftVal = parsedHandy.val1
        				contextList.rightVal = parsedHandy.val1
        			}
        		}

                // SELECTOR DE COINCIDENCIAS EN CAMPO DE TEXTO
                if ( type == "text" ) {
                    if ( fieldname ) { // Los computed fields no tienen fieldname y por el momento me los salto de la funcionalidad de context-list.
                        let likeExpression = this.simpleTableSearchString()
                        likeExpression = likeExpression == "" ? "" : ` AND ${fieldname} LIKE '%${likeExpression}%' ` 
                        const dbqParams = {
        			    	operation: 'request'
        			    	//, sqlSyntax: `SELECT distinct top 20  ${pkName} AS _ROW_NUMBER,${fieldname} FROM ${dbname}.${ownername}.${tablename} WHERE ${fieldname} IS NOT NULL AND ${fieldname} <> '' ${likeExpression} ORDER BY ${fieldname}`
        			    	, sqlSyntax: `SELECT distinct top 20  1 AS _ROW_NUMBER,${fieldname} FROM ${qeParam.table_full_name} AS [${qeParam.table_alias}] WHERE ${fieldname} IS NOT NULL AND ${fieldname} <> '' ${likeExpression} ORDER BY ${fieldname}`
                            , dbID
        			    }
                        window.working(1)
        			    this.api.$dbq ( dbqParams, data => {
        			    	contextList.rows = data
                            contextList.checkedRows = getCheckedRowsFromInput ( contextList.firstSearchString, data )
                            contextList.hiddenKeys = ['_ROW_NUMBER']
                            window.working(0)
        			    }, true, true)
                        this.searchable = false
                        type="list"
                    }
                }
                
        		open(type)
        	}
            const that = this
            //this.getCheckedRowsFromInput = getCheckedRowsFromInput
            function getCheckedRowsFromInput ( val, contextListData ) {
        			const checkedRows = []
        			let json = false
        			try {
        				const checkedLiterals = JSON.parse ( val )
        				contextListData.forEach ( (row,i) => {
        					if ( checkedLiterals.indexOf(row[Object.keys(row)[1]]) != -1 ) checkedRows.push ( {row,i} ) 
        				})
        			} catch (err){ }
                    return checkedRows
            }
        	function open(type) {
        		const top = $field.offset().top + $field.outerHeight()
        		, left = $field.offset().left
                , $list = $(contextList.$refs.contextList).addClass('shown')//show()
                //, $detach = $list.detach()
        		contextList.type = type
                //$field.css({'background-color':'red'}).before($list)
                contextList.opened = true
                contextList.positionContext()
                //$(contextList.$refs.contextList).find('[contenteditable="true"]').focus()
                $('body').click(showContext)
        		if ( cb ) cb ( )
        	}
            function showContext (event){
                const ae = document.activeElement
                , isContextList = $(ae).closest('#circusContextList').length || $(event.target).closest('#circusContextList').length
                if(!isContextList && !that.contextListFocused) {
                    const menu = $(that.$refs.contextList)
                    menu.removeClass('shown')//hide()
                    contextList.opened = false
                    $('body').off()
                    if ( cbWhenClose ) cbWhenClose ()
                }
            }
        },
        positionContext(event) {
            if ( !contextList.opened || !this.$field ) return
            const ww = $(window).width();
            const wh = $(window).height();
       		const top = this.$field.offset().top + this.$field.outerHeight()
            , left = this.$field.offset().left
            , right = left > ( ww / 2 ) ? ( ww - left - this.$field.outerWidth() ) : false
            , maxheight = wh - top - 20
       		contextList.top = top
       		contextList.left = left
       		contextList.right = right
       		contextList.maxheight = maxheight
            if (!event || !$.contains (event.target,this.$field[0]))return
            const inView= isScrolledIntoView(this.$field,$(event.target))
            if ( !inView )
                $(this.$refs.contextList).removeClass('shown') //hide()
            else 
                $(this.$refs.contextList).addClass('shown') //.show()

            function isScrolledIntoView($elem,$container) {
                var docViewTop = $container.offset().top //$container.scrollTop();
                var docViewBottom = docViewTop + $container.height();

                var elemTop = $elem.offset().top;
                var elemBottom = elemTop + $elem.height();

                return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
            }
            
        },
        closeContext() {
            this.contextListFocused = false
            return
            const $aux = $('#contextList_auxiliar')
            const $list = $(contextList.$refs.contextList).removeClass('shown').detach()
            $('body').append($list)
        }
    }
}
</script>