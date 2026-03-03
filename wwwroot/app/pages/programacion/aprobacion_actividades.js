var ESTADO = 1;
var idANIOPERIODO = 0;
var idAPROBACIONES = 0;
var idAPROBACIONESDETALLE = 0;
var idPROGRAMACIONACTIVIDADES = 0;
var idANIO = 0;
var ANIO = 0;
var idCENTROCOSTOS = 0;
let seleccionados = new Set();

$(document).on('change', '#chkTodos', function () {

    const checked = $(this).prop('checked');

    $('.chkActividad').prop('checked', checked);

    if (checked) {
        // Agregar todos los visibles al Set
        $('.chkActividad').each(function () {
            seleccionados.add($(this).data('id'));
        });
    } else {
        // Quitar todos
        $('.chkActividad').each(function () {
            seleccionados.delete($(this).data('id'));
        });
    }
});

$(document).on('change', '.chkActividad', function () {

    const id = $(this).data('id');

    if ($(this).is(':checked')) {
        seleccionados.add(id);
    } else {
        seleccionados.delete(id);
        $('#chkTodos').prop('checked', false);
    }

});

$(function () {
    
    validarLogin((response) => {
        if (response) {

            Prueba()
            //listarAprobacionesCostos();
        }
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
    $("#btnGrabarObservacion").click(function () {
        grabarObservacion();
    });
    $("#btnCerrarConcepto").click(function () {
        $("#modalObservacion").modal("hide");
    });
    $("#btnAprobaciones").click(function () {        
        AprobacionDeActividades();
    });


    $('#gridActividades').on('change', '.chkFila', function () {

        let table = $('#gridActividades').DataTable();

        // ✔ Desmarcar todos los demás checkboxes
        $('.chkFila').not(this).prop('checked', false);

        // obtener la fila donde está el checkbox
        let fila = $(this).closest('tr');

        // obtener los datos de esa fila
        let datosFila = table.row(fila).data();

        // ✔ Si está marcado, guardamos, si no, limpiamos
        if ($(this).is(':checked')) {

            console.log("datosFila", datosFila);
            // variables que necesites
            let id = datosFila.idProgramacionActividad;
            let anio = datosFila.anio;
            let codigoProgramacion = datosFila.codigoProgramacion;
            let denominacion = datosFila.denominacion;

            console.log("ID:", id);
            console.log("Año:", anio);
            console.log("Código:", codigoProgramacion);
            console.log("Denominación:", denominacion);
            
            $("#txtAniosAprobacionesFiltro").val(anio);

            $("#txtActividadOperativaAprobacionesFiltro").val(codigoProgramacion);

            // si quieres guardar en variables globales:
            window.itemSeleccionado = datosFila;

        } else {
            // si se desmarca, limpiamos la variable
            window.itemSeleccionado = null;
        }
    });

    var _anio = document.getElementById("cboAnios");
        _anio.addEventListener("change", function () {

        var idAnio = parseInt($("#cboAnios").val());
        idANIO = idAnio;

        let request =
        {
            idAnio: idAnio
        }

        var anio = 990;
        $("#txtProgramacionFiltro").val();  // de la Actividad
        $("#txtIdCentroCostosFiltro").val();   //de la Actividad

        getProgramacionActividad(anio);  //llama a la Actividad

        fillSelectCentroCostosAprobaciones("cboCentroCostosResponsable", request, 0, "SELECCIONE", (response) => { });

    });

    var _CostosAprobacion = document.getElementById("cboCentroCostosResponsable");
    _CostosAprobacion.addEventListener("change", function () {

        var anio = parseInt($("#cboAnios option:selected").text());
        ANIO = anio;

        var idCentroCostos = parseInt($("#cboCentroCostosResponsable").val());
        idCENTROCOSTOS = idCentroCostos;

        var idAprobaciones = $(this).find(':selected').data('idaprobaciones');
        idAPROBACIONES = idAprobaciones;

        console.log("anio:", anio);
        console.log("idCentroCostos:", idCentroCostos);
        console.log("IdAprobaciones:", idAprobaciones);

        //var anio = 0;
        $("#txtProgramacionFiltro").val();
        $("#txtIdCentroCostosFiltro").val(idCentroCostos);   //de la Actividad

        //getProgramacionActividad(anio);  //llama a la Actividad

        getAprobacionProgramacionActividad(anio, idCentroCostos);
        

        //llamar al detalle del Maestro de Aprobaciones
        getAprobacionesCostosDetalle(idAprobaciones)

    });

});

function Prueba() {
    var _idAnio = 1; //parseInt($("#cboAnio").val());
    let request =
    {
        idAnio: _idAnio
    }
    //fillSelectCentroCostos("cboCentroCostosResponsable", request, 0, "SELECCIONE", (response) => { });
}


//para trer los datos de la Actividad Programada
function editarProgramacion_Actividad(oIdProgramacionActividad) {

    var idProgramacionActividad = oIdProgramacionActividad

    let request =
    {
        idProgramacionActividad: idProgramacionActividad
    }
    
    editProgramacionActividad(request);
}

function editProgramacionActividad(request) {

    console.log("editProgramacionActividad", request)

    serviceCombosAprobacion.getProgramacionActividadPorId(request, headersuarm)
        .then(response => {

            console.log("response en aprobaciones", response)  //de la Actividad
            idANIO = response.idAnio;
            idPROGRAMACIONACTIVIDADES = response.idProgramacionActividad;

            var anio = response.anio;
            $("#txtProgramacionFiltro").val(response.codigoProgramacion);

            $("#txtAniosAprobacionesFiltro").val(response.anio);

            $("#txtActividadOperativaAprobacionesFiltro").val(response.codigoProgramacion);
            $("#txtCodigoActividadOperativaDetalle").val(response.codigoProgramacion);

            getProgramacionActividad(anio);  //llama a la Actividad      

        })
        .catch(error => {
            msgException('editProgramacionActividad', error);
     });
}

/* Actividad Operativa */
function getAprobacionProgramacionActividad(anio, idCentroCostos) {

    //let idCentro = $("#txtIdCentroCostosFiltro").val()?.trim();

    let request =
    {
        anio: anio,
        codigoProgramacion: null,
        idCentroCostos: idCentroCostos,
        denominacion: null,
        descripcion: null,
        estadoDescripcion: null,
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

    $("#gridActividades").DataTable().clear();
    $('#gridActividades').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {
            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceProgramacionActividad.getProgramacionActividadPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getProgramacionActividad', error));

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
                data: null,
                orderable: false,
                className: "text-center",
                render: function (data, type, row, meta) {
                    const checked = seleccionados.has(row.idProgramacionActividad) ? 'checked' : '';
                    return `<input type="checkbox" class="chkActividad" data-id="${row.idProgramacionActividad}" ${checked}/>`;
                }
            },
            {
                data: 'idProgramacionActividad',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'codigoProgramacion' },
            { data: 'denominacion' },
            { data: 'unidadMedidaDescripcion' },

            { data: 'metaFisica' },
            { data: 'metaFinanciera' },
                      

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
                data: 'idProgramacionActividad',
                render: function (data, type, row) {
                    //var resultado = '';
                    //resultado += '<button onclick = "editarObservacion(this)" data - id="${row.idProgramacionActividad}" data - anio="${row.anio}" data - codigo="${row.codigoProgramacion}" class="btn btn-sm btn-outline-dark"> <i class="bi-check-circle"></i> </button > ';
                    
                    return `<button 
                                onclick="editarObservacion(this)" 
                                data-id="${row.idProgramacionActividad}"
                                data-anio="${row.anio}"
                                data-codigo="${row.codigoProgramacion}"
                                data-estado="${row.estadoDescripcion}"
                                class="btn btn-sm btn-outline-dark">
                                <i class="bi-check-circle"></i>
                            </button>`;
                }
            }
        ]
    });
}

