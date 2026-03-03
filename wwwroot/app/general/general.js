var K_PROTOCOL_SSL = "https://";
var K_PROTOCOL_NOSSL = "http://";
const K_ICON_PADRE = [];
K_ICON_PADRE[0] = '';
K_ICON_PADRE[1] = '<i class="bi bi-gear-fill"></i>';
K_ICON_PADRE[2] = '<i class="bi bi-diagram-3-fill"></i>';
K_ICON_PADRE[3] = '<i class="bi bi-journal-check"></i>';
K_ICON_PADRE[4] = '<i class="bi bi-calendar-check"></i>';
K_ICON_PADRE[5] = '<i class="bi bi-person-fill"></i>';

/*CONSTANTE RESPECTO AL CODIGO DE ROL COMO CONSTANTE QUE ESTA EN EL SISTEMA*/
const K_ACCION = "accion";
const K_CODIGO_ROL_PERDIP = {
    ADMINISTRADOR_ORH : 1,
    CONSULTA_ALTA_DIR : 2,
    ADMINISTRADOR_OSE : 3,
    CONSULTA_OSE : 4,
}
/*CORRESPONDIENTE AL CODIGO DE CATALOGO ITEM*/
const K_SEDE = {
    LIMA: 1,
    EXTERIOR: 2,
}
 
$(function () {

    const _profile = passport.getInformationProfile();
    const _user = passport.getInformationUser();
    if (_user != null) { settingMenuSideBar(); }
    let str = "";
    let usuarioLog = "-";
    let correoLog = "-";
    let rolLog = "-";


    if (_profile != null) {
        _profile.forEach((rol) => {
            str += ` <a class="dropdown-item" onclick="resetProfile('${rol.descripcionRol}','${rol.idUsuarioRol}', '${rol.codigoRol}', '${rol.idRol}')" style="text-transform:uppercase"   >${rol.descripcionRol}</a>`;
        });
    }  
    document.querySelector("#ddlRolesSession").innerHTML = str;

    if (_user != null) {
        usuarioLog = _user.usuario;
        correoLog = _user.correo;
        rolLog = _user.rol;
    }
    $("#pnombrerol").text(rolLog);
    $("#pnombreusuario").text(usuarioLog);
    $("#usuarioLog").text("Usuario: " + usuarioLog);
    $("#correoLog").text("Correo: " + correoLog);
    $("#rolLog").text("Rol: " + rolLog);

});

const tituloAlert = {
    seguridad: 'Aviso SPP',
    confirmacion: 'SPP :: Confirmación de sistema',
    notificacion: 'SPP :: Aviso' 
}

 
function formatParameter(data) {
    let urlParameters = Object.entries(data).map(e => e.join('=')).join('&');

    return urlParameters;
}
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}
 


const alertify = {
    success(title, text,callback) {

        Swal.fire({
            title: title,
            text: text,
            icon: 'success',
            confirmButtonColor: '#343a40',
            confirmButtonText: 'Aceptar'
            // footer: '<a href="">Why do I have this issue?</a>'
        })
        callback(true);
     
    },
    error(title, text, callback) {


        Swal.fire({
            title: title,
            text: text,
            icon: 'error',
            confirmButtonColor: '#343a40',
            confirmButtonText: 'Aceptar'
           // footer: '<a href="">Why do I have this issue?</a>'
        })


        

        callback(true);
    },
    warning(title, text, callback) {
         Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            confirmButtonColor: '#343a40',
            confirmButtonText: 'Aceptar' 
        })
        
         callback(true);
    },
    info(title, text, callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'info',
            confirmButtonColor: '#343a40',
            confirmButtonText: 'Aceptar'
            //-- footer: '<a href="">Why do I have this issue?</a>'
        })
         
        callback(true);
    },
    confirm(title, text,icon,callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: '#343a40',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {
                 
                callback(result);
            } else if (result.isDenied) {
               
                callback(result);
            }
        })
        
    },
    confirmHtml(title, text, icon, callback) {
        Swal.fire({
            title: title,
            html: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: '#343a40',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            if (result.isConfirmed) {

                callback(result);
            } else if (result.isDenied) {

                callback(result);
            }
        })

    },
    messageOkAutoClose(message, timer) {
        Swal.fire({
            position: "top-end",
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: timer
        });
    }
}


 

