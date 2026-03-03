const metodoPlanillas = {
    route: 'planillas'
}

const metodoPlanillasDetalle = {
    route: 'planillasdetalle'
}


var servicePlanillas = {
    async getPlanillasPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoPlanillas.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    async getPlanillasPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPlanillas.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insPlanillas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPlanillas.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updPlanillas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPlanillas.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delPlanillas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPlanillas.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async getPlanillasListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoPlanillas.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /* Detalle */
    async getPlanillasDetallePaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoPlanillasDetalle.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },

    async insPlanillasDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPlanillasDetalle.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updPlanillasDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPlanillasDetalle.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },


    async getPlanillasDetallePorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPlanillasDetalle.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delPlanillasDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPlanillasDetalle.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },
}

//Funciones Para llenar los Commbos  Planillas
var serviceCombosPlanillas = {

    async getProgramaLista(request, headersuarm) {

        const metodoPrograma = {
            route: 'programa'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoPrograma.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }

    },

    async getProductoLista(request, headersuarm) {

        const metodoProducto = {
            route: 'producto'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProducto.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }

    },

    async getActividadLista(request, headersuarm) {

        const metodoActividad = {
            route: 'actividad'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoActividad.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }

    },

    async getFinalidadLista(request, headersuarm) {

        const metodoFinalidad = {
            route: 'finalidad'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoFinalidad.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }

    },

    async getCentroCostosLista(request, headersuarm) {

        const metodoCentroCostos = {
            route: 'centrocostos'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoCentroCostos.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }

    },

    async getClasificadorLista(request, headersuarm) {

        const metodoEspecificaGasto = {
            route: 'especificagasto'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoEspecificaGasto.route}/listado?${formatParameter(request)}`, requestOptions)
                .then(res => res.json())
                .then(res => res)
                .catch(err => err);

            if (datos.messages !== undefined) {
                return Promise.reject(datos);
            } else {
                return Promise.resolve(datos);
            }
        } catch (err) {
            return Promise.reject(err);
        }
    },
}

/* fillSelect */
function fillSelectPrograma(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getProgramaLista(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idPrograma) selected = "Selected";

                $("#" + control).append("<option value='" + tp.idPrograma + "' " + selected + ">" + tp.programa + " " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 

function fillSelectProducto(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getProductoLista(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idProducto) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idProducto + "' " + selected + ">" + tp.producto + " " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 

function fillSelectActividad(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getActividadLista(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idActividad) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idActividad + "' " + selected + ">" + tp.actividad + " " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 

function fillSelectFinalidad(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getFinalidadLista(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idFinalidad) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idFinalidad + "' " + selected + ">" + tp.finalidad + " " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 


function fillSelectCentroCostos(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getCentroCostosLista(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCentroCostos) selected = "Selected";
                $("#" + control).append("<option value='" + tp.idCentroCostos + "' " + selected + ">" + tp.centroCostos + " " + tp.descripcion + "</option>");
            });

            callback(1);
        })
        .catch(error => {
            alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
} 

function fillSelectEspecifica(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosPlanillas.getClasificadorLista(request, headersuarm)
        .then(response => {

            // Guardar temporalmente el response en el select (para usar luego)
            $("#" + control).data("descripcion", response);


            $.each(response, function (index, tp) {
                var selected = val == tp.idClasificador ? "Selected" : "";
                $("#" + control).append("<option value='" + tp.idClasificador + "' " + selected + ">" + tp.clasificador + " - " + tp.descripcion  + "</option>");
            });

            // Si hay valor seleccionado, mostrar su tipo de cambio
            if (val > 0) {
                const objetivoSeleccionado = response.find(x => x.idClasificador == val);
                if (objetivoSeleccionado) $("#txtDescripciónEspecifica").val(objetivoSeleccionado.descripcion);
            }

            // Evento para actualizar el input cuando el usuario cambie de objetivo
            $("#" + control).off("change").on("change", function () {
                const idSeleccionado = $(this).val();
                const data = $(this).data("descripcion") || [];
                const objetivo = data.find(x => x.idClasificador == idSeleccionado);
                $("#txtDescripciónEspecifica").val(objetivo ? objetivo.descripcion : "");
            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });

}