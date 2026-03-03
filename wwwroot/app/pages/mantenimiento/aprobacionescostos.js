const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
var idANIOPERIODO = 0;
var idAPROBACIONES = 0;
var idAPROBACIONESDETALLE = 0;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarAprobacionesCostos();
            });
        //listarAprobacionesCostos();
    });
    $("#btnBuscar").click(function () {
        listarAprobacionesCostos();
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
    $("#btnNuevoConcepto").click(function () {
        nuevoConcepto();
    });
    $("#btnGrabarConcepto").click(function () {
        grabarConcepto();
    });
    $("#btnCerrarConcepto").click(function () {
        $("#modalConceptos").modal("hide");
    });
    $("#btnCerrarDetalle").click(function () {
        $("#modalCostosDetalle").modal("hide");
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

        fillSelectCentroCostos("cboCentroCostos", request, 0, "SELECCIONE", (response) => { });
                
    });

});

function listarAprobacionesCostos() {
    getAprobacionesCostos()
}
function getAprobacionesCostos() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        centroCostos: ($("#txtCentroCostosFiltro").val() && $("#txtCentroCostosFiltro").val().trim() !== "")
            ? $("#txtCentroCostosFiltro").val().trim()
            : null,

        descripcionCostos: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        //codigoPrioritarios: ($("#txtPrioritariosFiltro").val() && $("#txtPrioritariosFiltro").val().trim() !== "")
        //    ? $("#txtPrioritariosFiltro").val().trim()
        //    : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val().trim() !== "")
            ? $("#txtEstadoFiltro").val().trim()
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
    /*serviceAprobacionesCostos.getAprobacionesCostosPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getAprobacionesCostos', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceAprobacionesCostos.getAprobacionesCostosPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getAprobacionesCostos', error));

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
                data: 'idAprobaciones',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            //{ data: 'codigoProgramacion' },

            { data: 'centroCostos' },
            { data: 'descripcionCentroCostos' },

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
                data: 'idAprobaciones',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="detalle(this)" data-input="' + data + '" class="btn btn-sm btn-outline-success" title="Conceptos"><i class="bi-list-check"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });
}

function editAprobacionesCostos(request) {
    limpiarModal();

    serviceAprobacionesCostos.getAprobacionesCostosPorId(request, headersuarm)
        .then(response => {
            console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idAprobaciones);

                var idAnio = response.idAnio
                let request =
                {
                    idAnio: idAnio
                };

                $("#hidProgramacionActividad").val(response.idProgramacionActividad);

                $("#txtcodigoProgramacion").val(response.codigoProgramacion);

                //console.log("response.idPoliticas", response.idPoliticas);                
                fillSelectCentroCostos("cboCentroCostos", request, response.idCentroCostos, "SELECCIONE", (response) => { });

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editAprobacionesCostos', error);
        });
}
function updAprobacionesCostos(datos) {

    //console.log("llega datos", datos);

    serviceAprobacionesCostos.updAprobacionesCostos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getAprobacionesCostos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updAprobacionesCostos', error);
        });
}
function insAprobacionesCostos(datos) {

    serviceAprobacionesCostos.insAprobacionesCostos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getAprobacionesCostos();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insAprobacionesCostos', error);
        });
}

function delAprobacionesCostos(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE AprobacionesCostos?", "question", (result) => {
        if (result.isConfirmed) {
            serviceAprobacionesCostos.delAprobacionesCostos(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getAprobacionesCostos();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delAprobacionesCostos', error);
                });
        }
    });
}


function grabar() {

    var idAprobaciones = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    var idProgramacionActividad = $("#hidProgramacionActividad").val();
    var idCentroCostos = parseInt($("#cboCentroCostos").val());
    
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idAprobaciones: idAprobaciones,
            idAnio: idAnio,

            idProgramacionActividad: idProgramacionActividad,
            idCentroCostos: idCentroCostos,
            
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updAprobacionesCostos(datos);
    } else {
        let datos = {
            //idAprobaciones: codigo,
            idAnio: idAnio,
            anio: anio,            

            idProgramacionActividad: 0,
            idCentroCostos: idCentroCostos,            

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insAprobacionesCostos(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idAprobaciones: codigo
    };
    delAprobacionesCostos(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Registro de Aprobaciones");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idAprobaciones = $(control).data('input');

    let request =
    {
        idAprobaciones: idAprobaciones
    }

    editAprobacionesCostos(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Aprobaciones");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());
    let request = { idAnio: idAnio }
    
    console.log("año", idAnio);
    fillSelectCentroCostos("cboCentroCostos", request, 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
        
    $("#cboCentroCostos").val('');

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtCentroCostosFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });

    listarAprobacionesCostos();
}

function detalle(control) {

    $("#modalCostosDetalle").modal("show");

    var idAprobaciones = $(control).data('input');
    idAPROBACIONES = idAprobaciones;

    console.log("idAprobaciones", idAprobaciones);

    let request =
    {
        idAprobaciones: idAprobaciones
    }

    CabeceraAprobaciones(request)
    getAprobacionesCostosDetalle(idAprobaciones);
}

function CabeceraAprobaciones(request) {

    /*var idAprobaciones = idAprobaciones
    let request =
    {
        idAprobaciones: idAprobaciones
    }*/

    serviceAprobacionesCostos.getAprobacionesCostosPorId(request, headersuarm)
        .then(response => {

            console.log("editar", response);
            idANIOPERIODO = response.idAnio;

            $("#txtAnioCabecera").val(response.anio);
            $("#txtcodigoProgramacionCabecera").val(response.codigoProgramacion);
            $("#txtCentroCostosCabecera").val(response.centroCostos);
            $("#txtDescripcionCentroCostos").val(response.descripcionCentroCostos);
                        
            $("#txtEstadoCabecera").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "SÍ";
            if (activo === false) activo = "NO";
            $("#txtActivoCabecera").val(String(activo));

        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}

function getAprobacionesCostosDetalle(idAprobaciones) {

    var idAprobaciones = idAprobaciones;   // $(control).data('input');

    let request =
    {
        idAprobaciones: idAprobaciones,
        activo: true,
        paginaActual: 0,
        tamanioPagina: 0
    }
    console.log("request", request);

    $("#gridDetalle").DataTable().clear();
    $('#gridDetalle').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceAprobacionesCostos.getAprobacionesCostosDetallePaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)

                    console.log("detalle", response);

                }).catch(error => msgException('getDetalle', error));

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
                data: 'idAprobacionesDetalle',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'nombresApellidos' }, 
            //{ data: 'centroCostos' },
            //{ data: 'descripcionCentroCostos' },
            { data: 'puestoTrabajo' },
            {
                data: 'fechaInicio',
                render: function (data, type, row) {
                    if (!data) return "";
                    let fecha = new Date(data);

                    if (fecha.getFullYear() <= 1900) return "";

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

                    if (fecha.getFullYear() <= 1900) return "";

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
                data: 'idAprobacionesDetalle',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editarconcepto(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminarconcepto(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ],
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true
    });    
}

