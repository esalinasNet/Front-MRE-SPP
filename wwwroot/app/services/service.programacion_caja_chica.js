const metodoProgramacionCajaChica = {
    route: 'cajachica'
}

var serviceProgramacionCajaChica = {
    /**
     * Obtener Caja Chica paginado
     */
    async getProgramacionCajaChicaPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Caja Chica paginado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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
     * Obtener listado de Caja Chica sin paginación
     */
    async getProgramacionCajaChicaListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/listado?${formatParameter(request)}`, requestOptions)
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
     * Obtener Caja Chica por ID
     */
    async getCajaChicaPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/obtener?${formatParameter(request)}`, requestOptions)
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
     * Insertar nuevo registro de Caja Chica
     */
    async insProgramacionCajaChica(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request insertar Caja Chica:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/guardar`, requestOptions)
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
     * Actualizar registro de Caja Chica existente
     */
    async updProgramacionCajaChica(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        console.log("→ Request actualizar Caja Chica:", request);

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/actualizar`, requestOptions)
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
     * Eliminar registro de Caja Chica (soft delete)
     */
    async delProgramacionCajaChicaPorId(idProgramacionCajaChica, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        console.log("→ Eliminando Caja Chica con ID:", idProgramacionCajaChica);

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
            idProgramacionCajaChica: idProgramacionCajaChica,
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
            var datos = await fetch(`${API_URL}${metodoProgramacionCajaChica.route}/eliminar`, requestOptions)
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