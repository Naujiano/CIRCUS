import uuidV1 from 'uuid/v1'
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
Vue.use(Vuex) 
import queryString from 'query-string';
import { _ } from 'core-js'
const parsedSearch = queryString.parse(location.search)
, apiURL = 	parsedSearch.api
, connectionsModel = {};
var storedVuexStore, vuexStore
export {vuexStore, parsedSearch}

let services = {connNameToDbName:{}}
$.ajax({
	url: apiURL + 'services',
  	data: '',
  	method: "POST",
  	async: false,
	success: (respuesta) => {
		const jsonRespuesta = JSON.parse(JSON.parse(respuesta))
		, connNameToDbName = {}
		Object.keys ( jsonRespuesta ).forEach ( key => {
			connNameToDbName[key.toLocaleLowerCase()] = jsonRespuesta[key]
		})
		Object.assign ( services.connNameToDbName, connNameToDbName )
	},
	error: (respuesta) => {
		console.log('error en services json')
  	}
});
let circusConfig = ""
$.ajax({
	url: apiURL + 'circusConfig',
  	data: '',
  	method: "POST",
  	async: false,
	success: (respuesta) => {
		circusConfig = JSON.parse(JSON.parse(respuesta))
	},
	error: (respuesta) => {
		console.log('error en circusConfig json')
  	}
});


if ( parsedSearch.reset ) {
	var fileName
	if ( parsedSearch.reset == 1 ) 
		fileName = 'circus.json'
	else
		fileName = parsedSearch.reset
	loadTree( treeModel=>{
			createStore(treeModel);
			//console.log('Model loaded from ' + fileName );
			alert("Se ha importado la configuración del archivo '" + fileName + "' a su Configuración Local.")
			location = './?api=' + apiURL + '&admin=1'
	}, fileName )
} else {
	try {
		storedVuexStore = JSON.parse(localStorage["vuexStore"]);
	}
	catch(err) {
		alert('No se ha encontrado Cookie de configuración local.\n\nCargando configuración del servidor...');
		location = window.location.href + "&reset=1"
	}	
	createStore(storedVuexStore)
}
export 	function loadTree ( cb, fileName ) {
	//var fileName = fileName ? fileName : 'circus.json'
	$.ajax({
		  url: parsedSearch.api + 'readFile',
		data: { fileName },
		method: "POST",
		async: false,
		  success: (jsonString) => {
			  const obj = JSON.parse(jsonString)
			cb(obj)
		}
	});
}
export function loadConfig ( fileName ) {
	location = './?api=' + apiURL + '&dev=1&admin=1&reset=' + fileName
}
export function deleteConfig ( fileName, cb ) {
	$.ajax({
		url: parsedSearch.api + 'deleteFile',
	  data: { fileName },
	  method: "POST",
	  async: false,
		success: (jsonString) => {
		  cb(jsonString)
	  }
    });
}
function createStore (storedVuexStore) {
	const vuexTree = {
		state: {
			...storedVuexStore
		} ,
		...actions
	}
	const localCircusConfig = vuexTree.state.database
	vuexTree.state.database = circusConfig // Asigno la configuración de la aplicación al archivo de configuración global.

	//Recupero el valor de "favorito" de la configuración local para manejarlo como un config del archivo de configuración individual y no como config general de la base de datos.
	Object.keys ( localCircusConfig.tables ).forEach ( tableName => {
		const table = localCircusConfig.tables[tableName]
		if ( !table ) return
		const fieldsConfig = table.fields_config
		if ( fieldsConfig ) {
			Object.keys ( fieldsConfig ).forEach ( fieldName => {
				const fieldConfig = fieldsConfig[fieldName]
				const favorite = fieldConfig.favorite
				if ( vuexTree.state.database.tables[tableName] )
					if ( vuexTree.state.database.tables[tableName].fields_config && vuexTree.state.database.tables[tableName].fields_config[fieldName] )
						vuexTree.state.database.tables[tableName].fields_config[fieldName].favorite = favorite   
			})
		}
	})

	
	//Object.assign ( vuexTree.state.database , circusConfig )
	vuexStore = new Vuex.Store(vuexTree)
	localStorage["vuexStore"] = JSON.stringify(vuexTree.state)

	vuexStore.subscribe((mutation, state) => {
		const estado = {...state}
		localStorage["vuexStore"] = JSON.stringify(estado)
		resetApiStore()
		//setDatabaseMaps()
		console.log('Commit to Vuex.')
		//saveConfigFile ()
		//saveCircusConfig()
		window.vuex = JSON.cc ( estado ) 
	})
}
function saveConfigFile () {
	let fileName = parsedSearch.reset
	if ( !fileName ) fileName = 'circus.json'
	$.ajax({
		url: apiURL + 'writeFile',
		data: { json: localStorage["vuexStore"], fileName },
		method: "POST",
		//async: false,
		success: (storedVuexStore) => {
			console.log('Guardado ' + fileName )
		},
		error: (respuesta) => {
			console.log('error ajax saveConfigFile')
		}
	});
}
//alterTree()
function alterTree () {
	let tree = JSON.stringify({...vuexStore.state})
	delete vuexStore.state.ventanas.data[2] //.table = "hunter_personas"
	localStorage["vuexStore"] = JSON.stringify({...vuexStore.state})
	saveTree("circus.json")
}

