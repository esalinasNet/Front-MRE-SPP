 
const API_URL = basePath.sgeoAPi;
 
var K_GRUPOS_PAISES = [];
var K_GRUPOS_PAISES_USUARIO = [];
var data = [];
$(function () {

    //var auth = passport.getAutorizacion();  /*PARA HABILITAR BOTONES*/
    //console.log("******auth",auth);

    $("#divGrupos").hide();
    $("#divCentroCostoss").hide();
    $("#divFiltros").hide();
   
    validarLogin((response) => {
        if (response) {

            fillSelectSistemas("cboSistemaFiltro", "SELECCIONE", 0, (respone) => {
                                
                fillSelectRol("cboRolFiltro", 0, "TODOS", 1, function (retorno) { });
                                
                fillSelectListarUsuarios("cboUsuarioFiltro", "", "TODOS", (respone) => { });

                listarAcesso();
                
            });

        }
    });

    $("#cboRol").change(function () {
        configMostrarGruposPais($("#cboRol").val());
    });
    
    $("#btnBuscar").click(function () {
        listarAcesso();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });

    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {

        var idSistema = $("#cboSistemaFiltro").val()

        if (idSistema == 0) {
            alertify.warning("AVISO", "Debe seleccionar un sistema para poder asignar permisos", () => { })
        }
        else {
            nuevo(idSistema);
        }
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });

    //Sistema  Filtro
    var sis = document.getElementById("cboSistemaFiltro");
    sis.addEventListener("change", function () {
        fillSelectRol("cboRolFiltro", 0, "TODOS", $("#cboSistemaFiltro").val(), function () { });
    });

    //Rol  Filtro
    var roles = document.getElementById("cboRolFiltro");
    sis.addEventListener("change", function () {
        //fillSelectUsuario("cboUsuarioFiltro", 0, "TODOS",0, function () { });
    });

    
    //Controles de mantenimiento
    var sistema = document.getElementById("cboSistema");
    sistema.addEventListener("change", function () {

        fillSelectRol("cboRol", 0, "TODOS", $("#cboSistema").val(), function () { });

        var x = $("#cboSistema").val();
        console.log("que es", x);
    });

    /*var filtroOse = document.getElementById("cboTipoUbigeo");  //Tipo de Ubigeo Nacional / Exterior  ya no
    filtroOse.addEventListener("change", function () {
        
        let tipo = $("#cboTipoUbigeo").val();
        console.log("tipo", tipo);

        let request = { idAnio: 1 }

        if (tipo === "1") { // Nacional            
            fillSelectCentroCostos("cboCentroCostos", request, 0, "SELECCIONE", (response) => { });
        }        
    })*/

    /*var filtroPais = document.getElementById("cboPais");
    filtroPais.addEventListener("change", function () {
        let request = {
            idPais: $("#cboPais").val(),    //Paises
            idTipoEntidad: $("#cboCentroCostos").val(),   //Tipo de UBigeo / Exterior
        }
    })*/    

    document.getElementById("cboRolFiltro").addEventListener("change", function () {
        fillSelectUsuario("cboUsuarioFiltro", 0, "TODOS", $("#cboRolFiltro").val(), function () { });
    })
});