function msgException(fncOrigen, error) {
    let message = error.messages[0];
    loading(false);
    if (error.statusCode != null && error.statusCode == 401) //NO TOKEN NO AUTORIZADO
        alertify.warning(tituloAlert.seguridad, `${message}`, () => {
            setTimeout(function () {
                document.location.href = `${basePath.sgeoWEB}login`;
            }, 3000);
        });
    else if (error.statusCode != null && error.statusCode == 404) // NO SE ENCONTRARON DATOS
        alertify.warning(tituloAlert.seguridad, `${message}`, () => { });
    else if (error.statusCode != null && error.statusCode == 403)// ACCESO PROHIBIDO
        alertify.warning(tituloAlert.seguridad, `${message}`, () => {
            setTimeout(function () {
                document.location.href = `${basePath.sgeoWEB}Noaccess`;
            }, 3000);
        });
    else // OTRO CASOS
        alertify.error(tituloAlert.seguridad, `${message}`, () => { });
}
function validarLogin(callback) {

    let currentOpt = document.location.pathname;

    if (!(currentOpt.indexOf("login") != -1))  {
        let request = { token: encodeURIComponent(passport.getJwtToken()) }
        servicePassport.validarSession(request, headersuarm)
            .then(response => {
                callback(response);
            })
            .catch(error => {
                callback(false);
                msgException('pubInforme', error);
            });
    } else callback(false);
} 


function soloNumeros(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 &&
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function loggout() {
    var datos = {
    }
    servicePassport.logoutLog(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                passport.removeJwtToken();
                alertify.info(tituloAlert.seguridad, "FINALIZANDO SESSIÓN...", () => {
                    setTimeout(function () {
                        document.location.href = `${basePath.sgeoWEB}login`;
                    }, 3000);
                });
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('logoutLog', error);
        });

}
function resetProfile(descripcionRol, idUsuarioRol, codigoRol,idRol) {

    console.log("*****",descripcionRol, idUsuarioRol, codigoRol, idRol);

    var __user = passport.getInformationUser();

    __user.rol = descripcionRol;
    __user.idUsuarioRol = idUsuarioRol;
    __user.codigoRol = parseInt(codigoRol);

    passport.setJwtIdUserRol(idUsuarioRol);
    passport.setJwtInformationUser(__user);
    passport.setIdPerfil(idRol);

    let requestAccess = {
        idPerfil: encodeURI(idRol),
        idSistema: encodeURI(passport.getIdSistema())
    };
    servicePassport.detailAccessRol(requestAccess, headersuarm).then(resp => {
        passport.setDetailAccess(resp);
        passport.setAutorizacion({});
        passport.setIdOpcion(0);

        // setTimeout(function () {
            document.location.href = `${basePath.sgeoWEB}Index`;
        // }, 2000);

    }).catch(error => {
        alertify.error(tituloAlert.seguridad, `${error.messages}`, () => { })
    });

   // document.location.href = `${basePath.sgeoWEB}Index`;
}
function isObject(val) {
    return val instanceof Object;
}

