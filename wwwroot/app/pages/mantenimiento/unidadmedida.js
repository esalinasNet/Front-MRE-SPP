const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarUnidadMedida();
            });
        //listarUnidadMedida();
    });
    $("#btnBuscar").click(function () {
        listarUnidadMedida();
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

    var grupo = document.getElementById("txtUnidadMedida");
    grupo.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

});

function listarUnidadMedida() {
    getUnidadMedida()
}
function getUnidadMedida() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        funcion: ($("#txtUnidadMedidaFiltro").val() && $("#txtUnidadMedidaFiltro").val().trim() !== "")
            ? $("#txtUnidadMedidaFiltro").val().trim()
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
    /*serviceUnidadMedida.getUnidadMedidaPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getUnidadMedida', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceUnidadMedida.getUnidadMedidaPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getUnidadMedida', error));

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
                data: 'idUnidadMedida',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'unidadMedida' },
            { data: 'descripcion' },
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
                data: 'idUnidadMedida',
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

function editUnidadMedida(request) {
    limpiarModal();

    serviceUnidadMedida.getUnidadMedidaPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idUnidadMedida);

                $("#txtUnidadMedida").val(response.unidadMedida);
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
            msgException('editUnidadMedida', error);
        });
}
function updUnidadMedida(datos) {

    //console.log("llega datos", datos);

    serviceUnidadMedida.updUnidadMedida(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUnidadMedida();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updUnidadMedida', error);
        });
}
function insUnidadMedida(datos) {

    serviceUnidadMedida.insUnidadMedida(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUnidadMedida();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insUnidadMedida', error);
        });
}

function delUnidadMedida(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE LA DIVISION FUNCIONAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceUnidadMedida.delUnidadMedida(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getUnidadMedida();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delUnidadMedida', error);
                });
        }
    });
}

function grabar() {

    var idUnidadMedida = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    var unidadMedida = $("#txtUnidadMedida").val();
    var descripcion = $("#txtDescripcion").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idUnidadMedida: idUnidadMedida,
            idAnio: idAnio,
            anio: anio,
            unidadMedida: unidadMedida,
            descripcion: descripcion,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updUnidadMedida(datos);
    } else {
        let datos = {
            //idUnidadMedida: codigo,
            idAnio: idAnio,
            anio: anio,
            unidadMedida: unidadMedida,
            descripcion: descripcion,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insUnidadMedida(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idUnidadMedida: codigo
    };
    delUnidadMedida(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Unidad Medida");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idUnidadMedida: id
    }

    editUnidadMedida(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Unidad Medida");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtUnidadMedida").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtUnidadMedidaFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

