const metodoProgramacionPlanilla = {
    route: 'planilla'
}

var serviceProgramacionPlanilla = {
    /**
     * Obtener Planilla paginado
     */
    async getProgramacionPlanillaPaginado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);
        console.log("→ Request Planilla paginado:", request);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/obtenerpaginado?${formatParameter(request)}`, requestOptions)
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

    /**
     * Obtener listado de Planilla sin paginación
     */
    async getProgramacionPlanillaListado(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/listado?${formatParameter(request)}`, requestOptions)
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

    /**
     * Obtener Planilla por ID
     */
    async getPlanillaPorId(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.LIST);

        var requestOptions = {
            method: 'GET',
            headers: headersuarm,
            redirect: 'follow',
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/obtener?${formatParameter(request)}`, requestOptions)
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

    /**
     * Insertar nuevo registro de Planilla
     */
    async insProgramacionPlanilla(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.INSERT);
        console.log("→ Request insertar Planilla:", request);

        var requestOptions = {
            method: 'POST',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/guardar`, requestOptions)
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

    /**
     * Actualizar registro de Planilla existente
     */
    async updProgramacionPlanilla(request, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.UPDATE);
        console.log("→ Request actualizar Planilla:", request);

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request)
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/actualizar`, requestOptions)
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

    /**
     * Eliminar registro de Planilla (soft delete)
     */
    async delProgramacionPlanillaPorId(idProgramacionPlanilla, headersuarm) {
        headersuarm.set(K_ACCION, K_ACTION.DELETE);
        console.log("→ Eliminando Planilla con ID:", idProgramacionPlanilla);

        var usuarioModificacion = 'admin';
        try {
            var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
            if (userData) {
                var userObj = JSON.parse(userData);
                usuarioModificacion = userObj.usuario || 'admin';
            }
        } catch (e) {
            console.error("Error al obtener usuario:", e);
        }

        var request = {
            idProgramacionPlanilla: idProgramacionPlanilla,
            ipModificacion: "0.0.0.0",
            usuarioModificacion: usuarioModificacion
        };

        var requestOptions = {
            method: 'PUT',
            headers: headersuarm,
            redirect: 'follow',
            body: JSON.stringify(request),
        };

        try {
            var datos = await fetch(`${API_URL}${metodoProgramacionPlanilla.route}/eliminar`, requestOptions)
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

    /**
     * Guardar múltiples registros de planilla (trabajador con múltiples clasificadores)
     * Esta función procesa el guardado de un trabajador con todos sus clasificadores
     */
    async guardarPlanillaCompleta(trabajadorData, clasificadores, contextoProgramacion, headersuarm) {
        console.log("→ Guardando planilla completa para trabajador:", trabajadorData);
        console.log("→ Con clasificadores:", clasificadores);

        const resultados = [];
        const errores = [];

        // Iterar sobre cada clasificador y crear un registro de planilla
        for (const clasificador of clasificadores) {
            const requestPlanilla = {
                idProgramacionRecurso: parseInt(contextoProgramacion.idProgramacionRecurso) || 0,
                idProgramacionTareas: parseInt(contextoProgramacion.idProgramacionTareas) || 0,
                idAnio: parseInt(contextoProgramacion.idAnio) || 0,
                idActividadOperativa: parseInt(contextoProgramacion.idActividadOperativa) || 0, // ✅
                idTarea: parseInt(contextoProgramacion.idTarea) || 0, // ✅
                idUnidadMedida: parseInt(contextoProgramacion.idUnidadMedida) || 0, // ✅
                representativa: contextoProgramacion.representativa || false,
                idFuenteFinanciamiento: parseInt(contextoProgramacion.idFuenteFinanciamiento) || 0, // ✅
                idUbigeo: parseInt(contextoProgramacion.idUbigeo) || 0, // ✅
                tipoUbigeo: parseInt(contextoProgramacion.tipoUbigeo) || 0, // ✅

                // Datos del trabajador
                idTrabajador: parseInt(trabajadorData.idTrabajador) || 0,
                nombreTrabajador: trabajadorData.nombreTrabajador || "",
                cargo: trabajadorData.cargo || "",

                // Datos del clasificador
                idClasificador: parseInt(clasificador.idClasificador) || 0,
                codigoClasificador: clasificador.codigoClasificador || "",
                descripcionClasificador: clasificador.descripcionClasificador || "",

                // Montos mensuales del clasificador
                montoEnero: parseFloat(clasificador.montoEnero) || 0,
                montoFebrero: parseFloat(clasificador.montoFebrero) || 0,
                montoMarzo: parseFloat(clasificador.montoMarzo) || 0,
                montoAbril: parseFloat(clasificador.montoAbril) || 0,
                montoMayo: parseFloat(clasificador.montoMayo) || 0,
                montoJunio: parseFloat(clasificador.montoJunio) || 0,
                montoJulio: parseFloat(clasificador.montoJulio) || 0,
                montoAgosto: parseFloat(clasificador.montoAgosto) || 0,
                montoSetiembre: parseFloat(clasificador.montoSetiembre) || 0,
                montoOctubre: parseFloat(clasificador.montoOctubre) || 0,
                montoNoviembre: parseFloat(clasificador.montoNoviembre) || 0,
                montoDiciembre: parseFloat(clasificador.montoDiciembre) || 0,

                idEstado: 1 // Estado activo por defecto
            };

            try {
                const resultado = await this.insProgramacionPlanilla(requestPlanilla, headersuarm);
                resultados.push({
                    clasificador: clasificador.descripcionClasificador,
                    resultado: resultado
                });
            } catch (error) {
                errores.push({
                    clasificador: clasificador.descripcionClasificador,
                    error: error
                });
            }
        }

        if (errores.length > 0) {
            console.error("❌ Errores al guardar algunos clasificadores:", errores);
            return Promise.reject({
                message: `Se guardaron ${resultados.length} de ${clasificadores.length} clasificadores`,
                resultados: resultados,
                errores: errores
            });
        }

        console.log("✅ Todos los clasificadores guardados exitosamente");
        return Promise.resolve({
            message: "Planilla guardada exitosamente",
            resultados: resultados
        });
    },

    /**
     * Actualizar múltiples registros de planilla (trabajador con múltiples clasificadores)
     */
    async actualizarPlanillaCompleta(trabajadorData, clasificadores, contextoProgramacion, headersuarm) {
        console.log("→ Actualizando planilla completa para trabajador:", trabajadorData);
        console.log("→ Con clasificadores:", clasificadores);

        const resultados = [];
        const errores = [];

        // Iterar sobre cada clasificador y actualizar el registro de planilla
        for (const clasificador of clasificadores) {
            const requestPlanilla = {
                idProgramacionPlanilla: clasificador.idProgramacionPlanilla, // ID del registro existente
                idProgramacionRecurso: contextoProgramacion.idProgramacionRecurso,
                idProgramacionTareas: contextoProgramacion.idProgramacionTareas,
                idAnio: contextoProgramacion.idAnio,
                idActividadOperativa: contextoProgramacion.idActividadOperativa,
                idTarea: contextoProgramacion.idTarea,
                idUnidadMedida: contextoProgramacion.idUnidadMedida,
                representativa: contextoProgramacion.representativa,
                idFuenteFinanciamiento: contextoProgramacion.idFuenteFinanciamiento,
                idUbigeo: contextoProgramacion.idUbigeo,
                tipoUbigeo: contextoProgramacion.tipoUbigeo,

                // Datos del trabajador
                idTrabajador: trabajadorData.idTrabajador,
                nombreTrabajador: trabajadorData.nombreTrabajador,
                cargo: trabajadorData.cargo,

                // Datos del clasificador
                idClasificador: clasificador.idClasificador,
                codigoClasificador: clasificador.codigoClasificador,
                descripcionClasificador: clasificador.descripcionClasificador,

                // Montos mensuales del clasificador
                montoEnero: clasificador.montoEnero || 0,
                montoFebrero: clasificador.montoFebrero || 0,
                montoMarzo: clasificador.montoMarzo || 0,
                montoAbril: clasificador.montoAbril || 0,
                montoMayo: clasificador.montoMayo || 0,
                montoJunio: clasificador.montoJunio || 0,
                montoJulio: clasificador.montoJulio || 0,
                montoAgosto: clasificador.montoAgosto || 0,
                montoSetiembre: clasificador.montoSetiembre || 0,
                montoOctubre: clasificador.montoOctubre || 0,
                montoNoviembre: clasificador.montoNoviembre || 0,
                montoDiciembre: clasificador.montoDiciembre || 0,

                idEstado: 1
            };

            try {
                const resultado = await this.updProgramacionPlanilla(requestPlanilla, headersuarm);
                resultados.push({
                    clasificador: clasificador.descripcionClasificador,
                    resultado: resultado
                });
            } catch (error) {
                errores.push({
                    clasificador: clasificador.descripcionClasificador,
                    error: error
                });
            }
        }

        if (errores.length > 0) {
            console.error("❌ Errores al actualizar algunos clasificadores:", errores);
            return Promise.reject({
                message: `Se actualizaron ${resultados.length} de ${clasificadores.length} clasificadores`,
                resultados: resultados,
                errores: errores
            });
        }

        console.log("✅ Todos los clasificadores actualizados exitosamente");
        return Promise.resolve({
            message: "Planilla actualizada exitosamente",
            resultados: resultados
        });
    }
}