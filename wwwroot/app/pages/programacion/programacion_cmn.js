var ITEMS_CMN_TEMP = [];
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
var GRUPO_BIEN_SELECCIONADO_NACIONAL = null;
var GRUPO_BIEN_SELECCIONADO_EXTERIOR = null;
var GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL = null;

$(function () {
    $("#btnInsertarItemsCMN").click(onClickInsertarItemsCMN);
    $("#cboTipoItemNacional").change(onChangeTipoItemNacional);
    $("#cboGenericoNacional").change(onChangeGenericoNacional);
    $("#btnBuscarItemNacional").click(onClickBuscarItemNacional);
    $("#btnAgregarItemsNacional").click(agregarItemsNacional);

    $("#cboTipoItemExterior").change(onChangeTipoItemExterior);
    $("#cboGenericoExterior").change(onChangeGenericoExterior);
    $("#btnBuscarItemExterior").click(onClickBuscarItemExterior);
    $("#btnAgregarItemsExterior").click(agregarItemsExterior);

    $("#btnBuscarServicioNacional").click(onClickBuscarServicioNacional);
    $("#btnAgregarServiciosNacional").click(agregarServiciosNacional);

    $("#btnBuscarServicioExterior").click(onClickBuscarServicioExterior);
    $("#btnAgregarServiciosExterior").click(agregarServiciosExterior);

    $("#cboGenericoServicioNacional").change(onChangeGenericoServicioNacional);

    $("#btnGrabarCMN").click(grabarCMN);
});

function onClickInsertarItemsCMN() {
    var tipoUbigeo = $("#hidTipoUbigeoCMN").val();

    if (!tipoUbigeo || tipoUbigeo === "") {
        alertify.error("No se ha detectado el tipo de ubigeo. Por favor, verifique la selección.");
        return;
    }

    if (tipoUbigeo === "1") {
        abrirModalItemsNacional();
    } else if (tipoUbigeo === "2") {
        abrirModalItemsExterior();
    } else {
        alertify.error("Tipo de ubigeo no válido: " + tipoUbigeo);
    }
}

function onChangeTipoItemNacional() {
    var tipoItem = $(this).val();

    if (tipoItem === "3") {
        $("#modalItemsNacional").modal("hide");
        setTimeout(function () {
            abrirModalServiciosNacional();
        }, 300);
    } else if (tipoItem) {
        cargarGenericosNacionalDesdeAPI(tipoItem);
    } else {
        $("#cboGenericoNacional").empty().append('<option value="">Seleccionar</option>');
        GRUPO_BIEN_SELECCIONADO_NACIONAL = null;
    }
}

function onChangeGenericoNacional() {
    var grupoBien = $(this).val();

    if (grupoBien) {
        GRUPO_BIEN_SELECCIONADO_NACIONAL = grupoBien;
        cargarItemsPorGrupoBien(grupoBien, "");
    } else {
        GRUPO_BIEN_SELECCIONADO_NACIONAL = null;
        $("#tbodyItemsNacional").empty();
        $("#tbodyItemsNacional").append(`
            <tr>
                <td colspan="9" class="text-center text-muted">
                    Seleccione un genérico
                </td>
            </tr>
        `);
    }
}

function onClickBuscarItemNacional() {
    var tipoItem = $("#cboTipoItemNacional").val();
    var generico = $("#cboGenericoNacional").val();
    var busqueda = $("#txtBusquedaNacional").val();

    if (!tipoItem) {
        alertify.error("Debe seleccionar un tipo de ítem");
        return;
    }

    buscarItemsNacional(tipoItem, generico, busqueda);
}

function onChangeTipoItemExterior() {
    var tipoItem = $(this).val();

    if (tipoItem === "3") {
        $("#modalItemsExterior").modal("hide");
        setTimeout(function () {
            abrirModalServiciosExterior();
        }, 300);
    } else if (tipoItem) {
        cargarGenericosExteriorDesdeAPI(tipoItem);
    } else {
        $("#cboGenericoExterior").empty().append('<option value="">Seleccionar</option>');
        GRUPO_BIEN_SELECCIONADO_EXTERIOR = null;
    }
}