function listarAcesso() {

    let request =
    {   
        idSistema: ($("#cboSistemaFiltro").val() && $("#cboSistemaFiltro").val() !== "0")
            ? parseInt($("#cboSistemaFiltro").val())   //$("#cboSistemaFiltro option:selected").text()  
            : 0,

        idRol: ($("#cboRolFiltro").val() && $("#cboRolFiltro").val() !== "0")
            ? parseInt($("#cboRolFiltro").val())  //$("#cboRolFiltro option:selected").text()
            : 0,

        idUsuario: ($("#cboUsuarioFiltro").val() && $("#cboUsuarioFiltro").val() !== "0")
            ? parseInt($("#cboUsuarioFiltro").val())   //$("#cboUsuarioFiltro option:selected").text()
            : 0,

        paginaActual: 1,
        tamanioPagina: 10,
    };
    console.log("request", request);
    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceAcceso.getAccesoPaginado(request, headersuarm)
                .then(response => {
                    console.log("response de paginado", response);
                    cb(response)
                })
                .catch(error => {
                    msgException('listarAcesso', error)
                });

        },
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Se encontraron _TOTAL_ resultados.",
            infoEmpty: "No se encontraron registros"
        },
        responsive: true,
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true,
        columns: [
            {
                data: 'idUsuarioRol',
                width: '5%',
                render: function (data,type,row,meta) {
                    return meta.row + 1;
                }
            },
            { data: 'nombreSistema' ,width:'10%'},
            { data: 'usuario', width: '40%' },
            { data: 'rol', width: '20%' },
            { data: 'nombreOSE', width: '15%' },
           
            {
                data: 'idUsuarioRol',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
            
        ]
    });
}

function editAcceso(request) {

    serviceAcceso.getAccesoPorId(request, headersuarm)
        .then(response => {

            let request = { idAnio: 1 }
            $("#hcodigo").val(response.idUsuarioRol);
                        
            fillSelectListarUsuarios("cboUsuario", response.idUsuario, "SELECCIONE", (respone) => { });

            fillSelectRol("cboRol", response.idRol, "SELECCIONE", 1, (respone) => {});

            fillSelectCentroCostos("cboCentroCostos", request, response.idCentroCostos, "SELECCIONE", (respone) => { });


            //configMostrarGruposPais(response.idRol);
            //if (response.accesoPrivado == 1) {
            //    $('#rbSi').prop('checked', true);
               
            //} else {
            //    $('#rbSi').prop('checked', false);
            //}

            console.log("response",response);
            //console.log("response.idOrganismo", response.idOrganismo);

            
        })
        .catch(error => {
            msgException('editAcceso', error)
        });
}

function updAcceso(datos) {
    serviceAcceso.updAcceso(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                listarAcesso();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
                
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updAcceso', error)
        });
}

function insAcceso(datos) {
    serviceAcceso.insAcceso(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                listarAcesso()
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insAcceso', error)
        });
}

function delAcceso(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL ACCESO?", "question", (result) => {
        if (result.isConfirmed) {
            serviceAcceso.delAcceso(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                        listarAcesso();
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
            })
            .catch(error => {
                msgException('delAcceso', error)
            });
        }
    });
}

function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idUsuario = parseInt($("#cboUsuario").val());
    var idRol = parseInt($("#cboRol").val());
    var idCentroCostos = parseInt($("#cboCentroCostos").val());   //Centro de Costos
    var accesoPrivado = 0;
    
    var flag = $("#flagEdit").val();
        
    if (flag == 1) {
        let datos = {
            idUsuarioRol: codigo,
            idUsuario: idUsuario,
            idRol: idRol,
            accesoPrivado: accesoPrivado,
         //   grupoPais: K_GRUPOS_PAISES,
            idCentroCostos: idCentroCostos
        };
        console.log("Datos", datos);
        updAcceso(datos);
    } else {
        let datos = {
            
            idUsuario: idUsuario,
            idRol: idRol,
            accesoPrivado: accesoPrivado,
         //   grupoPais: K_GRUPOS_PAISES,
            idCentroCostos: idCentroCostos
        };
        console.log("Datos", datos);

        insAcceso(datos);
    }
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idUsuarioRol: codigo
     };
    delAcceso(datos);
}

function editar(control) {
    $("#cboUsuario").prop("disabled", true);
    $("#cboRol").prop("disabled", true);
    $("#cboCentroCostos").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar acceso");
    $("#flagEdit").val(1);
    limpiarModal();
    var id = $(control).data('input');

    let request =
    {
        idUsuarioRol: id
    }

    editAcceso(request);
}

