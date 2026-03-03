const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarPoliticas();
            });
        //listarPoliticas();
    });
    $("#btnBuscar").click(function () {
        listarPoliticas();
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

function listarPoliticas() {
    getPoliticas()
}
function getPoliticas() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoPoliticas: ($("#txtPoliticasFiltro").val() && $("#txtPoliticasFiltro").val().trim() !== "")
            ? $("#txtPoliticasFiltro").val().trim()
            : null,

        descripcionObjetivo: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val() !== "0")
            ? parseInt($("#txtEstadoFiltro").val())
            : null,
        paginaActual: 1,
        tamanioPagina: 10
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
    /*servicePoliticas.getPoliticasPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getPoliticas', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            servicePoliticas.getPoliticasPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getPoliticas', error));

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
                data: 'idPoliticas',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            { data: 'codigoPoliticas' },
            { data: 'descripcionPoliticas' },

            { data: 'codigoObjetivo' },
            { data: 'descripcionObjetivo' },

            { data: 'codigoLinemiento' },
            { data: 'descripcionLineamiento' },

            { data: 'codigoServicio' },
            { data: 'descripcionServicio' },

            { data: 'estadoDescripcion' },
            {
                data: 'activo',
                render: function (data, type, row) {
                    var resultado = "";
                    if (data == 1) {
                        resultado = "ACTIVO";
                    } else {
                        resultado = "INACTIVO";
                    }
                    return resultado;
                }
            },
            {
                data: 'idPoliticas',
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

function editPoliticas(request) {
    limpiarModal();

    servicePoliticas.getPoliticasPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idPoliticas);

                $("#txtPoliticas").val(response.codigoPoliticas);
                $("#txtDescripcionPoliticas").val(response.descripcionPoliticas);

                $("#txtObjetivo").val(response.codigoObjetivo);
                $("#txtDescripcionObjetivo").val(response.descripcionObjetivo);

                $("#txtLineamiento").val(response.codigoLinemiento);
                $("#txtDescripcionLineamiento").val(response.descripcionLineamiento);

                $("#txtServicio").val(response.codigoServicio);
                $("#txtDescripcionServicio").val(response.descripcionServicio);

                $("#txtDescripcion").val(response.descripcion);
                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editPoliticas', error);
        });
}
function updPoliticas(datos) {

    //console.log("llega datos", datos);

    servicePoliticas.updPoliticas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getPoliticas();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updPoliticas', error);
        });
}
function insPoliticas(datos) {

    servicePoliticas.insPoliticas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getPoliticas();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insPoliticas', error);
        });
}

function delPoliticas(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE Politicas?", "question", (result) => {
        if (result.isConfirmed) {
            servicePoliticas.delPoliticas(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getPoliticas();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delPoliticas', error);
                });
        }
    });
}


function grabar() {

    var idPoliticas = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());

    var codigoPoliticas =  $("#txtPoliticas").val();
    var descripcionPoliticas =  $("#txtDescripcionPoliticas").val();

    var codigoObjetivo = $("#txtObjetivo").val();
    var descripcionObjetivo = $("#txtDescripcionObjetivo").val();

    var codigoLinemiento = $("#txtLineamiento").val();
    var descripcionLineamiento = $("#txtDescripcionLineamiento").val();

    var codigoServicio = $("#txtServicio").val();
    var descripcionServicio = $("#txtDescripcionServicio").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idPoliticas: idPoliticas,
            idAnio: idAnio,

            codigoPoliticas: codigoPoliticas,
            descripcionPoliticas: descripcionPoliticas,

            codigoObjetivo: codigoObjetivo,
            descripcionObjetivo: descripcionObjetivo,

            codigoLinemiento: codigoLinemiento,
            descripcionLineamiento: descripcionLineamiento,

            codigoServicio: codigoServicio,
            descripcionServicio: descripcionServicio,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updPoliticas(datos);
    } else {
        let datos = {
            //idPoliticas: codigo,
            idAnio: idAnio,

            codigoPoliticas: codigoPoliticas,
            descripcionPoliticas: descripcionPoliticas,

            codigoObjetivo: codigoObjetivo,
            descripcionObjetivo: descripcionObjetivo,

            codigoLinemiento: codigoLinemiento,
            descripcionLineamiento: descripcionLineamiento,

            codigoServicio: codigoServicio,
            descripcionServicio: descripcionServicio,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insPoliticas(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idPoliticas: codigo
    };
    delPoliticas(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Politica");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idPoliticas = $(control).data('input');

    let request =
    {
        idPoliticas: idPoliticas
    }

    editPoliticas(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Politica");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtPoliticas").val("");
    $("#txtDescripcionPoliticas").val("");

    $("#txtObjetivo").val("");
    $("#txtDescripcionObjetivo").val("");

    $("#txtLineamiento").val("");
    $("#txtDescripcionLineamiento").val("");

    $("#txtServicio").val("");
    $("#txtDescripcionServicio").val("");

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtPoliticasFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

