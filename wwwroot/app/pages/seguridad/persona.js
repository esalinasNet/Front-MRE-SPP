const API_URL = basePath.sgeoAPi;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectTipoDocumento("cboTipoDocumentoFiltro", 0, "SELECCIONE", (response) => {

                listarPersona();
            });
        //listarPersona();
    });
    $("#btnBuscar").click(function () {
        listarPersona();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevo();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function listarPersona() {
    getPersona()
}
function getPersona() {
    let request =
    {
        idTipoDocumento: $("#cboTipoDocumentoFiltro").val(),
        numeroDocumento: $("#txtNumeroDocumentoFiltro").val(),
        nombres: $("#txtNombreFiltro").val(),
        apellidoPaterno: $("#txtApellidoPaternoFiltro").val(),
        paginaActual: 0,
        tamanioPagina: 0
    };
    var sitaucionFiltro = $("#cboSituacionFiltro").val();
    switch (parseInt(sitaucionFiltro)) {
        case 1:
            request.activo = true;
            break;
        case 0:
            request.activo = false;
            break;
        default:
            request.activo = null;
            break;
    }
    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            servicePersona.getPersonaPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getPersona', error));
           

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
                data: 'idPersona',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'tipoDocumento' },
            { data: 'numeroDocumento' },
            { data: 'nombres' },
            { data: 'apellidoPaterno' },
            { data: 'apellidoMaterno' },
            { data: 'paisNacimiento' },
            {
                data: 'activo',
                render: function (data, type, row) {
                    var resultado = "";
                    if (data==1) {
                        resultado = "ACTIVO";
                    } else {
                        resultado = "INACTIVO";
                    }
                    return resultado;
                }
            },
            {
                data: 'idPersona',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });


}
function editPersona(request) {
    limpiarModal();
    console.log("ID PERSONA", request)
    servicePersona.getPersonaPorId(request, headersuarm)
        .then(response => {
           // console.log(response);
            fillSelectTipoDocumento("cboTipoDocumento", response.idTipoDocumento, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idPersona);
                $("#txtDocumento").val(response.numeroDocumento);
                $("#txtNombre").val(response.nombres);
                $("#txtApellidoPaterno").val(response.apellidoPaterno);
                $("#txtApellidoMaterno").val(response.apellidoMaterno);
                $("#cboTipoGenero").val(response.sexo);
                $("#txtCorreo").val(response.correo);
                $("#cboActivo").val(response.activo);
                $("#txtFechaNacimiento").val(response.fechaNacimiento);
                $("#txtTelefono").val(response.numeroTelefono);
                fillSelectPaises("cboPaisNacimiento", response.idPaisNacimiento, "SELECCIONE", function () {})
                fillSelectEstadoCivil("cboEstadoCivil", response.idEstadoCivil, "SELECCIONE", function () {})
                //fillSelectTipoGenero("cboTipoGenero", response.idTipoGenero, "SELECCIONE", function () { })                

            });

           

        })
        .catch(error => {
            msgException('editPersona', error);
        });
}
function updPersona(datos) {

    servicePersona.updPersona(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getPersona();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updPersona', error);
        });
}
function insPersona(datos) {

    servicePersona.insPersona(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getPersona();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insPersona', error);
        });
}

function delPersona(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE PERSONA?", "question", (result) => {
        if (result.isConfirmed) {
            servicePersona.delPersona(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getPersona();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delPersona', error);
                });
        }
    });
}

function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idTipoDocumento = parseInt($("#cboTipoDocumento").val());
    var idPaisNacimiento = parseInt($("#cboPaisNacimiento").val());
    var documento = $("#txtDocumento").val();
    var nombre = $("#txtNombre").val();
    var apellidoPaterno = $("#txtApellidoPaterno").val();
    var apellidoMaterno = $("#txtApellidoMaterno").val();
    var sexoNew = $("#cboTipoGenero").val();
    var correo = $("#txtCorreo").val();
    var fechaNacimiento = $("#txtFechaNacimiento").val();
    var estadoCivil = parseInt($("#cboEstadoCivil").val());
    var telefono = $("#txtTelefono").val();
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();

    if (flag == 1) {
        let datos = {
            idPersona: codigo,
            idTipoDocumento: idTipoDocumento,
            idPaisNacimiento: idPaisNacimiento,
            idEstadoCivil: estadoCivil,
            numeroDocumento: documento,
            nombres: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            correo: correo,
            sexo: sexoNew,
            numeroTelefono: telefono,
            activo: (activo == 1 ? true: false)
        };
        if (fechaNacimiento != "") {
            datos.fechaNacimiento = fechaNacimiento
        }
        updPersona(datos);
    } else {
        let datos = {
            idTipoDocumento: idTipoDocumento,
            idPaisNacimiento: idPaisNacimiento,
            idEstadoCivil: estadoCivil,
            numeroDocumento: documento,
            nombres: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            correo: correo,
            numeroTelefono: telefono,
            sexo: sexoNew
        };
        if (fechaNacimiento!="") {
            datos.fechaNacimiento = fechaNacimiento
        }
        console.log("aqui Datos", datos)
        insPersona(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idPersona: codigo
    };
    delPersona(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Persona");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    var id = $(control).data('input');

    let request =
    {
        idPersona: id
    }
    
    editPersona(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled",true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nueva Persona");

    fillSelectPaises("cboPaisNacimiento", 0, "SELECCIONE", (response) => { });

    fillSelectEstadoCivil("cboEstadoCivil", 0, "SELECCIONE", (response) => {});

    fillSelectTipoDocumento("cboTipoDocumento", 0, "SELECCIONE", (response) => { });

    //fillSelectTipoGenero("cboTipoGenero", 0, "SELECCIONE", (response) => { });

}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtDocumento").val("");
    $("#txtNombre").val("");
    $("#txtApellidoPaterno").val("");
    $("#txtApellidoMaterno").val("");
    $("#txtSexo").val("");
    $("#txtCorreo").val("");
    $("#txtFechaNacimiento").val("");
    $("#txtTelefono").val("");
    $("#cboActivo").val(1);
    //fillSelectPaises("cboPaisNacimiento", 0, "SELECCIONE", function () {})
    //fillSelectEstadoCivil("cboEstadoCivil", 0, "SELECCIONE", function () { })
    //fillSelectTipoDocumento("cboTipoDocumento", 0, "SELECCIONE", function () { })
    //fillSelectTipoGenero("cboTipoDocumento", 0, "SELECCIONE", function () { })
}

function limpiarFiltros() {
    $("#txtNumeroDocumentoFiltro").val('');
    $("#txtNombreFiltro").val('');
    $("#txtApellidoPaternoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectTipoDocumento("cboTipoDocumentoFiltro", 0, "SELECCIONE", (response) => { });
}
