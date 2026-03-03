const API_URL = basePath.sgeoAPi;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectSistemas("ddlSistema", "SELECCIONE",0, (response) => {

                listarRol();
            });
    });
    $("#btnBuscar").click(function () {
        listarRol();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {

        var valFiltro = $("#ddlSistema").val()
        if (valFiltro == 0) {
            alertify.warning("AVISO", "Debe seleccionar un sistema para crear un nuevo rol", () => { })
        }
        else {
            nuevo();
        }
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });

    
});

function listarRol() {
    getRol()
}

function getRol() {
    let request =
    {
        nombre: $("#txtNombreFiltro").val(),
        descripcion: $("#txtDescripcionFiltro").val(),
        idSistema: $("#ddlSistema").val(),
        paginaActual: 0,
        tamanioPagina: 0,
    };
    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,

        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceRol.getRolPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                    // console.log("data", response);
                }).catch(error => msgException('getRol', error));                

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
                data: 'idRol',
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            { data: 'nombreSistema' },
            { data: 'nombre' },
            { data: 'descripcion' },
            {
                data: 'idRol',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });


}
function editRol(request) {
    //console.log("request", request);
    serviceRol.getRolPorId(request, headersuarm)
        .then(response => {
            //console.log(response);
            fillSelectSistemas("ddlSistemaAdd", response.nombreSistema, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idRol);
                $("#txtNombre").val(response.nombre);
                $("#txtDescripcion").val(response.descripcion);
                $("#txtCodigoRol").val(response.codigoRol);
             });
        })
        .catch(error => {
            msgException('editRol', error)
        });
}
function updRol(datos) {

    serviceRol.updRol(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getRol();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updRol', error)
        });
}
function insRol(datos) {

    serviceRol.insRol(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getRol();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insRol', error)
        });
}

function delRol(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL ROL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceRol.delRol(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getRol();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                       
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delRol', error)
                });
        }
    });
}


function grabar() {
    if (Number.isInteger(parseInt($("#txtCodigoRol").val())) == false) {
        alertify.error("ERROR", "Debe ingresar un codigo en número", () => { })
        return;
    }

    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var nombre = $("#txtNombre").val();
    var descripcion = $("#txtDescripcion").val();
    var codigoRol = ($("#txtCodigoRol").val() == '' ? 0 : parseInt($("#txtCodigoRol").val()));
    var flag = $("#flagEdit").val();
    var idSistema = parseInt($("#ddlSistemaAdd").val());
    console.log("mis datos ", codigo, " ", nombre, " " ,descripcion, " ", codigoRol, " ", flag, " ", idSistema)
    if (flag == 1) {
        let datos = {
            idRol: codigo,
            codigoRol: codigoRol,
            idSistema: idSistema,
            nombre: nombre,
            descripcion: descripcion,            
          /*  usuarioModificacion: passport.getIdUserRol(),
            ipModificacion: ""*/
        };
        console.log("mis datos", datos)
        updRol(datos);
    } else {
        let datos = {            
            codigoRol: codigoRol,
            idSistema: idSistema,
            nombre: nombre,
            descripcion: descripcion,
           /* usuarioCreacion: passport.getIdUserRol(),
            ipCreacion: ""*/
        };
        console.log("mis datos", datos)
        insRol(datos);
    }
    
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idRol: codigo,
       /* usuarioModificacion: passport.getIdUserRol(),
        ipModificacion: ""*/
    };
    delRol(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Rol");
    $("#flagEdit").val(1);
    limpiarModal();
    document.getElementById("ddlSistemaAdd").disabled = true;
    var id = $(control).data('input');
    
    let request =
    {
        idRol: id
    }

    editRol(request);
}

function nuevo() {
    limpiarModal();
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo Rol");
    document.getElementById("ddlSistemaAdd").disabled = false;

    var selected = $('#ddlSistema').find(":selected").val();
    fillSelectSistemas("ddlSistemaAdd", "SELECCIONE", selected, () => { });
}

function limpiarModal() {

    $("#hcodigo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#txtCodigoRol").val('');
}

function limpiarFiltros() {
    $("#txtNombreFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#ddlSistema").val(0);
}
