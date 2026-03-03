const metodoAccionesInstitucionales = {
    route: 'accionesinstitucionales'
}
const metodoAeiCentroCostos = {
    route: 'aeicentrocostos'
}

var serviceAccionesInstitucionales = {
    async getAccionesInstitucionalesPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };
        try {
            var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    async getAccionesInstitucionalesPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/obtener?${formatParameter(request)}`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async insAccionesInstitucionales(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/guardar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);
        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async updAcciones(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/actualizar`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },


    async updAccionesInstitucionales(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };
        //console.log("requestOptions", requestOptions);
        var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/actualizaraeicostos`, requestOptions)
            .then(res => res.json())
            .then(res => res)
            .catch(err => err);

        if (datos.messages !== undefined) {
            return Promise.reject(datos);
        } else {
            return Promise.resolve(datos);
        }
    },

    async delAccionesInstitucionales(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/eliminar`, requestOptions)
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
    },

    async getAccionesListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoAccionesInstitucionales.route}/listado?${formatParameter(request)}`, requestOptions)
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

function fillSelectObjetivoInstitucionales(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceObjetivosInstitucionales.getObjetivosInstitucionalesListado(request, headersuarm)
        .then(response => {

            // Guardar temporalmente el response en el select (para usar luego)
            $("#" + control).data("DescripcionObjetivos", response);


            $.each(response, function (index, tp) {
                var selected = val == tp.idObjetivos ? "Selected" : "";
                $("#" + control).append("<option value='" + tp.idObjetivos + "' " + selected + ">" + tp.codigoObjetivos + "</option>");
            });

            // Si hay valor seleccionado, mostrar su tipo de cambio
            if (val > 0) {
                const objetivoSeleccionado = response.find(x => x.idObjetivos == val);
                if (objetivoSeleccionado) $("#txtDescripcionObjetivos").val(objetivoSeleccionado.descripcionObjetivos);
            }

            // Evento para actualizar el input cuando el usuario cambie de objetivo
            $("#" + control).off("change").on("change", function () {
                const idSeleccionado = $(this).val();
                const data = $(this).data("DescripcionObjetivos") || [];
                const objetivo = data.find(x => x.idObjetivos == idSeleccionado);
                $("#txtDescripcionObjetivos").val(objetivo ? objetivo.descripcionObjetivos : "");
            });

            callback(1);
        })
        .catch(error => {
        });
}