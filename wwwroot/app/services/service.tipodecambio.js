const metodoTipoCambio = {
    route: 'tipodecambio'
}

var serviceTipoCambio = {
    async getTipoCambioPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoTipoCambio.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async getTipoCambioPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoTipoCambio.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insTipoCambio(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoTipoCambio.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updTipoCambio(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoTipoCambio.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delTipoCambio(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoTipoCambio.route}/eliminar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    }
}