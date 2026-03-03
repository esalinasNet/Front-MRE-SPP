const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarCentroCostos();
            });
        //listarCentroCostos();
    });
    $("#btnBuscar").click(function () {
        listarCentroCostos();
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

function listarCentroCostos() {
    getCentroCostos()
}
function getCentroCostos() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        centroCostos: ($("#txtCentroCostosFiltro").val() && $("#txtCentroCostosFiltro").val().trim() !== "")
            ? $("#txtCentroCostosFiltro").val().trim()
            : null,

        descripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        centroCostosPadre: ($("#txtCentroCostosPadreFiltro").val() && $("#txtCentroCostosPadreFiltro").val().trim() !== "")
            ? $("#txtCentroCostosPadreFiltro").val().trim()
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
    /*serviceCentroCostos.getCentroCostosPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getCentroCostos', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceCentroCostos.getCentroCostosPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getCentroCostos', error));

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
                data: 'idCentroCostos',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'centroCostos' },
            { data: 'descripcion' },
            { data: 'centroCostosPadre' },
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
                data: 'idCentroCostos',
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

function editCentroCostos(request) {
    limpiarModal();

    serviceCentroCostos.getCentroCostosPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idCentroCostos);
                $("#txtCentroCostos").val(response.centroCostos);
                $("#txtDescripcion").val(response.descripcion);
                $("#txtCentroCostosPadre").val(response.centroCostosPadre);
                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";
                                
                $("#cboActivo").val(activo);
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editCentroCostos', error);
        });
}
function updCentroCostos(datos) {

    //console.log("llega datos", datos);

    serviceCentroCostos.updCentroCostos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCentroCostos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updCentroCostos', error);
        });
}
function insCentroCostos(datos) {

    serviceCentroCostos.insCentroCostos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCentroCostos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCentroCostos', error);
        });
}

function delCentroCostos(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE CentroCostos?", "question", (result) => {
        if (result.isConfirmed) {
            serviceCentroCostos.delCentroCostos(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getCentroCostos();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delCentroCostos', error);
                });
        }
    });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var idEjecutora = 1;
    var centrocostos = $("#txtCentroCostos").val();
    var descripcion = $("#txtDescripcion").val();
    var centrocostospadre = $("#txtCentroCostosPadre").val();
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idCentroCostos: codigo,
            idAnio: idAnio,
            idEjecutora: idEjecutora,
            centrocostos: centrocostos,
            descripcion: descripcion,
            centrocostospadre: centrocostospadre,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updCentroCostos(datos);
    } else {
        let datos = {
            //idCentroCostos: codigo,
            idAnio: idAnio,
            idEjecutora: idEjecutora,
            centrocostos: centrocostos,
            descripcion: descripcion,
            centrocostospadre: centrocostospadre,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insCentroCostos(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idCentroCostos: codigo
    };
    delCentroCostos(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Centro de Costos");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idCentroCostos: id
    }

    editCentroCostos(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo Centro de Costos");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtCentroCostos").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtCentroCostosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

