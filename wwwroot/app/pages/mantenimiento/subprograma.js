const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarSubPrograma();
            });
        //listarPrograma();
    });
    $("#btnBuscar").click(function () {
        listarSubPrograma();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevoSubPrograma();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function listarSubPrograma() {
    getSubPrograma()
}
function getSubPrograma() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        subprograma: ($("#txtSubProgramaFiltro").val() && $("#txtSubProgramaFiltro").val().trim() !== "")
            ? $("#txtSubProgramaFiltro").val().trim()
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

            serviceSubPrograma.getSubProgramaPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getSubPrograma', error));

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
                data: 'idSubPrograma',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'subprograma' },
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
                data: 'idSubPrograma',
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

function editSubPrograma(request) {
    limpiarModal();

    serviceSubPrograma.getSubProgramaPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idSubPrograma);
                $("#txtSubPrograma").val(response.subprograma);
                $("#txtDescripcion").val(response.descripcion);
                $("#txtEstado").val(response.estadoDescripcion);
                $("#cboActivo").val(response.activo);
                ESTADO = response.estado;                
            });            
        })
        .catch(error => {
            msgException('editSubPrograma', error);
        });
}
function updSubPrograma(datos) {

    //console.log("llega datos", datos);

    serviceSubPrograma.updSubPrograma(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getSubPrograma();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updSubPrograma', error);
        });
}
function insSubPrograma(datos) {

    serviceSubPrograma.insSubPrograma(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getSubPrograma();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insSubPrograma', error);
        });
}

function delSubPrograma(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL SUBPROGRAMA PRESUPUESTAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceSubPrograma.delSubPrograma(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getSubPrograma();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delSubPrograma', error);
                });
        }
    });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var subprograma = $("#txtSubPrograma").val();
    var descripcion = $("#txtDescripcion").val();
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idSubPrograma: codigo,
            idAnio: idAnio,
            subprograma: subprograma,
            descripcion: descripcion,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updSubPrograma(datos);
    } else {
        let datos = {
            //idSubPrograma: codigo,
            idAnio: idAnio,
            subprograma: subprograma,
            descripcion: descripcion,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insSubPrograma(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idSubPrograma: codigo
    };
    delSubPrograma(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar SubPrograma Presupuestal");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idSubPrograma: id
    }

    editSubPrograma(request);
}

function nuevoSubPrograma() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo SubPrograma Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtSubPrograma").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtSubProgramaFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

