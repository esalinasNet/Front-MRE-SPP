const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarObjetivosInstitucionales();
            });
        //listarObjetivosInstitucionales();
    });
    $("#btnBuscar").click(function () {
        listarObjetivosInstitucionales();
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

    var flag = $("#flagEdit").val();
    //Se toma el Año para los commbos
    var _anio = document.getElementById("cboAnio");
    _anio.addEventListener("change", function () {

        var idAnio = parseInt($("#cboAnio").val());
        let request =
        {
            idAnio: idAnio
        }

        if (flag == 0)  //nuevo
        {
            fillSelectAccionesInstitucionales("cboAcciones", request, 0, "SELECCIONE", (response) => { });
        }
    });
});

function listarObjetivosInstitucionales() {
    getObjetivosInstitucionales()
}
function getObjetivosInstitucionales() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoObjetivos: ($("#txtObjetivosFiltro").val() && $("#txtObjetivosFiltro").val().trim() !== "")
            ? $("#txtObjetivosFiltro").val().trim()
            : null,

        descripcionObjetivos: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
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
    /*serviceObjetivosInstitucionales.getObjetivosInstitucionalesPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getObjetivosInstitucionales', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceObjetivosInstitucionales.getObjetivosInstitucionalesPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getObjetivosInstitucionales', error));

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
                data: 'idObjetivos',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            { data: 'codigoObjetivos' },
            { data: 'descripcionObjetivos' },

            { data: 'codigoAcciones' },
            { data: 'descripcionAcciones' },

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
                data: 'idObjetivos',
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

function editObjetivosInstitucionales(request) {
    limpiarModal();

    serviceObjetivosInstitucionales.getObjetivosInstitucionalesPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idObjetivos);

                var idAnio = response.idAnio
                let request =
                {
                    idAnio: idAnio
                };

                fillSelectAccionesInstitucionales("cboAcciones", request, response.idAcciones, "SELECCIONE", (termino) => { });

                $("#txtObjetivos").val(response.codigoObjetivos);
                $("#txtDescripcionObjetivos").val(response.descripcionObjetivos);

                //$("#txtAcciones").val(response.codigoAcciones);
                $("#txtDescripcionAcciones").val(response.descripcionAcciones);

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editObjetivosInstitucionales', error);
        });
}
function updObjetivosInstitucionales(datos) {

    //console.log("llega datos", datos);

    serviceObjetivosInstitucionales.updObjetivosInstitucionales(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getObjetivosInstitucionales();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updObjetivosInstitucionales', error);
        });
}
function insObjetivosInstitucionales(datos) {

    serviceObjetivosInstitucionales.insObjetivosInstitucionales(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getObjetivosInstitucionales();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insObjetivosInstitucionales', error);
        });
}

function delObjetivosInstitucionales(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE ObjetivosInstitucionales?", "question", (result) => {
        if (result.isConfirmed) {
            serviceObjetivosInstitucionales.delObjetivosInstitucionales(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getObjetivosInstitucionales();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delObjetivosInstitucionales', error);
                });
        }
    });
}


function grabar() {

    var idObjetivos = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    console.log("idAnio:", idAnio, "anio:", anio);

    var codigoObjetivos = $("#txtObjetivos").val();
    var descripcionObjetivos = $("#txtDescripcionObjetivos").val();

    var idAcciones = parseInt($("#cboAcciones").val());
    var codigoAcciones = $("#txtAcciones").val();
    var descripcionAcciones = $("#txtDescripcionAcciones").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idObjetivos: idObjetivos,
            idAnio: idAnio,

            codigoObjetivos: codigoObjetivos,
            descripcionObjetivos: descripcionObjetivos,

            idAcciones: idAcciones,
            //codigoAcciones: codigoAcciones,
            //descripcionAcciones: descripcionAcciones,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updObjetivosInstitucionales(datos);
    } else {
        let datos = {
            //idObjetivosInstitucionales: codigo,
            idAnio: idAnio,
            anio: anio,
            codigoObjetivos: codigoObjetivos,
            descripcionObjetivos: descripcionObjetivos,

            idAcciones: idAcciones,
            //codigoAcciones: codigoAcciones,
            //descripcionAcciones: descripcionAcciones,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insObjetivosInstitucionales(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idObjetivos: codigo
    };
    delObjetivosInstitucionales(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Objetivo Institucional");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idObjetivos = $(control).data('input');

    let request =
    {
        idObjetivos: idObjetivos
    }
    //console.log("idObjetivos", idObjetivos);
    editObjetivosInstitucionales(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo Objetivo Institucional");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
    fillSelectAccionesInstitucionales("cboAcciones", 0, 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtObjetivos").val("");
    $("#txtDescripcionObjetivos").val("");

    //$("#txtAcciones").val("");
    $("#txtDescripcionAcciones").val("");

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtObjetivosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