function nuevoConcepto() {

    $("#modalConceptos").modal("show");
    $("#mdlTitleConceptos").text("Registrar Nuevo Centro de Costos");
    $("#flagEditConceptos").val(0);

    $("#txtIdAprobacionesCostosDetalle").val('');
    $("#txtIdAprobacionesCostos").val(idAPROBACIONES);

    $("#txtPuestoTrabajo").val('');

    $("#txtEstadoCostoDetalle").val("Emitido");
    $("#txtEstadoCostoDetalle").prop("disabled", true);
    $("#cboActivoConcepto").val(1);
    var idAnio = idANIOPERIODO
    let request =
    {
        idAnio: idAnio
    };

    //$("#txtDescripciónEspecifica").val('');
    fillSelectPersonas("cboPersonas", 0, "SELECCIONE", (response) => { });
    //fillSelectCentroCostos("cboCentroCostosDetalle", request, 0, "SELECCIONE", (response) => { });

}

function editarconcepto(control) {

    $("#modalConceptos").modal("show");
    $("#mdlTitleConceptos").text("Edita Centro de Costos");
    $("#flagEditConceptos").val(1);
    $("#txtEstadoCostoDetalle").prop("disabled", true);
    $("#cboActivoConcepto").prop("disabled", true);

    var idAprobacionesDetalle = $(control).data('input');
    idPLANILLADETALLE = idAprobacionesDetalle

    let request =
    {
        idAprobacionesDetalle: idAprobacionesDetalle
    }

    editarConceptoResgistro(request);
}