function onChangeGenericoExterior() {
    var grupoBien = $(this).val();

    if (grupoBien) {
        GRUPO_BIEN_SELECCIONADO_EXTERIOR = grupoBien;
        cargarItemsExteriorPorGrupoBien(grupoBien, "");
    } else {
        GRUPO_BIEN_SELECCIONADO_EXTERIOR = null;
        $("#tbodyItemsExterior").empty();
        $("#tbodyItemsExterior").append(`
            <tr>
                <td colspan="9" class="text-center text-muted">
                    Seleccione un genérico
                </td>
            </tr>
        `);
    }
}

function onClickBuscarItemExterior() {
    var tipoItem = $("#cboTipoItemExterior").val();
    var generico = $("#cboGenericoExterior").val();
    var busqueda = $("#txtBusquedaExterior").val();

    if (!tipoItem) {
        alertify.error("Debe seleccionar un tipo de ítem");
        return;
    }

    buscarItemsExterior(tipoItem, generico, busqueda);
}

function onChangeGenericoServicioNacional() {
    var grupoBien = $(this).val();

    if (grupoBien) {
        GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL = grupoBien;
        cargarServiciosPorGrupoBien(grupoBien, "");
    } else {
        GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL = null;
        $("#tbodyServiciosNacional").empty();
        $("#tbodyServiciosNacional").append(`
            <tr>
                <td colspan="9" class="text-center text-muted">
                    Seleccione un genérico
                </td>
            </tr>
        `);
    }
}

function onClickBuscarServicioNacional() {
    var busqueda = $("#txtBusquedaServicioNacional").val();

    if (!GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL) {
        alertify.error("Debe seleccionar un genérico primero");
        return;
    }

    cargarServiciosPorGrupoBien(GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL, busqueda);
}

function onClickBuscarServicioExterior() {
    var generico = $("#cboGenericoServicioExterior").val();
    var busqueda = $("#txtBusquedaServicioExterior").val();
    buscarServiciosExterior(generico, busqueda);
}

function abrirModalCMN() {
    var idRecurso = $("#hidRecursos").val();

    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_ACTUAL = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_ACTUAL = null;
    }

    $("#txtAnioCMN").val($("#txtAnioRecurso").val());
    $("#txtActividadCMN").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaCMN").val($("#txtTareaRecurso").val());
    $("#cboUnidadMedidaCMN").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaCMN").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteCMN").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoCMN").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoCMN").val($("#cboUbigeoRecurso").val());

    if (ID_PROGRAMACION_RECURSO_ACTUAL) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionCmn.getProgramacionCmnListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idCmn = response[0].idProgramacionCmn;

                    let requestObtener = {
                        idProgramacionCmn: idCmn,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionCmn.getCmnPorId(requestObtener, headersuarm)
                        .then(cmn => {
                            mostrarCmnEnTabla(cmn);
                        })
                        .catch(error => {
                            ITEMS_CMN_TEMP = [];
                            actualizarCuadroMultianual();
                        });
                } else {
                    ITEMS_CMN_TEMP = [];
                    actualizarCuadroMultianual();
                }
            })
            .catch(error => {
                ITEMS_CMN_TEMP = [];
                actualizarCuadroMultianual();
            });
    } else {
        ITEMS_CMN_TEMP = [];
        actualizarCuadroMultianual();
    }

    $("#modalCuadroMultianual").modal("show");
}

function eliminarCMN(idProgramacionCmn) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar este CMN?",
        function () {
            serviceProgramacionCmn.delProgramacionCmnPorId(idProgramacionCmn, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("CMN eliminado correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_CMN_TEMP = [];
                        actualizarCuadroMultianual();
                    } else {
                        alertify.error("No se pudo eliminar el CMN");
                    }
                })
                .catch(error => {
                    msgException('eliminarCMN', error);
                });
        },
        function () {
        }
    );
}