let store //= JSON.parse(localStorage["vuexStore"])//vuexStore.state
resetApiStore()

function resetApiStore () {
	store = JSON.parse(localStorage["vuexStore"])
}




//----------------------------------------------------------------------------------------------------------
export function tablesFromConnection ( connection ) {
	return [['clientes','clientes'],['polizas','polizas',],['recibos','recibos'],['colaboradores','colaboradores']]
}
export const databaseMaps = {
	setTablesMap () {
		//const existingTablesMap = window.tablesMap
		const tablesMap = window.tablesMap ? window.tablesMap : new Map()
		, tablesConfig = store.database.tables
		Object.keys(tablesConfig).forEach ( ( key, i ) => {
			const table = tablesConfig[key]
			, connection = table.connection
			, table_server = table.table_server
			, table_catalog = table.table_catalog
			, table_schema = table.table_schema ? table.table_schema : 'dbo'
			, table_name = table.table_name
			, table_alias = table.table_alias
			if ( connection && table_catalog && table_name && table_alias ) {
				table.table_reference = `[${table_catalog}].[${table_schema}].[${table_name}]` 
				table.table_schema = table_schema
				if ( table_server ) table.table_reference =  `[${table_server}].` + table.table_reference
				tablesMap.set ( key, Object.assign ( tablesMap.get ( key ) ? tablesMap.get ( key ) : {} , table ) )
			}
		})
		window.tablesMap = tablesMap
		vuexStore.state.tablesMap = Object.fromEntries(tablesMap)
	},
	setFieldsMap () {
		window.fieldsMap = {}
		window.events = {}
		window.events.endcache = new Event ( "endcache" )
		let contador = 0
		if ( ! vuexStore.state.fieldsMap ) vuexStore.state.fieldsMap = {}
		for ( const [key,table] of window.tablesMap ) {
			getFieldsForTable ( key, ( { fields,identities } ) => {
				fields.forEach ( campo => {
					campo.favorite = vuexStore.state.fieldsMap[campo.field_full_name] ? vuexStore.state.fieldsMap[campo.field_full_name].favorite : 0
					window.fieldsMap[campo.field_full_name] = campo
				})
				Object.assign ( vuexStore.state.fieldsMap, window.fieldsMap )
				contador++
				if ( contador == window.tablesMap.size ) window.dispatchEvent(window.events.endcache);
			})
			console.log(table)
		}
	}
}
databaseMaps.setTablesMap()
databaseMaps.setFieldsMap()