function settingMenu() {

    currentOpt=document.location.pathname
    var menu = passport.getDetailAccess();
    if (isObject(menu)) {
        if (undefined !== menu.opciones) {
            var opcionehija = menu.opciones.filter(x => x.idOpcionPadre != null);
            var opcionePadre = menu.opciones.filter(x => x.idOpcionPadre == null);
            var permisos = menu.opciones.filter(x => x.url == currentOpt);
            var hasPermiso = false;
            if (permisos.length > 0) hasPermiso = true;
            if (hasPermiso) {
                if (menu.opciones.length > 0) {
                    var opcionActual = permisos[0];
                    var accesos = menu.permisos.filter(x => x.idOpcion == opcionActual.idOpcion);
                    if (accesos.length > 0) {
                        passport.setAutorizacion(accesos);
                        passport.setIdOpcion(accesos[0].idOpcion);
                    } else {
                        passport.setAutorizacion({});
                        passport.setIdOpcion(0);
                    }
                }
            }
            var strMenu = '';
            //var strMenu = '<li class="nav-item active" >';
            //strMenu += ' <a class="nav-link menuLevel1 " id = "lnkInicio" href = "?" > <i class="bi bi-house-door-fill"> </i></a>';
            //strMenu += '</li>';
            opcionePadre.forEach(padre => {

                strMenu += '<li class="nav-item dropdown">';
                strMenu += '<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false" >';
                strMenu += padre.nombre;
                strMenu += '</a>';

                var menuhijo = opcionehija.filter(hija => hija.idOpcionPadre == padre.idOpcion);
                if (menuhijo.length != 0) {
                    strMenu += '<div class="dropdown-menu">';
                    menuhijo.forEach(hijo => {
                        strMenu += '<a class="dropdown-item" href="' + hijo.url + '">';
                        strMenu += hijo.nombre;
                        strMenu += '</a>';
                    });
                }
                strMenu += '</div>';
                strMenu += '</li>';
            });
          //  document.querySelector("#_menubar").innerHTML = strMenu;
        }
        else {
            passport.setAutorizacion({});
            passport.setIdOpcion(0);
        }
    } else {
        passport.setAutorizacion({});
        passport.setIdOpcion(0);
    }
}