function grabarCMN() {
    if (ITEMS_CMN_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un ítem");
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CMN_TEMP.forEach(item => {
        if (item.tipo === 'cmn_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            var monto = item.cantidad ? (item.cantidad * item.precio) : item.valor;
            montosPorMes[item.mes] += monto;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    // Solo enviamos los campos que el SP necesita como parámetros
    var datosCmn = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_ACTUAL,
        idProgramacionTareas: IDTAREAS_RECURSO,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        tipoUbigeo: parseInt($("#hidTipoUbigeoCMN").val()) || null,

        // Montos mensuales
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

    console.log("→ Datos CMN a guardar:", datosCmn);

    serviceProgramacionCmn.insProgramacionCmn(datosCmn, headersuarm)
        .then(responseCmn => {
            if (responseCmn.result > 0) {
                var idProgramacionCmn = responseCmn.result;
                guardarDetallesCmn(idProgramacionCmn, usuarioCreacion);
            } else {
                alertify.error(responseCmn.message || "No se pudo guardar el CMN");
            }
        })
        .catch(error => {
            msgException('grabarCMN', error);
        });
}

function guardarDetallesCmn(idProgramacionCmn, usuarioCreacion) {

    var itemsParaGuardar = ITEMS_CMN_TEMP.filter(item => item.tipo !== 'cmn_existente');

    if (itemsParaGuardar.length === 0) {
        finalizarGrabacionCmn();
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
            idProgramacionCmnDetalle: 0,
            idProgramacionCmn: idProgramacionCmn,
            codigoItem: item.codigo || '',
            descripcion: item.descripcion || '',
            cantidad: item.cantidad !== undefined && item.cantidad !== null ? item.cantidad : 0,
            idUnidadMedida: 1,
            precioUnitario: item.precio !== undefined && item.precio !== null ? item.precio : (item.valor !== undefined && item.valor !== null ? item.valor : 0),
            idClasificador: item.clasificador || 0,
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

        return serviceProgramacionCmnDetalle.guardarDetalleCmn(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            var exitosos = responses.filter(r => r.result > 0).length;

            if (exitosos === itemsParaGuardar.length) {
                finalizarGrabacionCmn();
            } else {
                finalizarGrabacionCmn();
            }
        })
        .catch(error => {
            finalizarGrabacionCmn();
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

function finalizarGrabacionCmn() {
    $("#modalCuadroMultianual").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Cuadro multianual guardado correctamente");

    ITEMS_CMN_TEMP = [];
}

function mostrarCmnEnTabla(cmn) {
    var montosPorMes = {
        1: cmn.montoEnero || 0,
        2: cmn.montoFebrero || 0,
        3: cmn.montoMarzo || 0,
        4: cmn.montoAbril || 0,
        5: cmn.montoMayo || 0,
        6: cmn.montoJunio || 0,
        7: cmn.montoJulio || 0,
        8: cmn.montoAgosto || 0,
        9: cmn.montoSetiembre || 0,
        10: cmn.montoOctubre || 0,
        11: cmn.montoNoviembre || 0,
        12: cmn.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyCuadroMultianual").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyCuadroMultianual").append(row);

    ITEMS_CMN_TEMP = [{
        tipo: 'cmn_existente',
        idProgramacionCmn: cmn.idProgramacionCmn,
        montos: montosPorMes
    }];
}

function abrirModalItemsNacional() {
    $("#cboTipoItemNacional").val("");
    $("#cboGenericoNacional").empty().append('<option value="">Seleccionar</option>');
    $("#txtBusquedaNacional").val("");

    $("#tbodyItemsNacional").empty();
    $("#tbodyItemsNacional").append(`
        <tr>
            <td colspan="9" class="text-center text-muted">
                Seleccione tipo de ítem y genérico para ver resultados
            </td>
        </tr>
    `);
    $("#divTablaItemsNacional").show();

    $("#modalItemsNacional").modal("show");
}

function cargarGenericosNacionalDesdeAPI(tipoItem) {
    $("#cboGenericoNacional").empty().append('<option value="">Cargando...</option>');

    var tipoBien = (tipoItem === "1" || tipoItem === "2") ? "s" : "b";
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        tipoBien: tipoBien
    };

    serviceBienesServicios.getListadoGrupo(params, headersuarm)
        .then(response => {
            $("#cboGenericoNacional").empty().append('<option value="">Seleccionar</option>');

            if (response && response.length > 0) {
                response.forEach(grupo => {
                    $("#cboGenericoNacional").append(
                        `<option value="${grupo.grupoBien}" data-id-grupo="${grupo.idGrupo}">${grupo.nombreBien}</option>`
                    );
                });
            } else {
                alertify.warning("No se encontraron genéricos para este tipo");
            }
        })
        .catch(error => {
            $("#cboGenericoNacional").empty().append('<option value="">Seleccionar</option>');
            msgException('cargarGenericosNacionalDesdeAPI', error);
        });
}

function cargarItemsPorGrupoBien(grupoBien, busqueda) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        grupoBien: grupoBien
    };

    $("#tbodyItemsNacional").empty();
    $("#tbodyItemsNacional").append(`
        <tr>
            <td colspan="9" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando ítems...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoGrupoBien(params, headersuarm)
        .then(response => {
            $("#tbodyItemsNacional").empty();

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
                    $("#tbodyItemsNacional").append(`
                        <tr>
                            <td colspan="9" class="text-center text-muted">
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
                            <td><input type="number" class="form-control form-control-sm item-precio" value="${item.precio ? item.precio.toFixed(2) : '0.00'}" min="0" step="0.01" /></td>
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
                    $("#tbodyItemsNacional").append(row);
                });
            } else {
                $("#tbodyItemsNacional").append(`
                    <tr>
                        <td colspan="9" class="text-center text-muted">
                            No se encontraron ítems para este grupo
                        </td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            $("#tbodyItemsNacional").empty();
            $("#tbodyItemsNacional").append(`
                <tr>
                    <td colspan="9" class="text-center text-danger">
                        Error al cargar los ítems
                    </td>
                </tr>
            `);
            msgException('cargarItemsPorGrupoBien', error);
        });
}

function buscarItemsNacional(tipoItem, generico, busqueda) {
    if (!GRUPO_BIEN_SELECCIONADO_NACIONAL) {
        alertify.error("Debe seleccionar un genérico primero");
        return;
    }

    cargarItemsPorGrupoBien(GRUPO_BIEN_SELECCIONADO_NACIONAL, busqueda);
}

function agregarItemsNacional() {
    var itemsSeleccionados = [];

    $("#tbodyItemsNacional tr").each(function () {
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
                precio: precio,
                unidad: $row.find("td:eq(3)").text(),
                clasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(6)").text(),
                nombreClasificador: $row.find("td:eq(6)").text(), 
                mes: parseInt(mes),
                mesNombre: MESES.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar cantidad, precio y mes para al menos un ítem");
        return;
    }

    ITEMS_CMN_TEMP = ITEMS_CMN_TEMP.concat(itemsSeleccionados);
    actualizarCuadroMultianualTotal();

    $("#modalItemsNacional").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} ítems`);
}

function abrirModalItemsExterior() {
    $("#cboTipoItemExterior").val("");
    $("#cboGenericoExterior").empty().append('<option value="">Seleccionar</option>');
    $("#txtBusquedaExterior").val("");

    $("#tbodyItemsExterior").empty();
    $("#tbodyItemsExterior").append(`
        <tr>
            <td colspan="9" class="text-center text-muted">
                Seleccione tipo de ítem y genérico para ver resultados
            </td>
        </tr>
    `);
    $("#divTablaItemsExterior").show();

    $("#modalItemsExterior").modal("show");
}

function cargarGenericosExteriorDesdeAPI(tipoItem) {
    $("#cboGenericoExterior").empty().append('<option value="">Cargando...</option>');

    var tipoBien = tipoItem === "1" || tipoItem === "2" ? "s" : "b";
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        tipoBien: tipoBien
    };

    serviceBienesServicios.getListadoGrupo(params, headersuarm)
        .then(response => {
            $("#cboGenericoExterior").empty().append('<option value="">Seleccionar</option>');

            if (response && response.length > 0) {
                response.forEach(grupo => {
                    $("#cboGenericoExterior").append(
                        `<option value="${grupo.grupoBien}" data-id-grupo="${grupo.idGrupo}">${grupo.nombreBien}</option>`
                    );
                });
            } else {
                alertify.warning("No se encontraron genéricos para este tipo");
            }
        })
        .catch(error => {
            $("#cboGenericoExterior").empty().append('<option value="">Seleccionar</option>');
            msgException('cargarGenericosExteriorDesdeAPI', error);
        });
}

function cargarItemsExteriorPorGrupoBien(grupoBien, busqueda) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        grupoBien: grupoBien
    };

    $("#tbodyItemsExterior").empty();
    $("#tbodyItemsExterior").append(`
        <tr>
            <td colspan="9" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando ítems...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoGrupoBien(params, headersuarm)
        .then(response => {
            $("#tbodyItemsExterior").empty();

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
                    $("#tbodyItemsExterior").append(`
                        <tr>
                            <td colspan="9" class="text-center text-muted">
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
<td><input type="number" class="form-control form-control-sm item-precio" value="${item.precio ? item.precio.toFixed(2) : '0.00'}" min="0" step="0.01" readonly /></td>                            <td class="text-end item-total">S/ 0.00</td>
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
                    $("#tbodyItemsExterior").append(row);
                });
            } else {
                $("#tbodyItemsExterior").append(`
                    <tr>
                        <td colspan="9" class="text-center text-muted">
                            No se encontraron ítems para este grupo
                        </td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            $("#tbodyItemsExterior").empty();
            $("#tbodyItemsExterior").append(`
                <tr>
                    <td colspan="9" class="text-center text-danger">
                        Error al cargar los ítems
                    </td>
                </tr>
            `);
            msgException('cargarItemsExteriorPorGrupoBien', error);
        });
}

function buscarItemsExterior(tipoItem, generico, busqueda) {
    if (!GRUPO_BIEN_SELECCIONADO_EXTERIOR) {
        alertify.error("Debe seleccionar un genérico primero");
        return;
    }

    cargarItemsExteriorPorGrupoBien(GRUPO_BIEN_SELECCIONADO_EXTERIOR, busqueda);
}

function agregarItemsExterior() {
    var itemsSeleccionados = [];

    $("#tbodyItemsExterior tr").each(function () {
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
                precio: precio,
                unidad: $row.find("td:eq(3)").text(),
                clasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(6)").text(),
                nombreClasificador: $row.find("td:eq(6)").text(), 
                mes: parseInt(mes),
                mesNombre: MESES.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar cantidad, precio y mes para al menos un ítem");
        return;
    }

    ITEMS_CMN_TEMP = ITEMS_CMN_TEMP.concat(itemsSeleccionados);
    actualizarCuadroMultianualTotal();

    $("#modalItemsExterior").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} ítems`);
}


