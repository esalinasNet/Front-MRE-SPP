var ITEMS_OTROS_GASTOS_TEMP = [];
var MESES_OTROS_GASTOS = [
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

var ID_PROGRAMACION_RECURSO_OTROS_GASTOS = null;

$(document).on("click", "#btnAgregarOtroGasto", function () {
    agregarOtroGasto();
});

$(document).on("click", "#btnGrabarOtrosGastos", function () {
    grabarOtrosGastos();
});

$(document).on("click", ".btn-gasto[data-tipo='OtrosGastos']", function () {
    if (typeof abrirModalOtrosGastos === 'function') {
        abrirModalOtrosGastos();
    }
});

function abrirModalOtrosGastos() {
    var idRecurso = $("#hidRecursos").val();
    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_OTROS_GASTOS = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_OTROS_GASTOS = null;
    }

    $("#txtAnioOtrosGastos").val($("#txtAnioRecurso").val());
    $("#txtActividadOtrosGastos").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaOtrosGastos").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaOtrosGastos").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaOtrosGastos").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteOtrosGastos").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoOtrosGastos").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoOtrosGastos").val($("#cboUbigeoRecurso").val());

    $("#txtGenericoOtrosGastos").val("");
    $("#cboClasificadorOtrosGastos").val("");
    $("#txtDenominacionRecursoOtrosGastos").val("");
    $("#txtValorOtrosGastos").val("");
    $("#cboMesOtrosGastos").val("");

    cargarClasificadoresOtrosGastos();

    if (ID_PROGRAMACION_RECURSO_OTROS_GASTOS) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_OTROS_GASTOS,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionOtrosGastos.getProgramacionOtrosGastosListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idOtroGasto = response[0].idProgramacionOtrosGastos;

                    let requestObtener = {
                        idProgramacionOtrosGastos: idOtroGasto,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionOtrosGastos.getOtrosGastosPorId(requestObtener, headersuarm)
                        .then(otroGasto => {
                            mostrarOtrosGastosEnTabla(otroGasto);
                        })
                        .catch(error => {
                            ITEMS_OTROS_GASTOS_TEMP = [];
                            actualizarCuadroOtrosGastos();
                        });
                } else {
                    ITEMS_OTROS_GASTOS_TEMP = [];
                    actualizarCuadroOtrosGastos();
                }
            })
            .catch(error => {
                ITEMS_OTROS_GASTOS_TEMP = [];
                actualizarCuadroOtrosGastos();
            });
    } else {
        ITEMS_OTROS_GASTOS_TEMP = [];
        actualizarCuadroOtrosGastos();
    }

    $("#modalOtrosGastos").modal("show");
}

function agregarOtroGasto() {
    var generico = $("#txtGenericoOtrosGastos").val();
    var clasificador = $("#cboClasificadorOtrosGastos").val();
    var clasificadorOption = $("#cboClasificadorOtrosGastos option:selected");
    var clasificadorFullText = clasificadorOption.text();

    var clasificadorTexto = clasificadorFullText.includes(" - ")
        ? clasificadorFullText.split(" - ")[0].trim()
        : clasificadorFullText.trim();

    var denominacion = $("#txtDenominacionRecursoOtrosGastos").val();
    var valor = parseFloat($("#txtValorOtrosGastos").val()) || 0;
    var mes = $("#cboMesOtrosGastos").val();
    var mesTexto = $("#cboMesOtrosGastos option:selected").text();

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
        generico: generico || null,
        clasificador: parseInt(clasificador), 
        clasificadorTexto: clasificadorTexto,  
        denominacion: denominacion,
        valor: valor,
        mes: parseInt(mes),
        mesNombre: mesTexto
    };

    ITEMS_OTROS_GASTOS_TEMP.push(item);

    $("#txtGenericoOtrosGastos").val("");
    $("#cboClasificadorOtrosGastos").val("");
    $("#txtDenominacionRecursoOtrosGastos").val("");
    $("#txtValorOtrosGastos").val("");
    $("#cboMesOtrosGastos").val("");

    actualizarCuadroOtrosGastosTotal();
    alertify.success("Otros Gastos agregado correctamente");
}

function eliminarOtrosGastos(idProgramacionOtrosGastos) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar este Otros Gastos?",
        function () {
            serviceProgramacionOtrosGastos.delProgramacionOtrosGastosPorId(idProgramacionOtrosGastos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("Otros Gastos eliminado correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_OTROS_GASTOS_TEMP = [];
                        actualizarCuadroOtrosGastos();
                    } else {
                        alertify.error("No se pudo eliminar Otros Gastos");
                    }
                })
                .catch(error => {
                    msgException('eliminarOtrosGastos', error);
                });
        },
        function () {
        }
    );
}

