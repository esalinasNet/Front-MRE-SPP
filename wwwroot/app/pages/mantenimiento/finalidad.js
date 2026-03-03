const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarFinalidad();
            });
        //listarFinalidad();
    });
    $("#btnBuscar").click(function () {
        listarFinalidad();
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

    var grupo = document.getElementById("txtFinalidad");
    grupo.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });

});

function listarFinalidad() {
    getFinalidad()
}
function getFinalidad() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        finalidad: ($("#txtFinalidadFiltro").val() && $("#txtFinalidadFiltro").val().trim() !== "")
            ? $("#txtFinalidadFiltro").val().trim()
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
    /*serviceFinalidad.getFinalidadPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getFinalidad', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceFinalidad.getFinalidadPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getFinalidad', error));

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
                data: 'idFinalidad',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'finalidad' },
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
                data: 'idFinalidad',
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

function editFinalidad(request) {
    limpiarModal();

    serviceFinalidad.getFinalidadPorId(request, headersuarm)
        .then(response => {
            //console.log("response", response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idFinalidad);

                $("#txtFinalidad").val(response.finalidad);
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
            msgException('editFinalidad', error);
        });
}
function updFinalidad(datos) {

    //console.log("llega datos", datos);

    serviceFinalidad.updFinalidad(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFinalidad();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updFinalidad', error);
        });
}
function insFinalidad(datos) {

    serviceFinalidad.insFinalidad(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFinalidad();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insFinalidad', error);
        });
}

function delFinalidad(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE LA DIVISION FUNCIONAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceFinalidad.delFinalidad(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getFinalidad();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delFinalidad', error);
                });
        }
    });
}

function grabar() {

    var idFinalidad = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    var finalidad = $("#txtFinalidad").val();
    var descripcion = $("#txtDescripcion").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idFinalidad: idFinalidad,
            idAnio: idAnio,
            anio: anio,
            finalidad: finalidad,
            descripcion: descripcion,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updFinalidad(datos);
    } else {
        let datos = {
            //idFinalidad: codigo,
            idAnio: idAnio,
            anio: anio,
            finalidad: finalidad,
            descripcion: descripcion,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insFinalidad(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idFinalidad: codigo
    };
    delFinalidad(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Finalidad Presupuestal");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idFinalidad = $(control).data('input');

    let request =
    {
        idFinalidad: idFinalidad
    }

    editFinalidad(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Finalidad Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtFinalidad").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtFinalidadFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

