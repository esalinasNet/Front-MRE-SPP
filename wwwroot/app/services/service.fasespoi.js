const metodoFasesPoi = {
    route: 'fasespoi'
}

var serviceFasesPoi = {
    /**
     * Obtener Fases POI paginado
     */
    async getFasesPoiPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            // ✅ CORREGIDO: faltaban paréntesis en fetch
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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
     * Obtener Fases POI por ID
     */
    async getFasesPoiPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            // ✅ CORREGIDO: faltaban paréntesis en fetch
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/obtener?${formatParameter(request)}`, requestOptions)
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
     * Insertar nueva Fase POI
     */
    async insFasesPoi(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        try {
            // ✅ CORREGIDO: faltaban paréntesis en fetch
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/guardar`, requestOptions)
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
     * Actualizar Fase POI
     */
    async updFasesPoi(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        try {
            // ✅ CORREGIDO: faltaban paréntesis en fetch
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/actualizar`, requestOptions)
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
     * Eliminar Fase POI (soft delete)
     */
    async delFasesPoi(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };
        try {
            // ✅ CORREGIDO: faltaban paréntesis en fetch
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/eliminar`, requestOptions)
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
     * ✅ NUEVO: Obtener listado de Fases POI (sin paginación)
     */
    async getFasesPoiListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Fases POI Listado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoFasesPoi.route}/listado?${formatParameter(request)}`, requestOptions)
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