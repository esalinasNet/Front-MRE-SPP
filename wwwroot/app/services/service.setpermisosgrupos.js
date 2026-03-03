const metodoAccesoGrupo = {
    route: 'usuariorolgrupo'
}
var serviceAccesoGrupo = {
    async insAccesoGrupo(request, headersuarm) {

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        var datos = await fetch(`${API_URL}${metodoAccesoGrupo.route}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },
  

    async getAccesoGrupoPorId(request, headersuarm) {
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAccesoGrupo.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },
    
}



