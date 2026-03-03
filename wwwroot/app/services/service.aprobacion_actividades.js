const metodoApronacionActividades = {
    route: 'apronacionactividades'
}

//Funciones Para llenar los Commbos  Programación
var serviceCombosAprobacion = {

    async getAprobacionesCentroCostosListado(request, headersuarm) {

        const metodoAprobacionesCostos = {
            route: 'aprobacionescostos'
        }

        headersuarm.set(K_ACCION, K_ACTION.LIST);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoAprobacionesCostos.route}/listado?${formatParameter(request)}`, requestOptions)
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

    async getProgramacionActividadPorId(request, headersuarm) {

        const metodoProgramacionActividad = {
            route: 'programacionactividad'
        }

        headersuarm.set(K_ACCION, K_ACTION.VIEW);
        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
            //body: JSON.stringify(request),
        };

        var datos = await fetch(`${API_URL}${metodoProgramacionActividad.route}/obtener?${formatParameter(request)}`, requestOptions)
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

function fillSelectCentroCostosAprobaciones(control, request, valor, mensaje, callback) {

    passport.setHeaderAccion(K_ACTION.LIST);
    var val = valor == undefined ? 0 : valor;
    $("#" + control + " option").remove();
    $("#" + control).append("<option value='0'>" + mensaje + "</option>");

    serviceCombosAprobacion.getAprobacionesCentroCostosListado(request, headersuarm)
        .then(response => {

            $.each(response, function (index, tp) {

                var selected = "";
                //if (val == tp.idProgramacionActividad) selected = "Selected";
                if (val == tp.idCentroCostos) selected = "Selected";
                
                //$("#" + control).append("<option value='" + tp.idProgramacionActividad + "' " + selected + ">" + tp.centroCostos + "  " + tp.descripcionCentroCostos + "</option>");
                //$("#" + control).append("<option value='" + tp.idProgramacionActividad + "' " + selected + " data-idaprobaciones='" + tp.idAprobaciones + "'>" + tp.centroCostos + " " + tp.descripcionCentroCostos + "</option>" );                
                $("#" + control).append("<option value='" + tp.idCentroCostos + "' " + selected + " data-idaprobaciones='" + tp.idAprobaciones + "'>" + tp.centroCostos + " " + tp.descripcionCentroCostos + "</option>" );                

            });

            callback(1);
        })
        .catch(error => {
            //alertify.error(tituloAlert.seguridad, `Error select: ${error.messages}`)
        });
}