function grabarOtrosGastos() {
    if (ITEMS_OTROS_GASTOS_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un gasto");
        return;
    }

    var idAnio = parseInt(localStorage.getItem('idAnio'));

    if (!idAnio) {
        alertify.error("No se pudo determinar el año");
        return;
    }

    var montosPorMes = {};
    MESES_OTROS_GASTOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_OTROS_GASTOS_TEMP.forEach(item => {
        if (item.tipo === 'otros_gastos_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    var primerItem = ITEMS_OTROS_GASTOS_TEMP.find(i => i.tipo !== 'otros_gastos_existente') || ITEMS_OTROS_GASTOS_TEMP[0];

    var datosOtrosGastos = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_OTROS_GASTOS,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        idAnio: idAnio,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        idUnidadMedida: null,
        representativa: $("#chkRepresentativaRecurso").prop("checked"),
        idFuenteFinanciamiento: parseInt($("#cboFuenteFinanciamientoRecurso").val()) || null,
        idUbigeo: parseInt($("#cboUbigeoRecurso").val()) || null,
        tipoUbigeo: parseInt($("#hidTipoUbigeoOtrosGastos").val()) || null,

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

    serviceProgramacionOtrosGastos.insProgramacionOtrosGastos(datosOtrosGastos, headersuarm)
        .then(responseOtrosGastos => {
            if (responseOtrosGastos.result > 0) {
                var idProgramacionOtrosGastos = responseOtrosGastos.result;
                guardarDetallesOtrosGastos(idProgramacionOtrosGastos, usuarioCreacion);
            } else {
                alertify.error(responseOtrosGastos.message || "No se pudo guardar Otros Gastos");
            }
        })
        .catch(error => {
            msgException('grabarOtrosGastos', error);
        });
}

function guardarDetallesOtrosGastos(idProgramacionOtrosGastos, usuarioCreacion) {

    var itemsParaGuardar = ITEMS_OTROS_GASTOS_TEMP.filter(item => item.tipo !== 'otros_gastos_existente');

    if (itemsParaGuardar.length === 0) {
        finalizarGrabacionOtrosGastos();
        return;
    }

    var promesas = itemsParaGuardar.map(item => {

        var detalleRequest = {
            idProgramacionOtrosGastosDetalle: 0,
            idProgramacionOtrosGastos: idProgramacionOtrosGastos,
            generico: item.generico || null,
            idClasificador: item.clasificador,              
            nombreClasificador: item.clasificadorTexto || '', 
            denominacionRecurso: item.denominacion || '',
            monto: item.valor || 0,
            valor: item.valor || 0,
            mes: item.mes,

            ipCreacion: "0.0.0.0",
            usuarioCreacion: usuarioCreacion
        };

        return serviceProgramacionOtrosGastosDetalle.guardarDetalleOtrosGastos(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            finalizarGrabacionOtrosGastos();
        })
        .catch(error => {
            finalizarGrabacionOtrosGastos();
        });
}

function finalizarGrabacionOtrosGastos() {
    $("#modalOtrosGastos").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Otros Gastos guardado correctamente");

    ITEMS_OTROS_GASTOS_TEMP = [];
}

function cargarClasificadoresOtrosGastos() {
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

                fillSelectClasificadorDelGasto("cboClasificadorOtrosGastos", requestCombos, 0, "SELECCIONE", (response) => {
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar clasificadores:", error);
        });
}

function cargarOtrosGastosDesdeBackend(idRecurso) {
    var usuarioConsulta = obtenerUsuarioConsulta();

    var request = {
        idProgramacionOtrosGastos: idRecurso,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionOtrosGastos.getOtrosGastosPorId(request, headersuarm)
        .then(function (response) {
            if (response && response.idProgramacionOtrosGastos) {
                mostrarOtrosGastosEnTabla(response);
            } else {
                ITEMS_OTROS_GASTOS_TEMP = [];
                actualizarCuadroOtrosGastos();
            }
        })
        .catch(function (error) {
            ITEMS_OTROS_GASTOS_TEMP = [];
            actualizarCuadroOtrosGastos();
        });
}

function mostrarOtrosGastosEnTabla(otrosGastos) {
    var montosPorMes = {
        1: otrosGastos.montoEnero || 0,
        2: otrosGastos.montoFebrero || 0,
        3: otrosGastos.montoMarzo || 0,
        4: otrosGastos.montoAbril || 0,
        5: otrosGastos.montoMayo || 0,
        6: otrosGastos.montoJunio || 0,
        7: otrosGastos.montoJulio || 0,
        8: otrosGastos.montoAgosto || 0,
        9: otrosGastos.montoSetiembre || 0,
        10: otrosGastos.montoOctubre || 0,
        11: otrosGastos.montoNoviembre || 0,
        12: otrosGastos.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyOtrosGastos").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES_OTROS_GASTOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyOtrosGastos").append(row);

    ITEMS_OTROS_GASTOS_TEMP = [{
        tipo: 'otros_gastos_existente',
        idProgramacionOtrosGastos: otrosGastos.idProgramacionOtrosGastos,
        montos: montosPorMes,
        clasificadorGasto: otrosGastos.clasificadorGasto,
        denominacionRecurso: otrosGastos.denominacionRecurso,
        valor: otrosGastos.valor
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

function actualizarCuadroOtrosGastos() {
    $("#tbodyOtrosGastos").empty();

    if (ITEMS_OTROS_GASTOS_TEMP.length === 0) {
        $("#tbodyOtrosGastos").append(`
            <tr>
                <td>Monto</td>
                <td colspan="13" class="text-center text-muted">No hay gastos agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_OTROS_GASTOS_TEMP.length === 1 &&
        ITEMS_OTROS_GASTOS_TEMP[0].tipo === 'otros_gastos_existente' &&
        ITEMS_OTROS_GASTOS_TEMP[0].montos) {

        var montosPorMes = ITEMS_OTROS_GASTOS_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES_OTROS_GASTOS.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyOtrosGastos").append(row);
        return;
    }

    var montosPorMes = {};
    MESES_OTROS_GASTOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_OTROS_GASTOS_TEMP.forEach(item => {
        montosPorMes[item.mes] += item.valor;
    });

    var totalGeneral = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_OTROS_GASTOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${totalGeneral.toFixed(2)}</td></tr>`;

    $("#tbodyOtrosGastos").append(row);
}

function actualizarCuadroOtrosGastosTotal() {
    $("#tbodyOtrosGastos").empty();

    if (ITEMS_OTROS_GASTOS_TEMP.length === 0) {
        $("#tbodyOtrosGastos").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay gastos agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES_OTROS_GASTOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_OTROS_GASTOS_TEMP.forEach(item => {
        if (item.tipo === 'otros_gastos_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] += item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_OTROS_GASTOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyOtrosGastos").append(row);
}