
var TRABAJADORES_PLANILLA = [];
var MESES = [
    { id: 1, nombre: 'Enero', prop: 'montoEnero' },
    { id: 2, nombre: 'Febrero', prop: 'montoFebrero' },
    { id: 3, nombre: 'Marzo', prop: 'montoMarzo' },
    { id: 4, nombre: 'Abril', prop: 'montoAbril' },
    { id: 5, nombre: 'Mayo', prop: 'montoMayo' },
    { id: 6, nombre: 'Junio', prop: 'montoJunio' },
    { id: 7, nombre: 'Julio', prop: 'montoJulio' },
    { id: 8, nombre: 'Agosto', prop: 'montoAgosto' },
    { id: 9, nombre: 'Setiembre', prop: 'montoSetiembre' },
    { id: 10, nombre: 'Octubre', prop: 'montoOctubre' },
    { id: 11, nombre: 'Noviembre', prop: 'montoNoviembre' },
    { id: 12, nombre: 'Diciembre', prop: 'montoDiciembre' }
];

var ID_PROGRAMACION_RECURSO_PLANILLA = null;

$(function () {
    $(document).on("click", ".btn-gasto[data-tipo='Planilla']", function () {
        abrirModalPlanilla();
    });

    $("#btnGrabarClasificadorModal").click(grabarClasificador);
    $("#btnGrabarPlanilla").click(grabarPlanilla);
});

function abrirModalPlanilla() {
    var idRecurso = $("#hidRecursos").val();

    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_PLANILLA = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_PLANILLA = null;
    }

    $("#txtAnioPlanilla").val($("#txtAnioRecurso").val());
    $("#txtActividadPlanilla").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaPlanilla").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaPlanilla").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaPlanilla").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuentePlanilla").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoPlanilla").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoPlanilla").val($("#cboUbigeoRecurso").val());

    cargarTrabajadoresDesdeAPI();
    $("#modalPlanilla").modal("show");
}

function cargarTrabajadoresDesdeAPI() {

    var anioTexto = $("#txtAnioPlanilla").val();

    if (!anioTexto) {
        console.error("❌ No hay año seleccionado");
        alertify.error("Error", "No se pudo determinar el año presupuestal");
        return;
    }

    var anio = parseInt(anioTexto);

    let request = {
        anio: anio,
        codigoAcciones: null,
        descripcionAcciones: null,
        estadoDescripcion: null,
        paginaActual: 1,
        tamanioPagina: 1000,
        draw: 1
    };

    servicePlanillas.getPlanillasPaginado(request, headersuarm)
        .then(response => {

            if (response && response.data && response.data.length > 0) {
                var trabajadoresMap = {};

                response.data.forEach(item => {
                    var nombreTrabajador = item.apellidosNombres || "SIN NOMBRE";
                    var cargo = item.descripcionCentroCostos || "SIN CARGO";
                    var claveTrabajador = `${nombreTrabajador}_${cargo}`;

                    if (!trabajadoresMap[claveTrabajador]) {
                        trabajadoresMap[claveTrabajador] = {
                            idPlanillas: item.idPlanillas,
                            nombreTrabajador: nombreTrabajador,
                            cargo: cargo,
                            clasificadores: []
                        };
                    }
                });

                TRABAJADORES_PLANILLA = Object.values(trabajadoresMap);

                cargarClasificadoresDeTrabajadores();
            } else {
                TRABAJADORES_PLANILLA = [];
                actualizarTablaPlanilla();
            }
        })
        .catch(error => {
            console.error("❌ Error al cargar trabajadores:", error);
            TRABAJADORES_PLANILLA = [];
            actualizarTablaPlanilla();
        });
}

function cargarClasificadoresDeTrabajadores() {

    var promesas = [];

    TRABAJADORES_PLANILLA.forEach((trabajador, index) => {

        let requestDetalle = {
            idPlanillas: trabajador.idPlanillas,
            activo: true,
            paginaActual: 1,
            tamanioPagina: 100,
            draw: 1
        };

        var promesa = servicePlanillas.getPlanillasDetallePaginado(requestDetalle, headersuarm)
            .then(responseDetalle => {

                if (responseDetalle && responseDetalle.data && responseDetalle.data.length > 0) {
                    trabajador.clasificadores = responseDetalle.data.map(det => ({
                        idPlanillaDetalle: det.idPlanillaDetalle,
                        idEspecifica: det.idEspecifica,
                        clasificador: det.clasificador,
                        descripcionClasificador: det.descripcionClasificador,
                        importe: det.importe || 0,

                        montoEnero: 0,
                        montoFebrero: 0,
                        montoMarzo: 0,
                        montoAbril: 0,
                        montoMayo: 0,
                        montoJunio: 0,
                        montoJulio: 0,
                        montoAgosto: 0,
                        montoSetiembre: 0,
                        montoOctubre: 0,
                        montoNoviembre: 0,
                        montoDiciembre: 0
                    }));
                } else {
                    trabajador.clasificadores = [];
                }

                return Promise.resolve();
            })
            .catch(error => {
                console.error(`❌ Error en clasificadores de ${trabajador.nombreTrabajador}:`, error);
                trabajador.clasificadores = [];
                return Promise.resolve();
            });

        promesas.push(promesa);
    });

    Promise.all(promesas)
        .then(() => {
            cargarMontosPlanilla();
        })
        .catch(error => {
            console.error("❌ PASO 5 FALLÓ en Promise.all:", error);
            actualizarTablaPlanilla();
        });
}

