const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(document).ready(function () {
    let hoy = new Date().toISOString().split("T")[0]; // yyyy-MM-dd
    $("#txtFechaInicio").val(hoy);
    $("#txtFechaFin").val(hoy);
});
$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                fillSelectCentroDeCostos("cboCentroCosto", 0, "SELECCIONE", (response) => { });
                listarCalendario();
            });
        //listarCalendario();
    });
    $("#btnBuscar").click(function () {
        listarCalendario();
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

function listarCalendario() {
    getCalendario()
}
function getCalendario() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        mesDescripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        centroCostos: ($("#txtCentroCostosFiltro").val() && $("#txtCentroCostosFiltro").val().trim() !== "")
            ? $("#txtCentroCostosFiltro").val().trim()
            : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val() !== "0")
            ? parseInt($("#txtEstadoFiltro").val())
            : null,
        paginaActual: 1,
        tamanioPagina: 10
    };
    console.log("request", request)

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
    /*serviceCalendario.getCalendarioPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getCalendario', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceCalendario.getCalendarioPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getCalendario', error));

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
                data: 'idPeriodo',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'mesDescripcion' },
            { data: 'centroCostos' },
            { data: 'dependencia' },
            {
                data: 'fechaInicio',
                render: function (data, type, row) {
                    if (!data) return "";
                    let fecha = new Date(data);
                    let dia = String(fecha.getDate()).padStart(2, '0');
                    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    let anio = fecha.getFullYear();
                    return `${dia}/${mes}/${anio}`;               
                }
            },
            {
                data: 'fechaFin',
                render: function (data, type, row) {
                    if (!data) return "";
                    let fecha = new Date(data);
                    let dia = String(fecha.getDate()).padStart(2, '0');
                    let mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    let anio = fecha.getFullYear();
                    return `${dia}/${mes}/${anio}`;
                }
            },

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
                data: 'idPeriodo',
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

function editCalendario(request) {
    limpiarModal();

    serviceCalendario.getCalendarioPorId(request, headersuarm)
        .then(response => {
            
            $("#hcodigo").val(response.idPeriodo);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => { });

            fillSelectCentroDeCostos("cboCentroCosto", response.idCentroCostos, "SELECCIONE", (response) => { });

            $("input[name='Meses'][value='" + response.idMes + "']").prop("checked", true);

            if (response.fechaInicio) {
                let fechaini = response.fechaInicio;
                if (fechaini.includes("/")) {
                    const partes = response.fechaInicio.split(" ")[0].split("/");
                    const fechaISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
                    fechaini = fechaISO;
                } else if (fechaini.includes("T")) {
                    fechaini = fechaini.split("T")[0];
                }
                $("#txtFechaInicio").val(fechaini);
            }
            if (response.fechaFin) {
                let fechafin = response.fechaFin;
                if (fechafin.includes("/")) {
                    const partes = response.fechaFin.split(" ")[0].split("/");
                    const fechaISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
                    fechafin = fechaISO;
                } else if (fechafin.includes("T")) {
                    fechafin = fechafin.split("T")[0];
                }
                $("#txtFechaFin").val(fechafin);                
            }
                
                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            //});
        })
        .catch(error => {
            msgException('editCalendario', error);
        });
}
function updCalendario(datos) {

    //console.log("llega datos", datos);

    serviceCalendario.updCalendario(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCalendario();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updCalendario', error);
        });
}
function insCalendario(datos) {

    serviceCalendario.insCalendario(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCalendario();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCalendario', error);
        });
}

function delCalendario(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE Calendario?", "question", (result) => {
        if (result.isConfirmed) {
            serviceCalendario.delCalendario(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getCalendario();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delCalendario', error);
                });
        }
    });
}


function grabar() {

    const fechaInicioTexto = document.getElementById("txtFechaInicio").value; 
    const fechaFinTexto = document.getElementById("txtFechaFin").value; 

    let fechaInicioISO = null;
    if (fechaInicioTexto) {
        fechaInicioISO = new Date(fechaInicioTexto + "T00:00:00").toISOString().split("Z")[0];
    }
    var fechaInicio = fechaInicioISO ? new Date(fechaInicioISO).toISOString().split("T")[0] : null; // yyyy-MM-dd

    let fechaFinISO = null;
    if (fechaFinTexto) {
        fechaFinISO = new Date(fechaFinTexto + "T00:00:00").toISOString().split("Z")[0];
    }
    var fechaFin = fechaFinISO ? new Date(fechaFinISO).toISOString().split("T")[0] : null; // yyyy-MM-dd               

    var idPeriodo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var idMes = $("input[name='Meses']:checked").val();
    var idCentroCostos = $("#cboCentroCosto").val();        
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("idCentroCostos", idCentroCostos);

    if (flag == 1) {
        let datos = {
            idPeriodo: idPeriodo,
            idAnio: idAnio,
            idMes: idMes,
            idCentroCostos: idCentroCostos,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updCalendario(datos);
    } else {
        let datos = {
            //idPeriodo: idPeriodo,
            idAnio: idAnio,
            idMes: idMes,
            idCentroCostos: idCentroCostos,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            idEstado: idEstado,
        };
        //console.log("nuevo", datos);
        insCalendario(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idCalendario: codigo
    };
    delCalendario(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Calendario Presupuestal");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idPeriodo = $(control).data('input');

    let request =
    {
        idPeriodo: idPeriodo
    }

    //console.log("envio request", request);
    editCalendario(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo Calendario Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
    fillSelectCentroDeCostos("cboCentroCosto", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtCalendario").val("");
    $("#txtDescripcion").val("");
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtCentroCostosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

