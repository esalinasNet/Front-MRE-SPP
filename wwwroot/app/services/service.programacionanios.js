const metodoPresupuesto = {
    route: 'programacionanios'
}

var servicePresupuesto = {
    /**
     * Copiar programación de años
     */
    async copiarProgramacionAnios(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        try {
            // ✅ CORREGIDO: Agregar paréntesis ()
            var datos = await fetch(`${API_URL}${metodoPresupuesto.route}/copiar`, requestOptions)
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