function cargarMontosPlanilla() {

    var idAnio = obtenerIdAnioDesdeLocalStorage();

    if (!idAnio) {
        console.error("❌ No hay idAnio en localStorage");
        actualizarTablaPlanilla();
        return;
    }

    var usuarioConsulta = obtenerUsuarioConsulta();

    let requestPlanilla = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_PLANILLA,
        idProgramacionTareas: IDTAREAS_RECURSO,
        idAnio: idAnio,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionPlanilla.getProgramacionPlanillaListado(requestPlanilla, headersuarm)
        .then(response => {

            if (response && response.length > 0) {

                response.forEach((planillaItem, idx) => {

                    var trabajador = TRABAJADORES_PLANILLA.find(t => t.idPlanillas === planillaItem.idTrabajador);

                    if (trabajador) {
                        var clasificador = trabajador.clasificadores.find(c => c.idEspecifica === planillaItem.idClasificador);

                        if (clasificador) {

                            clasificador.idProgramacionPlanilla = planillaItem.idProgramacionPlanilla;
                            clasificador.montoEnero = planillaItem.montoEnero || 0;
                            clasificador.montoFebrero = planillaItem.montoFebrero || 0;
                            clasificador.montoMarzo = planillaItem.montoMarzo || 0;
                            clasificador.montoAbril = planillaItem.montoAbril || 0;
                            clasificador.montoMayo = planillaItem.montoMayo || 0;
                            clasificador.montoJunio = planillaItem.montoJunio || 0;
                            clasificador.montoJulio = planillaItem.montoJulio || 0;
                            clasificador.montoAgosto = planillaItem.montoAgosto || 0;
                            clasificador.montoSetiembre = planillaItem.montoSetiembre || 0;
                            clasificador.montoOctubre = planillaItem.montoOctubre || 0;
                            clasificador.montoNoviembre = planillaItem.montoNoviembre || 0;
                            clasificador.montoDiciembre = planillaItem.montoDiciembre || 0;

                        } else {
                            console.warn(`⚠️ No se encontró clasificador con idEspecifica=${planillaItem.idClasificador}`);
                        }
                    } else {
                        console.warn(`⚠️ No se encontró trabajador con idPlanillas=${planillaItem.idTrabajador}`);
                    }
                });
            } else {
                console.log("ℹ️ No hay montos guardados previamente (response vacío o null)");
            }

            actualizarTablaPlanilla();
        })
        .catch(error => {
            console.error('❌ PASO 8 FALLÓ - Error al cargar montos:', error);
            actualizarTablaPlanilla();
        });
}

function abrirModalClasificador(indexTrabajador, indexClasificador) {

    var trabajador = TRABAJADORES_PLANILLA[indexTrabajador];
    var clasificador = trabajador.clasificadores[indexClasificador];

    $("#hidIndexTrabajadorClasificador").val(indexTrabajador);
    $("#hidIndexClasificador").val(indexClasificador);

    $("#txtNombreTrabajadorModal").text(trabajador.nombreTrabajador);
    $("#txtClasificadorModal").text(clasificador.clasificador + " - " + clasificador.descripcionClasificador);

    MESES.forEach(m => {
        var monto = clasificador[m.prop] || 0;
        $("#txtMonto" + m.nombre + "Clasificador").val(monto.toFixed(2));
    });

    $("#mdlTitleClasificador").text("Editar Clasificador");
    $("#modalClasificadorPlanilla").modal("show");
}

function grabarClasificador() {
    var indexTrabajador = parseInt($("#hidIndexTrabajadorClasificador").val());
    var indexClasificador = parseInt($("#hidIndexClasificador").val());

    var montos = {};
    var totalAnual = 0;

    MESES.forEach(m => {
        var monto = parseFloat($("#txtMonto" + m.nombre + "Clasificador").val()) || 0;
        montos[m.prop] = monto;
        totalAnual += monto;
    });

    Object.assign(TRABAJADORES_PLANILLA[indexTrabajador].clasificadores[indexClasificador], montos);

    actualizarTablaPlanilla();
    $("#modalClasificadorPlanilla").modal("hide");
    alertify.success("Éxito", "Montos actualizados correctamente");
}

