const metodoProgramacionOtrosGastos = {
    route: 'otrosgastos'
}

var serviceProgramacionOtrosGastos = {
    /**
     * Obtener Otros Gastos paginado
     */
    async getProgramacionOtrosGastosPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Otros Gastos paginado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    /**
     * Obtener listado de Otros Gastos sin paginación
     */
    async getProgramacionOtrosGastosListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/listado?${formatParameter(request)}`, requestOptions)
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

    /**
     * Obtener Otros Gastos por ID
     */
    async getOtrosGastosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/obtener?${formatParameter(request)}`, requestOptions)
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

    /**
     * Insertar nuevo registro de Otros Gastos
     */
    async insProgramacionOtrosGastos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request insertar Otros Gastos:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/guardar`, requestOptions)
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

    /**
     * Actualizar registro de Otros Gastos existente
     */
    async updProgramacionOtrosGastos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        console.log("→ Request actualizar Otros Gastos:", request);

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/actualizar`, requestOptions)
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

    /**
     * Eliminar registro de Otros Gastos (soft delete)
     */
    async delProgramacionOtrosGastosPorId(idProgramacionOtrosGastos, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        console.log("→ Eliminando Otros Gastos con ID:", idProgramacionOtrosGastos);

        var usuarioModificacion = 'admin';
        try {
            var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
            if (userData) {
                var userObj = JSON.parse(userData);
                usuarioModificacion = userObj.usuario || 'admin';
            }
        } catch (e) {
            console.error("Error al obtener usuario:", e);
        }

        var request = {
            idProgramacionOtrosGastos: idProgramacionOtrosGastos,
            ipModificacion: "0.0.0.0",
            usuarioModificacion: usuarioModificacion
        };

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionOtrosGastos.route}/eliminar`, requestOptions)
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
    }
}