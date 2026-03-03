const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarComponente();
            });
        //listarPrograma();
    });
    $("#btnBuscar").click(function () {
        listarComponente();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevoComponente();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function listarComponente() {
    getComponente()
}
function getComponente() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        componente: ($("#txtComponenteFiltro").val() && $("#txtComponenteFiltro").val().trim() !== "")
            ? $("#txtComponenteFiltro").val().trim()
            : null,

        descripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
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
    /*servicePrograma.getProgramaPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getPrograma', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceComponente.getComponentePaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getComponente', error));

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
                data: 'idComponente',
                width: "8%",
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio', width: "5%" },
            { data: 'componente', width: "10%" },
            { data: 'tipoComponente', width: "10%" },
            { data: 'descripcion', width: "40%" },
            { data: 'estadoDescripcion', width: "10%" },
            {
                data: 'activo',
                width: "10%",
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
                data: 'idComponente',
                width: "14%",
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

function editComponente(request) {
    limpiarModal();

    serviceComponente.getComponentePorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idComponente);    //*****/
                $("#txtComponente").val(response.componente);
                $("#txtTipoComponente").val(response.tipoComponente);
                $("#txtDescripcion").val(response.descripcion);
                $("#txtEstado").val(response.estadoDescripcion);
                $("#cboActivo").val(response.activo);
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editComponente', error);
        });
}
function updComponente(datos) {

    console.log("llega datos", datos);

    serviceComponente.updComponente(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getComponente();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updComponente', error);
        });
}
function insComponente(datos) {

    serviceComponente.insComponente(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getComponente();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insComponente', error);
        });
}

function delComponente(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR LA ACTIVIDAD PRESUPUESTAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceComponente.delComponente(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getComponente();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delComponente', error);
                });
        }
    });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var componente = $("#txtComponente").val();
    var tipoComponente = $("#txtTipoComponente").val();
    var descripcion = $("#txtDescripcion").val();
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    console.log("codigo", codigo);

    if (flag == 1) {
        let datos = {
            idComponente: codigo,
            idAnio: idAnio,
            componente: componente,
            tipoComponente: tipoComponente,
            descripcion: descripcion,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updComponente(datos);
    } else {
        let datos = {
            //idComponente: codigo,
            idAnio: idAnio,
            componente: componente,
            tipoComponente: tipoComponente,
            descripcion: descripcion,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insComponente(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idComponente: codigo
    };
    delComponente(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Componente Presupuestal");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idComponente: id
    }

    editComponente(request);
}

function nuevoComponente() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo Componente Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtComponente").val("");
    $("#txtTipoComponente").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtComponenteFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