function abrirModalServiciosNacional() {
    $("#cboGenericoServicioNacional").empty().append('<option value="">Cargando...</option>');

    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        tipoBien: "b"
    };

    serviceBienesServicios.getListadoGrupo(params, headersuarm)
        .then(response => {
            $("#cboGenericoServicioNacional").empty().append('<option value="">Seleccionar</option>');

            if (response && response.length > 0) {
                response.forEach(grupo => {
                    $("#cboGenericoServicioNacional").append(
                        `<option value="${grupo.grupoBien}" data-id-grupo="${grupo.idGrupo}">${grupo.nombreBien}</option>`
                    );
                });
            } else {
                alertify.warning("No se encontraron genéricos para servicios");
            }
        })
        .catch(error => {
            $("#cboGenericoServicioNacional").empty().append('<option value="">Seleccionar</option>');
            msgException('abrirModalServiciosNacional', error);
        });

    $("#txtBusquedaServicioNacional").val("");
    $("#tbodyServiciosNacional").empty();
    $("#tbodyServiciosNacional").append(`
        <tr>
            <td colspan="9" class="text-center text-muted">
                Seleccione un genérico para ver los servicios disponibles
            </td>
        </tr>
    `);
    $("#divTablaServiciosNacional").show();

    $("#modalServiciosNacional").modal("show");
}