/* Observaciones */
function editarObservacion(control) {

    $("#modalObservacion").modal("show");
    
    $("#flagEditObservacion").val(1);
    $("#txtEstadoObs").prop("disabled", true);
    $("#cboActivoObs").prop("disabled", true);

    $("#txtIdAprobacionObs").val(idAPROBACIONES);   //de la aprobación

    let idProgramacionActividad = $(control).data('id');
    let anio = $(control).data("anio");
    let codigoProgramacion = $(control).data("codigo");
    let estadoDescripcion = $(control).data("estado");

    console.log("ID:", idProgramacionActividad);
    console.log("Año:", anio);
    console.log("Código:", codigoProgramacion);

    idPROGRAMACIONACTIVIDADES = idProgramacionActividad

    $("#txtCodigoActividadOperativaObs").val(codigoProgramacion);   //de la Actividad
    $("#txtEstadoObs").val(estadoDescripcion);   //de la Actividad

    let request =
    {
        anio: anio,
        codigoProgramacion: codigoProgramacion
    }

    editarActividadObservacion(request);
}

function editarActividadObservacion(request) {
    
    serviceProgramacionActividad.getProgramacionActividadCodigo(request, headersuarm)    
        .then(response => {

            console.log("editar en Observacion", response);

            var idAnio = idANIOPERIODO;

            let request =  { idAnio: idAnio };

            $("#hidProgramacionActividadObs").val(response.idProgramacionActividad);

            $("#txtObservacion").val(response.observacion);

            $("#txtEstadoObs").val(response.estadoDescripcion);

            ESTADO = response.estado;

        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}

$(document).on('change', '.chkActividad', function () {
    const id = $(this).data('id');
    if ($(this).is(':checked')) {
        seleccionados.add(id);
    } else {
        seleccionados.delete(id);
    }
    
});

function grabarObservacion() {

    let idProgramacionActividad = idPROGRAMACIONACTIVIDADES;
    let idAnio = idANIO;
    let codigoProgramacion = $("#txtCodigoActividadOperativaObs").val(); 
    let observacion = $("#txtObservacion").val();
    let idEstado = 5;

    var flag = $("#flagEditObservacion").val();

    if (flag == 1) {
        let datos = {

            idProgramacionActividad: idProgramacionActividad,
            idAnio: idAnio,
            codigoProgramacion: codigoProgramacion,
            observacion: observacion,

            idEstado: idEstado,

        };
        console.log("grabar", datos);
        updObservaciones(datos);
    } else {
        let datos = {

            idEstado: idEstado,

        };        
        //insConceptos(datos);
    }
}

function updObservaciones(datos) {

    console.log("llega datos", ANIO, idCENTROCOSTOS);

    serviceProgramacionActividad.updProgramacionActividadObservado(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                                
                getAprobacionProgramacionActividad(ANIO, idCENTROCOSTOS);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalObservacion").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updConceptos', error);
        });
}
/* End Observaciones */

/* Aprobaciones  */
function AprobacionDeActividades() {

    // 1 Validar que el header esté marcado
    if (!$('#chkTodos').is(':checked')) {
        alertify.success(tituloAlert.seguridad, 'Debe marcar el check "Todos" para realizar la aprobación.', () => { });
        return;
    }

    // 2 Validar que exista al menos un registro seleccionado
    if (seleccionados.size === 0) {
        alertify.success(tituloAlert.seguridad, 'Debe seleccionar todos los registro para aprobar.', () => { });
        return;
    }

    // ✔ Todo OK → continuar
    const idsSeleccionados = Array.from(seleccionados);

    console.log("IDs a aprobar:", idsSeleccionados);

    AprobarMasivoActividades(); // idsSeleccionados);
}

function AprobarMasivoActividades() {

    let _Anio = ANIO;
    let _IdCentroCostos = idCENTROCOSTOS;

    let request =
    {
        anio: _Anio,
        idCentroCostos: _IdCentroCostos

    }

    serviceProgramacionActividad.getProgramacionActividadCentroCostos(request, headersuarm)
        .then(response => {

            console.log("Kresponse en aprobaciones", response)  

            const registros = response; // cambia a response.data si fuera necesario

            const todosEstado2 = registros.every(item => item.idEstado === 2);

            if (!todosEstado2) {

                alertify.success(tituloAlert.seguridad, 'Todos los registros deben tener Estado "Emitido".', () => { });
                return;
            }

            //alert("Aprobación exitosa");            
            let idAnio = idANIO;
            let idCentroCostos = idCENTROCOSTOS;
            let oIdEstado = 4;

            console.log("datos response ", idAnio, idCentroCostos)  

            let datos = {

                idAnio: idAnio,                
                idCentroCostos: idCentroCostos,                
                idEstado: oIdEstado,

            };
            updAprobaciones(datos)

        })
        .catch(error => {
            msgException('AprobarActividades', error);
        });
}

function updAprobaciones(datos) {

    console.log("llega datos", ANIO, idCENTROCOSTOS, datos);

    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE APROBAR LAS ACTIVIDADES?", "question", (result) => {

        serviceProgramacionActividad.updProgramacionActividadAprobaciones(datos, headersuarm)
            .then(response => {
                if (response.result > 0) {

                    getAprobacionProgramacionActividad(ANIO, idCENTROCOSTOS);

                    alertify.success(tituloAlert.seguridad, response.message, () => { });

                    $("#modalObservacion").modal("hide");

                } else {
                    alertify.error(tituloAlert.seguridad, response.message, () => { });
                }
            })
            .catch(error => {
                msgException('updConceptos', error);
        });

    });    
}

