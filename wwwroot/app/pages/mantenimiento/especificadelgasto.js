const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarEspecificaGasto();
            });
        //listarEspecificaGasto();
    });
    $("#btnBuscar").click(function () {
        listarEspecificaGasto();
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

function listarEspecificaGasto() {
    getEspecificaGasto()
}
function getEspecificaGasto() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        clasificador: ($("#txtClasificadorFiltro").val() && $("#txtClasificadorFiltro").val().trim() !== "")
            ? $("#txtClasificadorFiltro").val().trim()
            : null,

        descripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        //descripcion_detallada: ($("#txtDescripcion_DetalladaFiltro").val() && $("#txtDescripcion_DetalladaFiltro").val() !== "0")
        //    ? parseInt($("#txtDescripcion_DetalladaFiltro").val())
        //    : null,
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
    /*serviceEspecificaGasto.getEspecificaGastoPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getEspecificaGasto', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceEspecificaGasto.getEspecificaGastoPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getEspecificaGasto', error));

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
                data: 'idClasificador',
                width: "20%",
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio', width: "20%", },
            { data: 'clasificador', width: "20%", },
            { data: 'descripcion', width: "120%", },
           // { data: 'descripcion_detallada', width: "120px", },
            { data: 'estadoDescripcion', width: "90%", },
            {
                data: 'activo',
                width: "80%",
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
                data: 'idClasificador',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                },
                width: "5%"
            }
        ]
    });


}

function insEspecificaGasto(datos) {

    serviceEspecificaGasto.insEspecificaGasto(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getEspecificaGasto();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insEspecificaGasto', error);
        });
}
function editEspecificaGasto(request) {
    limpiarModal();

    serviceEspecificaGasto.getEspecificaGastoPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idClasificador);
                $("#txtClasificador").val(response.clasificador);
                $("#txtDescripcion").val(response.descripcion);
                $("#txtDescripcion_Detallada").val(response.descripcion_detallada);
                $("#txtCategoria_Gasto").val(response.idCategoria_gasto);
                $("#txtTipo_Clasificador").val(response.tipo_clasificador);
                $("#txtEstado").val(response.estadoDescripcion);
                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editEspecificaGasto', error);
        });
}
function updEspecificaGasto(datos) {

    //console.log("llega datos", datos);

    serviceEspecificaGasto.updEspecificaGasto(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getEspecificaGasto();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updEspecificaGasto', error);
        });
}

function delEspecificaGasto(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE EspecificaGasto?", "question", (result) => {
        if (result.isConfirmed) {
            serviceEspecificaGasto.delEspecificaGasto(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getEspecificaGasto();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delEspecificaGasto', error);
                });
        }
    });
}

function grabar() {

    var idClasificador = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));     
    var idAnio = parseInt($("#cboAnio").val());
    var clasificador = $("#txtClasificador").val();
    var descripcion = $("#txtDescripcion").val();
    var descripcion_detallada = $("#txtDescripcion_Detallada").val();
    var idCategoria_gasto =  $("#txtCategoria_Gasto").val();
    var tipo_clasificador = $("#txtTipo_Clasificador").val();
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idClasificador: idClasificador,
            idAnio: idAnio,
            clasificador: clasificador,
            descripcion: descripcion,
            descripcion_detallada: descripcion_detallada,
            idCategoria_gasto: idCategoria_gasto,
            tipo_clasificador: tipo_clasificador,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updEspecificaGasto(datos);
    } else {
        let datos = {
            //idClasificador: codigo,
            idAnio: idAnio,
            clasificador: clasificador,
            descripcion: descripcion,
            descripcion_detallada: descripcion_detallada,            
            idCategoria_gasto: idCategoria_gasto,
            tipo_clasificador: tipo_clasificador,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insEspecificaGasto(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idClasificador: codigo
    };
    delEspecificaGasto(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Especifica Gasto");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idClasificador: id
    }

    editEspecificaGasto(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Especifica Gasto");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");        
    $("#txtClasificador").val("");
    $("#txtDescripcion").val("");
    $("#txtDescripcion").val("");
    $("#txtCategoria_Gasto").val("");
    $("#txtTipo_Clasificador").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtClasificadorFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
    getEspecificaGasto();
}

