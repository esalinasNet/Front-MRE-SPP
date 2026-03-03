const metodoAprobacionesCostos = {
    route: 'aprobacionescostos'
}

const metodoAprobacionesCostosDetalle = {
    route: 'aprobacionescostosdetalle'
}

var serviceAprobacionesCostos = {
    async getAprobacionesCostosPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async getAprobacionesCostosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insAprobacionesCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updAprobacionesCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delAprobacionesCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async getAprobacionesCostosListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/listado?${formatParameter(request)}`, requestOptions)
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
    async getAprobacionesCostosDetallePaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async insAprobacionesCostosDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updAprobacionesCostosDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updAprobacionesCostosDetalleAprobado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/actualizar2`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },



    async getAprobacionesCostosDetallePorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delAprobacionesCostosDetalle(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAprobacionesCostosDetalle.route}/eliminar`, requestOptions)
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

function fillSelectCentroCostos(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosProgramacion.getCentroCostosListado(request, headersuarm)
        .then(response => {

            // Guardar temporalmente el response en el select (para usar luego)
            $("#" + control).data("DescripcionCentroCostos", response); 

            $.each(response, function (index, tp) {
                var selected = "";
                if (val == tp.idCentroCostos) selected = "Selected";                
                $("#" + control).append("<option value='" + tp.idCentroCostos + "' " + selected + ">" + tp.centroCostos + ' ' + tp.descripcion + "</option>");
            });

            // Si hay valor seleccionado, mostrar su tipo de cambio
            //if (val > 0) {
            //    const objetivoSeleccionado = response.find(x => x.idCentroCostos == val);
            //    if (objetivoSeleccionado) $("#txtDescripcionCentroCostos").val(objetivoSeleccionado.descripcion);
            //}

            // Evento para actualizar el input cuando el usuario cambie de objetivo
            //$("#" + control).off("change").on("change", function () {
            //    const idSeleccionado = $(this).val();
            //    const data = $(this).data("DescripcionCentroCostos") || [];
            //    const objetivo = data.find(x => x.idCentroCostos == idSeleccionado);
            //    $("#txtDescripcionCentroCostos").val(objetivo ? objetivo.descripcion : "");
            //});

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}

function fillSelectPersonas(control, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    servicePersona.getPersonaListado( headersuarm)
        .then(response => {
            
            $.each(response, function (index, tp) {

                var selected = "";

                if (val == tp.idPersona) selected = "Selected";

                $("#" + control).append("<option value='" + tp.idPersona + "' " + selected + ">" + tp.nombres + ', ' + tp.apellidoPaterno + ' ' + tp.apellidoMaterno + "</option>");
            });
            
            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}
