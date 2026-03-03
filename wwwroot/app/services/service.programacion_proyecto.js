const metodoProgramacionProyecto = {
    route: 'proyecto'
}

var serviceProgramacionProyecto = {
    /**
     * Obtener Proyecto paginado
     */
    async getProgramacionProyectoPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Proyecto paginado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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
     * Obtener listado de Proyecto sin paginación
     */
    async getProgramacionProyectoListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/listado?${formatParameter(request)}`, requestOptions)
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
     * Obtener Proyecto por ID
     */
    async getProyectoPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/obtener?${formatParameter(request)}`, requestOptions)
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
     * Insertar nuevo registro de Proyecto
     */
    async insProgramacionProyecto(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request insertar Proyecto:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/guardar`, requestOptions)
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
     * Actualizar registro de Proyecto existente
     */
    async updProgramacionProyecto(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        console.log("→ Request actualizar Proyecto:", request);

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/actualizar`, requestOptions)
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
     * Eliminar registro de Proyecto (soft delete)
     */
    async delProgramacionProyectoPorId(idProgramacionProyecto, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        console.log("→ Eliminando Proyecto con ID:", idProgramacionProyecto);

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
            idProgramacionProyecto: idProgramacionProyecto,
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
            var datos = await fetch(`${API_URL}${metodoProgramacionProyecto.route}/eliminar`, requestOptions)
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