/*
export function getListColumnSql ( key, options ) {
	const list = getListModel(key)
	if ( !list ) return key
*/
export function getListColumnSql ( qeParam, options ) {
	let { list, field_full_name, listType } = qeParam
	if ( !list ) return field_full_name
	if ( listType == "dynamic" ) { // Lista dinámica
        const sqlValueFromId = list.sqlValueFromId.replace ( "{{id}}", field_full_name )
        const newKey = `(${sqlValueFromId})`
		return newKey
    } else { // Es Array. Lista estática
		if ( !options ) {
			let newKey = `(case ${field_full_name}`
			if ( !list.forEach ) return field_full_name
        	list.forEach ( item => {
        	    const val = item[0]
        	    , txt = item[1]
        	    newKey += ` when ${val} then '${txt}' `
        	})
        	newKey += `end)`
			return newKey
		} else {
			return field_full_name
		}
    } 
}
export function getListModel ( listKey ) {
//	if ( typeof listkey != "object" ) 
		return getListModelFromOldModel ( listKey ) // compatibilidad con el modelo antiguo
	const table_config_keyname = listKey.table_config_keyname
	, tableConfig = window.tablesMap.get ( table_config_keyname )
	, field_name = listKey.column_name
	, field_list_model = _.get(tableConfig, `fields_config.${field_name}.listModel`)
	if ( field_list_model ) {
		return field_list_model
	}
	return false
}
function getListModelFromOldModel ( listKey ) {
	const listsModels = store.database.listsModels
    , lists = store.database.lists
    , listModelName = lists[listKey]
	, listModel = JSON.cc(listsModels[listModelName])
	return listModel
}
export function getLiteral ( id ) {
	const literales = store.database.literales
	if ( literales[id] ) return literales[id]
	const computedFields = store.database.computedFields
	, computedField = computedFields.filter ( cf => cf.sql.indexOf(id) != -1 )
	if ( computedField.length ) return computedField[0].literal
	const idArr = id.split(".")
	return idArr[idArr.length-1]
	//return id
}

export function getFieldsForTable ( table, cb ) {
	table = getCaseSensitiveTableName ( table )
	const tableConfig = window.tablesMap.get(table)
    $fieldsForTable (table,fields => {
		let identities = fields.filter ( (field,index) => field.is_identity ).map ( field => field.column_name )
		if ( ! identities.length ) identities = [tableConfig.table_pkname]
		cb ( { fields,identities })
	})
}
function getCaseSensitiveTableName (tableName) {
	let csTableName
	Object.keys ( store.database.tables ).forEach ( key => {
		if ( key.toLowerCase() == tableName.toLowerCase() ) csTableName = key
	})
	return csTableName
}

