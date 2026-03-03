const K_GLOBAL_LS_SISA = {
    _VAR_TKN: 'mreorh_pass_token',
    _VAR_USRROL: 'mreorh_pass_userRol',
    _VAR_USRLOGED: 'mreorh_pass_userLoged',
    _VAR_PROFILES: 'mreorh_pass_profileLoged',
    _VAR_TKN_REFRESH: 'mreorh_pass_refreshToken',

    _VAR_TKN_ROL: 'mreorh_pass_idRol',
    _VAR_TKN_SISTEMA: 'mreorh_pass_idSistema',
    _VAR_TKN_ACCION: 'mreorh_pass_accionCurrent',
    _VAR_TKN_DETAIL_ACCESS: 'mreorh_pass_settingMenu',
    _VAR_TKN_AUTH: 'mreorh_pass_optCurrentAuth',
    _VAR_TKN_OPCION: 'mreorh_pass_optCurrentId',    
}
/*ENCRYPT HANDLER SISA*/
const K_ACTION = {

    //ACCESS: 'qg99xDeDV0u268MA0fNm2Q==',
    //LIST: 'Srr2ylxL2PllvYeZKh8Dlg==',
    //UPDATE: 'qsUKc6unDBVfi9Pj+vCfGQ==',
    //DELETE: '2iVWerytyZ7Adk6vT0R+DQ==',
    //APROBE: 'eK0YjrPCwAHUBJxERKnvIw==',
    //REJECT: '28MRl6zj5hWcVt2NCABZAw==',
    //VIEW: 'IXttCdBVAG7dRSHi0lgm/Q==',
    //INSERT: 'R/oBiGdKkWiPYBucwqKBaQ==',
    //EXPORT: 'MqcdquWOkTN75k8zkq6eCQ==',
    //VIEW_PDF: 'TbD9rHJiYi79qM+MZ/zr5g==',
    //NONE: 'nN9Irk6xTdjwNLRbqDJesw=='
    ACCESS: 'ACC',
    LIST: 'LST',
    UPDATE: 'UPD',
    DELETE: 'DEL',
    APROBE: 'APR',
    REJECT: 'REJ',
    VIEW: 'VIW',
    INSERT: 'INS',
    EXPORT: 'MqcdquWOkTN75k8zkq6eCQ==',
    VIEW_PDF: 'TbD9rHJiYi79qM+MZ/zr5g==',
    NONE: 'nN9Irk6xTdjwNLRbqDJesw=='

 
     
};
 

const passport = {
    getJwtToken() {
        var tkn = localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN));
        if (tkn == "undefined") return '';
        else return localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN));
    },
    getIdUserRol() {
        return localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRROL));
    },
    getInformationUser() {
        return JSON.parse(localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRLOGED)));
    },
    getInformationProfile() {
        var profile = localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_PROFILES));
        if (profile == "undefined") return null;
        else return JSON.parse(localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_PROFILES)));
    }
    ,
    getRefreshToken() {
        return localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_REFRESH));
    }
    ,
    setJwtToken(token) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN), token);
    },
    setJwtIdUserRol(objeto) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRROL), objeto);
    },
    setJwtInformationUser(objeto) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRLOGED), JSON.stringify(objeto));
    },
    setJwtInformationProfile(objeto) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_PROFILES), JSON.stringify(objeto));
    },
    setIdPerfil(item) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_ROL), item);
        headersuarm.set("idPerfil", item);
    },
    setIdOpcion(item) {
        localStorage.setItem(K_GLOBAL_LS_SISA._VAR_TKN_OPCION, item);
        headersuarm.set("idOpcion", item);
    },
    setIdSistema(item) { localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_SISTEMA), item); },
    setAccion(item) { localStorage.setItem(K_GLOBAL_LS_SISA._VAR_TKN_ACCION, item); },
    setDetailAccess(item) { localStorage.setItem(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS, JSON.stringify(item)); },
    setAutorizacion(item) { localStorage.setItem(K_GLOBAL_LS_SISA._VAR_TKN_AUTH, JSON.stringify(item)); },

    getIdPerfil() {
        return localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_ROL));
    },
    getIdOpcion() {
        return localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_OPCION);
    },
    getIdSistema() {
        return localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_SISTEMA));
    },
    getAccion() {
        return localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_ACCION);
    },
    getDetailAccess() {
        var items = localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS);
        if (items == "undefined") return null;
        //else return JSON.parse(localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS)));
        else return JSON.parse(localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS));

    },
    getAutorizacion() {
        var items = localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_AUTH);
        if (items == "undefined") return null;
        //else return JSON.parse(localStorage.getItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS)));
        else {

            return JSON.parse(localStorage.getItem(K_GLOBAL_LS_SISA._VAR_TKN_AUTH));


            //{
            //    ACCESO: 'ACC',

            //}






        }

    },

    saveRefreshToken(refreshToken) {
        localStorage.setItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_REFRESH), refreshToken);
    },
    removeJwtToken() {
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN));
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRROL));
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_USRLOGED));
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_PROFILES));
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_REFRESH));

        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_ROL));
        localStorage.removeItem(K_GLOBAL_LS_SISA._VAR_TKN_OPCION);
        localStorage.removeItem(CryptoJS.MD5(K_GLOBAL_LS_SISA._VAR_TKN_SISTEMA));
        localStorage.removeItem(K_GLOBAL_LS_SISA._VAR_TKN_ACCION);
        localStorage.removeItem(K_GLOBAL_LS_SISA._VAR_TKN_DETAIL_ACCESS);
        localStorage.removeItem(K_GLOBAL_LS_SISA._VAR_TKN_AUTH);



    },
    setHeaderAccion(accion) {
        headersuarm.set("accion", accion);
       
    }
}