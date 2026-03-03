var ITEMS_PROYECTO_TEMP = [];
var MESES_PROYECTO = [
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

var ID_PROGRAMACION_RECURSO_PROYECTO = null;
var ITEMS_PROYECTO_NACIONAL_CACHE = [];
var ITEMS_PROYECTO_EXTERIOR_CACHE = [];

$(document).on("click", "#btnInsertarItemsProyecto", function () {
    insertarItemsProyecto();
});

$(document).on("change", "#cboTipoItemProyectoNacional", function () {
    var tipoItem = $(this).val();
    if (tipoItem) {
        cargarItemsProyectoNacionalDesdeAPI(tipoItem);
    } else {
        ITEMS_PROYECTO_NACIONAL_CACHE = [];
        $("#tbodyItemsProyectoNacional").empty();
        $("#tbodyItemsProyectoNacional").append(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Seleccione tipo de ítem para ver resultados
                </td>
            </tr>
        `);
    }
});

$(document).on("click", "#btnBuscarItemProyectoNacional", function () {
    var busqueda = $("#txtBusquedaProyectoNacional").val();
    filtrarItemsProyectoNacional(busqueda);
});

$(document).on("click", "#btnAgregarItemsProyectoNacional", function () {
    agregarItemsProyectoNacional();
});

$(document).on("change", "#cboTipoItemProyectoExterior", function () {
    var tipoItem = $(this).val();
    if (tipoItem) {
        cargarItemsProyectoExteriorDesdeAPI(tipoItem);
    } else {
        ITEMS_PROYECTO_EXTERIOR_CACHE = [];
        $("#tbodyItemsProyectoExterior").empty();
        $("#tbodyItemsProyectoExterior").append(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    Seleccione tipo de ítem para ver resultados
                </td>
            </tr>
        `);
    }
});

$(document).on("click", "#btnBuscarItemProyectoExterior", function () {
    var busqueda = $("#txtBusquedaProyectoExterior").val();
    filtrarItemsProyectoExterior(busqueda);
});

$(document).on("click", "#btnAgregarItemsProyectoExterior", function () {
    agregarItemsProyectoExterior();
});

$(document).on("click", "#btnGrabarProyecto", function () {
    grabarProyecto();
});

$(document).on("click", ".btn-gasto[data-tipo='Proyecto']", function () {
    if (typeof abrirModalProyecto === 'function') {
        abrirModalProyecto();
    }
});

function abrirModalProyecto() {
    var idRecurso = $("#hidRecursos").val();
    if (idRecurso && idRecurso !== "0") {
        ID_PROGRAMACION_RECURSO_PROYECTO = parseInt(idRecurso);
    } else {
        ID_PROGRAMACION_RECURSO_PROYECTO = null;
    }

    $("#txtAnioProyecto").val($("#txtAnioRecurso").val());
    $("#txtActividadProyecto").val($("#txtActividadOperativaRecurso").val());
    $("#txtTareaProyecto").val($("#txtTareaRecurso").val());
    $("#txtUnidadMedidaProyecto").val($("#cboUnidadMedidaRecursoModal option:selected").text());
    $("#chkRepresentativaProyecto").prop("checked", $("#chkRepresentativaRecurso").prop("checked"));
    $("#txtFuenteProyecto").val($("#cboFuenteFinanciamientoRecurso option:selected").text());
    $("#txtUbigeoProyecto").val($("#cboUbigeoRecurso option:selected").text());
    $("#hidTipoUbigeoProyecto").val($("#cboUbigeoRecurso").val());

    $("#txtDenominacionRecursoProyecto").val("");

    if (ID_PROGRAMACION_RECURSO_PROYECTO) {
        var usuarioConsulta = obtenerUsuarioConsulta();

        let requestListado = {
            idProgramacionRecurso: ID_PROGRAMACION_RECURSO_PROYECTO,
            usuarioConsulta: usuarioConsulta
        };

        serviceProgramacionProyecto.getProgramacionProyectoListado(requestListado, headersuarm)
            .then(response => {
                if (response && response.length > 0) {
                    var idProyecto = response[0].idProgramacionProyecto;

                    let requestObtener = {
                        idProgramacionProyecto: idProyecto,
                        usuarioConsulta: usuarioConsulta
                    };

                    serviceProgramacionProyecto.getProyectoPorId(requestObtener, headersuarm)
                        .then(proyecto => {
                            mostrarProyectoEnTabla(proyecto);
                        })
                        .catch(error => {
                            ITEMS_PROYECTO_TEMP = [];
                            actualizarCuadroProyecto();
                        });
                } else {
                    ITEMS_PROYECTO_TEMP = [];
                    actualizarCuadroProyecto();
                }
            })
            .catch(error => {
                ITEMS_PROYECTO_TEMP = [];
                actualizarCuadroProyecto();
            });
    } else {
        ITEMS_PROYECTO_TEMP = [];
        actualizarCuadroProyecto();
    }

    $("#modalProyecto").modal("show");
}

function insertarItemsProyecto() {
    var tipoUbigeo = $("#hidTipoUbigeoProyecto").val();

    if (!tipoUbigeo || tipoUbigeo === "") {
        alertify.error("No se ha detectado el tipo de ubigeo. Por favor, verifique la selección.");
        return;
    }

    if (tipoUbigeo === "1") {
        abrirModalItemsProyectoNacional();
    } else if (tipoUbigeo === "2") {
        abrirModalItemsProyectoExterior();
    } else {
        alertify.error("Tipo de ubigeo no válido: " + tipoUbigeo);
    }
}

function eliminarProyecto(idProgramacionProyecto) {
    alertify.confirm(
        "Confirmar eliminación",
        "¿Está seguro de eliminar este Proyecto?",
        function () {
            serviceProgramacionProyecto.delProgramacionProyectoPorId(idProgramacionProyecto, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success("Proyecto eliminado correctamente");

                        if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
                            getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
                        }

                        ITEMS_PROYECTO_TEMP = [];
                        actualizarCuadroProyecto();
                    } else {
                        alertify.error("No se pudo eliminar el Proyecto");
                    }
                })
                .catch(error => {
                    msgException('eliminarProyecto', error);
                });
        },
        function () {
        }
    );
}