function actualizarTablaPlanilla() {

    $("#tbodyPlanilla").empty();

    if (TRABAJADORES_PLANILLA.length === 0) {
        $("#tbodyPlanilla").append(`
            <tr>
                <td colspan="17" class="text-center text-muted">
                    No hay trabajadores registrados en el sistema para este año.
                </td>
            </tr>
        `);
        return;
    }

    TRABAJADORES_PLANILLA.forEach((trabajador, indexTrab) => {
        if (trabajador.clasificadores.length === 0) {
            $("#tbodyPlanilla").append(`
                <tr>
                    <td class="text-center">-</td>
                    <td class="fw-bold">${trabajador.nombreTrabajador}</td>
                    <td>${trabajador.cargo}</td>
                    <td colspan="14" class="text-center text-muted">
                        Sin clasificadores asignados
                    </td>
                </tr>
            `);
            return;
        }

        var totalesMensualesTrabajador = {
            montoEnero: 0,
            montoFebrero: 0,
            montoMarzo: 0,
            montoAbril: 0,
            montoMayo: 0,
            montoJunio: 0,
            montoJulio: 0,
            montoAgosto: 0,
            montoSetiembre: 0,
            montoOctubre: 0,
            montoNoviembre: 0,
            montoDiciembre: 0
        };

        trabajador.clasificadores.forEach(clasificador => {
            MESES.forEach(m => {
                totalesMensualesTrabajador[m.prop] += parseFloat(clasificador[m.prop]) || 0;
            });
        });

        var totalAnualTrabajador = 0;
        MESES.forEach(m => {
            totalAnualTrabajador += totalesMensualesTrabajador[m.prop];
        });

        var htmlTrabajador = `
            <tr class="table-info trabajador-row-${indexTrab}">
                <td class="align-middle text-center">
                    <button class="btn btn-sm btn-primary btn-toggle-clasificadores" 
                            data-trabajador="${indexTrab}" 
                            title="Mostrar/Ocultar clasificadores">
                        <i class="bi bi-plus-circle"></i>
                    </button>
                </td>
                <td class="fw-bold">${trabajador.nombreTrabajador}</td>
                <td>${trabajador.cargo}</td>
                <td class="text-center text-muted">-</td>
        `;

        MESES.forEach(m => {
            var monto = totalesMensualesTrabajador[m.prop];
            var clase = monto > 0 ? 'fw-bold table-warning' : 'text-muted';
            htmlTrabajador += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });

        htmlTrabajador += `<td class="text-end fw-bold table-info">S/ ${totalAnualTrabajador.toFixed(2)}</td></tr>`;

        $("#tbodyPlanilla").append(htmlTrabajador);

        trabajador.clasificadores.forEach((clasificador, indexClas) => {
            var totalClasificador = 0;

            var rowClasificador = `
                <tr class="clasificador-row clasificador-trabajador-${indexTrab}" style="display:none;">
                    <td></td>
                    <td class="ps-4 text-primary">
                        <strong>${clasificador.clasificador}</strong>
                    </td>
                    <td class="ps-4 text-muted small">
                        ${clasificador.descripcionClasificador}
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-warning" onclick="abrirModalClasificador(${indexTrab}, ${indexClas})" title="Editar montos">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
            `;

            MESES.forEach(m => {
                var monto = clasificador[m.prop] || 0;
                totalClasificador += monto;
                var clase = monto > 0 ? 'table-success' : 'text-muted';
                rowClasificador += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
            });

            rowClasificador += `<td class="text-end fw-bold table-primary">S/ ${totalClasificador.toFixed(2)}</td></tr>`;

            $("#tbodyPlanilla").append(rowClasificador);
        });
    });

}

