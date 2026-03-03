const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
var idANIOPERIODO = 0;
var idPLANILLA = 0;
var idPLANILLADETALLE = 0;

$(function () {

    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {

                listarPlanillas();
            });

        fillSelectAnioPresupuesto("cboAnios", 0, "SELECCIONE", (response) => { });
    });
    $("#btnBuscar").click(function () {
        //listarCalendario();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });    
    $("#btnAgregar").click(function () {
        nuevoPlanillas();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });
    $("#btnNuevoConcepto").click(function () {
        nuevoConcepto();
    });
    $("#btnGrabarConcepto").click(function () {
        grabarConcepto();
    });
    $("#btnCerrarConcepto").click(function () {
        $("#modalConceptos").modal("hide");
    });
    $("#btnCerrarDetalle").click(function () {
        $("#modalPlanillaDetalle").modal("hide");
    });

    //año para filtro de Actividades    
    var anios = document.getElementById("cboAnio");
    anios.addEventListener("change", function () {
        var idAnio = parseInt($("#cboAnio").val());
        
        let request = { idAnio: idAnio }
        fillSelectPrograma("cboPrograma", request, 0, "SELECCIONE", (response) => { });
        fillSelectProducto("cboProucto", request, 0, "SELECCIONE", (response) => { });
        fillSelectActividad("cboActividad", request, 0, "SELECCIONE", (response) => { });
        fillSelectFinalidad("cboFinalidad", request, 0, "SELECCIONE", (response) => { });
        fillSelectCentroCostos("cboCentroCostos", request, 0, "SELECCIONE", (response) => { });
    });
})

function listarPlanillas() {
    cargarGridPlanillas()
}

function cargarGridPlanillas() {
    console.log("planillas");

    let request =
    {
        anio: ($("#cboAnioFiltro").val() && $("#cboAnioFiltro").val() !== "0")
            ? $("#cboAnioFiltro option:selected").text()  //parseInt($("#cboAnioFiltro").val())
            : 0,

        codigoAcciones: ($("#txtNroDocumentoFiltro").val() && $("#txtNroDocumentoFiltro").val().trim() !== "")
            ? $("#txtNroDocumentoFiltro").val().trim()
            : null,

        descripcionAcciones: ($("#txtApellidosFiltro").val() && $("#txtApellidosFiltro").val().trim() !== "")
            ? $("#txtApellidosFiltro").val().trim()
            : null,

        //codigoPrioritarios: ($("#txtPrioritariosFiltro").val() && $("#txtPrioritariosFiltro").val().trim() !== "")
        //    ? $("#txtPrioritariosFiltro").val().trim()
        //    : null,

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val().trim() !== "")
            ? $("#txtEstadoFiltro").val().trim()
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

    $("#gridPlainllas").DataTable().clear();
    $('#gridPlainllas').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            servicePlanillas.getPlanillasPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getPlanillas', error));

        },
        language: {
            search: "Búsqueda:",
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No se encontraron registros",
            info: "Se encontraron _TOTAL_ resultados.",
            infoEmpty: "No se encontraron registros"
        },
        responsive: true,        
        autoWidth: false,
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true,
        /*data: [
            { nro: 1, anio: '2025', mes: '01' , programa: '0062. OPTIMIZACION DE LA POLI', producto: '3000144. PERSONAS RECIBEN SERV', actividad: '5004339. ATENCION DE TRAMITES', meta: '2', finalidad: '07175', centrocosto: '02.12.02', 
                    descripcioncosto: 'DIRECCION DE POLITICA CONSULAR', apellidonombres:'DE LA CRUZ DE LA CRUZ RAUL',  estado: 'Emitido', activo: 1 },
            {
                nro: 1, anio: '2025', mes: '01', programa: '0062. OPTIMIZACION DE LA POLI', producto: '3000144. PERSONAS RECIBEN SERV', actividad: '5004339. ATENCION DE TRAMITES', meta: '2', finalidad: '07175', centrocosto: '02.03.03',
                descripcioncosto: 'DIRECCION DE POLITICAS Y ESTRATEGICAS', apellidonombres: 'SANCHEZ VASQUEZ JULIO', estado: 'Emitido', activo: 1            
            },
        ],*/
        columns: [
            {
                data: 'idPlanillas',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio', width: "10px" },
            { data: 'mes', width: "10px" },
            { data: 'programa', width: "10px" },
            { data: 'descripcionPrograma', width: "10px" },
            { data: 'producto', width: "10px" },
            { data: 'descripcionProducto', width: "10px" },
            //{ data: 'actividad', width: "10px" },
            { data: 'descripcionActividad', width: "10px" },
            { data: 'meta', width: "10px" },
            //{ data: 'finalidad', width: "10px" },
            //{ data: 'descripcionFinalidad', width: "10px" },
            //{ data: 'idCentroCostos' },
            { data: 'centroCostos', width: "10px" },
            { data: 'descripcionCentroCostos', width: "10px" },
            { data: 'apellidosNombres', width: "10px" },
            { data: 'estadoDescripcion', width: "10px" },
            {
                data: 'activo',  width: "10px",
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
                data: 'idPlanillas', width: "10px",
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="detalle(this)" data-input="' + data + '" class="btn btn-sm btn-outline-success" title="Conceptos"><i class="bi-list-check"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ]
    });
}