/* End Aprobaciones  */


/* Aprobaciones detalle */
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

    $("#gridAprobaciones").DataTable().clear();
    $('#gridAprobaciones').DataTable({
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

                    //  Validar año inválido
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
                    resultado += '<button onclick="editarconcepto(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-check-circle"></i></button> ';
                    //resultado += '<button onclick="eliminarconcepto(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger"><i class="bi-trash"></i></button> ';
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

function editarconcepto(control) {

    $("#modalConceptos").modal("show");
    $("#mdlTitleConceptos").text("Edita Centro de Costos");
    $("#flagEditConceptos").val(1);
    $("#txtEstadoCostoDetalle").prop("disabled", true);
    $("#cboActivoConcepto").prop("disabled", true);

    var idAprobacionesDetalle = $(control).data('input');
    idAPROBACIONESDETALLE = idAprobacionesDetalle

    let request =
    {
        idAprobacionesDetalle: idAprobacionesDetalle
    }

    editarConceptoResgistro(request);
}

function editarConceptoResgistro(request) {
    //limpiarModal();

    serviceAprobacionesCostos.getAprobacionesCostosDetallePorId(request, headersuarm)
        .then(response => {

            console.log("editar en aprobaciones", response);

            var idAnio = idANIOPERIODO;
            let request =
            {
                idAnio: idAnio
            };

            $("#hidconceptos").val(response.idAprobacionesDetalle);
            $("#txtIdAprobacionDetalle").val(response.idAprobacionesDetalle);

            //$("#txtIdAprobacionesCostos").val(response.idAprobaciones);

            $("#txtPersonaDetalle").val(response.nombresApellidos);

            $("#txtPuestoTrabajoDetalle").val(response.puestoTrabajo);

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

            setFechaInput("#txtFechaInicio", response.fechaInicio);
            setFechaInput("#txtFechaFin", response.fechaFin);

            $("#txtEstadoDetalle").val(response.estadoDescripcion);

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

function setFechaInput(selector, fecha) {

    let hoy = new Date().toISOString().split("T")[0];

    if (!fecha) {
        $(selector).val(hoy);
        return;
    }

    let fechaObj = new Date(fecha);

    // 🔥 Si viene 0001-01-01 o algo menor a 1900
    if (fechaObj.getFullYear() <= 1900) {
        $(selector).val(hoy);
    } else {
        $(selector).val(fechaObj.toISOString().split("T")[0]);
    }
}

function grabarConcepto() {

    var idAprobacionesDetalle = parseInt($("#txtIdAprobacionDetalle").val())
        
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

    var flag = $("#flagEditConceptos").val();
    var idEstado = 4;

    if (flag == 1) {
        let datos = {

            idAprobacionesDetalle: idAprobacionesDetalle,
            
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            idEstado: idEstado,
            
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

function updConceptos(datos) {

    //console.log("llega datos", datos);

    serviceAprobacionesCostos.updAprobacionesCostosDetalleAprobado(datos, headersuarm)
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
