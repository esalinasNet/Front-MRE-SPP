const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarObjetivos();
            });
        //listarObjetivos();
    });
    $("#btnBuscar").click(function () {
        listarObjetivos();
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
            fillSelectObjetivoPrioritarios("cboPrioritario", request, 0, "SELECCIONE", (response) => { });
        }        
    });
});

function listarObjetivos() {
    getObjetivos()
}
function getObjetivos() {
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
    /*serviceObjetivos.getObjetivosPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getObjetivos', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceObjetivos.getObjetivosPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getObjetivos', error));

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

            { data: 'codigoPrioritarios' },
            { data: 'descripcionPrioritarios' },
            
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

function editObjetivos(request) {
    limpiarModal();

    serviceObjetivos.getObjetivosPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idObjetivos);

                var idAnio = response.idAnio
                let request =
                {
                    idAnio: idAnio
                };

                //console.log("response.idPoliticas", response.idPoliticas);
                fillSelectObjetivoPrioritarios("cboPrioritario", request, response.idPoliticas, "SELECCIONE", (termino) => { });

                $("#txtObjetivos").val(response.codigoObjetivos);
                $("#txtDescripcionObjetivos").val(response.descripcionObjetivos);
                                
                //$("#txtPrioritarios").val(response.codigoPrioritarios);
                $("#txtDescripcionPrioritarios").val(response.descripcionPrioritarios);
                
                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editObjetivos', error);
        });
}
function updObjetivos(datos) {

    //console.log("llega datos", datos);

    serviceObjetivos.updObjetivos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getObjetivos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updObjetivos', error);
        });
}
function insObjetivos(datos) {

    serviceObjetivos.insObjetivos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getObjetivos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insObjetivos', error);
        });
}

function delObjetivos(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE Objetivos?", "question", (result) => {
        if (result.isConfirmed) {
            serviceObjetivos.delObjetivos(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getObjetivos();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delObjetivos', error);
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

    var idPoliticas = parseInt($("#cboPrioritario").val());
    var codigoPrioritarios = $("#txtPrioritarios").val();        
    var descripcionPrioritarios =  $("#txtDescripcionPrioritarios").val();

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

            idPoliticas: idPoliticas,
            //codigoPrioritarios: codigoPrioritarios,
            //descripcionPrioritarios: descripcionPrioritarios,
            
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updObjetivos(datos);
    } else {
        let datos = {
            //idObjetivos: codigo,
            idAnio: idAnio,
            anio: anio,
            codigoObjetivos: codigoObjetivos,
            descripcionObjetivos: descripcionObjetivos,

            idPoliticas: idPoliticas,
            //codigoPrioritarios: codigoPrioritarios,
            //descripcionPrioritarios: descripcionPrioritarios,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insObjetivos(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idObjetivos: codigo
    };
    delObjetivos(datos);
}

function editar(control) {
    limpiarModal();
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Objetivo Estratégico Sectorial");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idObjetivos = $(control).data('input');

    let request =
    {
        idObjetivos: idObjetivos
    }

    editObjetivos(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Objetivo Estratégico Sectorial");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
    fillSelectObjetivoPrioritarios("cboPrioritario", 0, 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtObjetivos").val("");
    $("#txtDescripcionObjetivos").val("");

    //$("#txtPrioritarios").val("");
    $("#txtDescripcionPrioritarios").val("");
    
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtObjetivosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

