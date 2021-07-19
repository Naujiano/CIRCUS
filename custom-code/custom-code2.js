
const customjs = {
    "buttons" : {
        "onclick" : {
            "revertHistory" : function (api, pk_id) {
                alert('a')
				/*
				const historySelect = `SELECT * from circus_mass inner join cirucs_mass_history on cm_id = cmh_cm_id`
				, historyRevertUpdate = `update ${cm_table_name} SET ${cm_field_name} = cmh_value FROM circus_mass inner join cirucs_mass_history on cm_id = cmh_cm_id innerjoin ${cm_table_name} on cmh_pkid = ${cm_pkfield} `
                api.$dbq ({
                    operation: 'select'
                    , columns: ['cm_table_name','cm_pkfield']
                    , schemaSyntax: `circus_mass inner join cirucs_mass_history on cm_id = cmh_cm_id`
                    , whereSyntax: 'cm_id = ' + pk_id
                    , dbID : 'DBH_coteyser'
                }, data => {
                    console.log(data)
					if (!data[0]) {
						alert('No hay un historico disponible.')
						return false
					} else {
						api.$dbq ({
							sqlSyntax: historyRevertUpdate
							, dbID : 'DBH_coteyser'
						}, data => {
							console.log(data)
							if (data[0]) {
								alert('El procedimiento ha fallado.')
								return false
							} else {
								alert ( 'Se han revertido los datos correctamente. ' )
							}
						})
					}
                })
				*/
            },
            "getDocument" : function (api, pk_id) {
                alert('ggg')
                const fields = "doc_nombrearchivo,doc_nombreoriginal"
                , joinSyntax = "personas_documentos pd INNER JOIN dbh_documentos on doc_pkvalue = pd.perdoc_id INNER JOIN view_documentos_exigidos_union_hijos de ON de.perdoc_id = doc_pkvalue" 
                , whereSyntax = `de.id = ${pk_id} and doc_da_id = 105` // 105 es el area de Documentos de la figura 
                api.$dbq ({
                    operation: 'select'
                    , columns: fields
                    , schemaSyntax: joinSyntax
                    , whereSyntax: whereSyntax
                    , dbID : 'DBH_coteyser'
                }, data => {
                    console.log(data)
					if (!data[0]) {
						alert('No hay documento que cumpla esta exigencia.')
						return false
					}
					const doc_nombrearchivo = data[0].doc_nombrearchivo
					, doc_nombreoriginal = data[0].doc_nombreoriginal
                    window.open(api.hostname+"/node/express/circus_server/dbhdoc?file=" + doc_nombrearchivo + "&filename=" + doc_nombreoriginal)
                })
            },
            "editRecord" : function (api, pk_id) {
                api = api
                editRecord_id = pk_id
                const $iframe = $('<iframe src="http://localhost//CIRCUS/custom-code/record-edit.html?pk_id=' + pk_id + '"  id="juan" style="position:absolute;top:140px;left:500px;width:400px;height:300px;background:white;z-index:9999"></iframe>')
                 $('body').prepend($iframe)
                 window.addEventListener("message", (event)=>{
                    const data = event.data
                    const pk_id = data.pk_id
                    , val = data.val
                    , query = {
                        operation: 'update'
                        , columns: "observaciones"
                        , values: [val]
                        , schemaSyntax: "riesgos"
                        , whereSyntax: "pk_id=" + pk_id
                        , dbID : 'DBH_coteyser'
                    }
                    console.log(query)
                    $iframe.remove()
                    return
                    api.$dbq (query, data => {
                        console.log(data)
                    })
                },false)
                /*
                 setTimeout ( function () {
                    targetWindow = $iframe[0].contentWindow
                    targetWindow.postMessage({"juan":1},'*')
    
                 },1000)
                 */
                            
            }
        }
    }
}