function editarPlanillas(request) {
    limpiarModal();

    servicePlanillas.getPlanillasPorId(request, headersuarm)
        .then(response => {

            console.log("editar");

            fillSelectAnioPresupuesto("cboAnio", response.idAnio, "SELECCIONE", (termino) => { 
                $("#hcodigo").val(response.idPlanillas);
                idANIOPERIODO = response.idAnio;
                var idAnio = response.idAnio;

                let request =
                {
                    idAnio: idAnio
                };
                console.log("response", response);

                fillSelectPrograma("cboPrograma", request, response.idPrograma, "SELECCIONE", (termino) => {});

                fillSelectProducto("cboProucto", request, response.idProducto, "SELECCIONE", (termino) => { });

                fillSelectActividad("cboActividad", request, response.idActividad, "SELECCIONE", (termino) => { });

                let meta = response.Meta
                if (meta === 2) meta = "1";
                $("#cboMeta").val(1);
                
                fillSelectFinalidad("cboFinalidad", request, response.idFinalidad, "SELECCIONE", (termino) => { });

                let tipoDocumento = response.tipoDocumento;
                if (tipoDocumento === "1") tipoDocumento = "1";
                if (tipoDocumento === "2") tipoDocumento = "2";
                $("#cboTipodeDocuento").val(String(tipoDocumento));

                //$("#cboTipodeDocuento").val(String(1));
                $("#txtNroDocumento").val(response.nroDocumento);

                fillSelectCentroCostos("cboCentroCostos", request, response.idCentroCostos, "SELECCIONE", (termino) => { });

                //$("#cboCentroCostos").val(String(1));
                //$("#txtDescripcionCostos").val('DIRECCION DE POLITICA CONSULAR');

                $("#txtApellidosNombres").val(response.apellidosNombres);

                let nromes = response.idMes;
                let mes = "";
                if (nromes === 1) mes = "1";
                if (nromes === 2) mes = "2";
                if (nromes === 3) mes = "3";
                if (nromes === 4) mes = "4";
                if (nromes === 5) mes = "5";
                if (nromes === 6) mes = "6";
                if (nromes === 7) mes = "7";
                if (nromes === 8) mes = "8";
                if (nromes === 9) mes = "9";
                if (nromes === 10) mes = "10";
                if (nromes === 11) mes = "11";
                if (nromes === 12) mes = "12";

                $("#cboMes").val(String(mes));

                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";
                $("#cboActivo").val(String(activo));

                ESTADO = response.estado;
            });
        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}

function updPlanillas(datos) {

    //console.log("llega datos", datos);

    servicePlanillas.updPlanillas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                cargarGridPlanillas();

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalRegistro").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updPlanillas', error);
        });
}

function insPlanillas(datos) {

    servicePlanillas.insPlanillas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                cargarGridPlanillas();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insPlanillas', error);
        });
}

function delPlanillas(datos) {

    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {

            servicePlanillas.delPlanillas(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        cargarGridPlanillas();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delPlanillas', error);
                });
            
        }
    });
}