function nuevo(idSistema) {
    console.log("en nuevo idsistema", idSistema);
    let request = { idAnio: 1 }

    limpiarModal(idSistema);

    $("#cboUsuario").prop("disabled", false);
    $("#cboRol").prop("disabled", false);
    $("#cboCentroCostos").prop("disabled", false);

    fillSelectUsuarioNoFiltrado("cboUsuario", 0, "SELECCIONE", () => { })   //Trae los usuarios

    fillSelectRol("cboRol", 0, "Seleccione", idSistema, () => { });   
        
    fillSelectCentroCostos("cboCentroCostos", request, 0, "SELECCIONE", (response) => { });

    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo acceso");
    //configMostrarGruposPais(0);
}

function limpiarModal(idSistema) {
    K_GRUPOS_PAISES_USUARIO = [];
    K_GRUPOS_PAISES = [];
    $("#hcodigo").val('');
    $("#cboUsuario").val(0);
    $("#cboRol").val(0);
    $('#rbSi').prop('checked', true);
    fillSelectSistemas("cboSistema", "SELECCIONE", idSistema, () => { })

    fillSelectPaises("cboPais", 0, "TODOS", () => { })

    //fillSelectTipoOse("cboCentroCostos", 0, "TODOS", () => { })
}

function limpiarFiltros() {
    $("#cboUsuarioFiltro").val(0);
    $("#cboRolFiltro").val(0);
    $("#cboSistemaFiltro").val(0);
}

function obtenerCodigoRol(idRol,callback) {
    var request = {
        idRol: idRol
    }
    serviceRol.getRolPorId(request, headersuarm)
        .then(response => {
            callback(response.codigoRol);
        })
        .catch(error => {
            msgException('obtenerCodigoRol', error)
        });
}
function configMostrarGruposPais(idRol) {
    if (idRol != 0) {
        obtenerCodigoRol(idRol,   (response) =>{
            if (response) {
                if (K_CODIGO_ROL_PERDIP.ADMINISTRADOR_ORH == response ||
                    K_CODIGO_ROL_PERDIP.CONSULTA_OSE == response ||
                    K_CODIGO_ROL_PERDIP.CONSULTA_ALTA_DIR == response ) {
                    //$("#divGrupos").show();
                    $("#divCentroCostoss").hide();
                    $("#divFiltros").hide();
                   // listadoGrupoGeneral(function (data) {
                   //     setDataTable(data);
                   // });
                } else if (K_CODIGO_ROL_PERDIP.ADMINISTRADOR_OSE == response) {
                    $("#divGrupos").hide();
                    $("#divCentroCostoss").show();
                    $("#divFiltros").show();
                    $("#bodyGrupos").html("");

                   
                } else {
                    $("#divCentroCostoss").hide();
                    $("#divFiltros").hide();
                    $("#divGrupos").hide();
                    $("#bodyGrupos").html("");
                }
            }
        });
    } else {
        $("#divCentroCostoss").hide();
        $("#divFiltros").hide();
        $("#divGrupos").hide();
        $("#bodyGrupos").html("");
    }
    
}
function listadoGruposUsuario(callback) {
var request = {
        idUsuarioRol:$("#hcodigo").val()
    }
    if (request.idUsuarioRol != '') {
        serviceAccesoGrupo.getAccesoGrupoPorId(request, headersuarm)
            .then(response => {
                K_GRUPOS_PAISES_USUARIO = [];
                $.each(response, function (index, tp) {
                    var elemento = {
                        idUsuarioRol: tp.idUsuarioPerfil,
                        idGrupoAtencion: tp.idGrupoAtencion,
                        activo: (tp.activo == 1 ? true : false)
                    }

                    K_GRUPOS_PAISES_USUARIO.push(elemento);

                });
                callback(1);
            })
            .catch(error => {
                msgException('listadoGruposUsuario', error)
            });
    } else {
        K_GRUPOS_PAISES_USUARIO = [];
    }
    callback(1);
}
function listadoGrupoGeneral(callback) {
    
    listadoGrupos(function (salida) {
        if (salida==1) {
            $("#bodyGrupos").html("");
            listadoGruposUsuario(function (response) {
                var data = [];
                $("#bodyGrupos").html("");
                if (K_GRUPOS_PAISES_USUARIO != "") {
                    $.each(K_GRUPOS_PAISES_USUARIO, function (index, tp) {

                        K_GRUPOS_PAISES.map(function (dato) {
                            if (dato.idGrupoAtencion == tp.idGrupoAtencion) {
                                dato.activo = (tp.activo == 1 ? true : false);
                            }

                            return dato;
                        });
                    });
                }
                var filtrado = K_GRUPOS_PAISES.filter(function (objeto, index, self) {
                    return index === self.findIndex(function (o) {
                        return o.idGrupoAtencion === objeto.idGrupoAtencion && o.descripcion === objeto.descripcion;
                    });
                });
                /*console.log(filtrado);
                console.log('K_GRUPOS_PAISES_USUARIO', K_GRUPOS_PAISES_USUARIO);
                console.log('K_GRUPOS_PAISES', K_GRUPOS_PAISES);*/
                $.each(filtrado, function (i, row) {

                    var datos = {
                        numero: i + 1,
                        descripcion: row.descripcion,
                        idGrupoAtencion: row.idGrupoAtencion,
                        activo: row.activo,
                        embajadas: row.embajadas
                    }
                    data.push(datos);
                       
                    
                });
                callback(data);
                });
        }
    });

}

