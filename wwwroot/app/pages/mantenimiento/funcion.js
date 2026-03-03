const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarFuncion();
            });
        //listarFuncion();
    });
    $("#btnBuscar").click(function () {
        listarFuncion();
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

function listarFuncion() {
    getFuncion()
}
function getFuncion() {
    let request =
    {        
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        funcion: ($("#txtFuncionFiltro").val() && $("#txtFuncionFiltro").val().trim() !== "")
            ? $("#txtFuncionFiltro").val().trim()
            : null,

        descripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val() !== "0")
            ? parseInt($("#txtEstadoFiltro").val())
            : null,
        paginaActual: 1,
        tamanioPagina: 10
    };
    var sitaucionFiltro = $("#cboSituacionFiltro").val();
    switch (parseInt(sitaucionFiltro)) {
        case 1:
            request.activo = true;
            break;
        case 0:
            request.activo = false;
            break;
        default:
            request.activo = null;
            break;
    }
    /*serviceFuncion.getFuncionPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getFuncion', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceFuncion.getFuncionPaginado(request, headersuarm)  //cambiar
                .then(response => {                    
                    cb(response)                    
                }).catch(error => msgException('getFuncion', error));

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
                data: 'idFuncion',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'funcion' },
            { data: 'descripcion' },
            { data: 'estadoDescripcion' },           
            {
                data: 'activo',
                render: function (data, type, row) {
                    var resultado = "";
                    if (data == 1) {
                        resultado = "ACTIVO";
                    } else {
                        resultado = "INACTIVO";
                    }
                    return resultado;
                }
            },
            {
                data: 'idFuncion',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });


}

function editFuncion(request) {
    limpiarModal();
    
    serviceFuncion.getFuncionPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idFuncion);
                $("#txtFuncion").val(response.funcion);
                $("#txtDescripcion").val(response.descripcion);               
                $("#txtEstado").val(response.estadoDescripcion);
                $("#cboActivo").val(response.activo);                                
                ESTADO = response.estado;      
            });
        })
        .catch(error => {
            msgException('editFuncion', error);
        });
}
function updFuncion(datos) {

    //console.log("llega datos", datos);

    serviceFuncion.updFuncion(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFuncion();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updFuncion', error);
        });
}
function insFuncion(datos) {

    serviceFuncion.insFuncion(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getFuncion();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insFuncion', error);
        });
}

function delFuncion(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE Funcion?", "question", (result) => {
        if (result.isConfirmed) {
            serviceFuncion.delFuncion(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getFuncion();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delFuncion', error);
                });
        }
    });
}


function grabar() {
    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());    
    var funcion = $("#txtFuncion").val();
    var descripcion = $("#txtDescripcion").val();    
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idFuncion: codigo,
            idAnio: idAnio,
            funcion: funcion,
            descripcion: descripcion,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updFuncion(datos);
    } else {
        let datos = {
            //idFuncion: codigo,
            idAnio: idAnio,
            funcion: funcion,
            descripcion: descripcion,      
            idEstado: idEstado
        };        
        //console.log("nuevo", datos);
        insFuncion(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idFuncion: codigo
    };
    delFuncion(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Función Presupuestal");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idFuncion: id
    }    

    editFuncion(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva Función Presupuestal");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtFuncion").val("");
    $("#txtDescripcion").val("");    
    $("#txtEstado").val("");
    $("#cboActivo").val(1);    
    
}

function limpiarFiltros() {
    $("#txtFuncionFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

