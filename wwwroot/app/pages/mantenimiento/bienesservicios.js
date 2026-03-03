const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarBienesServicios();
            });
        //listarPrograma();
    });
    $("#btnBuscar").click(function () {
        listarBienesServicios();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevoBienesServicios();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function listarBienesServicios() {
    getBienesServicios()
}
function getBienesServicios() {
    let request =
        {
            anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
                ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
                : 0,

        codigoBien: ($("#txtCodigoBieneFiltro").val() && $("#txtCodigoBieneFiltro").val().trim() !== "")
            ? $("#txtCodigoBieneFiltro").val().trim()
                : null,
                
            tipoItems: ($("#txtTipoBieneFiltro").val() && $("#txtTipoBieneFiltro").val().trim() !== "")
                ? $("#txtTipoBieneFiltro").val().trim()
                : null,

            nombreBien: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
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
    
    $("#grid").DataTable().clear();
    console.log("request", request)

    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceBienesServicios.getBienesServiciosPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getBienesServicios', error));

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
        autoWidth: false,
        scrollX: false,
        columns: [
            {
                data: 'idBienesServicios',
                width: '5%',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio', width: '5%' },
            { data: 'codigoBien', width: '10%' },
            { data: 'nombreBien', width: '15%' },
            { data: 'tipoItems', width: '10%' },
            { data: 'descripcionUinidadMedida', width: '10%' },

            {
                data: 'precio',
                width: '8%',
                render: function (data) {
                    return parseFloat(data).toLocaleString('es-PE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                },
                createdCell: function (td) {
                    $(td).css('text-align', 'right');
                }
            },

            {
                data: 'clasificadorGasto', width: '10%', 
                createdCell: function (td) {
                    $(td).css('text-align', 'center');
                }
            },
            { data: 'descripcionClasificador', width: '15%' },

            { data: 'estadoDescripcion', width: '8%' },

            {
                data: 'activo',
                width: '6%',
                render: function (data, type, row) {
                    return data == 1 ? 'ACTIVO' : 'INACTIVO';
                }
            },
            {
                data: 'idBienesServicios',
                width: '8%',
                orderable: false,
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

function editBienesServicios(request) {
    limpiarModal();

    serviceBienesServicios.getBienesServiciosPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idBienesServicios);
                $("#txtCodigoDeBien").val(response.codigoBien);
                $("#txtDescripcion").val(response.nombreBien);
                $("#txtTipodeItem").val(response.tipoItems);

                var idAnio = response.idAnio
                let request = { idAnio: idAnio };
                
                fillSelectUnidadMedida("cboUnidadMedida", request, response.idUnidadMedida, "SELECCIONE", (termino) => { });
                //$("#txtUnidadMedida").val(response.idUnidadMedida);

                $("#txtPrecio").val(response.precio);

                fillSelectClasificadorDelGasto("cboClasificador", request, response.idClasificador, "SELECCIONE", (termino) => { });

                //$("#txtClasificador").val(response.clasificadorGasto);
                //$("#txtDenominacionClasificador").val(response.descripcionClasificador);

                $("#txtEstado").val(response.estadoDescripcion);
                $("#cboActivo").val(response.activo);
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editBienesServicios', error);
        });
}
function updBienesServicios(datos) {

    console.log("llega datos", datos);

    serviceBienesServicios.updBienesServicios(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getBienesServicios();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updBienesServicios', error);
        });
}
function insBienesServicios(datos) {

    serviceBienesServicios.insBienesServicios(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getBienesServicios();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insBienesServicios', error);
        });
}

function delBienesServicios(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR BIENES Y SERVICIOS?", "question", (result) => {
        if (result.isConfirmed) {
            serviceBienesServicios.delBienesServicios(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getBienesServicios();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delBienesServicios', error);
                });
        }
    });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());

    var codigoBien = $("#txtCodigoDeBien").val();
    var nombreBien = $("#txtDescripcion").val();
    var tipoItems = $("#txtTipodeItem").val();

    var idUnidadMedida = parseInt($("#cboUnidadMedida").val());
    //var uinidadMedida = $("#txtUnidadMedida").val();
    console.log(idUnidadMedida)

    var precio = $("#txtPrecio").val();

    var idClasificador = parseInt($("#cboClasificador").val());
    //var clasificadorGasto = $("#txtClasificador").val();
    //var denominacionEegg = $("#txtDenominacionClasificador").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    if (flag == 1) {
        let datos = {
            idBienesServicios: codigo,
            idAnio: idAnio,

            codigoBien: codigoBien,
            nombreBien: nombreBien,
            tipoItems: tipoItems, 

            idUnidadMedida: idUnidadMedida,
            //uinidadMedida: uinidadMedida,
            precio: precio,

            idClasificador: idClasificador,
            //clasificadorGasto: clasificadorGasto,
            //denominacionEegg: denominacionEegg,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        
        updBienesServicios(datos);
    } else {
        let datos = {
            //idBienesServicios: codigo,
            idAnio: idAnio,

            codigoBien: codigoBien,
            nombreBien: nombreBien,
            tipoItems: tipoItems,

            idUnidadMedida: idUnidadMedida,
            //uinidadMedida: uinidadMedida,

            precio: precio,

            idClasificador: idClasificador,
            //clasificadorGasto: clasificadorGasto,
            //denominacionEegg: denominacionEegg,

            idEstado: idEstado
        };
        
        insBienesServicios(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idBienesServicios: codigo
    };
    delBienesServicios(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Bienes y Servicios");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idBienesServicios: id
    }

    editBienesServicios(request);
}

function nuevoBienesServicios() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Bienes y Servicios");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtBienesServicios").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtBienesServiciosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