function grabarPlanilla() {

    if (TRABAJADORES_PLANILLA.length === 0) {
        alertify.error("Error", "No hay trabajadores disponibles");
        return;
    }

    var hayMontos = false;
    TRABAJADORES_PLANILLA.forEach(trab => {
        trab.clasificadores.forEach(clas => {
            MESES.forEach(m => {
                if ((clas[m.prop] || 0) > 0) {
                    hayMontos = true;
                }
            });
        });
    });

    if (!hayMontos) {
        alertify.error("Error", "Debe ingresar al menos un monto en algún clasificador");
        return;
    }

    var idAnio = obtenerIdAnioDesdeLocalStorage();
    if (!idAnio) {
        alertify.error("Error", "No se pudo determinar el año");
        return;
    }

    var contextoProgramacion = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_PLANILLA || 0,
        idProgramacionTareas: IDTAREAS_RECURSO || 0,
        idAnio: idAnio,
        idActividadOperativa: 0,
        idTarea: 0,
        idUnidadMedida: 0,
        representativa: $("#chkRepresentativaPlanilla").prop("checked"),
        idFuenteFinanciamiento: 0,
        idUbigeo: parseInt($("#hidTipoUbigeoPlanilla").val()) || 0,
        tipoUbigeo: parseInt($("#hidTipoUbigeoPlanilla").val()) || 0
    };

    var promesas = [];

    TRABAJADORES_PLANILLA.forEach(trabajador => {
        var trabajadorData = {
            idTrabajador: trabajador.idPlanillas,
            nombreTrabajador: trabajador.nombreTrabajador,
            cargo: trabajador.cargo
        };

        var clasificadoresConMontos = trabajador.clasificadores.map(clas => ({
            idProgramacionPlanilla: clas.idProgramacionPlanilla || null,
            idClasificador: clas.idEspecifica,
            codigoClasificador: clas.clasificador,
            descripcionClasificador: clas.descripcionClasificador,

            montoEnero: parseFloat(clas.montoEnero) || 0,
            montoFebrero: parseFloat(clas.montoFebrero) || 0,
            montoMarzo: parseFloat(clas.montoMarzo) || 0,
            montoAbril: parseFloat(clas.montoAbril) || 0,
            montoMayo: parseFloat(clas.montoMayo) || 0,
            montoJunio: parseFloat(clas.montoJunio) || 0,
            montoJulio: parseFloat(clas.montoJulio) || 0,
            montoAgosto: parseFloat(clas.montoAgosto) || 0,
            montoSetiembre: parseFloat(clas.montoSetiembre) || 0,
            montoOctubre: parseFloat(clas.montoOctubre) || 0,
            montoNoviembre: parseFloat(clas.montoNoviembre) || 0,
            montoDiciembre: parseFloat(clas.montoDiciembre) || 0
        }));

        var esActualizacion = clasificadoresConMontos.some(c => c.idProgramacionPlanilla);

        var promesa;
        if (esActualizacion) {
            promesa = serviceProgramacionPlanilla.actualizarPlanillaCompleta(
                trabajadorData,
                clasificadoresConMontos,
                contextoProgramacion,
                headersuarm
            );
        } else {
            promesa = serviceProgramacionPlanilla.guardarPlanillaCompleta(
                trabajadorData,
                clasificadoresConMontos,
                contextoProgramacion,
                headersuarm
            );
        }

        promesas.push(promesa);
    });

    Promise.all(promesas)
        .then(responses => {
            var totalExitosos = 0;
            responses.forEach(resp => {
                if (resp.resultados) {
                    totalExitosos += resp.resultados.length;
                }
            });

            $("#modalPlanilla").modal("hide");

            if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
            }

            alertify.success("Éxito", `Planilla guardada correctamente. ${totalExitosos} clasificadores procesados.`);
        })
        .catch(error => {
            console.error("❌ Error al grabar:", error);

            if (error.message) {
                alertify.error("Error", error.message);
            } else {
                msgException('grabarPlanilla', error);
            }
        });
}

$(document).on("click", ".btn-toggle-clasificadores", function () {
    var indexTrabajador = $(this).data("trabajador");
    var $icon = $(this).find("i");
    var $clasificadores = $(`.clasificador-trabajador-${indexTrabajador}`);

    $clasificadores.toggle();

    if ($clasificadores.is(":visible")) {
        $icon.removeClass("bi-plus-circle").addClass("bi-dash-circle");
        $(this).removeClass("btn-primary").addClass("btn-secondary");
    } else {
        $icon.removeClass("bi-dash-circle").addClass("bi-plus-circle");
        $(this).removeClass("btn-secondary").addClass("btn-primary");
    }
});

function obtenerIdAnioDesdeLocalStorage() {
    try {
        var idAnio = localStorage.getItem('idAnio');
        if (idAnio) {
            return parseInt(idAnio);
        }
    } catch (e) {
        console.error('Error al obtener idAnio:', e);
    }
    return null;
}

function obtenerUsuarioConsulta() {
    var usuarioConsulta = 'admin';
    try {
        var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
        if (userData) {
            var userObj = JSON.parse(userData);
            usuarioConsulta = userObj.usuario || 'admin';
        }
    } catch (e) {
        console.error('Error al obtener usuario:', e);
    }
    return usuarioConsulta;
}