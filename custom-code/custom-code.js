
const customjs = {
    "buttons" : {
        "onclick" : {
            "revertHistory" : function (api, pk_id) {
                //alert('a')
				if ( ! confirm ( 'Si continua modificará en masa registros para devolveros a estado seleccionado.' ) ) return false
                api.$dbq ({
                    operation: 'select'
                    , columns: ['cm_table_name', 'cm_field_name', 'cm_pkfield']
                    , schemaSyntax: `circus_mass`
                    , whereSyntax: 'cm_id = ' + pk_id
                    , dbID : 'vsegbas_COT'
                }, data => {
 					if (!data[0]) {
						alert('No hay un historico disponible.')
						return false
					} else {
						const cm_table_name = data[0].cm_table_name
						, cm_field_name = data[0].cm_field_name
						, cm_pkfield = data[0].cm_pkfield
						, historyRevertUpdate = `update ${cm_table_name} SET ${cm_field_name} = cmh_value FROM circus_mass inner join circus_mass_history on cm_id = cmh_cm_id inner join ${cm_table_name} on cmh_pkid = ${cm_pkfield} `
						api.$dbq ({
							sqlSyntax: historyRevertUpdate //+ 'aaa'
							, dbID : 'vsegbas_COT'
						}, data => {
							if (data.length) {
								console.log(data)
								alert('El procedimiento ha fallado.')
								return false
							} else {
								alert ( 'Se han revertido los datos correctamente. ' )
							}
						}, true, 'request')
					}
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
