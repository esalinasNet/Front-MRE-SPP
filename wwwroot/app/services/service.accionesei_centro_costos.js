const metodoAeiCentroCostos = {
    route: 'aeicentrocostos'
}

var serviceAeiCentroCostos = {
    async getAeiCentroCostosPaginado(request, headersuarm) {
        console.log("request de AEI", request);

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async getAeiCentroCostosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insAeiCentroCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updAeiCentroCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/actualizaraeicostos`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delAeiCentroCostos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async _getAeiCentroCostosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        //var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/obteneraeicostos?${formatParameter(request)}`, requestOptions)
        var datos = await fetch(`${API_URL}${metodoAeiCentroCostos.route}/obteneraeicostos?idAcciones=${request.idAcciones}&idAnio=${request.idAnio}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async getAeiCentroCostosPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        const url = `${API_URL}${metodoAeiCentroCostos.route}/obteneraeicostos?idAcciones=${request.idAcciones}&idAnio=${request.idAnio}`;

        try {
            const res = await fetch(url, {
                method: 'GET',
                headers: headersuarm,
                redirect: 'follow'
            });
            const data = await res.json();

            if (data.messages !== undefined) throw data;
            return data;
        } catch (error) {
            throw error;
        }
    }
}