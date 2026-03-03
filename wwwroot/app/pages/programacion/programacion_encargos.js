var ITEMS_ENCARGOS_TEMP = [];
var MESES_ENCARGOS = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Setiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' }
];

var ID_PROGRAMACION_RECURSO_ENCARGOS = null;

$(document).on("click", "#btnAgregarEncargo", function () {
    agregarEncargo();
});

$(document).on("click", "#btnGrabarEncargos", function () {
    grabarEncargos();
});

$(document).on("click", ".btn-gasto[data-tipo='Encargas']", function () {
    if (typeof abrirModalEncargos === 'function') {
        abrirModalEncargos();
    }
});

$(document).on("click", "#btnCerrarEncargos", function () {
    cerrarModalEncargos();
});

function abrirModalEncargos() {
    var idRecurso = $("#hidRecursos").val();
    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_ENCARGOS = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_ENCARGOS = null;
    }

    $("#txtAnioEncargos").val($("#txtAnioRecurso").val());
    $("#txtActividadEncargos").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaEncargos").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaEncargos").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaEncargos").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteEncargos").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoEncargos").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoEncargos").val($("#cboUbigeoRecurso").val());

    $("#cboClasificadorEncargos").val("");
    $("#txtDenominacionRecursoEncargos").val("");
    $("#txtValorEncargos").val("");
    $("#cboMesEncargos").val("");

    cargarClasificadoresEncargos();

    if (ID_PROGRAMACION_RECURSO_ENCARGOS) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ENCARGOS,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionEncargos.getProgramacionEncargosListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idEncargo = response[0].idProgramacionEncargos;

                    let requestObtener = {
                        idProgramacionEncargos: idEncargo,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionEncargos.getEncargosPorId(requestObtener, headersuarm)
                        .then(encargo => {
                            mostrarEncargosEnTabla(encargo);
                        })
                        .catch(error => {
                            ITEMS_ENCARGOS_TEMP = [];
                            actualizarCuadroEncargos();
                        });
                } else {
                    ITEMS_ENCARGOS_TEMP = [];
                    actualizarCuadroEncargos();
                }
            })
            .catch(error => {
                ITEMS_ENCARGOS_TEMP = [];
                actualizarCuadroEncargos();
            });
    } else {
        ITEMS_ENCARGOS_TEMP = [];
        actualizarCuadroEncargos();
    }

    $("#modalEncargos").modal("show");
}

function agregarEncargo() {
    var clasificador = $("#cboClasificadorEncargos").val();
    var clasificadorOption = $("#cboClasificadorEncargos option:selected");
    var clasificadorFullText = clasificadorOption.text();

    var clasificadorTexto = clasificadorFullText.includes(" - ")
        ? clasificadorFullText.split(" - ")[0].trim()
        : clasificadorFullText.trim();

    var denominacion = $("#txtDenominacionRecursoEncargos").val();
    var valor = parseFloat($("#txtValorEncargos").val()) || 0;
    var mes = $("#cboMesEncargos").val();
    var mesTexto = $("#cboMesEncargos option:selected").text();

    if (!clasificador) {
        alertify.error("Debe seleccionar un clasificador de gasto");
        return;
    }

    if (!denominacion || denominacion.trim() === "") {
        alertify.error("Debe ingresar la denominación del recurso");
        return;
    }

    if (valor <= 0) {
        alertify.error("Debe ingresar un valor válido");
        return;
    }

    if (!mes) {
        alertify.error("Debe seleccionar un mes");
        return;
    }

    var item = {
        clasificador: parseInt(clasificador),
        clasificadorTexto: clasificadorTexto,
        denominacion: denominacion,
        valor: valor,
        mes: parseInt(mes),
        mesNombre: mesTexto
    };

    ITEMS_ENCARGOS_TEMP.push(item);

    $("#cboClasificadorEncargos").val("");
    $("#txtDenominacionRecursoEncargos").val("");
    $("#txtValorEncargos").val("");
    $("#cboMesEncargos").val("");

    actualizarCuadroEncargosTotal();
    alertify.success("Encargo agregado correctamente");
}

