var ESTADO_RECURSO = 1;
var ANIO_RECURSO_SELECCIONADO = null;
var ACTIVIDAD_RECURSO_SELECCIONADA = null;
var TAREA_RECURSO_SELECCIONADA = null;

var IDPROGRAMACION_RECURSO = 0;
var CODIGOPROGRAMACION_RECURSO = "";
var IDTAREAS_RECURSO = 0;
var CODIGOTAREAS_RECURSO = "";

var DATOS_RECURSO_PRECARGADOS = null;


$(function () {

    $('#modalRecursos').on('hidden.bs.modal', function () {
        $(this).find('.btn-close-recursos').blur();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
    });

    $('#tab-recursos').on('click', function () {
        setTimeout(function () {
            inicializarTabRecursos();
        }, 300);
    });

    $("#btnGrabarRecursos").click(function () {
        grabarRecursos();
    });

    $("#btnCerrarRecursos").click(function () {
        $("#modalRecursos").modal("hide");
    });

    $("#btnAgregarRecurso").click(function () {
        nuevoRecurso();
    });

    $("#cboUbigeoRecurso").change(function () {
        var tipo = $(this).val();
        $(".btn-gasto").removeClass("active");
        $(".btn-gasto i").removeClass("bi-check-circle-fill").addClass("bi-check-circle");

        if (tipo === "1") {
            $("#gastoOBN, #gastoProyecto, #gastoViaticos, #gastoCajaChica, #gastoOtrosGastos, #gastoEncargas, #gastoPlanilla").show();
        }
        else if (tipo === "2") {
            $("#gastoOBN, #gastoProyecto, #gastoCajaChica, #gastoEncargas, #gastoPlanilla").hide();
            $("#gastoViaticos, #gastoOtrosGastos").show();
        }
        else {
            $("#gastoOBN, #gastoProyecto, #gastoViaticos, #gastoCajaChica, #gastoOtrosGastos, #gastoEncargas, #gastoPlanilla").hide();
        }
    });
});

