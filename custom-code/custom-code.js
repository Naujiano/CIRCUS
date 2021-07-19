
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
				
            }
        }
    }
}
