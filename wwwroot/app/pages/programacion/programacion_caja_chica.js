var ITEMS_CAJA_CHICA_TEMP = [];
var MESES = [
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
var GRUPO_BIEN_SELECCIONADO_CAJA_CHICA = null;

$(function () {
    $(document).on("click", ".btn-gasto[data-tipo='CajaChica']", function () {
        abrirModalCajaChica();
    });

    $("#btnInsertarItemsCajaChica").click(abrirModalInsertarItemsCajaChica);
    $("#btnGrabarCajaChica").click(grabarCajaChica);
    $("#btnBuscarItemCajaChicaNacional").click(buscarItemsCajaChicaNacional);
    $("#btnAgregarItemsCajaChicaNacional").click(agregarItemsCajaChicaNacional);

    $("#cboGenericoCajaChicaNacional").change(onChangeGenericoCajaChica);
});

function onChangeGenericoCajaChica() {
    var grupoBien = $(this).val();

    if (grupoBien) {
        GRUPO_BIEN_SELECCIONADO_CAJA_CHICA = grupoBien;
        cargarItemsCajaChicaPorGrupoBien(grupoBien, "");
    } else {
        GRUPO_BIEN_SELECCIONADO_CAJA_CHICA = null;
        $("#tbodyItemsCajaChicaNacional").empty();
        $("#tbodyItemsCajaChicaNacional").append(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Seleccione un genérico
                </td>
            </tr>
        `);
    }
}

function cargarItemsCajaChicaPorGrupoBien(grupoBien, busqueda) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        grupoBien: grupoBien
    };

    $("#tbodyItemsCajaChicaNacional").empty();
    $("#tbodyItemsCajaChicaNacional").append(`
        <tr>
            <td colspan="7" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando ítems...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoGrupoBien(params, headersuarm)
        .then(response => {
            $("#tbodyItemsCajaChicaNacional").empty();

            if (response && response.length > 0) {
                var itemsFiltrados = response;
                if (busqueda && busqueda.trim() !== "") {
                    var terminoBusqueda = busqueda.toLowerCase().trim();
                    itemsFiltrados = response.filter(item =>
                        item.nombreBien.toLowerCase().includes(terminoBusqueda) ||
                        item.codigoBien.toLowerCase().includes(terminoBusqueda)
                    );
                }

                if (itemsFiltrados.length === 0) {
                    $("#tbodyItemsCajaChicaNacional").append(`
                        <tr>
                            <td colspan="7" class="text-center text-muted">
                                No se encontraron ítems que coincidan con "${busqueda}"
                            </td>
                        </tr>
                    `);
                    return;
                }

                itemsFiltrados.forEach(function (item) {
                    var row = `
                        <tr data-id-clasificador="${item.idClasificador}">
                            <td>${item.codigoBien}</td>
                            <td>${item.nombreBien}</td>
                            <td><input type="number" class="form-control form-control-sm item-cantidad" value="0" min="0" step="0.01" /></td>
                            <td>${item.descripcionUinidadMedida || 'N/A'}</td>
                            <td><input type="number" class="form-control form-control-sm item-precio" value="${item.precio ? item.precio.toFixed(2) : '0.00'}" min="0" step="0.01" readonly /></td>
                            <td>${item.clasificadorGasto || 'N/A'}</td>
                            <td>${item.descripcionClasificador || 'N/A'}</td>
                            <td>
                                <select class="form-select form-select-sm item-mes">
                                    <option value="">Seleccionar</option>
                                    ${MESES.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                    `;
                    $("#tbodyItemsCajaChicaNacional").append(row);
                });
            } else {
                $("#tbodyItemsCajaChicaNacional").append(`
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            No se encontraron ítems para este grupo
                        </td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            $("#tbodyItemsCajaChicaNacional").empty();
            $("#tbodyItemsCajaChicaNacional").append(`
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error al cargar los ítems
                    </td>
                </tr>
            `);
            msgException('cargarItemsCajaChicaPorGrupoBien', error);
        });
}

function abrirModalCajaChica() {
    var idRecurso = $("#hidRecursos").val();

    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_ACTUAL = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_ACTUAL = null;
    }

    $("#txtAnioCajaChica").val($("#txtAnioRecurso").val());
    $("#txtActividadCajaChica").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaCajaChica").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaCajaChica").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaCajaChica").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteCajaChica").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoCajaChica").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoCajaChica").val($("#cboUbigeoRecurso").val());

    if (ID_PROGRAMACION_RECURSO_ACTUAL) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionCajaChica.getProgramacionCajaChicaListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idCajaChica = response[0].idProgramacionCajaChica;

                    let requestObtener = {
                        idProgramacionCajaChica: idCajaChica,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionCajaChica.getCajaChicaPorId(requestObtener, headersuarm)
                        .then(cajaChica => {
                            mostrarCajaChicaEnTabla(cajaChica);
                        })
                        .catch(error => {
                            ITEMS_CAJA_CHICA_TEMP = [];
                            actualizarTablaCajaChica();
                        });
                } else {
                    ITEMS_CAJA_CHICA_TEMP = [];
                    actualizarTablaCajaChica();
                }
            })
            .catch(error => {
                ITEMS_CAJA_CHICA_TEMP = [];
                actualizarTablaCajaChica();
            });
    } else {
        ITEMS_CAJA_CHICA_TEMP = [];
        actualizarTablaCajaChica();
    }

    $("#modalCajaChica").modal("show");
}

function mostrarCajaChicaEnTabla(cajaChica) {
    var montosPorMes = {
        1: cajaChica.montoEnero || 0,
        2: cajaChica.montoFebrero || 0,
        3: cajaChica.montoMarzo || 0,
        4: cajaChica.montoAbril || 0,
        5: cajaChica.montoMayo || 0,
        6: cajaChica.montoJunio || 0,
        7: cajaChica.montoJulio || 0,
        8: cajaChica.montoAgosto || 0,
        9: cajaChica.montoSetiembre || 0,
        10: cajaChica.montoOctubre || 0,
        11: cajaChica.montoNoviembre || 0,
        12: cajaChica.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyCajaChica").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyCajaChica").append(row);

    ITEMS_CAJA_CHICA_TEMP = [{
        tipo: 'caja_chica_existente',
        idProgramacionCajaChica: cajaChica.idProgramacionCajaChica,
        montos: montosPorMes
    }];
}

function actualizarTablaCajaChica() {
    $("#tbodyCajaChica").empty();

    if (ITEMS_CAJA_CHICA_TEMP.length === 0) {
        $("#tbodyCajaChica").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_CAJA_CHICA_TEMP.length === 1 && ITEMS_CAJA_CHICA_TEMP[0].tipo === 'caja_chica_existente' && ITEMS_CAJA_CHICA_TEMP[0].montos) {
        var montosPorMes = ITEMS_CAJA_CHICA_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyCajaChica").append(row);
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CAJA_CHICA_TEMP.forEach(item => {
        var monto = item.cantidad ? (item.cantidad * item.precio) : item.valor;
        montosPorMes[item.mes] += monto;
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyCajaChica").append(row);
}

function actualizarTablaCajaChicaTotal() {
    $("#tbodyCajaChica").empty();

    if (ITEMS_CAJA_CHICA_TEMP.length === 0) {
        $("#tbodyCajaChica").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CAJA_CHICA_TEMP.forEach(item => {
        if (item.tipo === 'caja_chica_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] += item.montos[mes];
            });
        } else {
            var monto = item.cantidad ? (item.cantidad * item.precio) : item.valor;
            montosPorMes[item.mes] += monto;
        }
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyCajaChica").append(row);
}

function abrirModalInsertarItemsCajaChica() {
    var tipoUbigeo = $("#hidTipoUbigeoCajaChica").val();

    if (!tipoUbigeo || tipoUbigeo === "") {
        alertify.error("No se ha detectado el tipo de ubigeo. Por favor, verifique la selección.");
        return;
    }

    if (tipoUbigeo === "1") {
        abrirModalItemsCajaChicaNacional();
    } else if (tipoUbigeo === "2") {
        alertify.warning("Modal para ítems exterior no implementado aún");
    } else {
        alertify.error("Tipo de ubigeo no válido: " + tipoUbigeo);
    }
}

function abrirModalItemsCajaChicaNacional() {
    $("#cboGenericoCajaChicaNacional").empty().append('<option value="">Cargando...</option>');
    $("#txtBusquedaCajaChicaNacional").val("");

    GRUPO_BIEN_SELECCIONADO_CAJA_CHICA = null;

    $("#tbodyItemsCajaChicaNacional").empty();
    $("#tbodyItemsCajaChicaNacional").append(`
        <tr>
            <td colspan="8" class="text-center text-muted">
                Seleccione un genérico para ver los suministros
            </td>
        </tr>
    `);

    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        tipoBien: "s"
    };

    serviceBienesServicios.getListadoGrupo(params, headersuarm)
        .then(response => {
            $("#cboGenericoCajaChicaNacional").empty().append('<option value="">Seleccionar</option>');

            if (response && response.length > 0) {
                response.forEach(grupo => {
                    $("#cboGenericoCajaChicaNacional").append(
                        `<option value="${grupo.grupoBien}" data-id-grupo="${grupo.idGrupo}">${grupo.nombreBien}</option>`
                    );
                });
            } else {
                alertify.warning("No se encontraron genéricos de suministros");
            }
        })
        .catch(error => {
            $("#cboGenericoCajaChicaNacional").empty().append('<option value="">Seleccionar</option>');
            msgException('abrirModalItemsCajaChicaNacional', error);
        });

    $("#modalItemsCajaChicaNacional").modal("show");
}

function buscarItemsCajaChicaNacional() {
    var busqueda = $("#txtBusquedaCajaChicaNacional").val();

    if (!GRUPO_BIEN_SELECCIONADO_CAJA_CHICA) {
        alertify.error("Debe seleccionar un genérico primero");
        return;
    }

    cargarItemsCajaChicaPorGrupoBien(GRUPO_BIEN_SELECCIONADO_CAJA_CHICA, busqueda);
}

function agregarItemsCajaChicaNacional() {
    var itemsSeleccionados = [];
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    $("#tbodyItemsCajaChicaNacional tr").each(function () {
        var cantidad = parseFloat($(this).find(".item-cantidad").val());
        var precio = parseFloat($(this).find(".item-precio").val());
        var mes = $(this).find(".item-mes").val();

        if (!isNaN(cantidad) && cantidad !== null && cantidad !== '' &&
            !isNaN(precio) && precio !== null && precio !== '' && mes) {

            var $row = $(this);
            var item = {
                codigo: $row.find("td:eq(0)").text(),
                descripcion: $row.find("td:eq(1)").text(),
                cantidad: cantidad,
                unidad: $row.find("td:eq(3)").text(),
                precio: precio,
                idClasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(5)").text(),
                nombreClasificador: $row.find("td:eq(6)").text(),
                mes: parseInt(mes),
                mesNombre: MESES.find(m => m.id == mes).nombre,
                idAnio: idAnio
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe seleccionar al menos un ítem con mes asignado");
        return;
    }

    ITEMS_CAJA_CHICA_TEMP = ITEMS_CAJA_CHICA_TEMP.concat(itemsSeleccionados);
    actualizarTablaCajaChicaTotal();

    $("#modalItemsCajaChicaNacional").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} ítems`);
}

function grabarCajaChica() {
    if (ITEMS_CAJA_CHICA_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un ítem");
        return;
    }

    var idAnio = obtenerIdAnioDesdeLocalStorage();

    if (!idAnio && ITEMS_CAJA_CHICA_TEMP[0] && ITEMS_CAJA_CHICA_TEMP[0].idAnio) {
        idAnio = ITEMS_CAJA_CHICA_TEMP[0].idAnio;
    }

    if (!idAnio) {
        alertify.error("No se pudo determinar el año de Caja Chica");
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CAJA_CHICA_TEMP.forEach(item => {
        if (item.tipo === 'caja_chica_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            var monto = item.cantidad ? (item.cantidad * item.precio) : item.valor;
            montosPorMes[item.mes] += monto;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    var datosCajaChica = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
        idProgramacionTareas: IDTAREAS_RECURSO,
        idAnio: idAnio,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        idTarea: IDTAREAS_RECURSO,
        idUnidadMedida: null,
        representativa: $("#chkRepresentativaCajaChica").prop("checked"),
        idFuenteFinanciamiento: parseInt($("#cboFuenteFinanciamientoRecurso").val()) || null,
        idUbigeo: parseInt($("#cboUbigeoRecurso").val()) || null,
        tipoUbigeo: parseInt($("#hidTipoUbigeoCajaChica").val()) || null,

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

        idEstado: 1,
        ipCreacion: "0.0.0.0",
        usuarioCreacion: usuarioCreacion
    };

    serviceProgramacionCajaChica.insProgramacionCajaChica(datosCajaChica, headersuarm)
        .then(responseCajaChica => {
            if (responseCajaChica.result > 0) {
                var idProgramacionCajaChica = responseCajaChica.result;
                guardarDetallesCajaChica(idProgramacionCajaChica, usuarioCreacion);
            } else {
                alertify.error(responseCajaChica.message || "No se pudo guardar la Caja Chica");
            }
        })
        .catch(error => {
            msgException('grabarCajaChica', error);
        });
}

function guardarDetallesCajaChica(idProgramacionCajaChica, usuarioCreacion) {
    var itemsParaGuardar = ITEMS_CAJA_CHICA_TEMP.filter(item => item.tipo !== 'caja_chica_existente');

    if (itemsParaGuardar.length === 0) {
        finalizarGrabacionCajaChica();
        return;
    }

    var promesas = itemsParaGuardar.map(item => {
        var montosDetalle = {
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

        var montoItem = item.cantidad !== undefined && item.cantidad !== null && item.precio !== undefined && item.precio !== null
            ? (item.cantidad * item.precio)
            : (item.valor !== undefined && item.valor !== null ? item.valor : 0);

        var nombreMesProp = obtenerNombrePropiedadMes(item.mes);
        montosDetalle[nombreMesProp] = montoItem;

        var detalleRequest = {
            idProgramacionCajaChicaDetalle: 0,
            idProgramacionCajaChica: idProgramacionCajaChica,
            codigoItem: item.codigo || '',
            descripcion: item.descripcion || '',
            cantidad: item.cantidad !== undefined && item.cantidad !== null ? item.cantidad : 0,
            idUnidadMedida: 1,
            precioUnitario: item.precio !== undefined && item.precio !== null ? item.precio : (item.valor !== undefined && item.valor !== null ? item.valor : 0),
            idClasificador: item.idClasificador || 0,
            nombreClasificador: item.clasificadorTexto || '',

            montoEnero: montosDetalle.montoEnero,
            montoFebrero: montosDetalle.montoFebrero,
            montoMarzo: montosDetalle.montoMarzo,
            montoAbril: montosDetalle.montoAbril,
            montoMayo: montosDetalle.montoMayo,
            montoJunio: montosDetalle.montoJunio,
            montoJulio: montosDetalle.montoJulio,
            montoAgosto: montosDetalle.montoAgosto,
            montoSetiembre: montosDetalle.montoSetiembre,
            montoOctubre: montosDetalle.montoOctubre,
            montoNoviembre: montosDetalle.montoNoviembre,
            montoDiciembre: montosDetalle.montoDiciembre,

            ipCreacion: "0.0.0.0",
            usuarioCreacion: usuarioCreacion
        };

        return serviceProgramacionCajaChicaDetalle.guardarDetalleCajaChica(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            finalizarGrabacionCajaChica();
        })
        .catch(error => {
            finalizarGrabacionCajaChica();
        });
}

function obtenerNombrePropiedadMes(numeroMes) {
    var mesesMap = {
        1: 'montoEnero',
        2: 'montoFebrero',
        3: 'montoMarzo',
        4: 'montoAbril',
        5: 'montoMayo',
        6: 'montoJunio',
        7: 'montoJulio',
        8: 'montoAgosto',
        9: 'montoSetiembre',
        10: 'montoOctubre',
        11: 'montoNoviembre',
        12: 'montoDiciembre'
    };
    return mesesMap[numeroMes] || 'montoEnero';
}

function finalizarGrabacionCajaChica() {
    $("#modalCajaChica").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Caja Chica guardada correctamente");

    ITEMS_CAJA_CHICA_TEMP = [];
}

function eliminarCajaChica(idProgramacionCajaChica) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar esta Caja Chica?",
        function () {
            serviceProgramacionCajaChica.delProgramacionCajaChicaPorId(idProgramacionCajaChica, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("Caja Chica eliminada correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_CAJA_CHICA_TEMP = [];
                        actualizarTablaCajaChica();
                    } else {
                        alertify.error("No se pudo eliminar Caja Chica");
                    }
                })
                .catch(error => {
                    msgException('eliminarCajaChica', error);
                });
        },
        function () {
        }
    );
}

function obtenerIdAnioDesdeLocalStorage() {
    try {
        var idAnio = localStorage.getItem('idAnio');
        if (idAnio) {
            return parseInt(idAnio);
        }
    } catch (e) {
        return null;
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
        return 'admin';
    }
    return usuarioConsulta;
}