const API_URL = basePath.sgeoAPi;

$(function () {
    validarLogin((response) => {
        if (response) {

            fillSelectTipoDocumento("cboTipoDocumentoFiltro", 0, "SELECCIONE", (response) => {

                listarUsuario();

            });
        } });
    $("#btnBuscar").click(function () {
        listarUsuario();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnBuscarPersona").click(function () {
        $("#modalBuscarPersona").modal("show");
    });
    $("#btnCerrarPersona").click(function () {
        $("#modalBuscarPersona").modal("hide");
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevo();

        $("#switchCheckMre").prop("checked", true);
        $("#txtUserNT").prop("disabled", false);
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
    $("#btnBuscarPersonaModal").click(function () {
        buscarPersona();
    });
    $('#modalBuscarPersona').on('shown.bs.modal', function () {
        fillSelectTipoDocumento("cboFiltroBusquedaTipoDocumento", 0, "TODOS", (response) => {
            buscarPersona();
        });
       
    })
    $("#switchCheckMre").change(function () {
        if ($('#switchCheckMre').is(':checked')) {
            $("#txtUserNT").prop("disabled", false);
        } else {
            $("#txtUserNT").prop("disabled", true);;
        }
    })
    $("#switchCheckEmb").change(function () {
        if ($('#switchCheckEmb').is(':checked')) {
            $("#txtCorreo").prop("disabled", false);
            $("#txtLogin").prop("disabled", false);
            $("#txtClave").prop("disabled", false);
        } else {
            $("#txtCorreo").prop("disabled", true);
            $("#txtLogin").prop("disabled", true);
            $("#txtClave").prop("disabled", true);
        }

    });
    $("#btnVerBack").click(function () {
        verContraseña("txtClaveNT",this);
    });
    $("#btnVerUsu").click(function () {
        verContraseña("txtClave",this);
    });

});

function verContraseña(idControl,button) {
    var password1;
    password1 = document.getElementById(idControl);

    if (password1.type == "password")
    {
        $(button).html('<i class="bi bi-eye-slash-fill"></i>');
        password1.type = "text";
    } else 
    {
        password1.type = "password";
        $(button).html('<i class="bi bi-eye-fill"></i>');
    }
}
function getUsuario() {
    let request =
    {
        idTipoDocumento: parseInt($("#cboTipoDocumentoFiltro").val()),
        numeroDocumento: $("#txtNumeroDocumentoFiltro").val(),
        nombres: $("#txtNombreFiltro").val(),
        apellidoPaterno: $("#txtApellidoPaternoFiltro").val(),
        correo: $("#txtCorreoFiltro").val(),
        paginaActual: 0,
        tamanioPagina: 0,
    };
    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceUsuario.getUsuarioPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                    // console.log("data", response);
                })
                .catch(error => {
                    msgException('getUsuario', error)
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
                data: 'idUsuario',
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: 'tipoDocumento' },
            { data: 'numeroDocumento' },
            { data: 'nombres' },
            { data: 'apellidoPaterno' },
            { data: 'apellidoMaterno' },
            { data: 'correo' },
            {
                data: 'idUsuario',
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
function editUsuario(request) {
    serviceUsuario.getUsuarioPorId(request, headersuarm)
        .then(response => {
            $("#hcodigo").val(response.idUsuario);
            
            $("#txtUserNT").val(response.usuarioNT);
            $("#txtClaveNT").val(response.claveNT);
            $("#lblTipoDocumento").text(response.tipoDocumento);
            $("#lblNumDocumento").text(response.numeroDocumento);
            $("#lblNombres").text(response.nombres);
            $("#lblApellidoPaterno").text(response.apellidoPaterno);
            $("#lblApellidoMaterno").text(response.apellidoMaterno);
            $("#lblCorreo").text(response.correoPersonal);

            $("#hidPersona").val(response.idPersona);
            $("#txtCorreo").val(response.correo);
            $("#txtLogin").val(response.login);
            $("#txtClave").val(response.clave);
            if (response.login != '' && response.login != null) {
                $("#txtCorreo").prop("disabled", false);
                $("#txtLogin").prop("disabled", false);
                $("#switchCheckEmb").prop("checked", true);
            } else {
                $("#txtCorreo").prop("disabled", true);
                $("#txtLogin").prop("disabled", true);
                $("#switchCheckEmb").prop("checked", false);
            }
            if (response.usuarioNT != '' && response.usuarioNT != null) {
                $("#txtUserNT").prop("disabled", false);
                $("#switchCheckMre").prop("checked", true);
            } else {
                $("#txtUserNT").prop("disabled", true);
                $("#switchCheckMre").prop("checked", false);
            }
            
            
        })
        .catch(error => {
            msgException('editUsuario', error)
        });
}
function updUsuario(datos) {

    serviceUsuario.updUsuario(datos, headersuarm)
        .then(response => {
            if (response.result >0) {
                getUsuario()
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
              //  console.log("entroooo else");
            }
            
        })
        .catch(error => {
            msgException('updUsuario', error)
        });
}
function insUsuario(datos) {

    serviceUsuario.insUsuario(datos, headersuarm)
        .then(response => {
            if (response.result >0) {
                getUsuario()
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
                //console.log("entroooo else");
            }
            //if (isNaN(response)) {
            //   // console.log(response);
            //    alertify.success(tituloAlert.seguridad, `Registro correcto. Id Generado: ${response.codigoGenerado}`)
            //    getUsuario()
            //} else {
            //    alertify.error(tituloAlert.seguridad, "Registro correcto NO OK.")
            //}
        })
        .catch(error => {
            msgException('insUsuario', error)
        });
}

function delUsuario(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL USUARIO?", "question", (result) => {
        if (result.isConfirmed) {
            serviceUsuario.delUsuario(datos, headersuarm)
                .then(response => {
                    if (response > 0) {
                        //console.log(response);
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                        getUsuario()
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delUsuario', error)
                });
        }
    });
}

function listarUsuario() {
    getUsuario()
}

function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var login = $("#txtLogin").val();
    var clave = $("#txtClave").val();
    var persona = parseInt(($("#hidPersona").val() == '' ? 0 : $("#hidPersona").val()));
    var correo = $("#lblCorreo").text();
    var flag = $("#flagEdit").val();
    var usuarioNT = $("#txtUserNT").val();
    var claveNT = $("#txtClaveNT").val();
    var isMre = 0;
    
    if ($('#switchCheckMre').is(':checked')) {
        isMre = 1;
    }
    if ($('#switchCheckEmb').is(':checked')) {
        isMre = 0;
    }
    if (flag == 1) {
        let datos = {
            idUsuario: codigo,
            login: login,
            clave: clave,
            idPersona: persona,
            correo: correo,
            claveNT: claveNT,
            usuarioNT: usuarioNT,
            isMre: isMre
        };
        updUsuario(datos);
    } else {
        let datos = {
            login: login,
            clave: clave,
            idPersona: persona,
            correo: correo,
            claveNT: claveNT,
            usuarioNT: usuarioNT,
            isMre: isMre
        };
        //console.log("AQUI DATOS", datos)
        insUsuario(datos);
    }
  
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idUsuario: codigo
    };
    delUsuario(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar usuario");
    $("#flagEdit").val(1);
    limpiarModal();
    var id = $(control).data('input');

    let request =
    {
        idUsuario: id
    }

    editUsuario(request);
}

function nuevo() {
    limpiarModal();
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo usuario");
}

function limpiarModal() {
    $("#hcodigo").val('');
    $("#hidPersona").val('');
   
    $("#txtClave").val('');
    $("#txtCorreo").val('');
    $("#txtLogin").val('');
    $("#txtUserNT").val('');
    $("#txtClaveNT").val('');
    $("#btnVerBack").html('<i class="bi bi-eye-fill"></i>');
    $("#btnVerUsu").html('<i class="bi bi-eye-fill"></i>');
    $("#lblTipoDocumento").text("-");
    $("#lblNumDocumento").text("-");
    $("#lblNombres").text("-");
    $("#lblApellidoPaterno").text("-");
    $("#lblApellidoMaterno").text("-");
    $("#lblCorreo").text("-");

    $("#txtCorreo").prop("disabled", true);
    $("#txtLogin").prop("disabled", true);
    $("#txtClave").prop("disabled", true);
    $("#txtUserNT").prop("disabled", true);
    $("#txtClaveNT").prop("disabled", true);

    $("#switchCheckMre").prop("checked", false);
    $("#switchCheckEmb").prop("checked", false);

    var password1 = document.getElementById("btnVerUsu");
    password1.type = "text";
    var password2 = document.getElementById("btnVerBack");
    password2.type = "text";
}

function limpiarFiltros() {
    $("#txtNombreFiltro").val('');
    $("#txtApellidoPaternoFiltro").val('');
    $("#txtCorreoFiltro").val('');
    $("#txtNumeroDocumentoFiltro").val('');
    fillSelectTipoDocumento("cboTipoDocumentoFiltro", 0, "SELECCIONE", (response) => {
    });
}

function limpiarBusquedaPersona() {
    fillSelectTipoDocumento("cboFiltroBusquedaTipoDocumento", 0, "TODOS", (response) => {
        $("#txtFiltroBuquedaNumDoc").val();
        $("#txtFiltroBuquedaNombres").val();
        $("#txtFiltroBuquedaApellido").val();
    });
    

}
function buscarPersona() {
    
    let request =
    {
        idTipoDocumento: parseInt($("#cboFiltroBusquedaTipoDocumento").val()),
        numeroDocumento: $("#txtFiltroBuquedaNumDoc").val(),
        nombres: $("#txtFiltroBuquedaNombres").val(),
        apellidoPaterno: $("#txtFiltroBuquedaApellido").val(),
        paginaActual: 0,
        tamanioPagina: 0,
        activo:true
    };

    $("#gridPersona").DataTable().clear();
    $('#gridPersona').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            servicePersona.getPersonaPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                    // console.log("data", response);
                })
                .catch(error => {
                    msgException('buscarPersona', error)
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

            { data: 'tipoDocumento' },
            { data: 'numeroDocumento' },
            {
                data: 'nombres',
                render: function (data, type, row) {
                    return data + " " + row.apellidoPaterno + " " + row.apellidoMaterno;
                }
            },
            {
                data: 'idPersona',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="seleccionarPersona(this)" data-correo="' + row.correo+'" data-apellidomaterno="' + row.apellidoMaterno + '" data-apellidopaterno="' + row.apellidoPaterno + '" data-nombre="' + row.nombres + '" data-numero="' + row.numeroDocumento + '" data-tipodoc="' + row.tipoDocumento + '" data-input="' + data + '" class="btn btn-sm btn-primary"><i class="bi bi-check2-square"></i> Seleccionar</button> ';
                    return resultado;
                }
            }
        ]
    });

}

function seleccionarPersona(control) {
    var nombres = $(control).data("nombre");
    var apellidoPaterno = $(control).data("apellidopaterno");
    var apellidoMaterno = $(control).data("apellidomaterno");
    var numeroDocumento = $(control).data("numero");
    var tipoDocumento = $(control).data("tipodoc");
    var correo = $(control).data("correo");
    var idPersona = $(control).data("input");


    $("#lblTipoDocumento").text(tipoDocumento);
    $("#lblNumDocumento").text(numeroDocumento);
    $("#lblNombres").text(nombres);
    $("#lblApellidoPaterno").text(apellidoPaterno);
    $("#lblApellidoMaterno").text(apellidoMaterno);
    $("#lblCorreo").text(correo);

    $("#hidPersona").val(idPersona);

    $("#modalBuscarPersona").modal("hide");
}