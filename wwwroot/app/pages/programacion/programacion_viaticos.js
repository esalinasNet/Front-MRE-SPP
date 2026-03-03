var ITEMS_VIATICOS_TEMP = [];
var MESES_VIATICOS = [
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

var ID_PROGRAMACION_RECURSO_ACTUAL = null;

$(document).on("input", "#txtMontoViaticos, #txtDiasViaticos, #txtCantidadPersonasViaticos", function () {
    calcularTotalViaticos();
});

$(document).on("click", "#btnAgregarViatico", function () {
    agregarViatico();
});

$(document).on("click", "#btnGrabarViaticos", function () {
    grabarViaticos();
});

$(document).on("click", ".btn-gasto[data-tipo='Viaticos']", function () {
    if (typeof abrirModalViaticos === 'function') {
        abrirModalViaticos();
    }
});

function abrirModalViaticos() {
    var idRecurso = $("#hidRecursos").val();
    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_ACTUAL = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_ACTUAL = null;
    }

    $("#txtAnioViaticos").val($("#txtAnioRecurso").val());
    $("#txtActividadViaticos").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaViaticos").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaViaticos").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaViaticos").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteViaticos").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoViaticos").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoViaticos").val($("#cboUbigeoRecurso").val());

    $("#cboClasificadorViaticos").val("");
    $("#txtDenominacionRecursoViaticos").val("");
    $("#txtMontoViaticos").val("");
    $("#txtDiasViaticos").val("");
    $("#txtCantidadPersonasViaticos").val("");
    $("#txtTotalViaticos").val("");
    $("#cboMesViaticos").val("");

    cargarClasificadoresViaticos();

    if (ID_PROGRAMACION_RECURSO_ACTUAL) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionViaticos.getProgramacionViaticosListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idViatico = response[0].idProgramacionViaticos;

                    let requestObtener = {
                        idProgramacionViaticos: idViatico,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionViaticos.getViaticoPorId(requestObtener, headersuarm)
                        .then(viatico => {
                            mostrarViaticoEnTabla(viatico);
                        })
                        .catch(error => {
                            ITEMS_VIATICOS_TEMP = [];
                            actualizarCuadroViaticos();
                        });
                } else {
                    ITEMS_VIATICOS_TEMP = [];
                    actualizarCuadroViaticos();
                }
            })
            .catch(error => {
                ITEMS_VIATICOS_TEMP = [];
                actualizarCuadroViaticos();
            });
    } else {
        ITEMS_VIATICOS_TEMP = [];
        actualizarCuadroViaticos();
    }

    $("#modalViaticos").modal("show");
}

function agregarViatico() {
    var clasificador = $("#cboClasificadorViaticos").val();
    var clasificadorOption = $("#cboClasificadorViaticos option:selected");
    var clasificadorFullText = clasificadorOption.text();

    var clasificadorTexto = clasificadorFullText.includes(" - ")
        ? clasificadorFullText.split(" - ")[0].trim()
        : clasificadorFullText.trim();

    var denominacion = $("#txtDenominacionRecursoViaticos").val();
    var monto = parseFloat($("#txtMontoViaticos").val()) || 0;
    var dias = parseInt($("#txtDiasViaticos").val()) || 0;
    var cantidadPersonas = parseInt($("#txtCantidadPersonasViaticos").val()) || 0;
    var total = parseFloat($("#txtTotalViaticos").val()) || 0;
    var mes = $("#cboMesViaticos").val();
    var mesTexto = $("#cboMesViaticos option:selected").text();

    if (!clasificador) {
        alertify.error("Debe seleccionar un clasificador de gasto");
        return;
    }

    if (!denominacion || denominacion.trim() === "") {
        alertify.error("Debe ingresar la denominación del recurso");
        return;
    }

    if (monto <= 0) {
        alertify.error("Debe ingresar un monto válido");
        return;
    }

    if (dias <= 0) {
        alertify.error("Debe ingresar la cantidad de días");
        return;
    }

    if (cantidadPersonas <= 0) {
        alertify.error("Debe ingresar la cantidad de personas");
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
        monto: monto,
        dias: dias,
        cantidadPersonas: cantidadPersonas,
        total: total,
        mes: parseInt(mes),
        mesNombre: mesTexto
    };

    ITEMS_VIATICOS_TEMP.push(item);

    $("#cboClasificadorViaticos").val("");
    $("#txtDenominacionRecursoViaticos").val("");
    $("#txtMontoViaticos").val("");
    $("#txtDiasViaticos").val("");
    $("#txtCantidadPersonasViaticos").val("");
    $("#txtTotalViaticos").val("");
    $("#cboMesViaticos").val("");

    actualizarCuadroViaticosTotal();
    alertify.success("Viático agregado correctamente");
}

