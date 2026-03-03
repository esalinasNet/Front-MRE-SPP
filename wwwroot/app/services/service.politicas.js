const metodoPoliticas = {
    route: 'politicas'
}

var servicePoliticas = {
    async getPoliticasPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoPoliticas.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async getPoliticasPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPoliticas.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insPoliticas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPoliticas.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updPoliticas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoPoliticas.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delPoliticas(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoPoliticas.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async getPoliticaListado(request, headersuarm) {

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoPoliticas.route}/listado?${formatParameter(request)}`, requestOptions)
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