function getCargarGridRecursos(anio, idActividadOperativa, idTarea) {
    let request = {
        anio: anio,
        idProgramacionActividad: idActividadOperativa,
        idProgramacionTareas: idTarea,
        codigoTareas: null,
        descripcionTareas: null,
        estadoDescripcion: null,
        paginaActual: 0,
        tamanioPagina: 0,
        activo: true
    };

    if ($.fn.DataTable.isDataTable('#gridRecursos')) {
        $('#gridRecursos').DataTable().destroy();
    }

    $('#gridRecursos').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {
            request.draw = d.draw;
            request.paginaActual = ((d.start / d.length) + 1);
            request.tamanioPagina = d.length;

            serviceProgramacionRecursos.getProgramacionRecursosPaginado(request, headersuarm)
                .then(responseRecursos => {

                    let expandedData = [];
                    let promesas = [];

                    responseRecursos.data.forEach(recurso => {
                        var usuarioConsulta = 'admin';
                        try {
                            var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
                            if (userData) {
                                var userObj = JSON.parse(userData);
                                usuarioConsulta = userObj.usuario || 'admin';
                            }
                        } catch (e) {
                            console.error("Error al obtener usuario:", e);
                        }

                        // CMN
                        if (recurso.gastoObn) {
                            let promesa = serviceProgramacionCmn.getProgramacionCmnListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(cmnList => {
                                    if (cmnList && cmnList.length > 0) {
                                        let cmn = cmnList[0];
                                        let montoTotal = (cmn.montoEnero || 0) + (cmn.montoFebrero || 0) +
                                            (cmn.montoMarzo || 0) + (cmn.montoAbril || 0) +
                                            (cmn.montoMayo || 0) + (cmn.montoJunio || 0) +
                                            (cmn.montoJulio || 0) + (cmn.montoAgosto || 0) +
                                            (cmn.montoSetiembre || 0) + (cmn.montoOctubre || 0) +
                                            (cmn.montoNoviembre || 0) + (cmn.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'CMN',
                                            tipoGastoCodigo: 'OBN',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || cmn.clasificadorGasto || 'N/A',
                                            denominacionRecurso: cmn.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: cmn.idProgramacionCmn
                                        });
                                    }
                                })
                                .catch(err => console.error("Error CMN:", err));
                            promesas.push(promesa);
                        }

                        // Proyecto
                        if (recurso.gastoProyecto) {
                            let promesa = serviceProgramacionProyecto.getProgramacionProyectoListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(proyectoList => {
                                    if (proyectoList && proyectoList.length > 0) {
                                        let proyecto = proyectoList[0];
                                        let montoTotal = (proyecto.montoEnero || 0) + (proyecto.montoFebrero || 0) +
                                            (proyecto.montoMarzo || 0) + (proyecto.montoAbril || 0) +
                                            (proyecto.montoMayo || 0) + (proyecto.montoJunio || 0) +
                                            (proyecto.montoJulio || 0) + (proyecto.montoAgosto || 0) +
                                            (proyecto.montoSetiembre || 0) + (proyecto.montoOctubre || 0) +
                                            (proyecto.montoNoviembre || 0) + (proyecto.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Proyecto',
                                            tipoGastoCodigo: 'Proyecto',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || proyecto.clasificadorGasto || 'N/A',
                                            denominacionRecurso: proyecto.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: proyecto.idProgramacionProyecto
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Proyecto:", err));
                            promesas.push(promesa);
                        }

                        // Viáticos
                        if (recurso.gastoViaticos) {
                            let promesa = serviceProgramacionViaticos.getProgramacionViaticosListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(viaticosList => {
                                    if (viaticosList && viaticosList.length > 0) {
                                        let viatico = viaticosList[0];
                                        let montoTotal = (viatico.montoEnero || 0) + (viatico.montoFebrero || 0) +
                                            (viatico.montoMarzo || 0) + (viatico.montoAbril || 0) +
                                            (viatico.montoMayo || 0) + (viatico.montoJunio || 0) +
                                            (viatico.montoJulio || 0) + (viatico.montoAgosto || 0) +
                                            (viatico.montoSetiembre || 0) + (viatico.montoOctubre || 0) +
                                            (viatico.montoNoviembre || 0) + (viatico.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Viáticos',
                                            tipoGastoCodigo: 'Viaticos',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || viatico.clasificadorGasto || 'N/A',
                                            denominacionRecurso: viatico.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: viatico.idProgramacionViaticos
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Viáticos:", err));
                            promesas.push(promesa);
                        }

                        // Encargos
                        if (recurso.gastoEncargas) {
                            let promesa = serviceProgramacionEncargos.getProgramacionEncargosListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(encargosList => {
                                    if (encargosList && encargosList.length > 0) {
                                        let encargo = encargosList[0];
                                        let montoTotal = (encargo.montoEnero || 0) + (encargo.montoFebrero || 0) +
                                            (encargo.montoMarzo || 0) + (encargo.montoAbril || 0) +
                                            (encargo.montoMayo || 0) + (encargo.montoJunio || 0) +
                                            (encargo.montoJulio || 0) + (encargo.montoAgosto || 0) +
                                            (encargo.montoSetiembre || 0) + (encargo.montoOctubre || 0) +
                                            (encargo.montoNoviembre || 0) + (encargo.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Encargos',
                                            tipoGastoCodigo: 'Encargas',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || encargo.clasificadorGasto || 'N/A',
                                            denominacionRecurso: encargo.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: encargo.idProgramacionEncargos
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Encargos:", err));
                            promesas.push(promesa);
                        }

                        // Otros Gastos
                        if (recurso.gastoOtrosGastos) {
                            let promesa = serviceProgramacionOtrosGastos.getProgramacionOtrosGastosListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(otrosGastosList => {
                                    if (otrosGastosList && otrosGastosList.length > 0) {
                                        let otroGasto = otrosGastosList[0];
                                        let montoTotal = (otroGasto.montoEnero || 0) + (otroGasto.montoFebrero || 0) +
                                            (otroGasto.montoMarzo || 0) + (otroGasto.montoAbril || 0) +
                                            (otroGasto.montoMayo || 0) + (otroGasto.montoJunio || 0) +
                                            (otroGasto.montoJulio || 0) + (otroGasto.montoAgosto || 0) +
                                            (otroGasto.montoSetiembre || 0) + (otroGasto.montoOctubre || 0) +
                                            (otroGasto.montoNoviembre || 0) + (otroGasto.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Otros Gastos',
                                            tipoGastoCodigo: 'OtrosGastos',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || otroGasto.clasificadorGasto || 'N/A',
                                            denominacionRecurso: otroGasto.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: otroGasto.idProgramacionOtrosGastos
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Otros Gastos:", err));
                            promesas.push(promesa);
                        }

                        // Caja Chica
                        if (recurso.gastoCajaChica) {
                            let promesa = serviceProgramacionCajaChica.getProgramacionCajaChicaListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(cajaChicaList => {
                                    if (cajaChicaList && cajaChicaList.length > 0) {
                                        let cajaChica = cajaChicaList[0];
                                        let montoTotal = (cajaChica.montoEnero || 0) + (cajaChica.montoFebrero || 0) +
                                            (cajaChica.montoMarzo || 0) + (cajaChica.montoAbril || 0) +
                                            (cajaChica.montoMayo || 0) + (cajaChica.montoJunio || 0) +
                                            (cajaChica.montoJulio || 0) + (cajaChica.montoAgosto || 0) +
                                            (cajaChica.montoSetiembre || 0) + (cajaChica.montoOctubre || 0) +
                                            (cajaChica.montoNoviembre || 0) + (cajaChica.montoDiciembre || 0);

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Caja Chica',
                                            tipoGastoCodigo: 'CajaChica',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || cajaChica.clasificadorGasto || 'N/A',
                                            denominacionRecurso: cajaChica.denominacionRecurso || recurso.denominacionRecurso,
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: cajaChica.idProgramacionCajaChica
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Caja Chica:", err));
                            promesas.push(promesa);
                        }

                        // Planilla
                        if (recurso.gastoPlanilla) {
                            let promesa = serviceProgramacionPlanilla.getProgramacionPlanillaListado({
                                idProgramacionRecurso: recurso.idProgramacionRecurso,
                                usuarioConsulta: usuarioConsulta
                            }, headersuarm)
                                .then(planillaList => {
                                    if (planillaList && planillaList.length > 0) {
                                        let montoTotal = 0;
                                        planillaList.forEach(item => {
                                            montoTotal += (item.montoEnero || 0) + (item.montoFebrero || 0) +
                                                (item.montoMarzo || 0) + (item.montoAbril || 0) +
                                                (item.montoMayo || 0) + (item.montoJunio || 0) +
                                                (item.montoJulio || 0) + (item.montoAgosto || 0) +
                                                (item.montoSetiembre || 0) + (item.montoOctubre || 0) +
                                                (item.montoNoviembre || 0) + (item.montoDiciembre || 0);
                                        });

                                        expandedData.push({
                                            ...recurso,
                                            tipoGastoActivo: 'Planilla',
                                            tipoGastoCodigo: 'Planilla',
                                            descripcionFuente: recurso.descripcionFuenteFinanciamento || 'N/A',
                                            clasificadorGasto: recurso.descripcionClasificador || 'Planilla Personal',
                                            denominacionRecurso: 'Planilla de Personal',
                                            montoTotal: montoTotal,
                                            idGastoEspecifico: planillaList[0].idProgramacionPlanilla
                                        });
                                    }
                                })
                                .catch(err => console.error("Error Planilla:", err));
                            promesas.push(promesa);
                        }
                    });

                    Promise.all(promesas).then(() => {
                        cb({
                            draw: responseRecursos.draw,
                            recordsTotal: expandedData.length,
                            recordsFiltered: expandedData.length,
                            data: expandedData
                        });
                    });
                })
                .catch(error => msgException('getProgramacionRecursosPaginado', error));
        },
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron registros de gastos",
            info: "Mostrando _START_ a _END_ de _TOTAL_",
            infoEmpty: "Sin registros",
            processing: "Procesando..."
        },
        responsive: true,
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true,
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: 'descripcionFuente',
                defaultContent: 'N/A',
                render: function (data, type, row) {
                    return data || 'N/A';
                }
            },
            {
                data: 'clasificadorGasto',
                defaultContent: 'N/A',
                render: function (data, type, row) {
                    return data || 'N/A';
                }
            },
            {
                data: 'denominacionRecurso',
                defaultContent: 'N/A'
            },
            {
                data: 'tipoGastoActivo',
                defaultContent: '-'
            },
            {
                data: 'idTipoItem',
                defaultContent: '-'
            },
            {
                data: 'montoTotal',
                render: function (data) {
                    return 'S/. ' + (data || 0).toFixed(2);
                }
            },
            {
                data: null,
                orderable: false,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-sm btn-outline-dark btn-editar-gasto" 
                                data-id="${row.idProgramacionRecurso}" 
                                data-tipo="${row.tipoGastoCodigo}"
                                title="Editar">
                            <i class="bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-eliminar-gasto" 
                                data-id-gasto="${row.idGastoEspecifico}" 
                                data-tipo="${row.tipoGastoCodigo}"
                                title="Eliminar">
                            <i class="bi-trash"></i>
                        </button>
                    `;
                }
            }
        ]
    });
}

$(document).on('click', '.btn-editar-gasto', function () {
    let idRecurso = $(this).data('id');
    let tipoGasto = $(this).data('tipo');

    if (DATOS_RECURSO_PRECARGADOS) {
        cargarDatosRecursoEnCampos(DATOS_RECURSO_PRECARGADOS, false);
        $("#hidRecursos").val(idRecurso);

        setTimeout(function () {
            switch (tipoGasto) {
                case 'OBN':
                    if (typeof abrirModalCMN === 'function') abrirModalCMN();
                    break;
                case 'Proyecto':
                    if (typeof abrirModalProyecto === 'function') abrirModalProyecto();
                    break;
                case 'Viaticos':
                    if (typeof abrirModalViaticos === 'function') abrirModalViaticos();
                    break;
                case 'Encargas':
                    if (typeof abrirModalEncargos === 'function') abrirModalEncargos();
                    break;
                case 'OtrosGastos':
                    if (typeof abrirModalOtrosGastos === 'function') abrirModalOtrosGastos();
                    break;
                case 'CajaChica':
                    if (typeof abrirModalCajaChica === 'function') abrirModalCajaChica();
                    break;
                case 'Planilla':
                    if (typeof abrirModalPlanilla === 'function') abrirModalPlanilla();
                    break;
            }
        }, 100);
    }
});

$(document).on('click', '.btn-eliminar-gasto', function () {
    let idGasto = $(this).data('id-gasto');
    let tipoGasto = $(this).data('tipo');

    if (confirm('¿Está seguro de eliminar este registro de ' + tipoGasto + '?')) {
        eliminarGasto(idGasto, tipoGasto);
    }
});

function eliminarGasto(idGasto, tipoGasto) {

    switch (tipoGasto) {
        case 'OBN':
            serviceProgramacionCmn.delProgramacionCmnPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("CMN eliminado correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar CMN");
                    }
                })
                .catch(error => msgException('delProgramacionCmnPorId', error));
            break;

        case 'Proyecto':
            serviceProgramacionProyecto.delProgramacionProyectoPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Proyecto eliminado correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Proyecto");
                    }
                })
                .catch(error => msgException('delProgramacionProyectoPorId', error));
            break;

        case 'Viaticos':
            serviceProgramacionViaticos.delProgramacionViaticosPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Viático eliminado correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Viático");
                    }
                })
                .catch(error => msgException('delProgramacionViaticosPorId', error));
            break;

        case 'Encargas':
            serviceProgramacionEncargos.delProgramacionEncargosPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Encargo eliminado correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Encargo");
                    }
                })
                .catch(error => msgException('delProgramacionEncargosPorId', error));
            break;

        case 'OtrosGastos':
            serviceProgramacionOtrosGastos.delProgramacionOtrosGastosPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Otros Gastos eliminado correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Otros Gastos");
                    }
                })
                .catch(error => msgException('delProgramacionOtrosGastosPorId', error));
            break;

        case 'CajaChica':
            serviceProgramacionCajaChica.delProgramacionCajaChicaPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Caja Chica eliminada correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Caja Chica");
                    }
                })
                .catch(error => msgException('delProgramacionCajaChicaPorId', error));
            break;

        case 'Planilla':
            serviceProgramacionPlanilla.delProgramacionPlanillaPorId(idGasto, headersuarm)
                .then(res => {
                    if (res.result > 0) {
                        alertify.success("Planilla eliminada correctamente");
                        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                    } else {
                        alertify.error(res.message || "No se pudo eliminar Planilla");
                    }
                })
                .catch(error => msgException('delProgramacionPlanillaPorId', error));
            break;
    }
}

function nuevoRecurso() {
    var idTarea = TAREA_RECURSO_SELECCIONADA;

    if (!idTarea) {
        alertify.error("Primero debe seleccionar una actividad y tarea en el tab de Acciones");
        return;
    }

    var usuarioConsulta = 'admin';
    try {
        var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
        if (userData) {
            var userObj = JSON.parse(userData);
            usuarioConsulta = userObj.usuario || 'admin';
        }
    } catch (e) {
        console.error("Error al obtener usuario:", e);
    }

    let requestListado = {
        idProgramacionTareas: idTarea,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionRecursos.getProgramacionRecursosListado(requestListado, headersuarm)
        .then(recursos => {

            if (recursos && Array.isArray(recursos) && recursos.length > 0) {
                const recurso = recursos[0];
                cargarRecursoExistente(recurso);
            } else {
                abrirModalNuevoRecurso();
            }
        })
        .catch(error => {
            console.error("❌ Error en /listado:", error);
            abrirModalNuevoRecurso();
        });
}

function abrirModalNuevoRecurso() {
    limpiarModalRecursos();

    $("#modalRecursos").modal("show");
    $("#mdlTitleRecursos").text("Registrar Presupuesto de Recursos");
    $("#flagEditRecursos").val(0);
    $("#hidRecursos").val("");

    var anio = ANIO_RECURSO_SELECCIONADO;
    var codigoActividad = CODIGOPROGRAMACION_RECURSO;
    var codigoTareas = CODIGOTAREAS_RECURSO;

    $("#txtAnioRecurso").val(anio);
    $("#txtActividadOperativaRecurso").val(codigoActividad);
    $("#txtTareaRecurso").val(codigoTareas);

    cargarDatosTarea(TAREA_RECURSO_SELECCIONADA);

    $("#gastoOBN, #gastoProyecto, #gastoViaticos, #gastoCajaChica, #gastoOtrosGastos, #gastoEncargas, #gastoPlanilla").hide();
}

function cargarRecursoExistente(recurso) {

    limpiarModalRecursos();

    $("#modalRecursos").modal("show");
    $("#mdlTitleRecursos").text("Editar Presupuesto de Recursos");
    $("#flagEditRecursos").val(1);

    var idRecurso = recurso.idProgramacionRecurso || recurso.id_PROGRAMACION_RECURSO || recurso.ID_PROGRAMACION_RECURSO;
    $("#hidRecursos").val(idRecurso);

    var anio = ANIO_RECURSO_SELECCIONADO;
    var codigoActividad = recurso.codigoProgramacion || CODIGOPROGRAMACION_RECURSO;
    var codigoTareas = recurso.codigoTareas || CODIGOTAREAS_RECURSO;

    $("#txtAnioRecurso").val(anio);
    $("#txtActividadOperativaRecurso").val(codigoActividad);
    $("#txtTareaRecurso").val(codigoTareas);

    var idUnidadMedida = recurso.idUnidadMedida || recurso.id_UNIDAD_MEDIDA || recurso.ID_UNIDAD_MEDIDA;
    var idFuenteFinanciamiento = recurso.idFuenteFinanciamiento || recurso.id_FUENTE_FINANCIAMIENTO || recurso.ID_FUENTE_FINANCIAMIENTO;
    var idUbigeo = recurso.idUbigeo || recurso.id_UBIGEO || recurso.ID_UBIGEO;
    var representativa = recurso.representativa || recurso.REPRESENTATIVA || false;

    var gastoObn = recurso.gastoObn || recurso.gasto_OBN || recurso.GASTO_OBN || false;
    var gastoProyecto = recurso.gastoProyecto || recurso.gasto_PROYECTO || recurso.GASTO_PROYECTO || false;
    var gastoViaticos = recurso.gastoViaticos || recurso.gasto_VIATICOS || recurso.GASTO_VIATICOS || false;
    var gastoCajaChica = recurso.gastoCajaChica || recurso.gasto_CAJA_CHICA || recurso.GASTO_CAJA_CHICA || false;
    var gastoOtrosGastos = recurso.gastoOtrosGastos || recurso.gasto_OTROS_GASTOS || recurso.GASTO_OTROS_GASTOS || false;
    var gastoEncargas = recurso.gastoEncargas || recurso.gasto_ENCARGAS || recurso.GASTO_ENCARGAS || false;
    var gastoPlanilla = recurso.gastoPlanilla || recurso.gasto_PLANILLA || recurso.GASTO_PLANILLA || false;

    let requestTarea = {
        anio: ANIO_RECURSO_SELECCIONADO,
        idProgramacionActividad: ACTIVIDAD_RECURSO_SELECCIONADA,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        codigoTareas: null,
        descripcionTareas: null,
        estadoDescripcion: null,
        paginaActual: 1,
        tamanioPagina: 1,
        activo: true
    };

    serviceProgramacionTareas.getProgramacionTareasPaginado(requestTarea, headersuarm)
        .then(response => {
            if (response.data && response.data.length > 0) {
                const tarea = response.data[0];
                var idAnio = tarea.idAnio;
                let requestCombos = { idAnio: idAnio };

                fillSelectUnidadMedida("cboUnidadMedidaRecursoModal", requestCombos, idUnidadMedida, "SELECCIONE", (termino) => {
                });

                fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoRecurso", requestCombos, idFuenteFinanciamiento, "SELECCIONE", (termino) => {
                });

                $("#chkRepresentativaRecurso").prop("checked", representativa);

                if (idUbigeo) {
                    setTimeout(function () {
                        $("#cboUbigeoRecurso").val(idUbigeo).trigger("change");
                    }, 300);
                }

                setTimeout(function () {
                    if (gastoObn) {
                        activarBotonGasto("#gastoOBN .btn-gasto");
                    }
                    if (gastoProyecto) {
                        activarBotonGasto("#gastoProyecto .btn-gasto");
                    }
                    if (gastoViaticos) {
                        activarBotonGasto("#gastoViaticos .btn-gasto");
                    }
                    if (gastoCajaChica) {
                        activarBotonGasto("#gastoCajaChica .btn-gasto");
                    }
                    if (gastoOtrosGastos) {
                        activarBotonGasto("#gastoOtrosGastos .btn-gasto");
                    }
                    if (gastoEncargas) {
                        activarBotonGasto("#gastoEncargas .btn-gasto");
                    }
                    if (gastoPlanilla) {
                        activarBotonGasto("#gastoPlanilla .btn-gasto");
                    }

                }, 600);

            }
        })
        .catch(error => {
            console.error("❌ Error cargando datos de tarea:", error);
        });
}

function cargarDatosRecursoEnCampos(recurso, mostrarModal = false) {

    var anio = ANIO_RECURSO_SELECCIONADO;
    var codigoActividad = recurso.codigoProgramacion || CODIGOPROGRAMACION_RECURSO;
    var codigoTareas = recurso.codigoTareas || CODIGOTAREAS_RECURSO;

    $("#txtAnioRecurso").val(anio);
    $("#txtActividadOperativaRecurso").val(codigoActividad);
    $("#txtTareaRecurso").val(codigoTareas);

    var idUnidadMedida = recurso.idUnidadMedida || recurso.id_UNIDAD_MEDIDA || recurso.ID_UNIDAD_MEDIDA;
    var idFuenteFinanciamiento = recurso.idFuenteFinanciamiento || recurso.id_FUENTE_FINANCIAMIENTO || recurso.ID_FUENTE_FINANCIAMIENTO;
    var idUbigeo = recurso.idUbigeo || recurso.id_UBIGEO || recurso.ID_UBIGEO;
    var representativa = recurso.representativa || recurso.REPRESENTATIVA || false;

    let requestTarea = {
        anio: ANIO_RECURSO_SELECCIONADO,
        idProgramacionActividad: ACTIVIDAD_RECURSO_SELECCIONADA,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        codigoTareas: null,
        descripcionTareas: null,
        estadoDescripcion: null,
        paginaActual: 1,
        tamanioPagina: 1,
        activo: true
    };

    serviceProgramacionTareas.getProgramacionTareasPaginado(requestTarea, headersuarm)
        .then(response => {
            if (response.data && response.data.length > 0) {
                const tarea = response.data[0];
                var idAnio = tarea.idAnio;
                let requestCombos = { idAnio: idAnio };

                fillSelectUnidadMedida("cboUnidadMedidaRecursoModal", requestCombos, idUnidadMedida, "SELECCIONE", (termino) => {
                });

                fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoRecurso", requestCombos, idFuenteFinanciamiento, "SELECCIONE", (termino) => {
                });

                $("#chkRepresentativaRecurso").prop("checked", representativa);

                if (idUbigeo) {
                    $("#cboUbigeoRecurso").val(idUbigeo);
                }
            }
        })
        .catch(error => {
            console.error("❌ Error cargando datos de tarea:", error);
        });
}

function activarBotonGasto(selector) {
    $(selector).addClass("active");
    $(selector).find("i").removeClass("bi-check-circle").addClass("bi-check-circle-fill");
}

function cargarDatosTarea(idTarea) {
    if (!idTarea) return;

    let request = {
        anio: ANIO_RECURSO_SELECCIONADO,
        idProgramacionActividad: ACTIVIDAD_RECURSO_SELECCIONADA,
        idProgramacionTareas: idTarea,
        codigoTareas: null,
        descripcionTareas: null,
        estadoDescripcion: null,
        paginaActual: 1,
        tamanioPagina: 1,
        activo: true
    };

    serviceProgramacionTareas.getProgramacionTareasPaginado(request, headersuarm)
        .then(response => {
            if (response.data && response.data.length > 0) {
                const tarea = response.data[0];
                var idAnio = tarea.idAnio;
                let requestCombos = { idAnio: idAnio };

                fillSelectUnidadMedida("cboUnidadMedidaRecursoModal", requestCombos, tarea.idUnidadMedida, "SELECCIONE", (termino) => {
                });

                fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoRecurso", requestCombos, tarea.idFuenteFinanciamiento, "SELECCIONE", (termino) => {
                });

                const representativa = tarea.representativa || false;
                $("#chkRepresentativaRecurso").prop("checked", representativa);

            }
        })
        .catch(error => {
            console.error("❌ Error cargando datos de tarea:", error);
        });
}

function precargarDatosRecurso(idTarea) {
    if (!idTarea) {
        DATOS_RECURSO_PRECARGADOS = null;
        return;
    }

    var usuarioConsulta = 'admin';
    try {
        var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
        if (userData) {
            var userObj = JSON.parse(userData);
            usuarioConsulta = userObj.usuario || 'admin';
        }
    } catch (e) {
        console.error("Error al obtener usuario:", e);
    }

    let requestListado = {
        idProgramacionTareas: idTarea,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionRecursos.getProgramacionRecursosListado(requestListado, headersuarm)
        .then(recursos => {
            if (recursos && Array.isArray(recursos) && recursos.length > 0) {
                DATOS_RECURSO_PRECARGADOS = recursos[0];
            } else {
                DATOS_RECURSO_PRECARGADOS = null;
            }
        })
        .catch(error => {
            console.error("❌ Error precargando datos del recurso:", error);
            DATOS_RECURSO_PRECARGADOS = null;
        });
}

function limpiarModalRecursos() {
    $("#hidRecursos").val("");
    $("#txtAnioRecurso").val("");
    $("#txtActividadOperativaRecurso").val("");
    $("#txtTareaRecurso").val("");
    $("#cboUnidadMedidaRecursoModal").val("");
    $("#chkRepresentativaRecurso").prop("checked", false);
    $("#cboFuenteFinanciamientoRecurso").val("");
    $("#cboUbigeoRecurso").val("");

    $(".btn-gasto").removeClass("active");
    $(".btn-gasto i").removeClass("bi-check-circle-fill").addClass("bi-check-circle");

    $("#gastoOBN, #gastoProyecto, #gastoViaticos, #gastoCajaChica, #gastoOtrosGastos, #gastoEncargas, #gastoPlanilla").hide();
}

function grabarRecursos() {
    if (!$("#cboUbigeoRecurso").val()) {
        alertify.error("Debe seleccionar un tipo de ubigeo");
        return;
    }

    var idAnio = null;
    try {
        var idAnioStorage = localStorage.getItem('idAnio');
        if (idAnioStorage) {
            idAnio = parseInt(idAnioStorage);
        } else {
            console.warn("→ ⚠️ No se encontró 'idAnio' en localStorage");
            alertify.error("Error", "No se pudo obtener el año. Por favor, recargue la página.");
            return;
        }
    } catch (e) {
        console.error("→ ❌ Error al obtener idAnio del localStorage:", e);
        alertify.error("Error", "Error al obtener el año del sistema.");
        return;
    }

    var idUnidadMedida = $("#cboUnidadMedidaRecursoModal").val()
        ? parseInt($("#cboUnidadMedidaRecursoModal").val())
        : null;

    var idFuenteFinanciamiento = $("#cboFuenteFinanciamientoRecurso").val()
        ? parseInt($("#cboFuenteFinanciamientoRecurso").val())
        : null;

    var idProgramacionTareas = TAREA_RECURSO_SELECCIONADA;
    var idProgramacionActividad = ACTIVIDAD_RECURSO_SELECCIONADA;
    var idProgramacionRecurso = $("#hidRecursos").val() ? parseInt($("#hidRecursos").val()) : 0;
    var idUbigeo = parseInt($("#cboUbigeoRecurso").val());
    var representativa = $("#chkRepresentativaRecurso").is(":checked");

    var gastoObn = $("#gastoOBN .btn-gasto").hasClass("active");
    var gastoProyecto = $("#gastoProyecto .btn-gasto").hasClass("active");
    var gastoViaticos = $("#gastoViaticos .btn-gasto").hasClass("active");
    var gastoCajaChica = $("#gastoCajaChica .btn-gasto").hasClass("active");
    var gastoOtrosGastos = $("#gastoOtrosGastos .btn-gasto").hasClass("active");
    var gastoEncargas = $("#gastoEncargas .btn-gasto").hasClass("active");
    var gastoPlanilla = $("#gastoPlanilla .btn-gasto").hasClass("active");

    var idEstado = ESTADO_RECURSO;
    var flag = $("#flagEditRecursos").val();

    var usuarioCreacion = 'admin';
    try {
        var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
        if (userData) {
            var userObj = JSON.parse(userData);
            usuarioCreacion = userObj.usuario || 'admin';
        }
    } catch (e) {
        console.error("Error al obtener usuario:", e);
    }

    if (flag == 1) {
        let datos = {
            idProgramacionRecurso: idProgramacionRecurso,
            idProgramacionActividad: idProgramacionActividad,
            idProgramacionTareas: idProgramacionTareas,
            idAnio: idAnio,
            idUnidadMedida: idUnidadMedida,
            idFuenteFinanciamiento: idFuenteFinanciamiento,
            representativa: representativa,
            idUbigeo: idUbigeo,
            gastoObn: gastoObn,
            gastoProyecto: gastoProyecto,
            gastoViaticos: gastoViaticos,
            gastoCajaChica: gastoCajaChica,
            gastoOtrosGastos: gastoOtrosGastos,
            gastoEncargas: gastoEncargas,
            gastoPlanilla: gastoPlanilla,
            idEstado: idEstado,
            ipModificacion: "0.0.0.0",
            usuarioModificacion: usuarioCreacion
        };
        updProgramacionRecursos(datos);
    } else {
        let datos = {
            idProgramacionActividad: idProgramacionActividad,
            idProgramacionTareas: idProgramacionTareas,
            idAnio: idAnio,
            idUnidadMedida: idUnidadMedida,
            idFuenteFinanciamiento: idFuenteFinanciamiento,
            representativa: representativa,
            idUbigeo: idUbigeo,
            gastoObn: gastoObn,
            gastoProyecto: gastoProyecto,
            gastoViaticos: gastoViaticos,
            gastoCajaChica: gastoCajaChica,
            gastoOtrosGastos: gastoOtrosGastos,
            gastoEncargas: gastoEncargas,
            gastoPlanilla: gastoPlanilla,
            idEstado: idEstado,
            ipCreacion: "0.0.0.0",
            usuarioCreacion: usuarioCreacion
        };
        insProgramacionRecursos(datos);
    }
}

function insProgramacionRecursos(datos) {
    serviceProgramacionRecursos.insProgramacionRecursos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);

                precargarDatosRecurso(TAREA_RECURSO_SELECCIONADA);
                alertify.success(tituloAlert.seguridad, response.message);
                $("#modalRecursos").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message);
            }
        })
        .catch(error => msgException('insProgramacionRecursos', error));
}

function updProgramacionRecursos(datos) {
    serviceProgramacionRecursos.updProgramacionRecursos(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);

                precargarDatosRecurso(TAREA_RECURSO_SELECCIONADA);
                alertify.success(tituloAlert.seguridad, response.message);
                $("#modalRecursos").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message);
            }
        })
        .catch(error => msgException('updProgramacionRecursos', error));
}

document.querySelectorAll('.btn-gasto').forEach(btn => {
    btn.addEventListener('click', function () {
        this.classList.toggle('active');

        const icon = this.querySelector('i');
        if (this.classList.contains('active')) {
            icon.classList.remove('bi-check-circle');
            icon.classList.add('bi-check-circle-fill');
        } else {
            icon.classList.remove('bi-check-circle-fill');
            icon.classList.add('bi-check-circle');
        }
    });
});

$(document).on("click", ".btn-gasto[data-tipo='OBN']", function () {
    if (typeof abrirModalCMN === 'function') {
        abrirModalCMN();
    } else {
        console.error("❌ ERROR: abrirModalCMN no está definida");
    }
});

function inicializarTabRecursos() {
    var anio = parseInt($("#txtAniosAccionesFiltro").val());
    var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
    var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());
    var codigoActividad = $("#txtActividadOperativaAccionesFiltro").val();
    var codigoTareas = $("#txtTareaAccionesFiltro").val();

    ANIO_RECURSO_SELECCIONADO = anio;
    ACTIVIDAD_RECURSO_SELECCIONADA = idProgramacionActividad;
    TAREA_RECURSO_SELECCIONADA = idProgramacionTareas;
    IDPROGRAMACION_RECURSO = idProgramacionActividad;
    CODIGOPROGRAMACION_RECURSO = codigoActividad;
    IDTAREAS_RECURSO = idProgramacionTareas;
    CODIGOTAREAS_RECURSO = codigoTareas;

    $("#txtAnioRecursoFiltro").val(anio);
    $("#txtActividadRecursoFiltro").val(codigoActividad);
    $("#txtTareaRecursoFiltro").val(codigoTareas);

    $("#hidProgramacionActividadRecurso").val(idProgramacionActividad);
    $("#hidProgramacionTareasRecurso").val(idProgramacionTareas);

    if (idProgramacionTareas) {
        precargarDatosRecurso(idProgramacionTareas);
    }

    if (anio && idProgramacionActividad && idProgramacionTareas) {
        setTimeout(function () {
            getCargarGridRecursos(anio, idProgramacionActividad, idProgramacionTareas);
        }, 500);
    }

    if (!$.fn.DataTable.isDataTable('#gridRecursos')) {
        inicializarGridVacio();
    }
}

function inicializarGridVacio() {
    $('#gridRecursos').DataTable({
        data: [],
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "Seleccione año, actividad y tarea para ver recursos",
            info: "Mostrando _START_ a _END_ de _TOTAL_",
            infoEmpty: "Sin registros",
            emptyTable: "Cambie al tab de recursos para ver los datos"
        },
        columns: [
            { data: null, render: (d, t, r, meta) => meta.row + 1 },
            { data: 'fuenteFinanciamiento', defaultContent: 'N/A' },
            { data: 'clasificadorGasto', defaultContent: 'N/A' },
            { data: 'denominacion', defaultContent: 'N/A' },
            { data: 'tipoGasto', defaultContent: 'N/A' },
            { data: 'tipoItem', defaultContent: 'N/A' },
            { data: null, render: () => 'S/. 0.00' },
            { data: 'estadoDescripcion', defaultContent: 'N/A' }
        ]
    });
}