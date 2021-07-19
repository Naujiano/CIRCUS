<template>
        <Ly flexbox=1 column=1 grow=1 height=1 data-component="Listado" class="qe" style="padding:0" ref="listado">
            <div style="position:absolute;top:0;left:0;width:5px;height:100vh;background:transparent;z-index:1000" @mouseover="showFormulario()"></div>
            <!--<div style="position:absolute;bottom:2px;left:0;width:100vw;height:4px;background:transparent;z-index:1000" onmouseover="window.showQueries()"></div>-->
            <Series :operation="series.operation" :fields="series_parameters" ref="popup" @operate="operate_serie"/>
            <!--<RowEditor :row="selected_row"/>-->
            <div style="width:100%;display:block;min-height:40px;padding: 0px 0;background:#f4f4f4;margin:0">
                <div style="float:left;display:block;padding:0px; width: 550px;" ref="toolbar">
                    <div class="toolbar-box toolbar1">
                        <div class="toolbar-box-title" style="margin-top:-7px">&nbsp;</div>
                        <Toolbar :buttons="admin?buttons:buttonsUser" style="float:left"/>
                    </div>
                    <div v-show="admin" class="toolbar-box">
                        <div class="toolbar-box-title" style="margin-top:-7px">Vistas</div>
                        <Toolbar :buttons="buttonsVistas" style="float:left"/>
                    </div>
                    <div v-show="admin"  class="toolbar-box">
                        <div class="toolbar-box-title" style="margin-top:-7px">Series</div>
                                
                        <!--
                                <select class="form-control" style="width:auto; margin-top: -0px; font-size: 11px; float:left;margin-left:10px" @change="series.operation=$event.target.value"  data-help-code="list-toolbar-series-operation">
                                    <option value="Sobreescribir">Sobreescribir</option>
                                    <option value="Vaciar">Vaciar</option>
                                </select>
                        -->
                                <button class="btn btn-primary btn-xs" data-help-code="list-toolbar-series-run" style="background:transparent;border:0; float:left; outline: none;          box-shadow:none" @click="series.show=!series.show"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"           x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
		            	        <path d="M0,128C0,57.3,57.3,0,128,0s128,57.3,128,128s-57.3,128-128,128S0,198.7,0,128z M172.8,68.3c1.2-10.2-6.8-19.1-17.1-19.1
		            	        	c-8.7,0-16.1,6.6-17.1,15.2c-0.5,4.6,0.8,9.1,3.6,12.7C151.6,88.9,171,83.6,172.8,68.3z M78.3,207.2c3.3-2.5,3.5-3.7,12.2-18.6
		            	        	c0,0,0-0.1,0.1-0.1c0,0,0,0-0.1,0c4.5-7.7,10.5-18.2,19.1-32.7c0.7,0.4,14.2,6,19.9,9.7c-6.5,4-15.1,9.6-21.3,13.4
		            	        	c-10,6-4.4,18.7,4.1,18c4.1-0.3,4.9-1.2,20.4-8.9c7.3-3.6,14.8-7.3,20.7-10.9c4.9-2.9,10.9-12.3,3.3-18.9L133.1,142
		            	        	c5.9-11.3,11.6-21.7,17.4-31.8c19.8,5.7,40.1-0.7,55.2-21.7c5.7-7.9,1.2-15.2-5.1-15.2c-10.4,0-10.2,17.3-32.7,17.3
		            	        	c-10.7,0-18.5-4.3-28.1-10C118,67.5,90,76.3,75.9,96.1c-8.5,11.8,4.5,22.6,12.8,11c7.8-10.9,17.6-15,29.1-12
		            	        	c-5.2,9.1-52.1,97.7-52.8,99.3C59.9,204.8,71.5,212.3,78.3,207.2z"></path>
		            	        </svg></button>
                               
                    </div>
                    <div v-show="admin&&series"  class="toolbar-box">
                        <div class="toolbar-box-title" style="margin-top:-7px">Customm</div>
                        <button v-for="boton in custom_buttons" :title ="boton.label" class="btn btn-primary btn-xs" data-help-code="" style="background:transparent;border:0; float:left; outline: none;box-shadow:none" @click="custom_button_click(boton)"><img :src="boton.image_src" style="width:21px; opacity:0.5"></button>
                    </div>
                </div>
                <div style="float:right;display:block;">{{grid.loadedRecsNumber}}/{{grid.rowCount}}</div>
            </div>
            <div v-show="admin&&series.show" class="toolbar-box-title" style="padding-top:5px;border:0px solid lightgray; border-width: 1px 0 0 0; ">Modificación de datos en masa</div> 
            <div v-show="admin&&series.show" style="width:100%;display:block;padding: 0px 0;background:#f4f4f4;margin:0; display: flex;">
                <select class="form-control" style="width:auto; margin-top: -0px; font-size: 11px; float:left;margin-left:10px"  data-help-code="list-toolbar-mass-field" ref="field_mass">
                    <option></option>
                    <option v-for="col in qeParams" v-if="col.table_full_name.toLowerCase()==tablaPrincipal.tableName.toLowerCase()":value="col.column_name">{{col.field_full_name}}</option>
                </select>
                <div style="float:left;margin: -3px 0 0 11px; font-size: 20px">=</div>
                <input class="form-control" style="flex-grow: 2; width:auto; margin-top: -0px; font-size: 11px; float:left;margin-left:10px" @input="" ref="input_mass">
                <button class="btn btn-primary btn-xs" data-help-code="list-toolbar-series-run" style="background:transparent;border:0; float:left; outline: none;          box-shadow:none" @click="operate_serie2"><svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"           x="0px" y="0px" viewBox="0 0 256 256" style="enable-background:new 0 0 256 256;" xml:space="preserve">
		            <path d="M0,128C0,57.3,57.3,0,128,0s128,57.3,128,128s-57.3,128-128,128S0,198.7,0,128z M172.8,68.3c1.2-10.2-6.8-19.1-17.1-19.1
		            	        	c-8.7,0-16.1,6.6-17.1,15.2c-0.5,4.6,0.8,9.1,3.6,12.7C151.6,88.9,171,83.6,172.8,68.3z M78.3,207.2c3.3-2.5,3.5-3.7,12.2-18.6
		            	        	c0,0,0-0.1,0.1-0.1c0,0,0,0-0.1,0c4.5-7.7,10.5-18.2,19.1-32.7c0.7,0.4,14.2,6,19.9,9.7c-6.5,4-15.1,9.6-21.3,13.4
		            	        	c-10,6-4.4,18.7,4.1,18c4.1-0.3,4.9-1.2,20.4-8.9c7.3-3.6,14.8-7.3,20.7-10.9c4.9-2.9,10.9-12.3,3.3-18.9L133.1,142
		            	        	c5.9-11.3,11.6-21.7,17.4-31.8c19.8,5.7,40.1-0.7,55.2-21.7c5.7-7.9,1.2-15.2-5.1-15.2c-10.4,0-10.2,17.3-32.7,17.3
		            	        	c-10.7,0-18.5-4.3-28.1-10C118,67.5,90,76.3,75.9,96.1c-8.5,11.8,4.5,22.6,12.8,11c7.8-10.9,17.6-15,29.1-12
		            	        	c-5.2,9.1-52.1,97.7-52.8,99.3C59.9,204.8,71.5,212.3,78.3,207.2z"></path>
		        </svg></button>
            </div>
            <div style="position:relative;border:0px solid red;max-height:80%;border:0 solid #ddd;border-width:0px 0 1px 0;margin-top:5px;margin-left:-5px;width:calc(100% + 10px)" class="bgqe" ref="qeContainer">
                <div v-show="show.queryEditor" class="" style="height:100%;overflow:auto;padding:5px 0;min-height:47px">
                    <Queryeditor ref="qe" :params="qeParams" @paramUpdate="qeParamUpdate" @paramDelete="paramDelete" :dbID="api.getTableConnectionId(ventana.data.table)"/>
                </div>
            </div>
            <div :class="{'computer-container':true, 'sorting':!grid.rows.length, 'computer-container-advanced': showAdvanced }">



                <div v-show="qeParams.length" style="width:25px;height:;float:left;padding-top:77px;position:relative;z-index:1"><button @click="extendParams()" style="background;border:1px solid #ddd;height:23px;" data-help-Code="show-advanced-params">+</button></div>


                <div ref="computer" style="display:flex;width: ; height:; padding:0 0 0 25px;position:absolute;white-space:nowrap;border:0px solid #ccc;border-top-width:5px">
                    <div v-for="(col,i) in grid.columns.names" v-if="qeParams[i]" :ref="'computed_'+col.label" class="header-cell" :key="'cont_'+col.label" :type="getParam(i).basic_data_type" :param="JSON.stringify(getParam(i))">

                        <!--
                        <select style="display:none">
                            <option value="SUM">SUMA</option>
                            <option value="AVG">MEDIA</option>
                            <option value="DISTINCT" selected>MEDIA</option>
                        </select>
                        -->

                <div style="display:flex; width: 100%;flex-direction:column">
            <div class="cell-title" style="clear:both;float:none;font-weight:bold;padding:4px 24px 4px 8px;width:100%;background: #898F99;border-radius: 10px; color:white;font-weight:normal;text-align:center" contenteditable="true" title="Renómbralo haciendo doble click." @dblclick="editAlias($event,i)" @blur="saveAlias($event,i)">
                {{getParam(i).alias}}
            </div>
                <button v-show="admin" @click="deleteParam(i)" class="close closeButton" data-help-code="search-parameter-close" style="float:right;margin-top:-18px;margin-bottom:5px; margin-left: calc(100% - 18px);zoom:1.1"></button>

