const metodoPassport = {
    endpoint: 'passport'    
}
var servicePassport = {
    async autentificar(request, headersuarm) {

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        var datos = await fetch(`${basePath.sgeoAPi}${metodoPassport.endpoint}`, requestOptions)
            .then(res => res.json())
            .then(data => data)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },
    async validarSession(request, headersuarm) {


        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow'
        };

        var datos = await fetch(`${basePath.sgeoAPi}${metodoPassport.endpoint}/validateToken?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }

    },
    async logoutLog(request,headersuarm) {

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        var datos = await fetch(`${basePath.sgeoAPi}${metodoPassport.endpoint}/logout`, requestOptions)
            .then(res => res.json())
            .then(data => data)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },
     async detailAccessRol(request, _headersuarm) {

        var requestOptions = {
            method: 'POST',
            headers: _headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

         var datos = await fetch(`${basePath.sgeoAPi}${metodoPassport.endpoint}/autorizacion`, requestOptions)
            .then(res => res.json())
            .then(data => data)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    }
}



