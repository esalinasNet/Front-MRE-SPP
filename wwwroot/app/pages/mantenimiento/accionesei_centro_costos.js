const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
let seleccionados = new Set();

$(document).on('change', '#chkTodos', function () {
    const checked = $(this).prop('checked');
    $('.chkCentro').prop('checked', checked);
});

$(function () {
    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                //fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
                listarAccionesInstitucionales();
            });
        //listarAccionesInstitucionales();
    });
    $("#btnBuscar").click(function () {
        listarAccionesInstitucionales();
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

function listarAccionesInstitucionales() {
    getAccionesInstitucionales()
}
function getAccionesInstitucionales() {
    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoAcciones: ($("#txtAccionesFiltro").val() && $("#txtAccionesFiltro").val().trim() !== "")
            ? $("#txtAccionesFiltro").val().trim()
            : null,

        descripcionAcciones: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
            ? $("#txtDescripcionFiltro").val().trim()
            : null,

        //codigoPrioritarios: ($("#txtPrioritariosFiltro").val() && $("#txtPrioritariosFiltro").val().trim() !== "")
        //    ? $("#txtPrioritariosFiltro").val().trim()
        //    : null,

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
    /*serviceAccionesInstitucionales.getAccionesInstitucionalesPaginado(request, headersuarm)  //cambiar
        .then(response => {
            console.log(response)
        }).catch(error => msgException('getAccionesInstitucionales', error));  */

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceAccionesInstitucionales.getAccionesInstitucionalesPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getAccionesInstitucionales', error));

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
                data: 'idAcciones',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },

            { data: 'codigoAcciones' },
            { data: 'descripcionAcciones' },

            { data: 'codigoObjetivos' },

            { data: 'nroCentroCostos' },

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
                data: 'idAcciones',
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

function editAccionesInstitucionales(request) {
    limpiarModal();

    serviceAccionesInstitucionales.getAccionesInstitucionalesPorId(request, headersuarm)
        .then(response => {
            
            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => {

                $("#hcodigo").val(response.idAcciones);

                $("#txtAcciones").val(response.codigoAcciones);
                $("#txtDescripcionAcciones").val(response.descripcionAcciones);

                $("#txtObjetivos").val(response.codigoObjetivos);
                $("#txtDescripcionObjetivos").val(response.descripcionObjetivos);

                $("#txtTotalSeleccionados").val(response.nroCentroCostos);

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));
                ESTADO = response.estado;

                //aqui traer la tabla aei_costos
                
            });

            let request = {
                idAcciones: response.idAcciones,  
                idAnio: response.idAnio 
            }

            //traemos los Centros de Costos seleccionados
            serviceAccionesInstitucionales.getAeiCentroCostosPorId(request, headersuarm)
                .then(_response => {
                    console.log("AEi Costos", _response);

                    // Extraer solo los idCentroCostos de cada objeto
                    const ids = _response.map(x => x.idCentroCostos);

                    // Crear el Set global con esos IDs
                    seleccionados = new Set(ids);

                    console.log("seleccionados Costos", seleccionados);
                });

            getCentroCostos();                 

        })
        .catch(error => {
            msgException('editAccionesInstitucionales', error);
        });
}

function updAccionesInstitucionales(datos) {

    //console.log("llega datos", datos);

    serviceAccionesInstitucionales.updAccionesInstitucionales(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getAccionesInstitucionales();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updAccionesInstitucionales', error);
        });
}
function insAccionesInstitucionales(datos) {

    serviceAccionesInstitucionales.insAccionesInstitucionales(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getAccionesInstitucionales();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insAccionesInstitucionales', error);
        });
}

function delAccionesInstitucionales(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE ACCIONES INTITUCIONALES?", "question", (result) => {
        if (result.isConfirmed) {
            serviceAccionesInstitucionales.delAccionesInstitucionales(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getAccionesInstitucionales();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delAccionesInstitucionales', error);
                });
        }
    });
}

function grabar() {

    var idAcciones = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());

    //console.log("idAnio:", idAnio, "anio:", anio);

    var idCentroCostos =  Array.from(seleccionados);
    var nroCentroCostos = seleccionados.size;
    
    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = 3;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idAcciones: idAcciones,
            idAnio: idAnio,

            idCentroCostos: idCentroCostos,
            nroCentroCostos: nroCentroCostos,
            
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updAccionesInstitucionales(datos);
    } else {
        let datos = {
            //idAcciones: codigo,
            idAnio: idAnio,
            anio: anio,
            codigoAcciones: codigoAcciones,
            descripcionAcciones: descripcionAcciones,

            codigoObjetivos: codigoObjetivos,
            descripcionObjetivos: descripcionObjetivos,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insAccionesInstitucionales(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idAccionesInstitucionales: codigo
    };
    delAccionesInstitucionales(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar - AEI con C. Costos");
    $("#flagEdit").val(1);

    $("#txtAcciones").prop("disabled", true);
    $("#txtDescripcionAcciones").prop("disabled", true);

    $("#txtObjetivos").prop("disabled", true);
    $("#txtDescripcionObjetivos").prop("disabled", true);
    $("#txtTotalSeleccionados").prop("disabled", true);

    $("#cboActivo").prop("disabled", true);
    $("#txtEstado").prop("disabled", true);
    $("#cboAnio").prop("disabled", true);

    var idAcciones = $(control).data('input');

    let request =
    {
        idAcciones: idAcciones
    }

    editAccionesInstitucionales(request);
}

function nuevo() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Nueva AEI con C. Costos");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuestal("cboAnio", 0, "SELECCIONE", (response) => { });
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtAcciones").val("");
    $("#txtDescripcionAcciones").val("");

    $("#txtObjetivos").val("");
    $("#txtDescripcionObjetivos").val("");

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {
    $("#txtAccionesFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    //$("#txtPrioritariosFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });

    getAccionesInstitucionales();
}

function getCentroCostos() {

    let request =
    {
        anio: 0,
        centroCostos: null,
        descripcion: null,
        centroCostosPadre: null,
        estadoDescripcion: null,
        paginaActual: 0,
        tamanioPagina: 0
    };

    //let seleccionados = new Set();

    $("#gridCentroCostos").DataTable().clear();
    $('#gridCentroCostos').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceCentroCostos.getCentroCostosPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getCentroCostos', error));

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
                data: null,
                orderable: false,
                className: 'text-center',
                render: function (data, type, row) {
                    const checked = seleccionados.has(row.idCentroCostos) ? 'checked' : '';
                    return `<input type="checkbox" class="chkCentro" data-id="${row.idCentroCostos}" ${checked} />`;
                }
            },
            //{
            //    data: 'idCentroCostos',
                //render: function (data, type, row, meta) {
                //    return row.registro;
                //}
            //},            
            { data: 'centroCostos' },
            { data: 'descripcion' },            
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
            }
           // {
               // data: 'idCentroCostos',
                //render: function (data, type, row) {
                //    var resultado = '';
                //    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';                   
                //    return resultado;
                //}
            //}
        ],
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true
    });

    function actualizarTotalSeleccionados() {
        $('#txtTotalSeleccionados').val(seleccionados.size);
    }

    $(document).on('change', '.chkCentro', function () {
        const id = $(this).data('id');
        if ($(this).is(':checked')) {
            seleccionados.add(id);
        } else {
            seleccionados.delete(id);
        }
        actualizarTotalSeleccionados();
    });
}