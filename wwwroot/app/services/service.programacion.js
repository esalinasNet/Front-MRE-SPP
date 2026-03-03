
function fillSelectAnios(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getAnioLista(headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idAnio) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idAnio + "' " + selected + ">" + tp.anio + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 


function fillSelectPoliticas(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getPoliticaListado(request, headersuarm)
        .then(response => {

            // Guardar temporalmente el response en el select (para usar luego)
            $("#" + control).data("ObjetivoPrioritario", response);
            $("#" + control).data("Lineamientos", response);

            $.each(response, function (index, tp) {
                var selected = val == tp.idPoliticas ? "Selected" : "";                
                $("#" + control).append("<option value='" + tp.idPoliticas + "' " + selected + ">" + tp.codigoServicio + "  " + tp.descripcionServicio + "</option>");
            });

            // Si hay valor seleccionado, mostrar su tipo de cambio
            if (val > 0) {
                const objetivoSeleccionado = response.find(x => x.idPoliticas == val);
                if (objetivoSeleccionado) $("#txtObjetivoPrioritario").val(objetivoSeleccionado.descripcionObjetivo);
            }
            if (val > 0) {
                const lineamientoSeleccionado = response.find(x => x.idPoliticas == val);
                if (lineamientoSeleccionado) $("#txtLineamientos").val(lineamientoSeleccionado.descripcionLineamiento);
            }

            // Evento para actualizar el input cuando el usuario cambie de objetivo
            $("#" + control).off("change").on("change", function () {
                const idSeleccionado = $(this).val();

                const data = $(this).data("ObjetivoPrioritario") || [];
                const objetivo = data.find(x => x.idPoliticas == idSeleccionado);
                $("#txtObjetivoPrioritario").val(objetivo ? objetivo.descripcionObjetivo : "");

                const ldata = $(this).data("Lineamientos") || [];
                const lineaamiento = ldata.find(x => x.idPoliticas == idSeleccionado);
                $("#txtLineamientos").val(lineaamiento ? lineaamiento.descripcionLineamiento : "");

            });


            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}


function fillSelectObjetivosEstrategicos(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getObjetivosEstrategicosListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idObjetivos) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idObjetivos + "' " + selected + ">" + tp.codigoObjetivos + "  " + tp.descripcionObjetivos + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectAccionesEstrategicas(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getAccionesEstrategicasListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idAcciones) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idAcciones + "' " + selected + ">" + tp.codigoAcciones + "  " + tp.descripcionAcciones + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectObjetivosInstitucioanles(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getObjetivosInstitucioanlesListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idObjetivos) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idObjetivos + "' " + selected + ">" + tp.codigoObjetivos + "  " + tp.descripcionObjetivos + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectAccionesInstitucioanles(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getAccionesInstitucioanlesListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idAcciones) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idAcciones + "' " + selected + ">" + tp.codigoAcciones + "  " + tp.descripcionAcciones + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectCategoriaPresupuestal(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getCategoriaPresupuestalListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idPresupuestal) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idPresupuestal + "' " + selected + ">" + tp.codigoPresupuestal + "  " + tp.descripcionPresupuestal + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectProductoProyecto(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getProductoProyectoListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idProducto) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idProducto + "' " + selected + ">" + tp.producto + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectFuncion(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getFuncionListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idFuncion) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idFuncion + "' " + selected + ">" + tp.funcion + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}


function fillSelectDivisionFuncional(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getDivisionFuncionalListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idDivisionFuncional) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idDivisionFuncional + "' " + selected + ">" + tp.divisionFuncional + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectGrupoFuncional(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getGrupoFuncionalListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idGrupoFuncional) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idGrupoFuncional + "' " + selected + ">" + tp.grupoFuncional + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectActividadOperativa(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getActividadOperativalListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idActividad) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idActividad + "' " + selected + ">" + tp.actividad + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectFinalidad(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getFinalidadListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idFinalidad) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idFinalidad + "' " + selected + ">" + tp.finalidad + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectUnidadMedida(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getUnidadMedidaListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idUnidadMedida) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idUnidadMedida + "' " + selected + ">" + tp.descripcion + "</option>");  //+ tp.unidadMedida + "  "
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectCentroCostos(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getCentroCostosListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idCentroCostos) selected = "Selected";
                //$("#" + control).append(`<option value="${tp.ubigeo}" ${selected}>${tp.descripcion}</option>`);
                $("#" + control).append("<option value='" + tp.idCentroCostos + "' " + selected + ">" + tp.centroCostos + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTipoDeCambio(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getTipoDeCambioListado(request, headersuarm)
        .then(response => {

            // Guardar temporalmente el response en el select (para usar luego)
            $("#" + control).data("monedas", response);

            $.each(response, function (index, tp) {
                var selected = val == tp.idMoneda ? "Selected" : "";                
                $("#" + control).append("<option value='" + tp.idMoneda + "' " + selected + ">" + tp.nombre + "</option>");
            });

            // Si hay valor seleccionado, mostrar su tipo de cambio
            if (val > 0) {
                const monedaSeleccionada = response.find(x => x.idMoneda == val);
                if (monedaSeleccionada) $("#txtMoneda").val(monedaSeleccionada.valor);
            }

            // Evento para actualizar el input cuando el usuario cambie la moneda
            $("#" + control).off("change").on("change", function () {
                const idSeleccionado = $(this).val();
                const data = $(this).data("monedas") || [];
                const moneda = data.find(x => x.idMoneda == idSeleccionado);
                $("#txtMoneda").val(moneda ? moneda.valor : "");
            });

            callback(1);
        })
        .catch(error => {
            console.error("Error select:", error);
        });
}

function fillSelectFuenteFinanciamiento(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getFuenteFinanciamientoListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idFuente) selected = "Selected";                
                $("#" + control).append("<option value='" + tp.idFuente + "' " + selected + ">" + tp.codigoFuente + "  " + tp.descripcionFuente + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectActividadesOperativas(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getActividadOperativaListado(request, headersuarm)
        .then(response => {
            
            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idProgramacionActividad) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idProgramacionActividad + "' " + selected + ">" + tp.codigoProgramacion + "</option>");
            });
                        
            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectTareasPorActividad(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceProgramacionTareas.getProgramacionTareasPorActividadListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idProgramacionTareas) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idProgramacionTareas + "' " + selected + ">" + tp.codigoTareas + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectClasificadorDelGasto(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getClasificadorDelGastoListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idClasificador) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idClasificador + "' " + selected + ">" + tp.clasificador + "  " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectEspecificaDelGasto(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getClasificadorDelGastoListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                if (val == tp.idClasificador) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idClasificador + "' " + selected + ">" + tp.clasificador + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}