</div>

<!-- -------------------------------- RECUADRO CON RECUENTO Y BOTON DE OPERACIONES DE AGREGADO ------------------------------------- -->
            <div style="position:relative;border:0px solid #ddd;border-width:0 0 0 0;padding:2px 4px 3px 5px; white-space: nowrap;margin-top:0px;clear:both;float:none:width:100%;height: 24px;top:3px">
                <div style="position:absolute; cursor:pointer; border:0px solid blue; top: 3px;z-index:1000;zoom:1.1;margin-left:-1px" class="button-operation">
                        <svg title="SUMA" v-show="getParam(i).basic_data_type=='number'" :class="{hidden:getParam(i).aggregate_function!='SUM'}" @click="clickFunc('SUM',$event,i)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  viewBox="0 0 512.002 512.002" style="color:red;zoom:0.6;float:left;margin-top:-2px" xml:space="preserve"><g>	<g>		<path style="background:blue" d="M437.108,74.898c-99.869-99.858-262.345-99.858-362.214,0c-99.858,99.858-99.858,262.34,0,362.203			c49.934,49.929,115.521,74.896,181.107,74.896s131.173-24.967,181.107-74.896C536.966,337.243,536.966,174.762,437.108,74.898z			 M373.067,166.895c0,9.229-7.484,16.707-16.707,16.707s-16.707-7.478-16.707-16.707v-16.826H191.01l77.923,95.294			c5.036,6.15,5.036,14.975,0,21.126l-77.923,95.204h148.643v-16.588c0-9.229,7.484-16.707,16.707-16.707			c9.223,0,16.707,7.478,16.707,16.707v33.414c0,9.229-7.601,16.588-16.824,16.588H155.758c-6.45,0-12.334-3.66-15.098-9.491			c-2.762-5.835-1.926-12.713,2.164-17.705l91.585-111.926L142.825,144.06c-4.09-4.992-4.927-11.959-2.164-17.795			c2.762-5.83,8.648-9.61,15.098-9.61h200.485c9.223,0,16.824,7.597,16.824,16.826V166.895z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <svg title="MEDIA" v-show="getParam(i).basic_data_type=='number'" :class="{hidden:getParam(i).aggregate_function!='AVG'}" @click="clickFunc('AVG',$event,i)" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;zoom:0.6;float:left;margin-top:-2px" xml:space="preserve"><g>	<g>		<path d="M155.804,205.902c-27.625,0-50.098,22.473-50.098,50.098s22.473,50.098,50.098,50.098			c28.788,0,52.979-23.076,77.68-50.098C208.782,228.978,184.593,205.902,155.804,205.902z"/>	</g></g><g>	<g>		<path d="M356.196,205.902c-28.788,0-52.979,23.076-77.68,50.098c24.7,27.022,48.891,50.098,77.68,50.098			c27.625,0,50.098-22.473,50.098-50.098S383.821,205.902,356.196,205.902z"/>	</g></g><g>	<g>		<path d="M256,0C114.844,0,0,114.839,0,256s114.844,256,256,256s256-114.839,256-256S397.156,0,256,0z M356.196,339.496			c-41.465,0-71.896-27.919-100.196-58.632c-28.3,30.713-58.73,58.632-100.196,58.632c-46.042,0-83.496-37.454-83.496-83.496			c0-46.042,37.454-83.496,83.496-83.496c41.465,0,71.896,27.919,100.196,58.632c28.3-30.713,58.73-58.632,100.196-58.632			c46.042,0,83.496,37.454,83.496,83.496C439.692,302.042,402.238,339.496,356.196,339.496z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <svg title="Número de valores distintos" @click="clickFunc('DISTINCT',$event,i)" :class="{hidden:getParam(i).aggregate_function!='DISTINCT'}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;;zoom:0.6;float:left;margin-top:-2px" class="" xml:space="preserve"><g>	<g>		<path d="M256,0C114.844,0,0,114.839,0,256s114.844,256,256,256s256-114.839,256-256S397.156,0,256,0z M389.594,317.231H244.592
			l-40.125,90.281c-2.772,6.219-8.872,9.92-15.275,9.92c-2.261,0-4.567-0.468-6.773-1.446c-8.425-3.745-12.221-13.612-8.48-22.043
			l34.094-76.712h-85.627c-9.219,0-16.699-7.475-16.699-16.699c0-9.225,7.48-16.699,16.699-16.699h100.471l29.688-66.797H122.406v0
			c-9.219,0-16.699-7.475-16.699-16.699c0-9.225,7.48-16.699,16.699-16.699h145.002l40.125-90.281
			c3.751-8.42,13.579-12.236,22.049-8.474c8.425,3.745,12.221,13.612,8.48,22.043l-34.094,76.712h85.627
			c9.219,0,16.699,7.475,16.699,16.699s-7.48,16.699-16.699,16.699H289.124l-29.688,66.797h130.159
			c9.219,0,16.699,7.475,16.699,16.699C406.294,309.756,398.813,317.231,389.594,317.231z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                        <div style="float:none;clear:both"></div>
                    </div>
                        <span style="top:-1px;float:left;padding-left:17px;position:relative">-</span>
                        <div style="float:none;clear:both"></div>
            </div>