function settingMenuSideBar() {
    document.querySelector("#_menubarSideBar").innerHTML = '';
    currentOpt = document.location.pathname
    var menu = passport.getDetailAccess();
    if (isObject(menu)) {
        if (undefined !== menu.opciones) {
            var opcionehija = menu.opciones.filter(x => x.idOpcionPadre != null);
            var opcionePadre = menu.opciones.filter(x => x.idOpcionPadre == null);
            var permisos = menu.opciones.filter(x => x.url == currentOpt);
            var hasPermiso = false;
            if (permisos.length > 0) hasPermiso = true;
            if (hasPermiso) {
                if (menu.opciones.length > 0) {
                    var opcionActual = permisos[0];
                    var accesos = menu.permisos.filter(x => x.idOpcion == opcionActual.idOpcion);
                    if (accesos.length > 0) {
                        passport.setAutorizacion(accesos);
                        passport.setIdOpcion(accesos[0].idOpcion);
                    } else {
                        passport.setAutorizacion({});
                        passport.setIdOpcion(0);
                    }
                }
            }
            var strMenu = '';

            strMenu += '<nav class="mt-2">';
            strMenu += '<ul class="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false" >';
            strMenu += '    <li class="nav-item menu-open"> ';
            strMenu += '        <a href="javascript:;" class="nav-link active">';
            //strMenu += '            <i class="nav-icon fa-solid fa-gauge-high"></i>';
            strMenu += '            <i class="nav-icon bi bi-building"></i>';
            strMenu += '                <p>';
            strMenu += '                    FRONT BASE SEG - OTI  ';
            strMenu += '                </p>';
            strMenu += '        </a>';
            strMenu += '    </li>';
            var i = 0;
            var idx = 0;
            opcionePadre.forEach(padre => {
                if (i > 0) {
                    // i,"**--");
                    strMenu += '<li class="nav-item" id="padre_' + padre.idOpcion + '">';
                    //strMenu += '    <a href="#" onclick="viewDown(' + padre.idOpcion + ');" id="href_' + padre.idOpcion + '"class="nav-link">'; //22-10-25
                    strMenu += '    <a href="#" onclick="viewDown(' + padre.idOpcion + ', event);" id="href_' + padre.idOpcion + '" class="nav-link">';

                    //                    strMenu += '            <i class="nav-icon fa-solid fa-copy"></i>';
                    strMenu += K_ICON_PADRE[idx];
                    //strMenu += '            <i class="nav-icon bi bi-hdd-stack"></i>';
                    strMenu += '                <p>';
                    strMenu += padre.nombre;
                    //                    strMenu += '            <i class="nav-arrow fa-solid fa-angle-right"></i>';
                    strMenu += '            <i class="nav-arrow bi bi-caret-right" id="arrow_' + padre.idOpcion + '"></i>';
                    strMenu += '                 </p>';
                    strMenu += '    </a>';


                    var menuhijo = opcionehija.filter(hija => hija.idOpcionPadre == padre.idOpcion);
                    if (menuhijo.length != 0) {
                        strMenu += ' <ul class="nav nav-treeview notViewElements" id="treeview_' + padre.idOpcion + '">';
                        menuhijo.forEach(hijo => {
                            strMenu += ' <li class="nav-item">';
                            strMenu += '<a class="nav-link" href="' + hijo.url + '">';
                            //  strMenu += '<i class="nav-icon fa-regular fa-circle"></i>';
                            strMenu += '<i class="nav-icon bi bi-dot "></i>';
                            strMenu += '<p>';
                            strMenu += hijo.nombre;
                            strMenu += '</p>';
                            strMenu += '</a>';
                            strMenu += '</li>';
                        });
                        strMenu += '</ul>';
                    }

                    strMenu += '</li>';
                }
                i++;
                idx++;
            });

            strMenu += '</ul>';
            strMenu += '</nav>';
            strMenu += `<style> .notViewElements { display: none; } .viewElements { display: block; } </style>`;

            // Expandir automáticamente el menú padre de la página actual
            setTimeout(() => {
                const currentPath = document.location.pathname;
                const activeLink = document.querySelector(`a.nav-link[href='${currentPath}']`);

                if (activeLink) {
                    // Marcar el hijo como activo
                    activeLink.classList.add('active');

                    // Buscar su padre
                    const treeview = activeLink.closest('.nav-treeview');
                    if (treeview) {
                        treeview.classList.remove('notViewElements');
                        treeview.classList.add('viewElements');

                        // Marcar el padre como activo
                        const padreLi = treeview.closest('.nav-item');
                        if (padreLi) {
                            const padreLink = padreLi.querySelector('a.nav-link');
                            if (padreLink) padreLink.classList.add('active');

                            // Cambiar flecha del padre
                            const arrow = padreLi.querySelector('.nav-arrow');
                            if (arrow) {
                                arrow.classList.remove('bi-caret-right');
                                arrow.classList.add('bi-caret-down');
                            }
                        }
                    }
                }
            }, 50);

            document.querySelector("#_menubarSideBar").innerHTML = strMenu;
        }
        else {
            passport.setAutorizacion({});
            passport.setIdOpcion(0);
        }
    } else {
        passport.setAutorizacion({});
        passport.setIdOpcion(0);
    }
}