function eliminarEncargos(idProgramacionEncargos) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar este Encargo?",
        function () {
            serviceProgramacionEncargos.delProgramacionEncargosPorId(idProgramacionEncargos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("Encargo eliminado correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_ENCARGOS_TEMP = [];
                        actualizarCuadroEncargos();
                    } else {
                        alertify.error("No se pudo eliminar el Encargo");
                    }
                })
                .catch(error => {
                    msgException('eliminarEncargos', error);
                });
        },
        function () {
        }
    );
}

function grabarEncargos() {
    if (ITEMS_ENCARGOS_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un encargo");
        return;
    }

    var idAnio = parseInt(localStorage.getItem('idAnio'));

    if (!idAnio) {
        alertify.error("No se pudo determinar el año");
        return;
    }

    var montosPorMes = {};
    MESES_ENCARGOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_ENCARGOS_TEMP.forEach(item => {
        if (item.tipo === 'encargos_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    var primerItem = ITEMS_ENCARGOS_TEMP.find(i => i.tipo !== 'encargos_existente') || ITEMS_ENCARGOS_TEMP[0];

    var datosEncargos = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ENCARGOS,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        idAnio: idAnio,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        idUnidadMedida: null,
        representativa: $("#chkRepresentativaRecurso").prop("checked"),
        idFuenteFinanciamiento: parseInt($("#cboFuenteFinanciamientoRecurso").val()) || null,
        idUbigeo: parseInt($("#cboUbigeoRecurso").val()) || null,
        tipoUbigeo: parseInt($("#hidTipoUbigeoEncargos").val()) || null,

        montoEnero: montosPorMes[1] || 0,
        montoFebrero: montosPorMes[2] || 0,
        montoMarzo: montosPorMes[3] || 0,
        montoAbril: montosPorMes[4] || 0,
        montoMayo: montosPorMes[5] || 0,
        montoJunio: montosPorMes[6] || 0,
        montoJulio: montosPorMes[7] || 0,
        montoAgosto: montosPorMes[8] || 0,
        montoSetiembre: montosPorMes[9] || 0,
        montoOctubre: montosPorMes[10] || 0,
        montoNoviembre: montosPorMes[11] || 0,
        montoDiciembre: montosPorMes[12] || 0,

        clasificadorGasto: parseInt(primerItem.clasificador || primerItem.clasificadorGasto),
        denominacionRecurso: primerItem.denominacion || primerItem.denominacionRecurso,
        valor: parseFloat(primerItem.valor),

        idEstado: 1,
        ipCreacion: "0.0.0.0",
        usuarioCreacion: usuarioCreacion
    };

    serviceProgramacionEncargos.insProgramacionEncargos(datosEncargos, headersuarm)
        .then(responseEncargos => {
            if (responseEncargos.result > 0) {
                var idProgramacionEncargos = responseEncargos.result;
                guardarDetallesEncargos(idProgramacionEncargos, usuarioCreacion);
            } else {
                alertify.error(responseEncargos.message || "No se pudo guardar el encargo");
            }
        })
        .catch(error => {
            msgException('grabarEncargos', error);
        });
}

function guardarDetallesEncargos(idProgramacionEncargos, usuarioCreacion) {

    var itemsParaGuardar = ITEMS_ENCARGOS_TEMP.filter(item => item.tipo !== 'encargos_existente');

    if (itemsParaGuardar.length === 0) {;
        finalizarGrabacionEncargos();
        return;
    }

    var promesas = itemsParaGuardar.map(item => {

        var detalleRequest = {
            idProgramacionEncargosDetalle: 0,
            idProgramacionEncargos: idProgramacionEncargos,
            idClasificador: item.clasificador,      
            nombreClasificador: item.clasificadorTexto || '', 
            denominacionRecurso: item.denominacion || '',
            monto: item.valor || 0,
            valor: item.valor || 0,
            mes: item.mes,

            ipCreacion: "0.0.0.0",
            usuarioCreacion: usuarioCreacion
        };

        return serviceProgramacionEncargosDetalle.guardarDetalleEncargos(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            finalizarGrabacionEncargos();
        })
        .catch(error => {
            finalizarGrabacionEncargos();
        });
}

function finalizarGrabacionEncargos() {
    $("#modalEncargos").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Encargo guardado correctamente");

    ITEMS_ENCARGOS_TEMP = [];
}

function cerrarModalEncargos() {
    if (ITEMS_ENCARGOS_TEMP.length > 0) {
        if (confirm('¿Desea cerrar sin guardar los cambios?')) {
            ITEMS_ENCARGOS_TEMP = [];
            $("#modalEncargos").modal("hide");
        }
    } else {
        $("#modalEncargos").modal("hide");
    }
}

function cargarClasificadoresEncargos() {
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

                fillSelectClasificadorDelGasto("cboClasificadorEncargos", requestCombos, 0, "SELECCIONE", (response) => {
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar clasificadores:", error);
        });
}

function cargarEncargosDesdeBackend(idRecurso) {
    var usuarioConsulta = obtenerUsuarioConsulta();

    var request = {
        idProgramacionEncargos: idRecurso,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionEncargos.getEncargosPorId(request, headersuarm)
        .then(function (response) {
            if (response && response.idProgramacionEncargos) {
                mostrarEncargosEnTabla(response);
            } else {
                ITEMS_ENCARGOS_TEMP = [];
                actualizarCuadroEncargos();
            }
        })
        .catch(function (error) {
            ITEMS_ENCARGOS_TEMP = [];
            actualizarCuadroEncargos();
        });
}

function mostrarEncargosEnTabla(encargos) {
    var montosPorMes = {
        1: encargos.montoEnero || 0,
        2: encargos.montoFebrero || 0,
        3: encargos.montoMarzo || 0,
        4: encargos.montoAbril || 0,
        5: encargos.montoMayo || 0,
        6: encargos.montoJunio || 0,
        7: encargos.montoJulio || 0,
        8: encargos.montoAgosto || 0,
        9: encargos.montoSetiembre || 0,
        10: encargos.montoOctubre || 0,
        11: encargos.montoNoviembre || 0,
        12: encargos.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyEncargos").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES_ENCARGOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyEncargos").append(row);

    ITEMS_ENCARGOS_TEMP = [{
        tipo: 'encargos_existente',
        idProgramacionEncargos: encargos.idProgramacionEncargos,
        montos: montosPorMes,
        clasificadorGasto: encargos.clasificadorGasto,
        denominacionRecurso: encargos.denominacionRecurso,
        valor: encargos.valor
    }];
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

function actualizarCuadroEncargos() {
    $("#tbodyEncargos").empty();

    if (ITEMS_ENCARGOS_TEMP.length === 0) {
        $("#tbodyEncargos").append(`
            <tr>
                <td>Monto</td>
                <td colspan="13" class="text-center text-muted">No hay encargos agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_ENCARGOS_TEMP.length === 1 &&
        ITEMS_ENCARGOS_TEMP[0].tipo === 'encargos_existente' &&
        ITEMS_ENCARGOS_TEMP[0].montos) {

        var montosPorMes = ITEMS_ENCARGOS_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES_ENCARGOS.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyEncargos").append(row);
        return;
    }

    var montosPorMes = {};
    MESES_ENCARGOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_ENCARGOS_TEMP.forEach(item => {
        montosPorMes[item.mes] += item.valor;
    });

    var totalGeneral = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_ENCARGOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${totalGeneral.toFixed(2)}</td></tr>`;

    $("#tbodyEncargos").append(row);
}

function actualizarCuadroEncargosTotal() {
    $("#tbodyEncargos").empty();

    if (ITEMS_ENCARGOS_TEMP.length === 0) {
        $("#tbodyEncargos").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay encargos agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES_ENCARGOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_ENCARGOS_TEMP.forEach(item => {
        if (item.tipo === 'encargos_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] += item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_ENCARGOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyEncargos").append(row);
}