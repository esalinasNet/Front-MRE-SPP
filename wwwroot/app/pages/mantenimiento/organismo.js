const API_URL = basePath.sgeoAPi;

$(function () {
    //var auth = passport.getAutorizacion();  /*PARA HABILITAR BOTONES*/
    //console.log("******auth",auth);
    validarLogin((response) => {
        if (response)
            
            fillSelectPaises("ddlPaisFiltro", 0, "TODOS", (response) => {
                fillSelectTipoEntidad("ddlTipoEntidadFiltro", 0, "TODOS", (response) => {
                    listarOrganismo();
                });
            });

    });


    $("#btnBuscar").click(function () {
        listarOrganismo();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnGenerar").click(function () {
        nuevo();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function getOrganismo() {
    let request =
    {
        idPais: document.querySelector("#ddlPaisFiltro").value,
        idTipoEntidad: document.querySelector("#ddlTipoEntidadFiltro").value,
        paginaActual: 0,
        tamanioPagina: 0
    };
    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceOrganismo.getOrganismoPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                    // console.log("data", response);
                })
                .catch(error => {
                    msgException('getOrganismo', error);
                    // alertify.error(tituloAlert.seguridad, error.messages)
                });

        },
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Se encontraron _TOTAL_ resultados.",
            infoEmpty: "No se encontraron registros"
        },
        responsive: true,
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true,
        columns: [
            {
                data: 'registro',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'descripcionPais' },
            { data: 'descripcionTipoEntidad' },
            {
                data: 'nombre'
            },
            { data: 'descripcion' },
            { data: 'abreviatura' },
            { data: 'correo' },
            {
                data: 'idOrganismo',
                render: function (data, type, row) {
                    var resultado = '';

                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-dark "><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger" ><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });


}

function listarOrganismo() {
    getOrganismo()
}

function limpiarFiltros() {
    $("#ddlPaisFiltro").val('0');
    $("#ddlTipoEntidadFiltro").val('0');

}

function limpiarModal() {
    $("#hcodigo").val('');
    $("#txtNombreNuevo").val('');
    $("#txtDescripcionNuevo").val('');
    $("#txtCorreoNuevo").val('');
    $("#txtAbreviaturaNuevo").val('');
    $("#cboPaisNuevo").val('0');
    $("#cboTipoOrganismoNuevo").val('0');
}

function nuevo() {
    limpiarModal();
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("CREACION DE OSE");

    fillSelectPaises("cboPaisNuevo", 0, "SELECCIONAR", (response) => { });
    fillSelectTipoEntidad("cboTipoEntidadNuevo", 0, "SELECCIONAR", (response) => { });

}

function eliminar(control) {
    var id = $(control).data('input');
    alertify.confirmHtml("Aviso", "&iquest;EST&Aacute; SEGURO QUE DESEA ELIMINAR INFORMACI&Oacute;N?", "question", (result) => {
        if (result.isConfirmed) {

            var request = {
                idOrganismo: id
            }
            serviceOrganismo.eliminar(request, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                        listarOrganismo();
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }

                }).catch(error => msgException('listarPaginado', error));

        }
    });

}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar OSE");
    $("#flagEdit").val(1);
    limpiarModal();
    var id = $(control).data('input');

    let request =
    {
        idOrganismo: id
    }

    editOrganismo(request);
}

function editOrganismo(request) {
    serviceOrganismo.getOrganismoxId(request, headersuarm)
        .then(response => {
            $("#hcodigo").val(response.idOrganismo);
            $("#txtNombreNuevo").val(response.nombre);
            $("#txtDescripcionNuevo").val(response.descripcion);
            $("#txtCorreoNuevo").val(response.correo);
            $("#txtAbreviaturaNuevo").val(response.abreviatura);
            fillSelectPaises("cboPaisNuevo", response.idPais, "SELECCIONE", (response) => { });
            fillSelectTipoEntidad("cboTipoEntidadNuevo", response.idTipoEntidad, "SELECCIONE", (response) => { });
        })
        .catch(error => {
            msgException('editCatalogo', error);
        });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var nombreNuevo = $("#txtNombreNuevo").val();
    var descripcionNuevo = $("#txtDescripcionNuevo").val();
    var correoNuevo = $("#txtCorreoNuevo").val();
    var abreviaturaNuevo = $("#txtAbreviaturaNuevo").val();
    var paisNuevo = $("#cboPaisNuevo").val();
    var tipoEntidadNuevo = $("#cboTipoEntidadNuevo").val(); 
    var flag = $("#flagEdit").val();

    if (flag == 1) {
        let datos = {
            idOrganismo: codigo,
            nombre: nombreNuevo,
            descripcion: descripcionNuevo,
            correo: correoNuevo,
            abreviatura: abreviaturaNuevo,
            idPais: paisNuevo,
            idTipoEntidad: tipoEntidadNuevo,
            //usuarioModificacion: passport.getInformationUser().usuario
        };
        updOrganismo(datos);
    } else {
        let datos = {
            nombre: nombreNuevo,
            descripcion: descripcionNuevo,
            correo: correoNuevo,
            abreviatura: abreviaturaNuevo,
            idPais: paisNuevo,
            idTipoEntidad: tipoEntidadNuevo,
            //usuarioCreacion: passport.getIdUserRol()
        };
        insOrganismo(datos);
    }
}

function updOrganismo(datos) {
    serviceOrganismo.actualizar(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getOrganismo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updOrganismo', error);
        });
}

function insOrganismo(datos) {
    serviceOrganismo.insertar(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                getOrganismo();
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCatalogo', error);
        });
}