function viewDown(id, event) {
    if (event) event.stopPropagation(); // ⛔ Detiene la burbuja del click
    console.log("click en padre:", id);

    const treeview = document.querySelector("#treeview_" + id);
    const arrow = document.querySelector("#arrow_" + id);
    const padreLink = document.querySelector("#href_" + id);

    if (!treeview) return;

    const isVisible = treeview.classList.contains("viewElements");

    // Cierra todos los demás submenús
    document.querySelectorAll('.nav-treeview').forEach(ul => {
        ul.classList.remove('viewElements');
        ul.classList.add('notViewElements');
    });
    document.querySelectorAll('.nav-arrow').forEach(arrowAll => {
        arrowAll.classList.remove('bi-caret-down');
        arrowAll.classList.add('bi-caret-right');
    });
    document.querySelectorAll('.nav-item > a.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Abre solo el seleccionado
    if (!isVisible) {
        treeview.classList.remove('notViewElements');
        treeview.classList.add('viewElements');

        if (arrow) {
            arrow.classList.remove('bi-caret-right');
            arrow.classList.add('bi-caret-down');
        }
        if (padreLink) {
            padreLink.classList.add('active');
        }
    }
}



// Manejo de hijos
function setActiveChild(element) {
    console.log("click en hijo:", element);

    // Quitar active de todos los hijos
    document.querySelectorAll('.nav-treeview a.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Marcar solo el hijo clicado
    element.classList.add('active');

    // 🔹 También marcar el padre como activo
    let padre = element.closest('.nav-item.menu-open')?.querySelector('a.nav-link');
    if (padre) {
        padre.classList.add('active');
    }
}

function fillSelectTipoDocumento(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipoDocumentoIdentidad(headersuarm)
        .then(response => {

            console.log("llego Docuemnto", response);
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
    callback(1);
}

function fillSelectTipoDocumentoProyectoMcc(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceProyectoMcc.getTipoDocumento(headersuarm)
        .then(response => {
           // "PRUEBA ", response)
            $.each(response, function (index, tp) {
               // "ENTRA FUNCION 2")
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTipoDocumentoProyectoEo(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceProyectoEo.getTipoDocumento(headersuarm)
        .then(response => {
           // "PRUEBA ", response)
            $.each(response, function (index, tp) {
               // "ENTRA FUNCION 2")
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectNaturaleza(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getNaturaleza(headersuarm)
        .then(response => {
            //console.log("PRUEBA ", response)
            $.each(response, function (index, tp) {
            //   // "ENTRA FUNCION 2")
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTipoClasificacionxOrganismo(control,request, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceTipoClasificacion.getTipoClasificacionxOrganismo(request, headersuarm)
        .then(response => {
            //console.log("PRUEBA ", response)
            $.each(response, function (index, tp) {
                //   // "ENTRA FUNCION 2")
                var selected = "";
                selected = "Selected";
                $("#" + control).append("<option value='" + tp.idTipoClasificacion + "' " + selected + ">" + tp.descripcion + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `${error.messages}`)
        });
}

function fillSelectSede(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getSede(headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectAnio(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getAniosItem(headersuarm)
        .then(response => {
            //console.log(response);
            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.descripcionCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTipo(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipo(headersuarm)
        .then(response => {
            
            $.each(response, function (index, tp) {
       
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTipoDocumentoResolucion(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipoDocumentoSustento(headersuarm)
        .then(response => {
           // "PRUEBA ", response)
            $.each(response, function (index, tp) {
               // "ENTRA FUNCION 2")
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillEstadoProyectoMcc(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceProyectoMcc.getEstado(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillEstadoProyectoEo(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceProyectoEo.getEstado(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectPaises(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');

    //serviceCatalogoItem.getPaises(headersuarm)
    servicePaises.getPaises(headersuarm)
        .then(response => {            
            $.each(response, function (index, tp) {
                var selected = "";                
                if (val == tp.idPaises) {
                    selected = "Selected";                    
                }
                //$("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
                $("#" + control).append("<option value='" + tp.idPaises + "' " + selected + ">" + tp.nombre_pais + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
    
}

function fillSelectTipoOse(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipoOse(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";

                if (val == tp.idCatalogoItem) {
                    selected = "Selected";

                }
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });

} 
function fillSelectSigla(control, valor, mensaje, callback) {

    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    $("#" + control).append("<option value='3'>" + "FUNCIONARIO PUBLICO" + "</option>");
    $("#" + control).append("<option value='2'>" + "SERVIDOR PUBLICO" + "</option>");
    $("#" + control).append("<option value='1005'>" + "EMPLEADO DE CONFIANZA" + "</option>");
    callback(1);
}

//esv 08-09-25
function fillSelectRol(control, valor, mensaje, idSistema, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    
    if (idSistema == 0) idSistema = null;
    let request = { idSistema: idSistema }

    serviceRol.getRolListado(request,headersuarm)
        .then(response => {
                        
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idRol) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idRol + "' " + selected + ">" + tp.nombre + "</option>");
                
            });
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });    
}

//end esv
function fillSelectListaRol(control, valor, mensaje, idSistema, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    ////$("#" + control).selectpicker('refresh');
    if (idSistema == 0) idSistema = null;
    let request = { idSistema: idSistema }

    serviceRol.getRolLista(request, headersuarm)
        .then(response => {
            var objetos = response;
            console.log("llego lista response", response);
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idRol) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idRol + "' " + selected + ">" + tp.nombre + "</option>");

            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);            
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
    callback(1);
}

function fillSelectUsuario(control, valor, mensaje, idRol, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    //$("#" + control).selectpicker('refresh');
    if (idRol == 0) idRol = null;
    let request = { idRol: idRol }
    console.log("usuario",request)
    serviceUsuario.getUsuarioListado(request, headersuarm)
        .then(response => {
            var objetos = response;
            $.each(objetos, function (index, tp) {
                var selected = "";
                if (val == tp.idUsuario) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idUsuario + "' " + selected + ">" + tp.apellidoPaterno + " " + tp.apellidoMaterno + " " + tp.nombres + "</option>");
            });
            //console.log(objetos);
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUsuarioNoFiltrado(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceUsuario.getUsuarioListadoNoFiltrado({}, headersuarm)
        .then(response => {
            var objetos = response;
            $.each(objetos, function (index, tp) {
                var selected = "";
                if (val == tp.idUsuario) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idUsuario + "' " + selected + ">" + tp.apellidoPaterno + " " + tp.apellidoMaterno + " " + tp.nombres + "</option>");
            });
            //console.log(objetos);
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectCatalogo(control, valor, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    //$("#" + control).selectpicker('refresh');
    serviceCatalogo.getCatalogoListado(headersuarm)
        .then(response => {
            //console.log("data", response.data);
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogo) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogo + "' " + selected + ">" + tp.nombreCatalogo + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1); 
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, error.messages)
        });
}

function fillSelectSistemas(control,mensaje, valor, callback) {

    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceSistema.getListadoSistema(headersuarm).then(response => {

        $.each(response, function (index, tp) {
            var selected = "";
            if (val == tp.idSistema) selected = "Selected";
            $("#" + control).append("<option value='" + tp.idSistema + "' " + selected + ">" + tp.nombre + "</option>");
        });
         

        callback(1);


    }).catch(error => {
        msgException("fillSelectSistemas", error)
        //callback(0);
    });

}


function fillSelectSiglaPadresUpd(control, valor, mensaje, callback, idclasi) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    var aux = "";
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceClasificacionPersonal.getListadoClasificaciones(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idClasificacionPersonalPadre && idclasi == tp.idClasificacionPersonal) {
                    aux = tp.idClasificacionPersonalPadre
                    //console.log(aux);
                   // aux);
                    let request = {
                        idPersona: aux
                    };
                    serviceClasificacionPersonal.getClasificacionPersonalPorId(request,headersuarm)
                        .then(response => {
                           // response.idClasificacionPadre);
                            // response.nombre);
                            //console.log(response) 
                            $("#" + control).append("<option value='" + response.idClasificacion + "' " + "Selected" + ">" + response.nombre + "</option>");
                        })       
                }
                $("#" + control).append("<option value='" + tp.idClasificacionPersonal + "' " + selected + ">" + tp.nombre + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
    callback(1);
}

function fillSelectSiglaPadreIns(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceClasificacionPersonal.getListadoClasificaciones(headersuarm)
        .then(response => {
            var objetos = response;
            $.each(objetos, function (index, tp) {
                var selected = "";
                if (val == tp.idUsuario) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idClasificacionPersonal + "' " + selected + ">" + tp.nombre + "</option>");
            });
            //console.log(objetos);
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}
 

function fillSelectTipoEntidad(control, valor,mensaje,callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipoEntidades(headersuarm)
        .then(response => {
            //console.log(response);
            //console.log("data", response.data);
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, error.messages)
        });
}

function fillSelectOrganismo(control, valor, mensaje, callback, request) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceOrganismo.getOrganismo(request, headersuarm)
        .then(response => {
            console.log("*******entroooo");
            $.each(response,  (index, tp)=> {
                var selected = "";
                if (val == tp.idOrganismo) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idOrganismo + "' " + selected + ">" + tp.nombre + "</option>");
            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);

            callback(1);
        })
        .catch(error => {
            //console.log("*******catchhhhhhhhhhh");
            alertify.error(tituloAlert.seguridad, error.messages)

        });
}
 
function fillSelectPersona(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    ////$("#" + control).selectpicker('refresh');

    servicePersona.getPersonaListado(headersuarm)
        .then(response => {
            var objetos = response;
            $.each(objetos, function (index, tp) {
                var selected = "";
                if (val == tp.idPersona) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idPersona + "' " + selected + ">" + tp.nombres + " " + tp.apellidoPaterno + " " + tp.apellidoMaterno + "</option>");

            });
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
           
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
    callback(1);
}
 
function fillSelectEstadoCivil(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getEstadoCivil(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            callback(1);
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });   
}

function fillSelectTipoGenero(control, valor, mensaje, callback) {
    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    //$("#" + control).selectpicker('refresh');
    serviceCatalogoItem.getTipoGenero(headersuarm)
        .then(response => {
            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCatalogoItem) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCatalogoItem + "' " + selected + ">" + tp.descripcionCatalogoItem + "</option>");
            });
            callback(1);
            //$("#" + control).selectpicker('refresh');
            //$("#" + control).selectpicker('val', valor);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectAnioPresupuesto(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    
    serviceAnio.getAnioListado(headersuarm)
        .then(response => {
           
            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idAnio) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idAnio + "' " + selected + ">" + tp.anio + "</option>");
            });
            
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectAnioPresupuestal(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceAnio.getAnioListado(headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idAnio) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idAnio + "' " + selected + ">" + tp.anio + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}


function fillSelectUbigeoDepartamento(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    
    serviceUbigeo.getDepartamento(headersuarm)
        .then(response => {
            
            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.departamento) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.departamento + "' " + selected + ">" + tp.descripcion + "</option>");
            });
            
            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUbigeoProvincia(control, valor, mensaje, departamento, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    if (departamento == "") departamento = null;
    let request = { departamento: departamento }

    serviceUbigeo.getProvincia(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.provincia) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.provincia + "' " + selected + ">" + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUbigeoDistrito(control, valor, mensaje, departamento, provincia, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    if (provincia == "") provincia = null;
    let request = { departamento: departamento,
                    provincia: provincia
        }

    console.log("request distrito", request);

    serviceUbigeo.getDistrito(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.distrito) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.distrito + "' " + selected + ">" + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillGetUbigeoProvincia(control, valor, mensaje, departamento, provincia, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    if (provincia == "") provincia = null;
    let ubigeo = String(departamento + provincia);
    let request = {
        ubigeo: ubigeo
    }

    console.log("request provincia", request, " + ", ubigeo);

    serviceUbigeo.getUbigeoProvinciaPorId(request, headersuarm)
        .then(response => {
            console.log("Response completo", response);
            if (Array.isArray(response)) {
                $.each(response, function (index, tp) {
                    let selected = (val == tp.ubigeo) ? "Selected" : "";
                    $("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.provincia}</option>`);
                });
            } else {
                let selected = (val == response.ubigeo) ? "Selected" : "";
                $("#" + control).append(`<option value="${response.ubigeo}" ${selected}>${response.provincia}</option>`);
            }
            
            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectCentroDeCostos(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCentroCostos.getCentroCostosListado(headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idCentroCostos) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idCentroCostos + "' " + selected + ">" + tp.centroCostos + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUbigeoExteriorRegion(control, valor, mensaje, callback) {

    console.log("en exterior region");

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceUbigeoExterior.getExteriorRegion(headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.codigoRegion) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.codigoRegion + "' " + selected + ">" + tp.region + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUbigeoExteriorPais(control, valor, mensaje, codigoRegion, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    if (codigoRegion == "") codigoRegion = null;
    let request = { codigoRegion: codigoRegion }

    serviceUbigeoExterior.getExteriorPais(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.codigoPais) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.codigoPais + "' " + selected + ">" + tp.pais + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUbigeoExteriorCiudad(control, valor, mensaje, codigoRegion, codigoPais, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    if (codigoPais == "") codigoPais = null;
    let request = {
        codigoRegion: codigoRegion,
        codigoPais: codigoPais
    }

    console.log("request distrito", request);

    serviceUbigeoExterior.getExteriorCiudad(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.codigoOse) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.codigoOse + "' " + selected + ">" + tp.ciudad + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectListarUsuarios(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");
    
    console.log("Listar usuarios", control, valor, mensaje, callback)

    serviceUsuario.getListarUsuarios( headersuarm)
        .then(response => {
                        
            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idUsuario) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idUsuario + "' " + selected + ">" + tp.apellidoPaterno + " " + tp.apellidoMaterno + " " + tp.nombres + "</option>");

            });
            
            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function loading(result) {
    if (result===true) {
        $("#loading").css('display', 'block');
    } else {
        $("#loading").css('display', 'none');
        //setTimeout(function () {            $("#loading").css('display', 'none');        }, 2000);
       
    } 
    
}
function readImage(input, img) {
    //// input.files);
    if (input.files && input.files[0]) {
        if (input.files[0].type == "image/jpeg" || input.files[0].type == "image/png") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#' + img).attr('src', e.target.result); // Renderizamos la imagen
                $('#' + img).show();
            }
            reader.readAsDataURL(input.files[0]);
        } else {
            $("#" + img).hide();
        }

    } else {
        $("#" + img).hide();
    }
}
 

function convertirFormatoFecha(fechaEnFormatoYMD) {
    const partes = fechaEnFormatoYMD.split('-');
    if (partes.length === 3) {
        const anio = partes[0];
        const mes = partes[1];
        const dia = partes[2];
        return `${dia}/${mes}/${anio}`;
    } else {
        return 'Formato de fecha incorrecto';
    }
}

/*OBTENER DEL LOCAL STORAGE*/
const headersuarm = new Headers();
headersuarm.append("Authorization", "Bearer " + passport.getJwtToken());
headersuarm.append("Content-type", "application/json; charset=UTF-8");
headersuarm.append("x-token-not-sent", false);
headersuarm.append("x-token-expired", false);
headersuarm.append("X-Auditoria", passport.getIdUserRol());

headersuarm.append("idPerfil", passport.getIdPerfil());
headersuarm.append("idOpcion", passport.getIdOpcion());
headersuarm.append("accion", "NONE");
headersuarm.append("idSistema", passport.getIdSistema());

/*FIXEAR LEER DE APPSETTIUNG*/
headersuarm.append("ApiKey", __paramApi.key);
headersuarm.append("AppKey", __paramApi.code);

const headersuarmLogin = new Headers();
headersuarmLogin.append("Content-type", "application/json; charset=UTF-8");
headersuarmLogin.append("x-token-not-sent", false);
headersuarmLogin.append("x-token-expired", false);

/*FIXEAR LEER DE APPSETTIUNG*/
headersuarmLogin.append("ApiKey", __paramApi.key);
headersuarmLogin.append("AppKey", __paramApi.code);