<!-- -------------------------------- /RECUADRO CON RECUENTO Y BOTON DE OPERACIONES DE AGREGADO ------------------------------------- -->


<!-- -------------------------------- BARRA DE HERRAMIENTAS ------------------------------------- -->
<div style="display:flex;width:100%">
                        <div style="border:0px solid red; width:auto; flex-grow:1">
                                        <button @click="activateParam(i,$event);" data-help-code="search-parameter-active" style="padding:0;border:0;width:20px;height:15px">
                    <svg v-show="qeParams[i]._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(qeParams[i]._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<path d="M162.5,102.5c0-39.977,32.523-72.5,72.5-72.5s72.5,32.523,72.5,72.5V160h30v-57.5C337.5,45.981,291.519,0,235,0		S132.5,45.981,132.5,102.5V160h30V102.5z"/>	<rect x="77.5" y="190" width="315" height="280"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="!qeParams[i]._active" :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px',fill:(qeParams[i]._active?'blue':'')}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 470 470" style="enable-background:new 0 0 470 470;" xml:space="preserve"><g>	<rect x="137.5" y="190" width="315" height="280"/>	<path d="M192.5,102.5V160h30v-57.5C222.5,45.981,176.519,0,120,0S17.5,45.981,17.5,102.5V190h30v-87.5		C47.5,62.523,80.023,30,120,30S192.5,62.523,192.5,102.5z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>                </button>

                 <button @click="setNewOrder(i)" data-help-code="search-parameter-order" style="text-transform:;;padding:0;border-left-color:transparent;box-shadow:none; border:0;width:20px">
                    <!--<svg :style="{transform:`rotate(${param._orderby=='desc'?'90deg':(param._orderby=='asc'?'-90deg':'0deg')})`,height:'8px','margin-bottom':'0px','margin-left':'-2px'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42"><path :style="{fill:`${param._orderby=='desc'?'blue':(param._orderby=='asc'?'green':'')}`}" d="M36.1 20.2l-29-20C6.8 0 6.4-0.1 6 0.1 5.7 0.3 5.5 0.6 5.5 1v40c0 0.4 0.2 0.7 0.5 0.9 0.1 0.1 0.3 0.1 0.5 0.1 0.2 0 0.4-0.1 0.6-0.2l29-20c0.3-0.2 0.4-0.5 0.4-0.8S36.3 20.4 36.1 20.2z"/></svg>-->
                    <svg v-show="qeParams[i]._orderby!='asc'&&qeParams[i]._orderby!='desc'" :style="{height:'10px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="427.484px" height="427.484px" viewBox="0 0 427.484 427.484" style="enable-background:new 0 0 427.484 427.484;"	 xml:space="preserve"><g>	<path d="M405.943,290.254L302.096,425.338c-1.04,1.354-2.66,2.146-4.374,2.146c-1.702,0-3.321-0.798-4.368-2.146L189.511,290.254		c-0.769-0.993-1.144-2.176-1.144-3.357c0-1.152,0.364-2.329,1.108-3.322c1.499-1.975,4.125-2.707,6.434-1.809l68.76,27.166V21.01		c0-3.047,2.477-5.503,5.515-5.503h55.106c3.038,0,5.509,2.456,5.509,5.503v287.922l68.76-27.166		c2.305-0.898,4.93-0.166,6.419,1.809C407.473,285.561,407.461,288.28,405.943,290.254z M238.012,143.913		c0.744-0.993,1.105-2.167,1.105-3.322c0-1.176-0.379-2.367-1.142-3.36L134.125,2.148C133.081,0.792,131.458,0,129.759,0		c-1.714,0-3.328,0.798-4.377,2.148L21.539,137.23c-1.519,1.969-1.525,4.69-0.03,6.683c1.487,1.968,4.114,2.707,6.419,1.803		l68.766-27.163v287.919c0,3.05,2.462,5.509,5.506,5.509h55.109c3.041,0,5.515-2.459,5.515-5.509V118.552l68.763,27.163		C233.886,146.62,236.51,145.88,238.012,143.913z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg> 

                    <svg v-show="qeParams[i]._orderby=='asc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 442.91 442.91" style="enable-background:new 0 0 442.91 442.91;" xml:space="preserve"><g>	<path d="M13.98,196.395c8.45,4.662,19.232,1.457,23.894-6.993l9.907-17.775c0.583,0,1.457,0.291,2.331,0.291h119.469		c0.583,0,1.457,0,2.04,0l8.742,17.483c3.205,6.119,9.324,9.616,15.735,9.616c2.622,0,5.245-0.583,7.867-2.04		c8.742-4.371,11.947-14.861,7.576-23.602L128.495,9.616c-2.914-5.828-8.742-9.324-15.152-9.616c-6.411,0-12.53,3.497-15.735,9.033		l-90.33,163.76C2.616,181.243,5.53,191.733,13.98,196.395z M112.178,54.781l41.668,82.171H66.721L112.178,54.781z M25.635,413.188		l120.052-124.714H38.165c-9.616,0-17.483-7.867-17.483-17.483c0-9.616,7.867-17.483,17.483-17.483h148.608		c6.993,0,13.404,4.079,16.026,10.781c2.622,6.411,1.457,13.987-3.497,18.94L79.251,407.943h107.522		c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483H38.165c-6.993,0-13.404-4.079-16.026-10.781		C19.225,425.718,20.682,418.433,25.635,413.188z M294.586,377.639V84.502c0-9.616,7.867-17.483,17.483-17.483		s17.483,7.867,17.483,17.483V327.52l77.218-97.615c6.119-7.576,16.9-8.742,24.477-2.914c7.576,6.119,8.742,16.901,2.914,24.477		L325.765,388.42c-3.497,4.371-8.45,6.702-13.695,6.702c-2.04,0-3.788-0.291-5.828-0.874		C299.249,391.625,294.586,385.215,294.586,377.639z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>

                    <svg v-show="qeParams[i]._orderby=='desc'" :style="{fill:'blue',height:'11px','margin-bottom':'0px','margin-left':'-2px'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 440.87 440.87" style="enable-background:new 0 0 440.87 440.87;" xml:space="preserve"><g>	<path d="M19.605,17.483C19.605,7.867,27.473,0,37.089,0h148.608c6.993,0,13.404,4.079,16.026,10.781		c2.622,6.411,1.457,13.987-3.497,18.94L78.174,154.436h107.522c9.616,0,17.483,7.867,17.483,17.483s-7.867,17.483-17.483,17.483		H37.089c-6.993,0-13.404-4.079-16.026-10.781c-2.622-6.411-1.457-13.987,3.497-18.94L144.611,34.967H37.089		C27.473,34.967,19.605,27.099,19.605,17.483z M6.201,414.645l90.33-163.76c3.205-5.536,9.324-9.033,15.735-9.033		c6.411,0,12.238,3.788,15.152,9.616l83.046,163.76c4.371,8.742,0.874,19.232-7.576,23.602c-2.622,1.166-5.245,2.04-7.867,2.04		c-6.411,0-12.53-3.497-15.735-9.616l-8.742-17.483c-0.583,0-1.457,0-2.04,0H48.744c-0.874,0-1.457,0-2.331-0.291l-9.907,17.775		c-4.662,8.45-15.444,11.656-23.894,6.993C4.453,433.585,1.539,423.095,6.201,414.645z M65.645,378.804h86.834l-41.668-82.171		L65.645,378.804z M305.165,385.506c1.748,0.583,3.788,0.874,5.828,0.874c5.245,0,10.199-2.331,13.695-6.702l108.396-136.952		c6.119-7.576,4.662-18.649-2.914-24.477c-7.576-6.119-18.649-4.662-24.477,2.914l-77.218,97.615V75.761		c0-9.616-7.867-17.483-17.483-17.483c-9.616,0-17.483,7.867-17.483,17.483v293.136C293.51,376.473,298.172,382.884,305.165,385.506		z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>               
                </button>
                <button v-show="qeParams[i]._active" @click="negateParam(i)" data-help-code="search-parameter-negated" style="padding:0;border:0">
                    <svg :style="{height:'11px','margin-bottom':'-1px','margin-left':'-2px',fill:(qeParams[i].leftText.toLowerCase().indexOf('not')!=-1?'red':'')}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="46px" height="46px" viewBox="0 0 46 46" style="enable-background:new 0 0 46 46;" xml:space="preserve"><g>	<g>		<path d="M32.294,19H13.706c-2.209,0-4,1.791-4,4s1.791,4,4,4h18.588c2.209,0,4-1.791,4-4S34.503,19,32.294,19z"/>		<path d="M23,0C10.298,0,0,10.298,0,23c0,12.703,10.298,23,23,23s23-10.297,23-23C46,10.298,35.702,0,23,0z M23,40			c-9.374,0-17-7.625-17-17c0-9.373,7.626-17,17-17s17,7.627,17,17C40,32.375,32.374,40,23,40z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
                </button>
                <button @click="headerClick(i,$event)" data-help-code="search-parameter-list-config" style="padding:0;border:0">
                    <svg :style="{height:'12px','margin-bottom':'-1px','margin-left':'-2px'}"  version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><g>	<g>		<path d="M499.844,328l-53.885-45.104C447.333,273.49,448,264.646,448,256s-0.667-17.49-2.042-26.896L499.844,184			c3.979-3.323,4.99-9.021,2.396-13.51L453.177,85.51c-2.594-4.479-8.021-6.458-12.896-4.688l-65.906,24.083			c-14.094-11.031-29.75-20.042-46.677-26.844l-12.125-69.24C314.677,3.719,310.24,0,305.063,0h-98.125			c-5.177,0-9.615,3.719-10.51,8.823l-12.125,69.24c-16.927,6.802-32.583,15.813-46.677,26.844L71.719,80.823			c-4.844-1.802-10.312,0.198-12.896,4.688L9.76,170.49c-2.594,4.49-1.583,10.188,2.396,13.51l53.885,45.104			C64.667,238.51,64,247.354,64,256s0.667,17.49,2.042,26.896L12.156,328c-3.979,3.323-4.99,9.021-2.396,13.51l49.063,84.979			c2.604,4.49,8.083,6.469,12.896,4.688l65.906-24.083c14.094,11.031,29.75,20.042,46.677,26.844l12.125,69.24			c0.896,5.104,5.333,8.823,10.51,8.823h98.125c5.177,0,9.615-3.719,10.51-8.823l12.125-69.24			c16.927-6.802,32.583-15.813,46.677-26.844l65.906,24.083c4.844,1.74,10.302-0.198,12.896-4.688l49.063-84.979			C504.833,337.021,503.823,331.323,499.844,328z M256,362.667c-58.813,0-106.667-47.854-106.667-106.667			S197.187,149.333,256,149.333S362.667,197.188,362.667,256S314.813,362.667,256,362.667z"/>	</g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>                </button>

                <!--<button style="background:transparent; border:0" @click="extendParam(i)">xxx</button>-->
                </div>

    </div>
