const API_URL = basePath.sgeoAPi;
var ESTADO = 1;

$(function () {
    validarLogin((response) => {
        if (response)
            //fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarUbigeoExterior();
            //});
        //listarFuncion();
    });
    $("#btnBuscar").click(function () {
        listarUbigeoExterior();
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
        listarUbigeoExterior();
    });
});

function listarUbigeoExterior() {
    getUbigeoExterior()
}
function getUbigeoExterior() {
    let request =
    {        
        zone: ($("#txtZoneFiltro").val() && $("#txtZoneFiltro").val().trim() !== "")
            ? $("#txtZoneFiltro").val().trim()
            : null,

        region: ($("#txtRegionFiltro").val() && $("#txtRegionFiltro").val().trim() !== "")
            ? $("#txtRegionFiltro").val().trim()
            : null,

        pais: ($("#txtPaisFiltro").val() && $("#txtPaisFiltro").val().trim() !== "")
            ? $("#txtPaisFiltro").val().trim()
            : null,

        oseRes: ($("#txtOSERESFiltro").val() && $("#txtOSERESFiltro").val().trim() !== "")
            ? $("#txtOSERESFiltro").val().trim()
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
    serviceUbigeoExterior.getUbigeoExteriorPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getFuncion', error));  

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceUbigeoExterior.getUbigeoExteriorPaginado(request, headersuarm)  //cambiar
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
                data: 'idUbigeoExterior',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'zone' },
            { data: 'region' },
            { data: 'pais' },
            { data: 'oseRes' },
            { data: 'tipoMision' },
            { data: 'nombreOse' },
            { data: 'moneda' },            
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
                data: 'idUbigeoExterior',
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


function editUbigeExterior(request) {
    limpiarModal();

    serviceUbigeoExterior.getUbigeoExteriorPorId(request, headersuarm)
        .then(response => {
            // console.log(response);
            //fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {
                $("#hcodigo").val(response.idUbigeoExterior);
                $("#txtZone").val(response.zone);
                $("#txtRegion").val(response.region);
                $("#txtPais").val(response.pais);
                $("#txtOSE").val(response.ose);
                $("#txtTipoMision").val(response.tipoMision);
                $("#txtNombreOSE").val(response.nombreOse);
                $("#txtTipoMoneda").val(response.moneda);                

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;
            //});
        })
        .catch(error => {
            msgException('editFuncion', error);
        });
}

function updUbigeoExterior(datos) {
        

    serviceUbigeoExterior.updUbigeoExterior(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                getUbigeoExterior();

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

function insUbigeoExterior(datos) {

    serviceUbigeoExterior.insUbigeoExterior(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeoExterior();
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

function delUbigeoExterior(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ?", "question", (result) => {
        if (result.isConfirmed) {
            serviceUbigeoExterior.delUbigeoExterior(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getUbigeoExterior();
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
        
    var zone = $("#txtZone").val();
    var region = $("#txtRegion").val();
    var pais = $("#txtPais").val();
    var oseRES = $("#txtOSERES").val();
    var ose = $("#txtOSE").val();
    var tipoMision = $("#txtTipoMision").val();
    var nombreOse = $("#txtNombreOSE").val();
    var moneda = $("#txtTipoMoneda").val();
    var mon = $("#txtMon").val();

    var activo = parseInt($("#cboActivo").val());

    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idUbigeoExterior: codigo,
            zone: zone,
            region: region,
            pais: pais,
            oseRES: oseRES,
            ose: ose,
            tipoMision: tipoMision,
            nombreOse: nombreOse,
            moneda: moneda,
            mon: mon,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updUbigeoExterior(datos);

    } else {
        let datos = {
            zone: zone,
            region: region,
            pais: pais,
            oseRES: oseRES,
            ose: ose,
            tipoMision: tipoMision,
            nombreOse: nombreOse,
            moneda: moneda,
            mon: mon,
            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insUbigeoExterior(datos);
    }
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idUbigeoExterior: codigo
    };
    delUbigeoExterior(datos);
}
function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nuevo OSE");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    //fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Registro OSE");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var id = $(control).data('input');

    let request =
    {
        idUbigeoExterior: id
    }

    editUbigeExterior(request);
}

function limpiarModal() {
    $("#hcodigo").val("");
    $("#txtZone").val("");
    $("#txtRegion").val("");
    $("#txtPais").val("");
    $("#txtOSERES").val("");
    $("#txtOSE").val("");
    $("#txtTipoMision").val("");
    $("#txtNombreOSE").val("");
    $("#txtTipoMoneda").val("");
    $("#txtMon").val("");   
    
    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}
function limpiarFiltros() {
    $("#txtZoneFiltro").val("");
    $("#txtRegionFiltro").val("");
    $("#txtPaisFiltro").val("");
    $("#txtOSERESFiltro").val("");    
    $("#cboSituacionFiltro").val(1);
    //fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