function grabar() {

    var idPlanillas = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var idAnio = parseInt($("#cboAnio").val());
    var anio = parseInt($("#cboAnio option:selected").text());


    var idMes = parseInt($("#cboMes").val());
    var idPrograma = parseInt($("#cboPrograma").val());
    var idProducto = parseInt($("#cboProucto").val());
    var idActividad = parseInt($("#cboActividad").val());

    var Meta = parseInt($("#cboMeta").val());
    var idFinalidad = parseInt($("#cboFinalidad").val());

    var tipoDocumento = parseInt($("#cboTipodeDocuento").val());
    var nroDocumento = $("#txtNroDocumento").val();

    var idCentroCostos = parseInt($("#cboCentroCostos").val());
    var ApellidosNombres = $("#txtApellidosNombres").val();

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {
        let datos = {
            idPlanillas: idPlanillas,
            idAnio: idAnio,
            
            idMes:  idMes,
            idPrograma: idPrograma,
            idProducto: idProducto,
            idActividad: idActividad,
            Meta: Meta,
            idFinalidad: idFinalidad,

            idCentroCostos: idCentroCostos,

            tipoDocumento: tipoDocumento,
            nroDocumento: nroDocumento,

            apellidosNombres: ApellidosNombres,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        console.log("grabar", datos);
        updPlanillas(datos);
    } else {
        let datos = {
            //idPlanillas: codigo,
            idAnio: idAnio,
            anio: anio,            

            idMes: idMes,
            idPrograma: idPrograma,
            idProducto: idProducto,
            idActividad: idActividad,
            Meta: Meta,
            idFinalidad: idFinalidad,

            idCentroCostos: idCentroCostos,

            tipoDocumento: tipoDocumento,
            nroDocumento: nroDocumento,

            apellidosNombres: ApellidosNombres,

            idEstado: idEstado
        };
        //console.log("nuevo", datos);
        insPlanillas(datos);
    }

}

function eliminar(control) {

    var idPlanillas = $(control).data('input');

    let request =
    {
        idPlanillas: idPlanillas
    }

    delPlanillas(request);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar datos de Planillas");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtMes").prop("disabled", true);
    $("#txtEstado").prop("disabled", true);

    var idPlanillas = $(control).data('input');

    let request =
    {
        idPlanillas: idPlanillas
    }

    editarPlanillas(request);
}

function nuevoPlanillas() {
    limpiarModal();
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo Planillas Presupuestal");
    
    $("#txtEstado").prop("disabled", true);
    
    $("#txtEstado").val("Emitido");

    fillSelectAnioPresupuesto("cboAnio", 0, "SELECCIONE", (response) => { });   

}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#cboPrograma").val(String(0));
    $("#cboProucto").val(String(0));
    $("#cboActividad").val(String(0));
    $("#cboMeta").val(String(0));
    $("#cboFinalidad").val(String(0));

    $("#cboTipodeDocuento").val(String(1));
    $("#txtNroDocumento").val('');

    $("#cboCentroCostos").val(String(0));
    $("#txtDescripcionCostos").val('');

    $("#txtApellidosNombres").val('');

    $("#cboMes").val(String(0));
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtPlanillasFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
    listarPlanillas();
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar datos de Planillas");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtMes").prop("disabled", true);
    $("#txtEstado").prop("disabled", true);

    var idPlanillas = $(control).data('input');

    let request =
    {
        idPlanillas: idPlanillas
    }

    editarPlanillas(request);
}

function detalle(control) {

    $("#modalPlanillaDetalle").modal("show");

    var idPlanillas = $(control).data('input');
    idPLANILLA = idPlanillas;

    let request =
    {
        idPlanillas: idPlanillas
    }

    CabeceraPlanilla(idPlanillas)
    getPlanillaDetalle(idPlanillas);
}

function CabeceraPlanilla(idPlanillas) {

    var idPlanillas = idPlanillas
    let request =
    {
        idPlanillas: idPlanillas
    }

    servicePlanillas.getPlanillasPorId(request, headersuarm)
        .then(response => {

            console.log("editar", response);
            idANIOPERIODO = response.idAnio;

            $("#txtAnioCabecera").val(response.anio);
            $("#txtDescripcioProducto").val(response.producto + "-" + response.descripcionProducto);
            $("#txtDescripcioActividad").val(response.actividad + "-" + response.descripcionActividad);
            $("#txtDescripcionMeta").val(response.meta);
            $("#txtDescripcionFinalidad").val(response.finalidad + "-" + response.descripcionFinalidad);
            $("#txtDescripcionCentroCostos").val(response.centroCostos + "-" + response.descripcionCentroCostos);
            $("#txtApellidosNombresCabecera").val(response.apellidosNombres);

            let tipoDocumento = response.tipoDocumento;
            if (tipoDocumento === 1) tipoDocumento = "1";
            if (tipoDocumento === 2) tipoDocumento = "2";
            $("#cboTipodeDocuento").val(String(tipoDocumento));
            var tipo = $("#cboTipodeDocuento option:selected").text();
            $("#txtTipoDocuemnto").val(tipo);

            $("#txtNroDocuemnto").val(response.nroDocumento);
            $("#txtEstadoCabecera").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "SÍ";
            if (activo === false) activo = "NO";
            $("#txtActivoCabecera").val(String(activo));

            $("#txtPeriodoMes").val(response.descripcionMes);

        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}

function getPlanillaDetalle(idPlanilla) {

    var idPlanillas = idPlanilla;   // $(control).data('input');

    let request =
    {
        idPlanillas: idPlanillas,
        activo: true,
        paginaActual: 0,
        tamanioPagina: 0
    }
    console.log("request", request);

    $("#gridDetalle").DataTable().clear();
    $('#gridDetalle').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            servicePlanillas.getPlanillasDetallePaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)

                    console.log("detalle", response);

                }).catch(error => msgException('getDetalle', error));

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
                data: 'idPlanillaDetalle',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },            
            //{ data: 'idPlanillas' },
            //{ data: 'idEspecifica' },
            { data: 'clasificador' },
            { data: 'descripcionClasificador' },
            //{ data: 'periodo' },
            { data: 'importe' },
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
                data: 'idPlanillaDetalle',
                    render: function (data, type, row) {
                    var resultado = '';
                        resultado += '<button onclick="editarconcepto(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';                   
                        resultado += '<button onclick="eliminarconcepto(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }
        ],
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true
    });
       
}