function setDataTable(data) {
    $('#gridGrupos').DataTable({
        data:data,
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Página  _PAGE_ de _PAGES_",
            infoEmpty: "No se encontraron registros"
        },
        responsive: true,
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: false,
        columns: [{
            "data": "numero"
        },
            {
                "data": "descripcion",
                render: function (data,typre,row) {
                    var resultado = "";
                    resultado = '<label class="form-check-label" for="witchCheckChecked' + row.idGrupoAtencion + '">' + data + '</label>';

                    return resultado;

                }

            },
            {
                "data": "numero",
                render: function (data,type,row) {
                    var resultado = "";
                    var checked = "";
                    if (row.activo == true) checked = ' checked ';
                    resultado = '<div class="form-check form-switch">' +
                        '<input onchange="cambioActivoGrupo(this)" class="form-check-input" type="checkbox" data-input="' + row.idGrupoAtencion + '" role="switch" id="witchCheckChecked' + row.idGrupoAtencion + '" ' + checked + '>' +
                        '</div >';
                    return resultado;
                }
            },
            {
                "data": "embajadas",
                render: function (data,type,row) {
                    var resultado = "";
                    
                    if (data != "" && data!=null) {
                        var arrayCentroCostoss = data.split(",");
                        resultado += "<ul>";
                        for (var i = 0; i < arrayCentroCostoss.length; i++) {
                            resultado += "<li>"+arrayCentroCostoss[i] + "</li>";
                        }
                        resultado += "</ul>";
                    }
                    return resultado;
                }
            }
        ]
    });
}

function listadoGrupos(callback) {

    serviceCatalogoItem.getGrupoPaises(headersuarm)
        .then(response => {

            K_GRUPOS_PAISES = [];

            $.each(response, function (index, tp) {
                var elemento = {
                    idUsuarioRol: ($("#hcodigo").val() == "" ? 0 : parseInt($("#hcodigo").val())),
                    descripcion: tp.descripcionCatalogoItem,
                    idGrupoAtencion: tp.idCatalogoItem,
                    embajadas: tp.embajadas,
                    activo: false
                }
                K_GRUPOS_PAISES.push(elemento);
            });

            callback(1);
        })
        .catch(error => {
            msgException('listadoGrupos', error)
        });
}
function cambioActivoGrupo(control) {
    var id = $(control).data("input");
    var act = false;
    if ($('#witchCheckChecked' + id).is(':checked')) {
        act=true
    }

    K_GRUPOS_PAISES.map(function (dato) {
        if (dato.idGrupoAtencion == id) {
            dato.activo = act;
        }

        return dato;
    });
}