export default class queryEditor {
    constructor (paramArray,queries) {
        /*
        const params = Object.keys(paramObject).map ( key => ({
            key
            , value: paramObject[key].value
            , text: paramObject[key].text
            , data_type: paramObject[key].data_type
            , operator: "AND"
        }))
        */
       // if ( !paramArray.length ) paramArray = this.getParamArray(paramArray)
        /*
       const params = paramObject.map ( para => {
            const key = para.key
            , value = para.value
            , text = para.text
            , data_type = para.data_type
            , operator = para.operator ? para.operator : "AND"
            , vista = para.vista
            , campo = para.campo
            , list = para.list
            , leftText = para.leftText
            , rightText = para.rightText
            return { key, value, text, data_type, operator, vista, campo, list }
        })
        */
        this.params = paramArray
        this.queries = queries
    }
    getParams ( paramObject ) {
        return this.params
    }
    getColumns ( ) {
        const columns = (this.params.filter(param=>param._inlist).map(param=>{
            let key = param.key
            if(param.data_type=="date"){
                key = `(convert(char(10),${key},103))`
            }
            return (`${key} as [${param.alias}]`)
        }))
        //console.log(columns)
        return columns
    }
    getSqlSyntax () {
        let sqlSyntax = ""
        , val
        //console.log("qe")
        //console.log(JSON.cc(this.params))
        this.params.filter ( param => param._active ).forEach ( param => {
            const vista = param.vista
            let isInlineSelect = false // param.value.match ( /^{.*}$/g )
            try {
                const json = JSON.parse ( param.value )
                if ( typeof json == 'object' && !json.length ) { //es select con descripcion
                    const sql = json.sql
                    , descripcion = json.descripcion
                    isInlineSelect = {sql,descripcion}
                }
            } catch ( err ) {}
            //debugger
            if ( vista && vista != "" ) {
                console.log('motito'+vista+'--')
                const campo = param.campo
                , query = this.getQueryByName ( vista )
                const joinSyntax = query.joinSyntax
                , whereSql = query.whereSql
                console.log(query)
                val = ` ${param.key} on( SELECT ${campo} FROM ${joinSyntax} ${whereSql} )`
                //sqlSyntax += ` ${param.operator} ${param.leftText} ${val} ${param.rightText}`
            } else if (isInlineSelect) {
                val = ` ${param.key} IN ( ${isInlineSelect.sql} )`
            } else {
                if ( param.list && param.list.length ) {
                    const listElements = this.matchListElements(param.list,param.text) // Ej: [[1,'alta'],[2,'baja']]
                    let valor = ""
                    listElements.forEach ( ele => {
                        const value = ele[0]
                        valor += `"${value}" OR `
                    })
                    if ( valor != "" ) {
                        valor = valor.substring ( 0, valor.length - 4 )
                        param.value = valor
                    }
                } else {
                    
                }
                val = stringMatch ( param.key, param.text, param.data_type, param )
            }
            if ( param.value != "%" && param.value != "[]" && param.value != "" ) sqlSyntax += ` ${param.operator} ${param.leftText} ${val} ${param.rightText}`
        })
        if ( sqlSyntax.length > 0 ) {
            sqlSyntax = sqlSyntax.substring ( 4 )
            //sqlSyntax += this.getOrderBy()
        }
        //console.log(sqlSyntax)
        return sqlSyntax
    }
    getOrderBy () {
        let orderBy = []
        this.params.forEach ( param => {
            const order = param._orderby
            , valid = ( order == 'asc' || order == 'desc' )
            if ( valid ) {
                let key = param.key
                /*
                if(param.data_type=="date"){
                    key = `(convert(char(10),${key},103))`
                }
                */
                /*
                if(key.toLowerCase().indexOf('select ')!=-1&&key.toLowerCase().indexOf('from ')!=-1) {
                    key = param.reference
                }
                */
                orderBy.push ( key + ' ' + order )
                //return (`${key} as [${param.alias}]`)
            }
        })
        //if ( orderBy != "" ) orderBy = orderBy.substring(0,orderBy.length-1)
        return orderBy
    }
    getQueryByName (name) {
        let resQuery
        this.api.$dbq ({
            schemaSyntax: "views"
            , columns: ["v_json"]
            , whereSyntax: "name = "+name
            , language: "spanish"
            , dbID: "circus"
        },(recordset)=>{
            const v_json = recordset[0].v_json
            console.log(v_json)
        },false)
        return
        this.queries.forEach ( query => {
            console.log(query.name+'*'+name)
            if ( query.name == name ) {
                resQuery = query
            }
        })
        //console.log(resQuery)
        return resQuery
    }
    getWhereText () {
        let whereText = ""
        this.params.filter ( param => param._active ).forEach ( param => {
            whereText += param.operator + ' ' + param.leftText + ' ' + param.alias + ' = ' + param.text + ' ' + param.rightText
        })
        return whereText
    }
    matchListElements (keyList, searchedValue ) {
        //log(this.keysSettings)
        let matchedEles = []
        if ( keyList ) {
            //const values = keyList.values
            matchedEles = keyList.filter ( val => {
                if ( val[1].indexOf(searchedValue) != -1 ) return true
            })
        }
        return matchedEles
    }
}
export function parseHandy (txt) {
    if ( txt.indexOf('"') != -1 ) return txt // si lleva doble comillas es expresión de la vieja complicada. No proceso.
    //txt = txt.replace ( /  /g , " " ) //quito dobles espacios
    const spliters = ['> ','< ','>= ','<= ','<> ','= ']
    , txtSplit = txt.split(" - ")
    , parsedHandy = {}
    let parseAble = false
    if ( txtSplit.length == 2 ) { // Es Rango.
        const leftVal = txtSplit[0]
        , rightVal = txtSplit[1]
        parsedHandy.val1 = leftVal
        parsedHandy.val2 = rightVal
        parseAble = true
    }
    if ( ! parseAble ) {
        spliters.forEach ( spliter => {
            const txtSplit = txt.split(spliter)
            if ( txtSplit.length == 2 && ! parseAble ) {
                const rightVal = txtSplit[1]
                parsedHandy.val1 = rightVal
                parsedHandy.operator = spliter
                parseAble = true
                //handSyntax = `"${spliter}${rightVal}"`
                //console.log(spliter)
            }
        })
    }
    if ( parseAble ) {
        return parsedHandy
    } else {
        return txt
    }
}
function handyToClassic ( handy ) {
    if ( typeof handy == 'object' ) {
        const val1 = handy.val1
        , val2 = handy.val2
        , operator = handy.operator
        if ( typeof val2 != "undefined" ) {
            return `">=${val1}" AND "<=${val2}"`
        } else {
            return `"${operator}${val1}"`
        }
    } else {
        return handy
    }

}
//console.log(hoyToGetdate('">hoy(+1a)"'))
function hoyToGetdate(exp) {
    const re = / *hoy *\( *([\+,\-] *\d+ *[d,m,a,D,M,A]){0,1} *\) */gi
    , matches = exp.match(re)
    if ( ! matches ) return exp
    matches.forEach ( match => {
        exp = exp.replace ( match, gde(match) )
    })
    return exp
    function gde ( match ) {
        let handy = match.replace ( / */gi , "" ).replace("hoy(","").replace(")","")
        if ( ! handy.length ) return `getdate()`
        const operator = handy[0]
        , increment = handy.substr(1,handy.length-2)
        let interval = handy[handy.length-1]
        switch ( interval ) {
            case 'a': interval = 'year'; break;
            case 'm': interval = 'month'; break;
            case 'd': interval = 'day'; break;
        }
        const dateExp = `dateadd(${interval},${operator}${increment},getdate())`
        //console.log(interval)
        return dateExp
    }
}
function stringMatch ( n, v, data_type, param ) {
    const type = data_type//dataType ( data_type )
    , isnumeric = type == 'number'
    , isdate = type == 'date'
    , sqlparaloquesea = '"%" or ""'
    let vJson = false
    if ( isnumeric || isdate ) v = handyToClassic ( parseHandy ( v ) )
    if ( v == '%' ) v=sqlparaloquesea
    try {
        vJson = JSON.parse ( v )
        if ( typeof vJson == "string" || typeof vJson == "number"  ) vJson = undefined
    } catch ( err ) {
    }
	var re=/"([^"]*)"/gi
    var matches=v.match(re)
    if ( vJson ) {
        const literals = vJson.map ( literal => {
            return `'${literal.replace(/\'/gi,"''")}'` 
        })
        
        var sqltxt = ""
        literals.forEach ( function ( val ) {
            sqltxt = sqltxt + n + " LIKE " + val + " OR "
        } )
        if (sqltxt.length ) sqltxt = "(" + sqltxt.substring(0, sqltxt.length-3) + ")";
        //if ( param.like ) return sqltxt
        if ( ! isnumeric && ! isdate ) return sqltxt
    
        return "("+n+" IN (" + literals + "))"
    } else {
        if ( !matches ){
            if ( isdate ) {
                var r="convert(char(10),"+n+",103) like '%"+v+"%'"
                return "("+r+")"
            /*
            } else if ( isnumeric ) {
                return "("+n+" = " + v + ")"
            */
            } else {
                return "("+n+" like '%" + v + "%')"
            }
        } else {
            var espacioraro=new RegExp(String.fromCharCode(160),"g")
            , saltodelinea=new RegExp(String.fromCharCode(10),"g")
            , sqlparanulo = '(" is null" or "=' + "''" + '")'
            , r=""
            , l=""
            v=v.replace(espacioraro,"").replace(saltodelinea,"")
            if(isnumeric||isdate){v=v.replace('""',sqlparanulo)}
            if(isnumeric||isdate){
                r=hoyToGetdate(v.replace(re,n+"$1"))
                //if(tipo==135 && v.toLowerCase().indexOf('getdate')==-1 && v.toLowerCase().indexOf(sqlparanulo)==-1){
                if(isdate){
                    var red=new RegExp("[0-9]{1,2}/[0-9]{1,2}/[0-9]{4}","g")
                    var matchesf = r.match(red)
                    //if (matchesf == null){alerta('Sintaxis de filtrado no válida');return false}
                    //for(var i=0;i<matchesf.length;i++)r=r.replace(matchesf[i],"'"+matchesf[i]+"'")
                    if (matchesf != null){
                        for(var i=0;i<matchesf.length;i++){
                            //if(tipo==135 && v.toLowerCase().indexOf('getdate')==-1 && v.toLowerCase().indexOf(sqlparanulo)==-1)
                                r=r.replace(matchesf[i],"'"+matchesf[i]+"'")
                        }
                    }
                }
            }else{
                for(var i=0;i<matches.length;i++)v=v.replace(matches[i],matches[i])
                r=v.replace(re,n+" like '$1'")
                r=r.replace(n+" like ''","("+n+" is null OR "+n+"='')")
            }
            return "("+r+")"
        }
    }
}
function eliminarAcentos(txt){
	txt=txt.replace(/a/gi,"[a,\u00e1]")
	txt=txt.replace(/e/gi,"[e,\u00e9]")
	txt=txt.replace(/i/gi,"[i,\u00ed]")
	txt=txt.replace(/o/gi,"[o,\u00f3]")
	txt=txt.replace(/u/gi,"[u,\u00fa]")
	txt=txt.replace(/n/gi,"[n,\u00f1]")
	return txt
}
