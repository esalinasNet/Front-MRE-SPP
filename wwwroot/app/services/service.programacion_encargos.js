const metodoProgramacionEncargos = {
    route: 'encargos'
}

var serviceProgramacionEncargos = {
    /**
     * Obtener Encargos paginado
     */
    async getProgramacionEncargosPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Encargos paginado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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
     * Obtener listado de Encargos sin paginación
     */
    async getProgramacionEncargosListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/listado?${formatParameter(request)}`, requestOptions)
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
     * Obtener Encargos por ID
     */
    async getEncargosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/obtener?${formatParameter(request)}`, requestOptions)
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
     * Insertar nuevo registro de Encargos
     */
    async insProgramacionEncargos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request insertar Encargos:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/guardar`, requestOptions)
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
     * Actualizar registro de Encargos existente
     */
    async updProgramacionEncargos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        console.log("→ Request actualizar Encargos:", request);

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/actualizar`, requestOptions)
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
     * Eliminar registro de Encargos (soft delete)
     */
    async delProgramacionEncargosPorId(idProgramacionEncargos, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        console.log("→ Eliminando Encargos con ID:", idProgramacionEncargos);

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
            idProgramacionEncargos: idProgramacionEncargos,
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
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargos.route}/eliminar`, requestOptions)
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