function cargarServiciosPorGrupoBien(grupoBien, busqueda) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = obtenerIdAnioDesdeLocalStorage();

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio || 1,
        grupoBien: grupoBien
    };

    $("#tbodyServiciosNacional").empty();
    $("#tbodyServiciosNacional").append(`
        <tr>
            <td colspan="9" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando servicios...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoGrupoBien(params, headersuarm)
        .then(response => {
            $("#tbodyServiciosNacional").empty();

            if (response && response.length > 0) {
                var serviciosFiltrados = response;
                if (busqueda && busqueda.trim() !== "") {
                    var terminoBusqueda = busqueda.toLowerCase().trim();
                    serviciosFiltrados = response.filter(item =>
                        item.nombreBien.toLowerCase().includes(terminoBusqueda) ||
                        item.codigoBien.toLowerCase().includes(terminoBusqueda)
                    );
                }

                if (serviciosFiltrados.length === 0) {
                    $("#tbodyServiciosNacional").append(`
                        <tr>
                            <td colspan="9" class="text-center text-muted">
                                No se encontraron servicios que coincidan con "${busqueda}"
                            </td>
                        </tr>
                    `);
                    return;
                }

                serviciosFiltrados.forEach(function (servicio) {
                    var row = `
                        <tr data-id-clasificador="${servicio.idClasificador}">
                            <td>${servicio.codigoBien}</td>
                            <td>${servicio.nombreBien}</td>
                            <td><input type="number" class="form-control form-control-sm servicio-cantidad" value="0" min="0" step="0.01" /></td>
                            <td>${servicio.descripcionUinidadMedida || 'Servicio'}</td>
                            <td><input type="number" class="form-control form-control-sm servicio-precio" value="${servicio.precio ? servicio.precio.toFixed(2) : '0.00'}" min="0" step="0.01" /></td>
                            <td class="text-end servicio-total">S/ 0.00</td>
                            <td>${servicio.clasificadorGasto || 'N/A'}</td>
                            <td>${servicio.descripcionClasificador || 'N/A'}</td>
                            <td>
                                <select class="form-select form-select-sm servicio-mes">
                                    <option value="">Seleccionar</option>
                                    ${MESES.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                                </select>
                            </td>
                        </tr>
                    `;
                    $("#tbodyServiciosNacional").append(row);
                });
            } else {
                $("#tbodyServiciosNacional").append(`
                    <tr>
                        <td colspan="9" class="text-center text-muted">
                            No se encontraron servicios para este grupo
                        </td>
                    </tr>
                `);
            }
        })
        .catch(error => {
            $("#tbodyServiciosNacional").empty();
            $("#tbodyServiciosNacional").append(`
                <tr>
                    <td colspan="9" class="text-center text-danger">
                        Error al cargar los servicios
                    </td>
                </tr>
            `);
            msgException('cargarServiciosPorGrupoBien', error);
        });
}

function buscarServiciosNacional(generico, busqueda) {
    if (!GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL) {
        alertify.error("Debe seleccionar un genérico primero");
        return;
    }

    cargarServiciosPorGrupoBien(GRUPO_BIEN_SELECCIONADO_SERVICIO_NACIONAL, busqueda);
}

function agregarServiciosNacional() {
    var itemsSeleccionados = [];

    $("#tbodyServiciosNacional tr").each(function () {
        var cantidad = parseFloat($(this).find(".servicio-cantidad").val());
        var precio = parseFloat($(this).find(".servicio-precio").val());
        var mes = $(this).find(".servicio-mes").val();

        if (!isNaN(cantidad) && cantidad !== null && cantidad !== '' &&
            !isNaN(precio) && precio !== null && precio !== '' && mes) {

            var $row = $(this);
            var item = {
                codigo: $row.find("td:eq(0)").text(),
                descripcion: $row.find("td:eq(1)").text(),
                cantidad: cantidad,
                precio: precio,
                unidad: $row.find("td:eq(3)").text(),
                clasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(6)").text(),
                nombreClasificador: $row.find("td:eq(6)").text(), 
                mes: parseInt(mes),
                mesNombre: MESES.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar cantidad, precio y mes para al menos un servicio");
        return;
    }

    ITEMS_CMN_TEMP = ITEMS_CMN_TEMP.concat(itemsSeleccionados);
    actualizarCuadroMultianualTotal();

    $("#modalServiciosNacional").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} servicios`);
}