export function getIdentitiesForTableSet ( table, cb ) {
	const tableConfig = window.tablesMap.get(table)
	$fieldsForTable (table,fields => {
		let identities = fields.filter ( (field,index) => field.is_identity ).map ( field => ( { column_name: field.column_name, table_name: field.table_name } ) )
		if ( ! identities.length ) identities = [tableConfig.table_pkname]
		cb ( identities )
	})
}
function sp_circus_fields ( tableName, cb ) {
	const tableConfig = window.tablesMap.get(tableName) //store.database.tables[tableName]
	if ( !tableConfig ) {
		console.log ( `api.js no encuentra la tabla '${tableName}'.` )
		return false
	}
	const table_name = tableConfig.table_name
	, table_schema = tableConfig.table_schema
	, table_catalog = tableConfig.table_catalog
	, table_server = tableConfig.table_server
	, connection = tableConfig.connection
	let sp_name = `[${table_catalog}].[${table_schema}].[sp_circus_fields] '${table_name}'`
	if ( table_server ) sp_name = `[${table_server}].${sp_name}`
	$dbq (
		{
			operation: 'sp'
			, sp_name
			, dbID: connection
		}
		, campos => { cb ( campos ) }
	)

}
export function $fieldsForTable ( tableName, cb ) {
	const tables = getTablesRelation(tableName).names
	, finalCampos = []
	, promises = []
	let index = 0
	console.time('fieldsForTable'+tableName)
	tables.forEach ( ( tableName ) => {
		const tna = tableName.split ( "." )
		, tableConfig = window.tablesMap.get(tableName) //store.database.tables[tableName]
		, dbID = getTableConnectionId(tableName)
		const { table_catalog, table_name, table_schema, table_server, table_alias, table_pkname, fields_config, fields_computed, table_reference } = tableConfig
		let promise
		//if ( ! tableConfig.evaluatedFields ) {
			promise = new Promise ( ( resolve, reject ) => {
				sp_circus_fields ( tableName, ( campos ) => {
					const newCampos = JSON.parse ( JSON.stringify ( campos ) )
					if ( fields_computed && fields_computed.length ) {
						fields_computed.forEach ( cf => {
							newCampos.push({
								CHARACTER_MAXIMUM_LENGTH:10
								, column_name: cf.sql
								, data_type: cf.type
								, is_identity: false
								, table_name //: tableName //tabla
								, table_schema
								, table_catalog
								, literal: cf.literal
								, is_computed: true
								, label: cf.literal
							})
						})
					}
					evaluateFields(newCampos)
					resolve ( newCampos )
				} )
			})
		/*
		} else {
			promise = function() {
				const newCampos = tableConfig.evaluatedFields
				evaluateFields(newCampos)
				return ( newCampos )
			}
		}
		*/
		promises.push ( promise )
		function evaluateFields(newCampos) {
			newCampos.forEach ( ( campo, i ) => {
				//const fieldSettings = getFieldSettings ( campo.column_name, campo.table_name )
				let list = false, listModel = false, listAlias = false, listType = false, favorite= false
				//if ( campo.column_name.toLowerCase() == "col_id_1" ) debugger

				/*
				if ( fields_config && ! campo.is_computed ) {
					const field_config = $$ ( fields_config ).getCI ( campo.column_name )
					if ( field_config ) {
						listModel = field_config.listModel
						list = store.database.listsModels[listModel]
						favorite = field_config.favorite
						//debugger
						if ( list ) {
							listAlias = list.alias
							if ( list.sqlListGrid ) { //ES LISTA DINÁMICA. 
								listType = "dynamic"
							} else {
								listType = "static"
								list = list.valuesArray ? list.valuesArray : list // ME QUEDO SÓLO CON EL ARRAY DE VALORES QUE ES CON LO QUE FUNCIONA EL RESTO DEL PROGRAMA.
							}
						}
					}
				}
				*/

				const field_full_name = ! campo.is_computed ? `[${table_alias}].[${campo.column_name}]` : `${campo.column_name}`
				Object.assign ( 
					campo
					, { 
						//dbsettings: fieldSettings 
						 form: { group: 'grupo2'}
						 , favorite
						, list
						, listModel
						, listAlias
						, listType
						, table_schema 
						, table_server 					
						, table_alias 					
						, table_config_keyname: tableName
						, field_full_name
						, table_full_name : table_reference
						, table_pkname
						, index
						, key: field_full_name
						, aggregate_function : 'DISTINCT'
						, basic_data_type: function ( data_type ) {
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
						}(campo.data_type)
					}
				)
				//setFieldListSettings ( campo )
				index++;
			});
			tableConfig.evaluatedFields = newCampos
			window.tablesMap.set(tableName,tableConfig)
		}
	})
	function execPromises_bak ( promiseNumber ) {
		const promise = promises [promiseNumber]
		if ( promise.then ) {
			promise.then( (newCampos) => {
				addFields ( newCampos )
			})
		} else {
			const newCampos = promise()
			addFields ( newCampos )
		}
		function addFields(newCampos) {
			finalCampos.push ( ...newCampos )
			if ( promiseNumber < promises.length - 1 ) {
				execPromises ( promiseNumber+1 )
			} else {
				console.timeEnd('fieldsForTable'+tableName)
				cb ( finalCampos )
			}
		}
	}
	function execPromises ( promiseNumber ) {
		const promise = promises [promiseNumber]
		promise.then( (newCampos) => {
			addFields ( newCampos )
		})
		function addFields(newCampos) {
			finalCampos.push ( ...newCampos )
			if ( promiseNumber < promises.length - 1 ) {
				execPromises ( promiseNumber + 1 )
			} else {
				console.timeEnd('fieldsForTable'+tableName)
				const tableConfig = window.tablesMap.get(tableName)

				tableConfig.evaluatedFields = finalCampos
				window.tablesMap.set(tableName,tableConfig) 
	
				//if ( tableName == "visual_polizas" ) debugger
				cb ( finalCampos )
			}
		}
	}
	execPromises( 0 )
}
export function setFieldListSettings ( campo ) {
	const tableConfig = window.tablesMap.get( campo.table_config_keyname )  
	const { table_catalog, table_name, table_schema, table_server, table_alias, table_pkname, fields_config, fields_computed, table_reference } = tableConfig
	let list = false, listModel = false, listAlias = false, listType = false
	if ( fields_config && ! campo.is_computed ) {
		const field_config = $$ ( fields_config ).getCI ( campo.column_name )
		if ( field_config ) {
			listModel = field_config.listModel
			list = store.database.listsModels[listModel]
			if ( list ) {
				listAlias = list.alias
				if ( list.sqlListGrid ) { //ES LISTA DINÁMICA. 
					listType = "dynamic"
				} else {
					listType = "static"
					list = list.valuesArray ? list.valuesArray : list // ME QUEDO SÓLO CON EL ARRAY DE VALORES QUE ES CON LO QUE FUNCIONA EL RESTO DEL PROGRAMA.
				}
				campo.key = getListColumnSql ( { list, field_full_name: campo.field_full_name, listType } )
			}
		}
	}
	Object.assign ( campo , { list, listModel, listAlias, listType } )
	return campo
}
function getFieldSettings ( fieldName, tableName ) {
	const table = store.database.tables[tableName.toLowerCase()]
	, lists = store.database.lists
	//, dbsettings = table.fields ? table.fields[fieldName] : false
	, treatedSettings = {} // Object.assign ( {} , dbsettings )
	, listName = lists[tableName+'.'+fieldName]
	treatedSettings.list = store.database.listsModels[listName]
	return treatedSettings
}
export function getTableConnectionId ( tableName, databasename ) {
	let dbID = false
	Object.keys ( store.database.tables ).forEach ( key => {
		if ( key.toLocaleLowerCase() == tableName.toLocaleLowerCase() ) {
			const connID = store.database.tables[key].connection//.toLowerCase()
			dbID = databasename ? services.connNameToDbName[connID.toLowerCase()] : connID
		}
	})
	return dbID
}
export function getTablesRelation ( tableName ) {
	const dbID = getTableConnectionId(tableName,1)
	//const relatedGroup = { names: [tableName], joinSyntax: cleanTableName(dbID)+'.dbo.'+cleanTableName(tableName) }
	const tableConfig = window.tablesMap.get ( tableName )
	if ( ! tableConfig ) {
		console.log(`api.js no ha encontrado la tabla '${tableName}' en el mapa de tablas.`)
		return false
	}
	const joinSyntax = `${tableConfig.table_reference} as [${tableConfig.table_alias}]`
	const relatedGroup = { names: [tableName], joinSyntax: joinSyntax }
	const relatedTables = getRelatedTables ( tableName )
	relatedGroup.joinSyntax +=  relatedTables.joinSyntax
	let nextRelatedNames = relatedTables.names
	do {
		let relatedNames = nextRelatedNames
		//_.pullAll(relatedNames, relatedGroup.names)
		nextRelatedNames = []
		for ( tableName of relatedNames ) {
			const relatedTables = getRelatedTables ( tableName, relatedGroup.names.concat(relatedNames) )
			nextRelatedNames = nextRelatedNames.concat(relatedTables.names)
			relatedGroup.names.push ( tableName )
			relatedGroup.joinSyntax +=  relatedTables.joinSyntax
		}
	} while ( nextRelatedNames.length )
	//relatedGroup.names = [tableName].concat ( relatedGroup.names )
	aliasIndex = -1
	involvedTablesNames = []
	return relatedGroup
}
const aliases = ['a','b','c','d','e','f','g','h','i']
var involvedTablesNames = []
var aliasIndex = -1
function getNextAlias ( ) {
	aliasIndex++
	return aliases[aliasIndex]
}
function getRelatedTables ( tableName, excludeNames=[] ) {
	const remoteTableConfig = window.tablesMap.get ( tableName )
	if ( ! remoteTableConfig ) return false

	const res = { names: [], joinSyntax: "" }
	const tables = store.database.tables
	, table = tables[tableName]
	, relatedTablesNames = []
	, remote_table_reference = remoteTableConfig.table_reference
	, remote_table_alias = remoteTableConfig.table_alias
	if ( !table ) return res
	let joinTables = ""
	
	const relatedTables = table.relatedTables ? table.relatedTables : {}
	Object.keys(relatedTables).filter(tableName=>excludeNames.indexOf(tableName)==-1).forEach ( ( key, aliasIndex ) => {
		const tableConfig = window.tablesMap.get ( key )
		if ( ! tableConfig ) return false

		const relatedTable = relatedTables[key]
		, remoteField = relatedTable.remoteField
		, localField = relatedTable.localField
		, dbID = cleanTableName ( getTableConnectionId ( key, 1 ) )
		, dbID2 = cleanTableName ( getTableConnectionId ( tableName, 1 ) )
		, joinType = relatedTables[key].join ? relatedTables[key].join : "INNER JOIN"
		//joinTables += ` ${joinType} ${dbID}.dbo.${cleanTableName(key)} ON ${dbID2}.dbo.${cleanTableName(tableName)}.${localField} = ${dbID}.dbo.${cleanTableName(key)}.${remoteField}`
		, t1fullname = `${dbID}.dbo.${cleanTableName(key)}`
		, alias = isTableRepeated (key) ? getNextAlias() : ''
		, alias2 = alias != '' ? alias : t1fullname
		, local_table_reference = tableConfig.table_reference
		, local_table_alias = tableConfig.table_alias


		// AL FINAL HE DECIDIDO EXCLUIR CUALQUIER REPETICIÓN DE UNA TABLA EN LA SELECT. LA QUE LLEGUE PRIMERO SE LO QUEDA.
		if ( ! isTableRepeated (key)  ) 
			joinTables += ` ${joinType} ${local_table_reference} AS [${local_table_alias}] ON [${local_table_alias}].[${localField}] =  [${remote_table_alias}].[${remoteField}]`
			//joinTables += ` ${joinType} ${t1fullname} ${alias} ON ${dbID2}.dbo.${cleanTableName(tableName)}.${localField} =  ${alias2}.${remoteField}`
		relatedTablesNames.push ( key )
		involvedTablesNames.push ( key )
		function isTableRepeated (tn) {
			return involvedTablesNames.indexOf (tn) != -1
		}
		//debugger
	})
	res.names = relatedTablesNames
	res.joinSyntax = joinTables
	return res
}
function cleanTableName ( tn ) {
	const tnArr = tn.split(".")
	, cleanedName = tnArr.length > 1 ? tnArr[tnArr.length - 1] : tn
	return cleanedName
}

