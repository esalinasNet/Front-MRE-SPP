const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
let seleccionados = new Set();

$(document).on('change', '#chkTodos', function () {
    const checked = $(this).prop('checked');
    $('.chkCentro').prop('checked', checked);
});

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarCategoriaPresupuestal();
            });
        //listarCategoriaPresupuestal();
    });
    $("#btnBuscar").click(function () {
        listarCategoriaPresupuestal();
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

function listarCategoriaPresupuestal() {
    getCategoriaPresupuestal()
}
function getCategoriaPresupuestal() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoPresupuestal: ($("#txtPresupuestalFiltro").val() && $("#txtPresupuestalFiltro").val().trim() !== "")
            ? $("#txtPresupuestalFiltro").val().trim()
            : null,

        descripcionPresupuestal: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        //codigoPrioritarios: ($("#txtPrioritariosFiltro").val() && $("#txtPrioritariosFiltro").val().trim() !== "")
        //    ? $("#txtPrioritariosFiltro").val().trim()
        //    : null,

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
    /*serviceCategoriaPresupuestal.getCategoriaPresupuestalPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getCategoriaPresupuestal', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceCategoriaPresupuestal.getCategoriaPresupuestalPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getCategoriaPresupuestal', error));

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
                data: 'idPresupuestal',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            { data: 'codigoPresupuestal' },
            { data: 'descripcionPresupuestal' },

            //{ data: 'codigoAcciones' },
            //{ data: 'descripcionAcciones' },

            { data: 'nroCodigoAcciones' },

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
                data: 'idPresupuestal',
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

function editCategoriaPresupuestal(request) {
    limpiarModal();

    serviceCategoriaPresupuestal.getCategoriaPresupuestalPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idPresupuestal);

                $("#txtPresupuestal").val(response.codigoPresupuestal);
                $("#txtDescripcionPresupuestal").val(response.descripcionPresupuestal);

                $("#hidAcciones").val(response.idAcciones);
                $("#txtAcciones").val(response.codigoAcciones);
                $("#txtDescripcionAcciones").val(response.descripcionAcciones);

                $("#txtTotalSeleccionados").val(response.nroCodigoAcciones);

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });


            let request = {
                idPresupuestal: response.idPresupuestal,
                idAnio: response.idAnio
            }
            console.log("request", request);
            //traemos los Centros de Costos seleccionados
            serviceCategoriaPresupuestal.getAeiCategoriaPresupuestalPorId(request, headersuarm)
                .then(_response => {
                    console.log("AEi Presupuestal", _response);

                    // Extraer solo los idCentroCostos de cada objeto
                    const ids = _response.map(x => x.idAcciones);

                    // Crear el Set global con esos IDs
                    seleccionados = new Set(ids);

                    console.log("seleccionados Costos", seleccionados);
                });

            getAeiCategoria(); // response.idAnio, response.idAcciones, response.activo );      
        })
        .catch(error => {
            msgException('editCategoriaPresupuestal', error);
        });
}

function updCategoriaPresupuestal(datos) {

    //console.log("llega datos", datos);

    serviceCategoriaPresupuestal.updCategoriaPresupuestal(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCategoriaPresupuestal();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updCategoriaPresupuestal', error);
        });
}
function insCategoriaPresupuestal(datos) {

    serviceCategoriaPresupuestal.insCategoriaPresupuestal(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCategoriaPresupuestal();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCategoriaPresupuestal', error);
        });
}

function delCategoriaPresupuestal(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE CategoriaPresupuestal?", "question", (result) => {
        if (result.isConfirmed) {
            serviceCategoriaPresupuestal.delCategoriaPresupuestal(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getCategoriaPresupuestal();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delCategoriaPresupuestal', error);
                });
        }
    });
}


function grabar() {

    var idPresupuestal = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    //console.log("idAnio:", idAnio, "anio:", anio);

    var codigoPresupuestal = $("#txtPresupuestal").val();
    var descripcionPresupuestal = $("#txtDescripcionPresupuestal").val();

    var idAcciones = Array.from(seleccionados);
    var nroCodigoAcciones = seleccionados.size;

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = 3

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idPresupuestal: idPresupuestal,
            idAnio: idAnio,

            codigoPresupuestal: codigoPresupuestal,
            descripcionPresupuestal: descripcionPresupuestal,

            idAcciones: idAcciones,
            nroCodigoAcciones: nroCodigoAcciones,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updCategoriaPresupuestal(datos);
    } else {
        let datos = {
            //idCategoriaPresupuestal: codigo,
            idAnio: idAnio,
            anio: anio,

            codigoPresupuestal: codigoPresupuestal,
            descripcionPresupuestal: descripcionPresupuestal,

            idAcciones: idAcciones,
            //codigoAcciones: codigoAcciones,
            nroCodigoAcciones: nroCodigoAcciones,

            idEstado: 2 //idEstado
        };
        //console.log("nuevo", datos);
        insCategoriaPresupuestal(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idPresupuestal: codigo
    };
    delCategoriaPresupuestal(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Categoria Presupuestal");
    $("#flagEdit").val(1);

    /*$("#txtPresupuestal").prop("disabled", true);
    $("#txtDescripcionPresupuestal").prop("disabled", true);

    $("#txtAcciones").prop("disabled", true);
    $("#txtDescripcionAcciones").prop("disabled", true);  */

    $("#txtTotalSeleccionados").prop("disabled", true);

    $("#cboActivo").prop("disabled", true);
    $("#txtEstado").prop("disabled", true);
    $("#cboAnio").prop("disabled", true);

    var idPresupuestal = $(control).data('input');

    let request =
    {
        idPresupuestal: idPresupuestal
    }

    editCategoriaPresupuestal(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Categoria Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");
    $("#txtTotalSeleccionados").prop("disabled", true);
    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#hidAcciones").val("");

    $("#txtPresupuestal").val("");
    $("#txtDescripcionPresupuestal").val("");

    $("#txtAcciones").val("");
    $("#txtDescripcionAcciones").val("");

    $("#txtTotalSeleccionados").val(0);

    $("#txtEstado").val("");
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtPresupuestalFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

function getAeiCategoria() {
    //console.log("idAnio, idAcciones", idAnio, idAcciones);
    let request =
    {
        anio: 0, //idAnio,
        //idAcciones: idAcciones,
        codigoAcciones: null,
        descripcionAcciones: null,
        activo: true,
        paginaActual: 0,
        tamanioPagina: 0        
    };

    //let seleccionados = new Set();

    $("#gridCentroCostos").DataTable().clear();
    $('#gridCentroCostos').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            //serviceAeiCentroCostos.getAeiCentroCostosPaginado(request, headersuarm)  //cambiar
            serviceAccionesInstitucionales.getAccionesInstitucionalesPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getAeiCentroCostos', error));

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
                data: null,
                orderable: false,
                className: 'text-center',
                render: function (data, type, row) {
                    const checked = seleccionados.has(row.idAcciones) ? 'checked' : '';
                    return `<input type="checkbox" class="chkCentro" data-id="${row.idAcciones}" ${checked} />`;
                }
            },
            //{
            //    data: 'idCentroCostos',
            //render: function (data, type, row, meta) {
            //    return row.registro;
            //}
            //},            
            { data: 'codigoAcciones' },
            { data: 'descripcionAcciones' },
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
            }
            // {
            // data: 'idCentroCostos',
            //render: function (data, type, row) {
            //    var resultado = '';
            //    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';                   
            //    return resultado;
            //}
            //}
        ],
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true
    });

    function actualizarTotalSeleccionados() {
        $('#txtTotalSeleccionados').val(seleccionados.size);
    }

    $(document).on('change', '.chkCentro', function () {
        const id = $(this).data('id');
        if ($(this).is(':checked')) {
            seleccionados.add(id);
        } else {
            seleccionados.delete(id);
        }
        actualizarTotalSeleccionados();
    });
}