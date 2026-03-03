const API_URL = basePath.sgeoAPi;
 
$(function () {
 
    validarLogin((response) => {
        if (response) {
            
            fillSelectCatalogo("cboCatalogo", 1, function () {
                listarCatalogoItem();
            });
        }
    });
    
    $("#btnBuscar").click(function () {
        listarCatalogoItem();
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
    $("#cboCatalogo").change(function () {
        getCatalogoItem();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
});

function getCatalogoItem() {
    let request =
    {
        idCatalogo: ($("#cboCatalogo").val() == null ? 1 : $("#cboCatalogo").val()),
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

          serviceCatalogoItem.getCatalogoItemPaginado(request, headersuarm)
               .then(response => {
                   //console.log("data***getCatalogoItem", response);
                   cb(response)
                   
                })
              .catch(error => msgException('getCatalogoItem',error));

           /// console.log("datossss***",datos);

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
            { data: 'registro',
            render: function (data, type, row, meta) {
                return row.registro;
                },
                width: "5%"
            },
            {
                data: 'descripcionCatalogoItem',
                width: "20%"            },
            {
                data: 'abreviaturaCatalogoItem',
                width: "10%"
            },
            {
                data: 'codigoCatalogoItem',
                width: "10%"            },
            {
                data: 'detalleCatalogoItem',
                render: function (data, type, row) {
                    return '<span style="white-space:normal">' + data + "</span>";
                },
                width:"40%"
            },
            {
                data: 'eliminado',
                render: function (data,type,row) {
                    var resultado = "";
                    if (data == true) {
                        resultado = "No";
                    } else {
                        resultado = "Sí";
                    }
                    return resultado;
                },
                width: "5%"
            },
            {
                data: 'idCatalogoItem',
                render: function (data,type,row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn  btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';

                    if (row.eliminado==false) {
                        resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn  btn-sm btn-outline-danger"><i class="bi-trash"></i></button> ';
                    }
                    
                    return resultado;
                },
                width: "5%"
            }
        ]
    });


}
function editCatalogo(request) {
    serviceCatalogoItem.getCatalogoItemPorId(request, headersuarm)
        .then(response => {
            $("#hcodigo").val(response.idCatalogoItem);
            $("#txtDescripcionNuevo").val(response.descripcionCatalogoItem);
            $("#txtAbreviaturaCatalogo").val(response.abreviaturaCatalogoItem);
            $("#txtCodigoCatalogoItemNuevo").val(response.codigoCatalogoItem);
            $("#txtDetalle").val(response.detalleCatalogoItem);
        })
        .catch(error => {
            msgException('editCatalogo', error);
        });
}
function updCatalogoItem(datos) {

    serviceCatalogoItem.updCatalogoItem(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                getCatalogoItem();
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updCatalogoItem', error);
        });
}
function insCatalogoItem(datos) {

    serviceCatalogoItem.insCatalogoItem(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                getCatalogoItem();
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insCatalogoItem', error);
        });
}

function delCatalogoItem(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL ITEM DEL CATÁLOGO?", "question", (result) => {
        if (result.isConfirmed) {
            serviceCatalogoItem.delCatalogoItem(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        alertify.success(tituloAlert.seguridad, response.message, () => { });
                        getCatalogoItem();
                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delCatalogoItem', error);
                });
        }
    });
}

function listarCatalogoItem() {
    getCatalogoItem()
}

function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var descripcionCatalogo = $("#txtDescripcionNuevo").val();
    var abreviaturaCatalogo = $("#txtAbreviaturaCatalogo").val();
    var codigoCatalogoItem = parseInt($("#txtCodigoCatalogoItemNuevo").val());
    var idCatalogo = parseInt($("#cboCatalogo").val());
    var detalleCatalogoItem=$("#txtDetalle").val();
    var flag = $("#flagEdit").val();

    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);


    if (flag == 1) {
        let datos = {
            idCatalogoItem: codigo,
            idCatalogo: idCatalogo,
            codigoCatalogoItem: codigoCatalogoItem,
            orden: 0,
            descripcionCatalogoItem: descripcionCatalogo,
            abreviaturaCatalogoItem: abreviaturaCatalogo,
            detalleCatalogoItem: detalleCatalogoItem,
            eliminado: false,
            activo: true,
            fechaModificacion: hoy.toISOString(),
            usuarioModificacion: passport.getIdUserRol(),
            ipModificacion: ""
        };
        updCatalogoItem(datos);
    } else {
        let datos = {
            idCatalogo: idCatalogo,
            codigoCatalogoItem: codigoCatalogoItem,
            orden: 0,
            descripcionCatalogoItem: descripcionCatalogo,
            abreviaturaCatalogoItem: abreviaturaCatalogo,
            detalleCatalogoItem: detalleCatalogoItem,
            eliminado: false,
            activo: true,
            fechaCreacion: hoy.toISOString(),
            usuarioCreacion: passport.getIdUserRol(),
            ipCreacion: ""
        };
        insCatalogoItem(datos);
    }
   
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idCatalogoItem: codigo,
        usuarioModificacion: passport.getIdUserRol(),
        ipModificacion: ""
    };
    delCatalogoItem(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar catálogo item");
    $("#flagEdit").val(1);
    limpiarModal();
    var id = $(control).data('input');
    $("#lblCatalogo").text($("#cboCatalogo").find('option:selected').text());
    let request =
    {
        idCatalogoItem: id
    }

    editCatalogo(request);
}

function nuevo() {
     limpiarModal();
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo catálogo item");
    $("#lblCatalogo").text($("#cboCatalogo").find('option:selected').text());
}

function limpiarModal() {
    $("#hcodigo").val('');
    $("#txtDescripcionNuevo").val('');
    $("#txtAbreviaturaCatalogo").val('');
    $("#txtCodigoCatalogoItemNuevo").val('');
    $("#txtDetalle").val('');
    $("#txtCodigoCatalogonNuevo").val(0);
}