function grabarProyecto() {
    if (ITEMS_PROYECTO_TEMP.length === 0) {
        alertify.error("Debe agregar al menos un ítem");
        return;
    }

    var denominacionRecurso = $("#txtDenominacionRecursoProyecto").val();
    if (!denominacionRecurso || denominacionRecurso.trim() === "") {
        alertify.error("Debe ingresar la denominación del recurso");
        return;
    }

    var idAnio = parseInt(localStorage.getItem('idAnio'));

    if (!idAnio) {
        alertify.error("No se pudo determinar el año");
        return;
    }

    var montosPorMes = {};
    MESES_PROYECTO.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_PROYECTO_TEMP.forEach(item => {
        if (item.tipo === 'proyecto_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] = item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var usuarioCreacion = obtenerUsuarioConsulta();

    var datosProyecto = {
        idProgramacionRecurso: ID_PROGRAMACION_RECURSO_PROYECTO,
        idProgramacionTareas: TAREA_RECURSO_SELECCIONADA,
        idAnio: idAnio,
        idActividadOperativa: ACTIVIDAD_RECURSO_SELECCIONADA,
        idUnidadMedida: null,
        representativa: $("#chkRepresentativaRecurso").prop("checked"),
        idFuenteFinanciamiento: parseInt($("#cboFuenteFinanciamientoRecurso").val()) || null,
        idUbigeo: parseInt($("#cboUbigeoRecurso").val()) || null,
        tipoUbigeo: parseInt($("#hidTipoUbigeoProyecto").val()) || null,

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

        denominacionRecurso: denominacionRecurso,

        idEstado: 1,
        ipCreacion: "0.0.0.0",
        usuarioCreacion: usuarioCreacion
    };

    serviceProgramacionProyecto.insProgramacionProyecto(datosProyecto, headersuarm)
        .then(responseProyecto => {
            if (responseProyecto.result > 0) {
                var idProgramacionProyecto = responseProyecto.result;
                guardarDetallesProyecto(idProgramacionProyecto, usuarioCreacion);
            } else {
                alertify.error(responseProyecto.message || "No se pudo guardar el Proyecto");
            }
        })
        .catch(error => {
            msgException('grabarProyecto', error);
        });
}

function guardarDetallesProyecto(idProgramacionProyecto, usuarioCreacion) {
    var itemsParaGuardar = ITEMS_PROYECTO_TEMP.filter(item => item.tipo !== 'proyecto_existente');

    if (itemsParaGuardar.length === 0) {
        finalizarGrabacionProyecto();
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

        var nombreMesProp = obtenerNombrePropiedadMes(item.mes);
        montosDetalle[nombreMesProp] = item.valor || 0;

        var detalleRequest = {
            idProgramacionProyectoDetalle: 0,
            idProgramacionProyecto: idProgramacionProyecto,
            codigoItem: item.codigo || '',
            descripcion: item.descripcion || '',
            valor: item.valor || 0,
            idUnidadMedida: 1,
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

        return serviceProgramacionProyectoDetalle.guardarDetalleProyecto(detalleRequest, headersuarm);
    });

    Promise.all(promesas)
        .then(responses => {
            finalizarGrabacionProyecto();
        })
        .catch(error => {
            finalizarGrabacionProyecto();
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

function finalizarGrabacionProyecto() {
    $("#modalProyecto").modal("hide");

    if (ANIO_RECURSO_SELECCIONADO && ACTIVIDAD_RECURSO_SELECCIONADA) {
        getCargarGridRecursos(ANIO_RECURSO_SELECCIONADO, ACTIVIDAD_RECURSO_SELECCIONADA, TAREA_RECURSO_SELECCIONADA);
    }

    alertify.success("Proyecto guardado correctamente");

    ITEMS_PROYECTO_TEMP = [];
}

function mostrarProyectoEnTabla(proyecto) {
    var montosPorMes = {
        1: proyecto.montoEnero || 0,
        2: proyecto.montoFebrero || 0,
        3: proyecto.montoMarzo || 0,
        4: proyecto.montoAbril || 0,
        5: proyecto.montoMayo || 0,
        6: proyecto.montoJunio || 0,
        7: proyecto.montoJulio || 0,
        8: proyecto.montoAgosto || 0,
        9: proyecto.montoSetiembre || 0,
        10: proyecto.montoOctubre || 0,
        11: proyecto.montoNoviembre || 0,
        12: proyecto.montoDiciembre || 0
    };

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    $("#tbodyProyectos").empty();

    var row = '<tr><td class="fw-bold">Monto</td>';

    MESES_PROYECTO.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });

    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyProyectos").append(row);

    if (proyecto.denominacionRecurso) {
        $("#txtDenominacionRecursoProyecto").val(proyecto.denominacionRecurso);
    }

    ITEMS_PROYECTO_TEMP = [{
        tipo: 'proyecto_existente',
        idProgramacionProyecto: proyecto.idProgramacionProyecto,
        montos: montosPorMes,
        denominacionRecurso: proyecto.denominacionRecurso
    }];
}

function abrirModalItemsProyectoNacional() {
    $("#cboTipoItemProyectoNacional").val("");
    $("#txtBusquedaProyectoNacional").val("");
    ITEMS_PROYECTO_NACIONAL_CACHE = [];

    $("#tbodyItemsProyectoNacional").empty();
    $("#tbodyItemsProyectoNacional").append(`
        <tr>
            <td colspan="7" class="text-center text-muted">
                Seleccione tipo de ítem para ver resultados
            </td>
        </tr>
    `);

    $("#modalItemsProyectoNacional").modal("show");
}

function cargarItemsProyectoNacionalDesdeAPI(tipoItem) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = parseInt(localStorage.getItem('idAnio')) || 1;

    var tipoItemsMap = {
        "1": "SUMINISTRO",
        "2": "ACTIVO FIJO",
        "3": "SERVICIO"
    };

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio,
        tipoItems: tipoItemsMap[tipoItem],
        clasificadorGasto: "2.6"
    };

    $("#tbodyItemsProyectoNacional").empty();
    $("#tbodyItemsProyectoNacional").append(`
        <tr>
            <td colspan="7" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando ítems del clasificador 2.6...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoTipoItems(params, headersuarm)
        .then(response => {
            ITEMS_PROYECTO_NACIONAL_CACHE = response || [];

            if (ITEMS_PROYECTO_NACIONAL_CACHE.length === 0) {
                $("#tbodyItemsProyectoNacional").empty();
                $("#tbodyItemsProyectoNacional").append(`
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            No hay ningún ítem para este clasificador
                        </td>
                    </tr>
                `);
                return;
            }

            mostrarItemsProyectoNacional(ITEMS_PROYECTO_NACIONAL_CACHE);
        })
        .catch(error => {
            ITEMS_PROYECTO_NACIONAL_CACHE = [];
            $("#tbodyItemsProyectoNacional").empty();
            $("#tbodyItemsProyectoNacional").append(`
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error al cargar los ítems
                    </td>
                </tr>
            `);
            msgException('cargarItemsProyectoNacionalDesdeAPI', error);
        });
}

function filtrarItemsProyectoNacional(busqueda) {
    if (ITEMS_PROYECTO_NACIONAL_CACHE.length === 0) {
        alertify.warning("Primero debe seleccionar un tipo de ítem");
        return;
    }

    var itemsFiltrados = ITEMS_PROYECTO_NACIONAL_CACHE;

    if (busqueda && busqueda.trim() !== "") {
        var terminoBusqueda = busqueda.toLowerCase().trim();
        itemsFiltrados = ITEMS_PROYECTO_NACIONAL_CACHE.filter(item =>
            item.nombreBien.toLowerCase().includes(terminoBusqueda) ||
            item.codigoBien.toLowerCase().includes(terminoBusqueda)
        );
    }

    if (itemsFiltrados.length === 0) {
        $("#tbodyItemsProyectoNacional").empty();
        $("#tbodyItemsProyectoNacional").append(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No se encontraron ítems que coincidan con "${busqueda}"
                </td>
            </tr>
        `);
        return;
    }

    mostrarItemsProyectoNacional(itemsFiltrados);
}

function mostrarItemsProyectoNacional(items) {
    $("#tbodyItemsProyectoNacional").empty();

    items.forEach(function (item) {
        var row = `
            <tr data-id-clasificador="${item.idClasificador}">
                <td>${item.codigoBien}</td>
                <td>${item.nombreBien}</td>
                <td><input type="number" class="form-control form-control-sm item-valor" value="0" min="0" step="0.01" /></td>
                <td>${item.descripcionUinidadMedida || 'Servicio'}</td>
                <td>${item.clasificadorGasto || '2.6'}</td>
                <td>${item.descripcionClasificador || 'N/A'}</td>
                <td>
                    <select class="form-select form-select-sm item-mes">
                        <option value="">Seleccionar</option>
                        ${MESES_PROYECTO.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                    </select>
                </td>
            </tr>
        `;
        $("#tbodyItemsProyectoNacional").append(row);
    });
}

function agregarItemsProyectoNacional() {
    var itemsSeleccionados = [];

    $("#tbodyItemsProyectoNacional tr").each(function () {
        var valor = parseFloat($(this).find(".item-valor").val());
        var mes = $(this).find(".item-mes").val();

        if (!isNaN(valor) && valor !== null && valor !== '' && mes) {
            var $row = $(this);
            var item = {
                codigo: $row.find("td:eq(0)").text(),
                descripcion: $row.find("td:eq(1)").text(),
                valor: valor,
                unidad: $row.find("td:eq(3)").text(),
                idClasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(4)").text(),
                nombreClasificador: $row.find("td:eq(5)").text(),
                mes: parseInt(mes),
                mesNombre: MESES_PROYECTO.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar mes para al menos un ítem");
        return;
    }

    ITEMS_PROYECTO_TEMP = ITEMS_PROYECTO_TEMP.concat(itemsSeleccionados);
    actualizarCuadroProyectoTotal();

    $("#modalItemsProyectoNacional").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} ítems`);
}

function abrirModalItemsProyectoExterior() {
    $("#cboTipoItemProyectoExterior").val("");
    $("#txtBusquedaProyectoExterior").val("");
    ITEMS_PROYECTO_EXTERIOR_CACHE = [];

    $("#tbodyItemsProyectoExterior").empty();
    $("#tbodyItemsProyectoExterior").append(`
        <tr>
            <td colspan="7" class="text-center text-muted">
                Seleccione tipo de ítem para ver resultados
            </td>
        </tr>
    `);

    $("#modalItemsProyectoExterior").modal("show");
}

function cargarItemsProyectoExteriorDesdeAPI(tipoItem) {
    var usuarioConsulta = obtenerUsuarioConsulta();
    var idAnio = parseInt(localStorage.getItem('idAnio')) || 1;

    var tipoItemsMap = {
        "1": "SUMINISTRO",
        "2": "ACTIVO FIJO",
        "3": "SERVICIO"
    };

    var params = {
        usuarioConsulta: usuarioConsulta,
        idAnio: idAnio,
        tipoItems: tipoItemsMap[tipoItem],
        clasificadorGasto: "2.6"
    };

    $("#tbodyItemsProyectoExterior").empty();
    $("#tbodyItemsProyectoExterior").append(`
        <tr>
            <td colspan="7" class="text-center">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div> Cargando ítems del clasificador 2.6...
            </td>
        </tr>
    `);

    serviceBienesServicios.getListadoTipoItems(params, headersuarm)
        .then(response => {
            ITEMS_PROYECTO_EXTERIOR_CACHE = response || [];

            if (ITEMS_PROYECTO_EXTERIOR_CACHE.length === 0) {
                $("#tbodyItemsProyectoExterior").empty();
                $("#tbodyItemsProyectoExterior").append(`
                    <tr>
                        <td colspan="7" class="text-center text-muted">
                            No hay ningún ítem para este clasificador
                        </td>
                    </tr>
                `);
                return;
            }

            mostrarItemsProyectoExterior(ITEMS_PROYECTO_EXTERIOR_CACHE);
        })
        .catch(error => {
            ITEMS_PROYECTO_EXTERIOR_CACHE = [];
            $("#tbodyItemsProyectoExterior").empty();
            $("#tbodyItemsProyectoExterior").append(`
                <tr>
                    <td colspan="7" class="text-center text-danger">
                        Error al cargar los ítems
                    </td>
                </tr>
            `);
            msgException('cargarItemsProyectoExteriorDesdeAPI', error);
        });
}

function filtrarItemsProyectoExterior(busqueda) {
    if (ITEMS_PROYECTO_EXTERIOR_CACHE.length === 0) {
        alertify.warning("Primero debe seleccionar un tipo de ítem");
        return;
    }

    var itemsFiltrados = ITEMS_PROYECTO_EXTERIOR_CACHE;

    if (busqueda && busqueda.trim() !== "") {
        var terminoBusqueda = busqueda.toLowerCase().trim();
        itemsFiltrados = ITEMS_PROYECTO_EXTERIOR_CACHE.filter(item =>
            item.nombreBien.toLowerCase().includes(terminoBusqueda) ||
            item.codigoBien.toLowerCase().includes(terminoBusqueda)
        );
    }

    if (itemsFiltrados.length === 0) {
        $("#tbodyItemsProyectoExterior").empty();
        $("#tbodyItemsProyectoExterior").append(`
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No se encontraron ítems que coincidan con "${busqueda}"
                </td>
            </tr>
        `);
        return;
    }

    mostrarItemsProyectoExterior(itemsFiltrados);
}

function mostrarItemsProyectoExterior(items) {
    $("#tbodyItemsProyectoExterior").empty();

    items.forEach(function (item) {
        var row = `
            <tr data-id-clasificador="${item.idClasificador}">
                <td>${item.codigoBien}</td>
                <td>${item.nombreBien}</td>
                <td><input type="number" class="form-control form-control-sm item-valor" value="0" min="0" step="0.01" /></td>
                <td>${item.descripcionUinidadMedida || 'Servicio'}</td>
                <td>${item.clasificadorGasto || '2.6'}</td>
                <td>${item.descripcionClasificador || 'N/A'}</td>
                <td>
                    <select class="form-select form-select-sm item-mes">
                        <option value="">Seleccionar</option>
                        ${MESES_PROYECTO.map(m => `<option value="${m.id}">${m.nombre}</option>`).join('')}
                    </select>
                </td>
            </tr>
        `;
        $("#tbodyItemsProyectoExterior").append(row);
    });
}

function agregarItemsProyectoExterior() {
    var itemsSeleccionados = [];

    $("#tbodyItemsProyectoExterior tr").each(function () {
        var valor = parseFloat($(this).find(".item-valor").val());
        var mes = $(this).find(".item-mes").val();

        if (!isNaN(valor) && valor !== null && valor !== '' && mes) {
            var $row = $(this);
            var item = {
                codigo: $row.find("td:eq(0)").text(),
                descripcion: $row.find("td:eq(1)").text(),
                valor: valor,
                unidad: $row.find("td:eq(3)").text(),
                idClasificador: parseInt($row.attr("data-id-clasificador")),
                clasificadorTexto: $row.find("td:eq(4)").text(),
                nombreClasificador: $row.find("td:eq(5)").text(),
                mes: parseInt(mes),
                mesNombre: MESES_PROYECTO.find(m => m.id == mes).nombre
            };
            itemsSeleccionados.push(item);
        }
    });

    if (itemsSeleccionados.length === 0) {
        alertify.error("Debe ingresar mes para al menos un ítem");
        return;
    }

    ITEMS_PROYECTO_TEMP = ITEMS_PROYECTO_TEMP.concat(itemsSeleccionados);
    actualizarCuadroProyectoTotal();

    $("#modalItemsProyectoExterior").modal("hide");
    alertify.success(`Se agregaron ${itemsSeleccionados.length} ítems`);
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

function actualizarCuadroProyecto() {
    $("#tbodyProyectos").empty();

    if (ITEMS_PROYECTO_TEMP.length === 0) {
        $("#tbodyProyectos").append(`
            <tr>
                <td>Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    if (ITEMS_PROYECTO_TEMP.length === 1 &&
        ITEMS_PROYECTO_TEMP[0].tipo === 'proyecto_existente' &&
        ITEMS_PROYECTO_TEMP[0].montos) {

        var montosPorMes = ITEMS_PROYECTO_TEMP[0].montos;
        var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

        var row = '<tr><td class="fw-bold">Monto</td>';
        MESES_PROYECTO.forEach(m => {
            var monto = montosPorMes[m.id] || 0;
            var clase = monto > 0 ? 'table-success' : '';
            row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
        });
        row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

        $("#tbodyProyectos").append(row);
        return;
    }

    var montosPorMes = {};
    MESES_PROYECTO.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_PROYECTO_TEMP.forEach(item => {
        montosPorMes[item.mes] += item.valor;
    });

    var totalGeneral = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_PROYECTO.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${totalGeneral.toFixed(2)}</td></tr>`;

    $("#tbodyProyectos").append(row);
}

function actualizarCuadroProyectoTotal() {
    $("#tbodyProyectos").empty();

    if (ITEMS_PROYECTO_TEMP.length === 0) {
        $("#tbodyProyectos").append(`
            <tr>
                <td class="fw-bold">Monto</td>
                <td colspan="13" class="text-center text-muted">No hay ítems agregados</td>
            </tr>
        `);
        return;
    }

    var montosPorMes = {};
    MESES_PROYECTO.forEach(m => montosPorMes[m.id] = 0);

    ITEMS_PROYECTO_TEMP.forEach(item => {
        if (item.tipo === 'proyecto_existente' && item.montos) {
            Object.keys(item.montos).forEach(mes => {
                montosPorMes[parseInt(mes)] += item.montos[mes];
            });
        } else {
            montosPorMes[item.mes] += item.valor;
        }
    });

    var total = Object.values(montosPorMes).reduce((a, b) => a + b, 0);

    var row = '<tr><td class="fw-bold">Monto</td>';
    MESES_PROYECTO.forEach(m => {
        var monto = montosPorMes[m.id];
        var clase = monto > 0 ? 'table-success' : '';
        row += `<td class="text-end ${clase}">S/ ${monto.toFixed(2)}</td>`;
    });
    row += `<td class="text-end fw-bold table-primary">S/ ${total.toFixed(2)}</td></tr>`;

    $("#tbodyProyectos").append(row);
}