<!-- -------------------------------- /BARRA DE HERRAMIENTAS ------------------------------------- -->



                        <!--<div style="float:none;height:20px;width:100%">-->
                        <div :class="{'search-field':true,'search-field-inactive':qeParams[i]?!qeParams[i]._active:false}" contentEditable="true" @keydown="keyDownSearchField      ($event,i)" @keyup="positionContext($event,i)" @focus="focusSearchField($event,i)" @blur="focusSearchField($event,i,true)" v-html="getParamSearchString(i)" :title="getParamSearchString(i)" ></div>

                        <div class="clearfix"></div>

                        <button @click="changeOperator(i)" v-show="getParam(i)._active && getParam(i)._extended" data-help-code="search-parameter-operator" style="width:auto;padding:0 3px;background: transparent; border:0;font-size:12px;float:left; margin-top: -2px; margin-right:2px;width:17px" v-html="qeParams[i].operator=='AND'?'Y':'O'"></button>

                        <div contenteditable="true" class="side-text" v-show="getParam(i)._active && getParam(i)._extended" v-html="qeParams[i].leftText" @blur="changeText(i,$event,'leftText')" @keyup="textKeyPress($event,'leftText',i)" data-help-code="search-parameter-parentesis-left" style="font-weight:bold;background:white;float:left;border:1px solid #ddd;min-width:20px; "/>

                        <div contenteditable="true" class="side-text" v-show="getParam(i)._active && getParam(i)._extended" v-html="qeParams[i].rightText" @blur="changeText(i,$event,'rightText')" @keyup="textKeyPress($event,'rightText')" data-help-code="search-parameter-parentesis-right" style="font-weight:bold;background:white;float:left;border:1px solid #ddd ;min-width:20px;min-height: 17px;margin-left:10px"/>
                        
                        <div class="clearfix"></div>

                    </div>
                    
                </div>
            </div>
            <div style="width:100%;height:5px;background:#ccc;"></div>
            <Ly grow=1 style="background:;position:relative;padding-top:0px">
            <!--
                <button v-show="admin" @click="show.queryEditor=!show.queryEditor" style="position:absolute;width:18px;top:2px;right:0px;background:;padding: 3px;z-index:1">
                     <div :class="{'arrow-up':show.queryEditor,'arrow-down':!show.queryEditor}"></div>
                </button>
            -->
                <SimpleTable style="background:white" height="100%" :hiddenKeys="['PK_ID']" :rows="grid.rows" overflow="scroll" ref="Tabla" v-on:orderBy="orderBy" v-on:rowClick="rowClick" v-on:checkClick="checkClick" v-on:scrollHeaders="scrollHeaders" v-on:resizeHeaders="resizeHeaders" :checkable="true" :checkedRows="checkedIndexes" v-on:headerClick="headerClick" :selectable="true" :showHeaders="false"/>
            </Ly>
        </Ly>
</template>

<script src="./listado.js">
</script>

<style src="./listado.css" scoped>
</style>