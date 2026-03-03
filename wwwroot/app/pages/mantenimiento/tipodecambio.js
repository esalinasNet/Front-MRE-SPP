const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

//$(document).ready(function () {
//    let hoy = new Date().toISOString().split("T")[0]; // yyyy-MM-dd
//    $("#fechaFiltro").val(hoy);
//});
$(function () {
    
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarTipoCambio();

            });
        //listarTipoCambio();
    });
    $("#btnBuscar").click(function () {
        listarTipoCambio();
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
        listarTipoCambio();
    });
    //document.getElementById("fechaFiltro").addEventListener("change", function () {
    //    getTipoCambio();
    //});


});

function listarTipoCambio() {
    getTipoCambio()
}
function getTipoCambio() {
    
    let request =
    {

        //fecha: ($("#fechaFiltro").val() && $("#fechaFiltro").val() !== "")
        //    ? $("#fechaFiltro").val()
        //    : null,
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoIso: ($("#txtCodigoIsoFiltro").val() && $("#txtCodigoIsoFiltro").val().trim() !== "")
            ? $("#txtCodigoIsoFiltro").val().trim()
            : null,

        nombre: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val() !== "0")
            ? parseInt($("#txtEstadoFiltro").val())
            : null,

        paginaActual: 1,
        tamanioPagina: 10
    };

    console.log("fecha", request);

    /*serviceTipoCambio.getTipoCambioPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getTipoCambio', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceTipoCambio.getTipoCambioPaginado(request, headersuarm)  //cambiar
               .then(response => {
                   cb(response)
               }).catch(error => msgException('getTipoCambio', error));

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
                data: 'idMoneda',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'codigoIso' },
            { data: 'nombre' },
            { data: 'valor' },
            { data: 'estadoDescripcion' },
            //{
            //    data: 'fecha',
            //    render: function (data, type, row) {
            //        if (!data) return "";
            //        let fecha = new Date(data);
            //        let dia = String(fecha.getDate()).padStart(2, '0');
            //        let mes = String(fecha.getMonth() + 1).padStart(2, '0');
            //        let anio = fecha.getFullYear();
            //        return `${dia}/${mes}/${anio}`;
            //    }

            //},
            //{ data: 'horaRegistro' },
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
                data: 'idMoneda',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" ' + 'data-fecha="' + row.fecha + '" ' + 'data-hora="' + row.horaRegistro + '" ' + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });
}

function editTipoCambio(request) {
    limpiarModal();

    serviceTipoCambio.getTipoCambioPorId(request, headersuarm)
        .then(response => {
            //console.log("response", response);
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idMoneda);

                $("#txtCodigo").val(response.codigoIso);
                $("#txtNombre").val(response.nombre);
                $("#txtValor").val(response.valor);

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            })
        })
        .catch(error => {
            msgException('editTipoCambio', error);
        });
}
function updTipoCambio(datos) {

    serviceTipoCambio.updTipoCambio(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getTipoCambio();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updTipoCambio', error);
        });
}
function insTipoCambio(datos) {

    console.log("llegan datos", datos);
    serviceTipoCambio.insTipoCambio(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getTipoCambio();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insTipoCambio', error);
        });
}

function delTipoCambio(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE TipoCambio?", "question", (result) => {
        if (result.isConfirmed) {
            serviceTipoCambio.delTipoCambio(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getTipoCambio();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delTipoCambio', error);
                });
        }
    });
}

function grabar() {

    const valorTexto = document.getElementById("txtValor").value;
    const valorDecimal = parseFloat(valorTexto); 

    var idMoneda = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());
    
    var codigoIso = $("#txtCodigo").val();
    var nombre = $("#txtNombre").val();
    var valor = valorDecimal;
    
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;FF
    
    if (flag == 1) {
        let datos = {
            idMoneda: idMoneda,          
            idAnio: idAnio,
            anio: anio,
            codigoIso: codigoIso,
            nombre: nombre,
            valor: valor,  
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };        
        updTipoCambio(datos);
    } else {
        let datos = {
            idAnio: idAnio,
            anio: anio,
            codigoIso: codigoIso,
            nombre: nombre,
            valor: valor,
            idEstado: idEstado
        };        
        insTipoCambio(datos);
    }
}

function eliminar(control) {
    var idMoneda = $(control).data('input');
    let datos = {
        idMoneda: idMoneda
    };
    delTipoCambio(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Tipo de Cambio");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    
    $("#txtEstado").prop("disabled", true);

    var idMoneda = $(control).data('input');
    
    let request =
    {
        idMoneda: idMoneda    
    }
    
    editTipoCambio(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo TipoCambio");
    
    $("#txtEstado").val("Emitido");
    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtCodigo").val("");
    $("#txtNombre").val("");
    $("#txtValor").val("");
    $("#txtFechaRegistro").val("");
    $("#txtHoraRegistro").val("");

    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtCodigoIsoFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