function abrirModalServiciosExterior() {
    $("#cboGenericoServicioExterior").empty().append('<option value="">Seleccionar</option>');
    $("#txtBusquedaServicioExterior").val("");

    $("#tbodyServiciosExterior").empty();
    $("#tbodyServiciosExterior").append(`
        <tr>
            <td colspan="9" class="text-center text-muted">
                Presione buscar para ver los servicios disponibles
            </td>
        </tr>
    `);
    $("#divTablaServiciosExterior").show();

    $("#cboGenericoServicioExterior").append('<option value="1">Servicios diversos</option>');
    $("#cboGenericoServicioExterior").append('<option value="2">Consultoría</option>');

    $("#modalServiciosExterior").modal("show");
}

function buscarServiciosExterior(generico, busqueda) {
    var servicios = [
        { codigo: '00114422', descripcion: 'Especialista sistemas 1', idClasificador: 431, valor: 0, unidad: 'Servicio', clasificador: '2.3.15.31', nombreClasificador: 'Servicios diversos' },
        { codigo: '00114423', descripcion: 'Especialista sistemas 2', idClasificador: 432, valor: 0, unidad: 'Servicio', clasificador: '2.3.15.32', nombreClasificador: 'Servicios diversos' },
        { codigo: '00114424', descripcion: 'Especialista sistemas 3', idClasificador: 433, valor: 0, unidad: 'Servicio', clasificador: '2.3.15.33', nombreClasificador: 'Servicios diversos' }
    ];

    $("#tbodyServiciosExterior").empty();

    servicios.forEach(function (servicio) {
        var row = `
            <tr data-id-clasificador="${servicio.idClasificador}">
                <td>${servicio.codigo}</td>
                <td>${servicio.descripcion}</td>
                <td><input type="number" class="form-control form-control-sm servicio-cantidad" value="0" min="0" step="0.01" /></td>
                <td>${servicio.unidad}</td>
                <td><input type="number" class="form-control form-control-sm servicio-precio" value="${servicio.valor}" min="0" step="0.01" /></td>
                <td class="text-end servicio-total">S/ 0.00</td>
                <td>${servicio.clasificador}</td>
                <td>${servicio.nombreClasificador}</td>
                <td>
                    <select class="form-select form-select-sm servicio-mes">
                        <option value="">Seleccionar</option>
                        ${MESES.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                    </select>
                </td>
            </tr>
        `;
        $("#tbodyServiciosExterior").append(row);
    });

    $("#divTablaServiciosExterior").show();
}