function eliminarViaticos(idProgramacionViaticos) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar este Viático?",
        function () {
            serviceProgramacionViaticos.delProgramacionViaticosPorId(idProgramacionViaticos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("Viático eliminado correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_VIATICOS_TEMP = [];
                        actualizarCuadroViaticos();
                    } else {
                        alertify.error("No se pudo eliminar el Viático");
                    }
                })
                .catch(error => {
                    msgException('eliminarViaticos', error);
                });
        },
        function () {
        }
    );
}

function grabarViaticos() {
    if (ITEMS_VIATICOS_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un viático");
        return;
    }

    var idAnio = parseInt(localStorage.getItem('idAnio'));

    if (!idAnio) {
        alertify.error("No se pudo determinar el año");
        return;
    }

    var montosPorMes = {};
    MESES_VIATICOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_VIATICOS_TEMP.forEach(item => {
        if (item.tipo === 'viatico_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.total;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    var primerItem = ITEMS_VIATICOS_TEMP.find(i => i.tipo !== 'viatico_existente') || ITEMS_VIATICOS_TEMP[0];

    var datosViaticos = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        idAnio: idAnio,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        idUnidadMedida: null,
        representativa: $("#chkRepresentativaRecurso").prop("checked"),
        idFuenteFinanciamiento: parseInt($("#cboFuenteFinanciamientoRecurso").val()) || null,
        idUbigeo: parseInt($("#cboUbigeoRecurso").val()) || null,
        tipoUbigeo: parseInt($("#hidTipoUbigeoViaticos").val()) || null,

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
        montoDiario: parseFloat(primerItem.monto || primerItem.montoDiario),
        dias: parseInt(primerItem.dias),
        cantidadPersonas: parseInt(primerItem.cantidadPersonas),

        idEstado: 1,
        ipCreacion: "0.0.0.0",
        usuarioCreacion: usuarioCreacion
    };

    serviceProgramacionViaticos.insProgramacionViaticos(datosViaticos, headersuarm)
        .then(responseViaticos => {
            if (responseViaticos.result > 0) {
                var idProgramacionViaticos = responseViaticos.result;
                guardarDetallesViaticos(idProgramacionViaticos, usuarioCreacion);
            } else {
                alertify.error(responseViaticos.message || "No se pudo guardar el viático");
            }
        })
        .catch(error => {
            msgException('grabarViaticos', error);
        });
}

function guardarDetallesViaticos(idProgramacionViaticos, usuarioCreacion) {

    var itemsParaGuardar = ITEMS_VIATICOS_TEMP.filter(item => item.tipo !== 'viatico_existente');

    if (itemsParaGuardar.length === 0) {
        finalizarGrabacionViaticos();
        return;
    }

    var promesas = itemsParaGuardar.map(item => {

        var detalleRequest = {
            idProgramacionViaticosDetalle: 0,
            idProgramacionViaticos: idProgramacionViaticos,
            idClasificador: item.clasificador,                 
            nombreClasificador: item.clasificadorTexto || '',  
            denominacionRecurso: item.denominacion || '',
            monto: item.monto || 0,
            cantidadPersonas: item.cantidadPersonas || 0,
            dias: item.dias || 0,
            mes: item.mes,

            ipCreacion: "0.0.0.0",
            usuarioCreacion: usuarioCreacion
        };

        return serviceProgramacionViaticosDetalle.guardarDetalleViaticos(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            finalizarGrabacionViaticos();
        })
        .catch(error => {
            finalizarGrabacionViaticos();
        });
}

function finalizarGrabacionViaticos() {
    $("#modalViaticos").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Viático guardado correctamente");

    ITEMS_VIATICOS_TEMP = [];
}

function cargarClasificadoresViaticos() {
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

                fillSelectClasificadorDelGasto("cboClasificadorViaticos", requestCombos, 0, "SELECCIONE", (response) => {
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar clasificadores:", error);
        });
}

function cargarViaticosDesdeBackend(idRecurso) {
    var usuarioConsulta = obtenerUsuarioConsulta();

    var request = {
        idProgramacionViaticos: idRecurso,
        usuarioConsulta: usuarioConsulta
    };

    serviceProgramacionViaticos.getViaticoPorId(request, headersuarm)
        .then(function (response) {
            if (response && response.idProgramacionViaticos) {
                mostrarViaticoEnTabla(response);
            } else {
                ITEMS_VIATICOS_TEMP = [];
                actualizarCuadroViaticos();
            }
        })
        .catch(function (error) {
            ITEMS_VIATICOS_TEMP = [];
            actualizarCuadroViaticos();
        });
}

function mostrarViaticoEnTabla(viatico) {
    var montosPorMes = {
        1: viatico.montoEnero || 0,
        2: viatico.montoFebrero || 0,
        3: viatico.montoMarzo || 0,
        4: viatico.montoAbril || 0,
        5: viatico.montoMayo || 0,
        6: viatico.montoJunio || 0,
        7: viatico.montoJulio || 0,
        8: viatico.montoAgosto || 0,
        9: viatico.montoSetiembre || 0,
        10: viatico.montoOctubre || 0,
        11: viatico.montoNoviembre || 0,
        12: viatico.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyViaticos").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES_VIATICOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyViaticos").append(row);

    ITEMS_VIATICOS_TEMP = [{
        tipo: 'viatico_existente',
        idProgramacionViaticos: viatico.idProgramacionViaticos,
        montos: montosPorMes,
        clasificadorGasto: viatico.clasificadorGasto,
        denominacionRecurso: viatico.denominacionRecurso,
        montoDiario: viatico.montoDiario,
        dias: viatico.dias,
        cantidadPersonas: viatico.cantidadPersonas
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

function calcularTotalViaticos() {
    var monto = parseFloat($("#txtMontoViaticos").val()) || 0;
    var dias = parseInt($("#txtDiasViaticos").val()) || 0;
    var cantidadPersonas = parseInt($("#txtCantidadPersonasViaticos").val()) || 0;

    var total = monto * dias * cantidadPersonas;
    $("#txtTotalViaticos").val(total.toFixed(2));
}

function actualizarCuadroViaticos() {
    $("#tbodyViaticos").empty();

    if (ITEMS_VIATICOS_TEMP.length === 0) {
        $("#tbodyViaticos").append(`
            <tr>
                <td>Monto</td>
                <td colspan="13" class="text-center text-muted">No hay viáticos agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_VIATICOS_TEMP.length === 1 &&
        ITEMS_VIATICOS_TEMP[0].tipo === 'viatico_existente' &&
        ITEMS_VIATICOS_TEMP[0].montos) {

        var montosPorMes = ITEMS_VIATICOS_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES_VIATICOS.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyViaticos").append(row);
        return;
    }

    var montosPorMes = {};
    MESES_VIATICOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_VIATICOS_TEMP.forEach(item => {
        montosPorMes[item.mes] += item.total;
    });

    var totalGeneral = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_VIATICOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${totalGeneral.toFixed(2)}</td></tr>`;

    $("#tbodyViaticos").append(row);
}

function actualizarCuadroViaticosTotal() {
    $("#tbodyViaticos").empty();

    if (ITEMS_VIATICOS_TEMP.length === 0) {
        $("#tbodyViaticos").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay viáticos agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES_VIATICOS.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_VIATICOS_TEMP.forEach(item => {
        if (item.tipo === 'viatico_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] += item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.total;
        }
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_VIATICOS.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyViaticos").append(row);
}