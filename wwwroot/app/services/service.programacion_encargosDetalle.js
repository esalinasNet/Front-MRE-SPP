const metodoProgramacionEncargosDetalle = {
    route: 'encargos-detalle'
}

var serviceProgramacionEncargosDetalle = {
    /**
     * Guardar detalle Encargos (insertar o actualizar)
     */
    async guardarDetalleEncargos(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request guardar detalle Encargos:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionEncargosDetalle.route}/guardar`, requestOptions)
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