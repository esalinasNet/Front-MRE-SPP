const API_URL = basePath.sgeoAPi;

$(".app-header").hide();
$(".app-sidebar").hide();
 
function loggin(token, param) {
   
    let request = {
        userName: '',
        password: '',
        tokenCaptcha: token
    }
    if (param.enabled==="false") {
        var key_user = CryptoJS.enc.Utf8.parse(param.param1);
        var iv_user = CryptoJS.enc.Utf8.parse(param.param11);
        var key_pwd = CryptoJS.enc.Utf8.parse(param.param2);
        var iv_pwd = CryptoJS.enc.Utf8.parse(param.param21);
        request.userName = CryptoJS.AES.encrypt($("#userName").val(), key_user, { iv: iv_user }).toString();
        request.password = CryptoJS.AES.encrypt($("#password").val(), key_pwd, { iv: iv_pwd }).toString();
    } else {
        request.userName = $("#userName").val();
        request.password = $("#password").val();

    }

    var result=servicePassport.autentificar(request, headersuarmLogin)
        .then(response => {

            let userLogged = {
                correo: response.correo,
                rol: response.descripcionRol,
                usuario: response.nombreUsuario,
                idUsuarioRol: response.idUsuarioRolStr,
                codigoRol: response.codigoRol,
                idRol: response.idRol,
                idSistema: response.idSistema
            }

            let requestAccess = {
                idPerfil: encodeURI(response.idRol),
                idSistema: encodeURI(response.idSistema)
            };

            const _headersuarm = new Headers();
            _headersuarm.append("Authorization", "Bearer " + response.jwToken);
            _headersuarm.append("Content-type", "application/json; charset=UTF-8");
            _headersuarm.append("ApiKey", __paramApi.key);
            _headersuarm.append("AppKey", __paramApi.code);

            servicePassport.detailAccessRol(requestAccess, _headersuarm).then(resp => {
            
                passport.setJwtToken(response.jwToken);
                passport.setJwtIdUserRol(response.idUsuarioRolStr);
                passport.setJwtInformationUser(userLogged);
                passport.setJwtInformationProfile(response.roles);
                passport.setIdPerfil(response.idRol);
                passport.setIdSistema(response.idSistema);
                passport.setDetailAccess(resp);
        
                alertify.success(tituloAlert.seguridad, `${response.message}`, () => {
                     setTimeout(function () { document.location.href = `${basePath.sgeoWEB}Index`; }, 2000);
                })
 

            }).catch(error => {
                alertify.error(tituloAlert.seguridad, `${error.messages}`, () => { })
            });

          
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `${error.messages}`, () => { })
        });

     
}