function eliminarconcepto(control) {

    var idAprobacionesDetalle = $(control).data('input');

    let request =
    {
        idAprobacionesDetalle: idAprobacionesDetalle
    }

    delConceptoRegistro(request);
}

function editarConceptoResgistro(request) {
    //limpiarModal();

    serviceAprobacionesCostos.getAprobacionesCostosDetallePorId(request, headersuarm)
        .then(response => {

            console.log("editar", response);

            var idAnio = idANIOPERIODO;
            let request =
            {
                idAnio: idAnio
            };

            $("#hidconceptos").val(response.idAprobacionesDetalle);
            $("#txtIdAprobacionesCostosDetalle").val(response.idAprobacionesDetalle);
            $("#txtIdAprobacionesCostos").val(response.idAprobaciones);            

            fillSelectPersonas("cboPersonas", response.idPersona, "SELECCIONE", (termino) => { });
            //fillSelectCentroCostos("cboCentroCostosDetalle", request, response.idCentroCostos, "SELECCIONE", (termino) => { });

            $("#txtPuestoTrabajo").val(response.puestoTrabajo);

            /*if (response.fechaInicio) {
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
            }*/

            $("#txtEstadoCostoDetalle").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "1";
            if (activo === false) activo = "0";

            $("#cboActivoConcepto").val(String(activo));
            ESTADO = response.estado;

        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}

function grabarConcepto() {

    var idAprobaciones = parseInt($("#txtIdAprobacionesCostos").val())
    var idAprobacionesDetalle = parseInt($("#txtIdAprobacionesCostosDetalle").val())

    var idPersona = parseInt($("#cboPersonas").val());

    //var idCentroCostos = parseInt($("#cboCentroCostosDetalle").val());

    var puestoTrabajo = $("#txtPuestoTrabajo").val();

    /*const fechaInicioTexto = document.getElementById("txtFechaInicio").value;
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
    */

    var activo = parseInt($("#cboActivoConcepto").val());

    var flag = $("#flagEditConceptos").val();
    var idEstado = ESTADO; //2;

    console.log("idAprobaciones", idAprobaciones)

    if (flag == 1) {
        let datos = {

            idAprobacionesDetalle: idAprobacionesDetalle,
            idAprobaciones: idAprobaciones,
            idPersona: idPersona,
            //idCentroCostos: idCentroCostos,
            puestoTrabajo: puestoTrabajo,
            //fechaInicio: fechaInicio,
            //fechaFin: fechaFin,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        console.log("grabar", datos);
        updConceptos(datos);
    } else {
        let datos = {

            //idAprobacionesDetalle: idAprobacionesDetalle,
            idAprobaciones: idAprobaciones,
            idPersona: idPersona,
            //idCentroCostos: idCentroCostos,
            puestoTrabajo: puestoTrabajo,
            //fechaInicio: fechaInicio,
            //fechaFin: fechaFin,
            idEstado: idEstado,

        };
        console.log("nuevo", datos);
        insConceptos(datos);
    }

}

function insConceptos(datos) {

    serviceAprobacionesCostos.insAprobacionesCostosDetalle(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                getAprobacionesCostosDetalle(idAPROBACIONES);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalConceptos").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insConceptos', error);
        });
}

function updConceptos(datos) {

    //console.log("llega datos", datos);

    serviceAprobacionesCostos.updAprobacionesCostosDetalle(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                getAprobacionesCostosDetalle(idAPROBACIONES);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalConceptos").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updConceptos', error);
        });
}

function delConceptoRegistro(datos) {

    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {

            serviceAprobacionesCostos.delAprobacionesCostosDetalle(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        getAprobacionesCostosDetalle(idAPROBACIONES);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delConceptoRegistro', error);
                });
        }
    });
}