export function getDirectParents ( tableName ) {
	if (! store.database.tables[tableName] ) debugger
	const relatedTables = store.database.tables[tableName].relatedTables
	, parentTables = relatedTables ? relatedTables : {}
	return parentTables
}
export function getDirectSuns ( tableName ) {
	const tables = store.database.tables
	, childTablesNames = Object.keys(tables).filter(tName => {
		const tab = tables[tName]
		if ( !tab.relatedTables ) return false
		const relatedTables = Object.keys(tab.relatedTables).map(tName=>tName.toLowerCase())
		if ( relatedTables.indexOf(tableName.toLowerCase())==-1 ) return false
		return true
	})
	, childTablesRes = {}
	childTablesNames.forEach ( tName => {
		//tables[tName].relatedTables[tableName]
		childTablesRes[tName]=tables[tName].relatedTables[tableName]
	})
	return childTablesRes
}
//const api = 'http://82.223.111.21:8000/'
//const api = 'http://localhost:8000/'
export function saveTree ( fileName, doPrompt ) {
	if ( doPrompt ) {
		const givenName = window.prompt ( "Introduzca el nombre que quiere dar al archivo de configuración" , fileName )
		if ( !givenName ) return false
		fileName = givenName + ( givenName.indexOf ( '.json' ) == - 1 ? '.json' : '' )
	}
	if ( !fileName ) fileName = uuidV1()+'.json'
	//saveTree.fileName = fileName
	$.ajax({
  		url: apiURL + 'writeFile',
		data: { json: localStorage["vuexStore"], fileName },
		method: "POST",
		//async: false,
  		success: (storedVuexStore) => {
			console.log('Model saved to ' + fileName )
		}
	});
	return fileName
}
export function saveGlobalConfig ( { path, value } ) {
	console.log( { path , value } )
	//return
    $.ajax({
        url: apiURL + 'writeConfig',
      	data: { path, value },
      	method: "POST",
      	//async: false,
        success: (storedVuexStore) => {
        	console.log('Global State saved.' )
      	}
  	});
}
export function listFiles (folder,cb) {
	$.ajax({
		url: apiURL + 'listFiles',
	  	data: { folder },
	  	method: "POST",
	  	//async: false,
		success: ( list ) => {
		  	cb ( JSON.parse ( list ) )
	  	}
  	});
}
export function getTablesList (cb) {
	const list = []
	, promises = []
	, connections = services.connNameToDbName
	//return list
	var promiseIndex = 0
	Object.keys ( connections  ).forEach ( key => {
		const connName = key
		, dbName = connections[connName]
		promises.push ( new Promise (
			function ( resolve, reject ) {
				$dbq (
					{
						columns: ['name']
						, schemaSyntax: "sys.tables"
						, dbID: connName
						, whereSyntax: "name is not null"
					},
					function ( tablas ) {
						list.push ( {label:connName, content:tablas.map ( ele => {return ele.name} ) } )
						resolve ('all cool')
						//cb(tablas)
					}
				)
			}
		) )
	})
	executePromise()
	function executePromise () {
		promises[promiseIndex].then ( 
			function ( result ) { 
				promiseIndex++; 
				if ( promiseIndex<promises.length ) {
					 executePromise () 
				} else {
					cb ( list )
				}
			}
			, function ( err ) {}
		)
	}
}
export function $dbq (
	params
	, cb
	, async
	, request
) {
	//if ( ! params.dbID ) params.dbID = 'visual'
	params.language = 'spanish'
	if ( ! async ) async = true
	const operation = request ? 'request' :  'dbq'
	//const operation = 'dbq'
	$.ajax({
  		url: apiURL + operation,
		data: `params=${encodeURIComponent(JSON.stringify(params))}`,
		method: "POST",
		async: async,
  		success: (respuesta) => {
			  const jsonRespuesta = JSON.parse(respuesta)
			  if ( jsonRespuesta.length && jsonRespuesta[0].Error ){
				  console.log(JSON.stringify(jsonRespuesta[0]))
				  window.circus.showHelpBox ( {title:'Error en consulta SQL', text:JSON.stringify(jsonRespuesta[0])}, true)
			  	//alert(JSON.stringify(jsonRespuesta[0]))
			  }
			if ( cb ) cb(jsonRespuesta)
		},
  		error: (respuesta) => {
			  console.log(respuesta)
		}
	});
	
}
export function keepDBConnAlive () {
	$.ajax({
		url: apiURL + 'ping',
	    data: `dbID=visual`,
	    method: "POST",
	    //async: true,
		success: (respuesta) => {
			console.log('ping')
	  	},
		error: (respuesta) => {
			console.log('error ajax ping')
	  	}
  });
}
export function downloadExcel ( sqlParams, types ) {
	
	window.open ( apiURL + 'downloadExcel?' + `params=${encodeURIComponent(JSON.stringify(sqlParams))}&types=${encodeURIComponent(JSON.stringify(types))}` )
	return
}