function agregarServiciosExterior() {
    var itemsSeleccionados = [];

    $("#tbodyServiciosExterior tr").each(function () {
        var cantidad = parseFloat($(this).find(".servicio-cantidad").val());
        var precio = parseFloat($(this).find(".servicio-precio").val());
        var mes = $(this).find(".servicio-mes").val();

        if (!isNaN(cantidad) && cantidad !== null && cantidad !== '' &&
            !isNaN(precio) && precio !== null && precio !== '' && mes) {

            var $row = $(this);
            var item = {
                codigo: $row.find("td:eq(0)").text(),
                descripcion: $row.find("td:eq(1)").text(),
                cantidad: cantidad,
                precio: precio,
                unidad: $row.find("td:eq(3)").text(),
                clasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(6)").text(), 
                nombreClasificador: $row.find("td:eq(6)").text(), // CORREGIDO: debe ser el código, no la descripción
                mes: parseInt(mes),
                mesNombre: MESES.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar cantidad, precio y mes para al menos un servicio");
        return;
    }

    ITEMS_CMN_TEMP = ITEMS_CMN_TEMP.concat(itemsSeleccionados);
    actualizarCuadroMultianualTotal();

    $("#modalServiciosExterior").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} servicios`);
}

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

function actualizarCuadroMultianual() {
    $("#tbodyCuadroMultianual").empty();

    if (ITEMS_CMN_TEMP.length === 0) {
        $("#tbodyCuadroMultianual").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_CMN_TEMP.length === 1 && ITEMS_CMN_TEMP[0].tipo === 'cmn_existente' && ITEMS_CMN_TEMP[0].montos) {
        var montosPorMes = ITEMS_CMN_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyCuadroMultianual").append(row);
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CMN_TEMP.forEach(item => {
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

    $("#tbodyCuadroMultianual").append(row);
}

function actualizarCuadroMultianualTotal() {
    $("#tbodyCuadroMultianual").empty();

    if (ITEMS_CMN_TEMP.length === 0) {
        $("#tbodyCuadroMultianual").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_CMN_TEMP.forEach(item => {
        if (item.tipo === 'cmn_existente' && item.montos) {
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

    $("#tbodyCuadroMultianual").append(row);
}