const API_URL = basePath.sgeoAPi;
 
$(function () {
    //var auth = passport.getAutorizacion();  /*PARA HABILITAR BOTONES*/
    //console.log("******auth",auth);
     validarLogin((response) => { if (response) listarCatalogo(); });
    
    
    $("#btnBuscar").click(function () {
        listarCatalogo();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        nuevo();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});


function getCatalogo() {
      let request =  
      {
          descripcionCatalogo: $("#txtDescripcionFiltro").val(),
          paginaActual: 0,
          tamanioPagina: 0,
          idUsuarioRolSession: encodeURIComponent(passport.getIdUserRol())
    };
      $("#grid").DataTable().clear();
      $('#grid').DataTable({
        processing: true,
          serverSide: true,
         
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length)+1)
            request.tamanioPagina = d.length

            serviceCatalogo.getCatalogoPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                    console.log("data", response);
                })
                .catch(error => {
                    msgException('getCatalogo', error);
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
            { data: 'idCatalogo',
            render: function (data, type, row, meta) {
                return row.registro;
                }
            },
            { data: 'nombreCatalogo' },
            { data: 'codigoCatalogo' },
            {
                data: 'mantenible',
                render: function (data, type, row) {
                    var resultado = '';
                    
                    if (data==false) {
                        resultado = 'No';
                    } else {
                        resultado = 'Sí';
                    }
                    return resultado;
                }
            },
            {
                data: 'idCatalogo',
                render: function (data,type,row) {
                    var resultado = '';
                    if (row.mantenible == true) {
                       // console.log(row.mantenible);
                        resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-dark "><i class="bi-pencil"></i></button> ';
                    }
                    
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger" ><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });
     
  
}
function editCatalogo(request) {
    serviceCatalogo.getCatalogoPorId(request, headersuarm)
        .then(response => {
            $("#hcodigo").val(response.idCatalogo);
            $("#txtDescripcionNuevo").val(response.descripcionCatalogo);
            $("#txtCodigoCatalogonNuevo").val(response.codigoCatalogo);
            if (response.manteniblePorUsuario==true) {
                $('#rbSi').prop('checked', true);
            } else {
                $('#rbSi').prop('checked', false);
            }
           
        })
        .catch(error => {
            msgException('editCatalogo', error);
        });
}
function updCatalogo(datos) {
    serviceCatalogo.updCatalogo(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getCatalogo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updCatalogo', error);
        });
}
function insCatalogo(datos) {
      serviceCatalogo.insCatalogo(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                getCatalogo();
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCatalogo', error);
        });
}

function delCatalogo(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL CATÁLOGO?", "question", (result) => {
        if (result.isConfirmed) {
            serviceCatalogo.delCatalogo(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                        getCatalogo()
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delCatalogo', error);
                });
        }
    });
}

function listarCatalogo() {
     getCatalogo()
}

function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var descripcionCatalogo = $("#txtDescripcionNuevo").val();
    var codigoCatalogo = parseInt($("#txtCodigoCatalogonNuevo").val());
    var esMantenible = false;
    if ($('#rbSi').is(':checked')) {
        esMantenible = true;
    } else {
        esMantenible = false;
    }
  
    var flag = $("#flagEdit").val();

    if (flag == 1) {
        let datos = {
            idCatalogo: codigo,
            descripcionCatalogo: descripcionCatalogo,
            codigoCatalogo: codigoCatalogo,
            manteniblePorUsuario: esMantenible,
           // usuarioModificacion: passport.getIdUserRol()
        };
        updCatalogo(datos);
    } else {
        let datos = {
            descripcionCatalogo: descripcionCatalogo,
            codigoCatalogo: codigoCatalogo,
            manteniblePorUsuario: esMantenible,
           // usuarioCreacion: passport.getIdUserRol()
        };
        insCatalogo(datos);
    }
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idCatalogo: codigo,
      //  usuarioModificacion: passport.getIdUserRol(),
      //  ipModificacion: ""
    };
    delCatalogo(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar catálogo");
     $("#lblCatalogo").text($("#lblCatalogo").find('option:selected').text());
    $("#flagEdit").val(1);
    limpiarModal();
    var id = $(control).data('input');

    let request =
    {
        idCatalogo:id
    }

    editCatalogo(request);
}

function nuevo() {
    limpiarModal();
    $("#lblCatalogo").text($("#lblCatalogo").find('option:selected').text());
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo catálogo");
}

function limpiarModal() {
    $("#hcodigo").val('');
    $("#txtDescripcionNuevo").val('');
    $("#txtCodigoCatalogonNuevo").val(0);
    $('#rbSi').prop('checked', true);
}

function limpiarFiltros() {
    $("#txtDescripcionFiltro").val('');
    $("#txtCodigoFiltro").val('');
}