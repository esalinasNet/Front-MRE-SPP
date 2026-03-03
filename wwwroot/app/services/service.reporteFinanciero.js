const metodoReporteFinanciero = {
    route: 'reportefinanciero'
};

var serviceReporteFinanciero = {
    async getReporteFinanciero(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow'
        };
        try {
            var datos = await fetch(`${API_URL}${metodoReporteFinanciero.route}/obtener?${formatParameter(request)}`, requestOptions)
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
};