const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarFasesPoi();
            });
        //listarFasesPoi();
    });
    $("#btnBuscar").click(function () {
        listarFasesPoi();
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

function listarFasesPoi() {
    getFasesPoi()
}
function getFasesPoi() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoFasesPoi: ($("#txtFasesPoiFiltro").val() && $("#txtFasesPoiFiltro").val().trim() !== "")
            ? $("#txtFasesPoiFiltro").val().trim()
            : null,

        descripcionFasesPoi: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
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
    /*serviceFasesPoi.getFasesPoiPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getFasesPoi', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceFasesPoi.getFasesPoiPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getFasesPoi', error));

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
                data: 'idFasesPoi',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            { data: 'codigoFases' },
            { data: 'descripcionFases' },

            { data: 'anioInicial' },
            { data: 'anioFinal' },

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
                data: 'idFasesPoi',
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

function editFasesPoi(request) {
    limpiarModal();

    serviceFasesPoi.getFasesPoiPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idFasesPoi);

                $("#txtFases").val(response.codigoFases);
                $("#txtDescripcionFases").val(response.descripcionFases);

                $("#txtAnioInicial").val(response.anioInicial);
                $("#txtAnioFinal").val(response.anioFinal);

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editFasesPoi', error);
        });
}
function updFasesPoi(datos) {

    //console.log("llega datos", datos);

    serviceFasesPoi.updFasesPoi(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFasesPoi();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updFasesPoi', error);
        });
}
function insFasesPoi(datos) {

    serviceFasesPoi.insFasesPoi(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFasesPoi();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insFasesPoi', error);
        });
}

function delFasesPoi(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE FasesPoi?", "question", (result) => {
        if (result.isConfirmed) {
            serviceFasesPoi.delFasesPoi(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getFasesPoi();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delFasesPoi', error);
                });
        }
    });
}


function grabar() {

    var idFasesPoi = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    //console.log("idAnio:", idAnio, "anio:", anio);

    var codigoFases = $("#txtFases").val();
    var descripcionFases = $("#txtDescripcionFases").val();

    var anioInicial = $("#txtAnioInicial").val();
    var anioFinal = $("#txtAnioFinal").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idFasesPoi: idFasesPoi,
            idAnio: idAnio,

            codigoFases: codigoFases,
            descripcionFases: descripcionFases,

            anioInicial: anioInicial,
            anioFinal: anioFinal,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updFasesPoi(datos);
    } else {
        let datos = {
            //idFasesPoi: codigo,
            idAnio: idAnio,
            anio: anio,
            codigoFases: codigoFases,
            descripcionFases: descripcionFases,

            anioInicial: anioInicial,
            anioFinal: anioFinal,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insFasesPoi(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idFasesPoi: codigo
    };
    delFasesPoi(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar PESEM - Fases POI");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idFasesPoi = $(control).data('input');

    let request =
    {
        idFasesPoi: idFasesPoi
    }

    editFasesPoi(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nueva Fases POI");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtFases").val("");
    $("#txtDescripcionFases").val("");

    $("#txtAnioInicial").val("");
    $("#txtAnioFinal").val("");

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtFasesFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