function nuevoConcepto() {

    $("#modalConceptos").modal("show");
    $("#mdlTitleConceptos").text("Registrar Nuevos Conceptos");
    $("#flagEditConceptos").val(0);

    $("#txtIdPlanillaDetalle").val('');
    $("#txtIdPlanilla").val(idPLANILLA);
    $("#txtImporte").val(0);

    var idAnio = idANIOPERIODO
    let request =
    {
        idAnio: idAnio
    };

    $("#txtDescripciónEspecifica").val('');
    fillSelectEspecifica("cboEspecificaGasto", request, 0, "SELECCIONE", (response) => { });

}

function editarconcepto(control) {

    $("#modalConceptos").modal("show");
    $("#mdlTitleConceptos").text("Edita Conceptos");
    $("#flagEditConceptos").val(1);

    var idPlanillaDetalle = $(control).data('input');
    idPLANILLADETALLE = idPlanillaDetalle

    let request =
    {
        idPlanillaDetalle: idPlanillaDetalle
    }

    editarConceptoResgistro(request);
}

function eliminarconcepto(control) {

    var idPlanillaDetalle = $(control).data('input');

    let request =
    {
        idPlanillaDetalle: idPlanillaDetalle
    }

    delConceptoRegistro(request);
}

function editarConceptoResgistro(request) {
    //limpiarModal();

    servicePlanillas.getPlanillasDetallePorId(request, headersuarm)
        .then(response => {

            console.log("editar", response);            

            var idAnio = idANIOPERIODO;
            let request =
            {
                idAnio: idAnio
            };
            
            $("#hidconceptos").val(response.idPlanillaDetalle);
            $("#txtIdPlanillaDetalle").val(response.idPlanillaDetalle);
            $("#txtIdPlanilla").val(response.idPlanillas);
            $("#txtImporte").val(response.importe);

            fillSelectEspecifica("cboEspecificaGasto", request, response.idEspecifica, "SELECCIONE", (termino) => { });                
           
        })
        .catch(error => {
            msgException('editAcciones', error);
        });
}


function updConceptos(datos) {

    //console.log("llega datos", datos);

    servicePlanillas.updPlanillasDetalle(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                getPlanillaDetalle(idPLANILLA);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalConceptos").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updConceptos', error);
        });
}
function insConceptos(datos) {

    servicePlanillas.insPlanillasDetalle(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                getPlanillaDetalle(idPLANILLA);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalConceptos").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insConceptos', error);
        });
}

function delConceptoRegistro(datos) {

    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {

            servicePlanillas.delPlanillasDetalle(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        getPlanillaDetalle(idPLANILLA);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delConceptoRegistro', error);
                });
        }
    });
}

function grabarConcepto() {

    console.log("kike");

    var idPlanillas = parseInt($("#txtIdPlanilla").val())
    var idPlanillaDetalle = parseInt($("#txtIdPlanillaDetalle").val())
    var idEspecifica = parseInt($("#cboEspecificaGasto").val());
    var importe = parseInt($("#txtImporte").val());
    var activo = parseInt($("#cboActivoConcepto").val());

    var flag = $("#flagEditConceptos").val();
    console.log("kike", idPlanillaDetalle);

    if (flag == 1) {
        let datos = {

            idPlanillaDetalle: idPlanillaDetalle, 
            idPlanillas: idPlanillas,
            idEspecifica: idEspecifica,

            importe: importe,            
                        
            activo: (activo == 1 ? true : false)
        };
        //console.log("grabar", datos);
        updConceptos(datos);
    } else {
        let datos = {

            idPlanillas: idPlanillas,
            idEspecifica: idEspecifica,

            importe: importe        

        };
        //console.log("nuevo", datos);
        insConceptos(datos);
    }

}

