const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
var idAnio = 0;
var todasLasActividadesMigracion = [];
var actividadesSeleccionadasParaMigrar = [];
var aniosDisponiblesParaMigrar = [];
var aniosSeleccionadosParaMigrar = [];
var fasePOIActual = null;

$(function () {

    $("#btnNuevaActividad").prop("disabled", true);
    $("#btnNuevoClasificador").prop("disabled", true);
    $("#btnNuevaTarea").prop("disabled", true);
    $("#btnNuevaAccion").prop("disabled", true);

    validarLogin((response) => {
        if (response)
            fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => {
                                
                listarProgramacionActividad();
            });        

          fillSelectAnioPresupuesto("cboAnios", 0, "SELECCIONE", (response) => { });
    });
    $("#btnBuscar").click(function () {
        listarCalendario();
    });
    $("#btnGrabar").click(function () {
        grabar();
    });
    $("#btnCerrar").click(function () {
        $("#modalRegistro").modal("hide");
    });
    $("#btnAgregar").click(function () {
        //nuevo();
    });
    $("#btnNuevaActividad").click(function () {
        nuevo();
    });
    $("#btnLimpiar").click(function () {
        limpiarFiltros();
    });

    //    
    //Tabs 
    $('#tabResultados button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
        const target = $(e.target).attr("data-bs-target");

        if (target === "#pane-actividades") {
            if (!$.fn.DataTable.isDataTable('#gridActividades')) listarProgramacionActividad();
        }
        else if (target === "#pane-clasificador") {

            if (!$.fn.DataTable.isDataTable('#gridClasificador')) cargarGridClasificador();
        }
        else if (target === "#pane-tareas") {
            if (!$.fn.DataTable.isDataTable('#gridTareas')) cargarGridTareas();
        }
        else if (target === "#pane-recursos") {
            if (!$.fn.DataTable.isDataTable('#gridRecursos')) cargarGridRecursos();
        }
        else if (target === "#pane-acciones") {
            if (!$.fn.DataTable.isDataTable('#gridAcciones')) cargarGridAcciones();
        }
    });    

    //año para filtro de Actividades    
    var anio = document.getElementById("cboAnios");
    anio.addEventListener("change", function () {

        var idAnioAc = parseInt($("#cboAnios").val());
        var anioAc = parseInt($("#cboAnios option:selected").text());

        idAnio = idAnioAc;
        localStorage.setItem("idAnio", idAnioAc);
        localStorage.setItem("anio", anioAc);

        getProgramacionActividad(anioAc)

        $("#txtAniosClasificadorFiltro").val(anioAc);

        $("#txtAniosClasificador").val(anioAc);
        $("#txtAnioTareas").val(anioAc);
        $("#txtAnioAcciones").val(anioAc);

        $("#hAniosPresupuestalClasificador").val(idAnioAc);
        $("#hAniosPresupuestalTareas").val(idAnioAc);
        $("#hAniosPresupuestalAcciones").val(idAnioAc);

        $("#btnNuevaActividad").prop("disabled", false);

    });

    $('#gridActividades').on('change', '.chkFila', function () {

        let table = $('#gridActividades').DataTable();

        // ✔ Desmarcar todos los demás checkboxes
        $('.chkFila').not(this).prop('checked', false);

        // obtener la fila donde está el checkbox
        let fila = $(this).closest('tr');

        // obtener los datos de esa fila
        let datosFila = table.row(fila).data();

        console.log("datosFila", datosFila);

        // ✔ Si está marcado, guardamos, si no, limpiamos
        if ($(this).is(':checked')) {

            // variables que necesites
            let id = datosFila.idProgramacionActividad;
            let anio = datosFila.anio;
            let codigoProgramacion = datosFila.codigoProgramacion;
            let denominacion = datosFila.denominacion;
            let tipoUbigeo = datosFila.tipoUbigeo;
            let Ubigeo = datosFila.ubigeo;
            let idUnidadMedida = datosFila.idUnidadMedida;

            $("#hidProgramacionActividad").val(id);
            $("#hidProgramacionActividadClasificador").val(id);
            $("#hidProgramacionActividadAcciones").val(id);

            $("#hcodigoProgramacion").val(codigoProgramacion);
            $("#txtActividadOperativaClasificadorFiltro").val(codigoProgramacion);
            $("#txtActividadOperativaClasificador").val(codigoProgramacion);
            $("#txtActividadOperativaTareas").val(codigoProgramacion);
            $("#txtActividadOperativaAcciones").val(codigoProgramacion);

            $("#txtAniosTareasFiltro").val(anio);
            $("#txtActividadOperativaTareasFiltro").val(codigoProgramacion);

            $("#btnNuevoClasificador").prop("disabled", false);
            $("#btnNuevaTarea").prop("disabled", false);

            //Datos para Tareas
            $("#htipoUbigeoActividad").val(tipoUbigeo);
            $("#hUbigeoActividad").val(Ubigeo);
            $("#hidUnidadMedidaActividad").val(idUnidadMedida);


            //$("#cboUbigeoTareas").val(tipoUbigeo);
            //$("#txtUbigeoTareas").val(Ubigeo);

            getCargarGridClasificador(anio, id);

            getCargarGridTareas(anio, id);

            // si quieres guardar en variables globales:
            window.itemSeleccionado = datosFila;

        } else {
            // si se desmarca, limpiamos la variable
            window.itemSeleccionado = null;
        }
    });


    //Se toma el Año para los commbos
    var _servicio = document.getElementById("cboServicio");
    _servicio.addEventListener("change", function () {

        let flag = parseInt($("#flagEdit").val());  

        var idAnio = parseInt($("#cboAnios").val());

        let request = { idAnio: idAnio }

        if (flag == 0)  //nuevo
        {
            llenaCommbos(request)
            fillSelectObjetivosEstrategicos("cboOES", request, 0, "SELECCIONE", (response) => { });
        }
        
        fillSelectTipoDeCambio("cboMoneda", request, 0, "SELECCIONE", (response) => { });

        serviceProgramacionActividad.getProgramacionActividadAniosPorId(request, headersuarm)
            .then(response => {

                $("#txtProgramacion").val(response.codigoProgramacion);

            })
            .catch(error => {
                msgException('editProgramacionActividad', error);
            });
    });

    //Tipo Ubigeo
    $("#cboUbigeo").change(function () {
        var tipo = $(this).val();

        if (tipo === "1") { // Nacional
            $("#divNacional").show();
            $("#divExtranjero").hide();
        }
        else if (tipo === "2") { // Extranjero
            $("#divNacional").hide();
            $("#divExtranjero").show();

            var idAnio = parseInt($("#cboAnios").val());
            let request =
            {
                idAnio: idAnio
            }
            
            fillSelectTipoDeCambio("cboMoneda", request, "", "SELECCIONE", (response) => { });
        }
        else {
            $("#divNacional, #divExtranjero").hide();
        }
    });
       
    //Ubigeo Nacional
    var depa = document.getElementById("cboDepartamento");
    depa.addEventListener("change", function () {
        $("#cboDepartamento").prop("disabled", false);

        var departamento = $("#cboDepartamento").val();

        fillSelectUbigeoProvincia("cboProvincia", 0, "TODOS", departamento, function () { });
        
    });

    var prov = document.getElementById("cboProvincia");
    prov.addEventListener("change", function () {
        $("#cboDistrito").prop("disabled", false);

        var departamento = $("#cboDepartamento").val();
        provincia = $("#cboProvincia").val();
        fillSelectUbigeoDistrito("cboDistrito", 0, "TODOS", departamento, provincia, function () { });
        
    });

    //Ubigeo Extranjero
    var regiones = document.getElementById("cboRegion");
    regiones.addEventListener("change", function () {
        $("#cboRegion").prop("disabled", false);

        var region = $("#cboRegion").val();

        fillSelectUbigeoExteriorPais("cboPais", 0, "TODOS", region, function () { });
    });

    var paises = document.getElementById("cboPais");
    paises.addEventListener("change", function () {
        $("#cboCiudad").prop("disabled", false);

        var region = $("#cboRegion").val();
        pais = $("#cboPais").val();
        fillSelectUbigeoExteriorCiudad("cboCiudad", 0, "TODOS", region, pais, function () { });
    });

    $("#chkActividadOperativa").on("change", function () {
        if ($(this).is(":checked")) {
            $("#chkActividadInversion").prop("checked", false);
        }
    });

    $("#chkActividadInversion").on("change", function () {
        if ($(this).is(":checked")) {
            $("#chkActividadOperativa").prop("checked", false);
        }
    });

    inicializarMigracion();
});

function listarProgramacionActividad() {
    getProgramacionActividad(0)
}

function getProgramacionActividad(anio) {

    //let idCentro = $("#txtIdCentroCostosFiltro").val()?.trim();

    let request =
    {
        anio: anio,

        codigoProgramacion: ($("#txtProgramacionFiltro").val() && $("#txtProgramacionFiltro").val().trim() !== "")
            ? $("#txtProgramacionFiltro").val().trim()
            : null,

        //idCentroCostos: idCentro ? parseInt(idCentro) : null,

        idCentroCostos: ($("#txtIdCentroCostosFiltro").val() && $("#txtIdCentroCostosFiltro").val().trim() !== "")
             ? $("#txtIdCentroCostosFiltro").val().trim()
            : null,

        denominacion: ($("#txtDenominacionFiltro").val() && $("#txtDenominacionFiltro").val().trim() !== "")
            ? $("#txtDenominacionFiltro").val().trim()
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

    $("#gridActividades").DataTable().clear();
    $('#gridActividades').DataTable({
        processing: true,
        serverSide: true,        
        ajax: function (d, cb) {
            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceProgramacionActividad.getProgramacionActividadPaginado(request, headersuarm)
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getProgramacionActividad', error));

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
                className: "text-center",
                render: function (data, type, row, meta) {
                    return `<input type="checkbox" class="chkFila" data-id="${row.idProgramacionActividad}" />`;
                }
            },
            {
                data: 'idProgramacionActividad',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'anio' },
            { data: 'codigoProgramacion' },
            { data: 'denominacion' },
            { data: 'unidadMedidaDescripcion' },

            { data: 'metaFisica' },
            { data: 'metaFinanciera' },

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
                data: 'idProgramacionActividad',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-dark" title="Editar"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminar(this)" data-input="' + data + '" class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="bi-trash"></i></button> ';
                    resultado += '<button onclick="descargarReporteActividad(' + data + ')" class="btn btn-sm btn-outline-success" title="Descargar Reporte Excel"><i class="bi bi-file-earmark-excel"></i></button>';
                    return resultado;
                }
            }
        ]
    });
}

function editProgramacionActividad(request) {
    limpiarModal();

    serviceProgramacionActividad.getProgramacionActividadPorId(request, headersuarm)
        .then(response => {
            
            $("#txtAniosActividades").val(response.anio);

            fillSelectUbigeoDepartamento("cboDepartamento", "", "SELECCIONE", (response) => { });

            fillSelectUbigeoExteriorRegion("cboRegion", "", "SELECCIONE", (response) => { });

            $("#hidProgramacionActividad").val(response.idProgramacionActividad);

            $("#txtProgramacion").val(response.codigoProgramacion);
            $("#txtObjetivoPrioritario").val(response.objetivoPrioritario);
            $("#txtDenominacion").val(response.denominacion);
            $("#txtDescripcion").val(response.descripcion);
            $("#txtLineamientos").val(response.lineamiento);

            var idAnio = response.idAnio
            let request =
            {
                idAnio: idAnio
            };

            fillSelectPoliticas("cboServicio", request, response.idPoliticas, "SELECCIONE", (termino) => { });

            fillSelectObjetivosEstrategicos("cboOES", request, response.idObjetivosEstrategicas, "SELECCIONE", (termino) => { });
            fillSelectAccionesEstrategicas("cboAES", request, response.idAccionesEstrategicas, "SELECCIONE", (termino) => { });
            fillSelectObjetivosInstitucioanles("cboOEI", request, response.idObjetivosInstitucionales, "SELECCIONE", (termino) => { });
            fillSelectAccionesInstitucioanles("cboAEI", request, response.idAccionesInstitucionales, "SELECCIONE", (termino) => { });

            fillSelectCategoriaPresupuestal("cboCategoríaPresupuestal", request, response.idCategoriaPresupuestal, "SELECCIONE", (termino) => { });
            fillSelectProductoProyecto("cboProducto", request, response.idProductoProyecto, "SELECCIONE", (termino) => { });
            fillSelectFuncion("cboFuncion", request, response.idFuncion, "SELECCIONE", (termino) => { });
            fillSelectDivisionFuncional("cboDivisiónFuncional", request, response.idDivisionFuncional, "SELECCIONE", (termino) => { });
            fillSelectGrupoFuncional("cboGrupoFuncional", request, response.idGrupoFuncional, "SELECCIONE", (termino) => { });
            fillSelectActividadOperativa("cboActividadPresupuestal", request, response.idActividadPresupuestal, "SELECCIONE", (termino) => { });
            fillSelectFinalidad("cboFinalidad", request, response.idFinalidad, "SELECCIONE", (termino) => { });
            fillSelectUnidadMedida("cboUnidadMedida", request, response.idUnidadMedida, "SELECCIONE", (termino) => { });

            fillSelectCentroCostos("cboCentroCosto", request ,response.idCentroCostos, "SELECCIONE", (termino) => { });
            let Tubigeo = response.tipoUbigeo;
            if (Tubigeo === true) Tubigeo = "1";
            if (Tubigeo === false) Tubigeo = "2";
            $("#cboUbigeo").val(String(Tubigeo));

            var ubigeo = "";
            var region = "";
            var pais = "";
            var ciudad = "";

            if (response.ubigeo == null) {
                response.ubigeo = "150101";  //nacional
            }
            if (response.region == null || response.region == "" ) {
                response.region = "010101"; //extranjero
            }
            if (response.pais == null) {
                response.pais = "";
            }
            if (response.ose == null) {
                response.ose = "";
            }
            
            if (Tubigeo == 1) {

                $("#divNacional").show();
                $("#divExtranjero").hide();
                ubigeo = response.ubigeo;

                var departamento = ubigeo.substring(0, 2);
                var provincia = ubigeo.substring(2, 4);
                var distrito = ubigeo.substring(4, 6);
                
                fillSelectUbigeoDepartamento("cboDepartamento", departamento, "SELECCIONE", function () {
                    fillSelectUbigeoProvincia("cboProvincia", provincia, "TODOS", departamento, function () {
                        fillSelectUbigeoDistrito("cboDistrito", distrito, "TODOS", departamento, provincia, function () {
                          
                        });
                    });
                });
            }
            if (Tubigeo == 2) {

                $("#divNacional").hide();
                $("#divExtranjero").show();

                ubigeo = response.ubigeo;

                var region = ubigeo.substring(0, 2);
                var pais = ubigeo.substring(2, 4);
                var ciudad = ubigeo.substring(4, 6)

                fillSelectUbigeoExteriorRegion("cboRegion", region, "SELECCIONE", function () {
                    fillSelectUbigeoExteriorPais("cboPais", pais, "TODOS", region, function () {
                        fillSelectUbigeoExteriorCiudad("cboCiudad", ciudad, "TODOS", region, pais, function () {

                        });
                    });
                });

                var idAnio = response.idAnio
                let request =
                {
                    idAnio: idAnio
                };
                
                fillSelectTipoDeCambio("cboMoneda", request, response.idMoneda, "SELECCIONE", (termino) => { });
                
            }

            $("#chkActividadOperativa").prop("checked", response.actividadOperativa == true || response.actividadOperativa == 1);
            $("#chkActividadInversion").prop("checked", response.actividadOperativa == true || response.actividadOperativa == 1);

            $("#txtEstado").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "1";
            if (activo === false) activo = "0";

            $("#cboActivo").val(String(activo));
            ESTADO = response.estado;
        })
        .catch(error => {
            msgException('editProgramacionActividad', error);
        });
}

function updProgramacionActividad(datos) {

    serviceProgramacionActividad.updProgramacionActividad(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                var anio = parseInt($("#cboAnios option:selected").text());
                
                getProgramacionActividad(anio);

                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updProgramacionActividad', error);
        });
}

function insProgramacionActividad(datos) {

    serviceProgramacionActividad.insProgramacionActividad(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                var anio = parseInt($("#cboAnios option:selected").text());

                getProgramacionActividad(anio);

                alertify.success(tituloAlert.seguridad, response.message, () => { });
                limpiarModal();
                var idAnio = parseInt($("#cboAnios").val());
                let request = { idAnio: idAnio }

                serviceProgramacionActividad.getProgramacionActividadAniosPorId(request, headersuarm)
                    .then(response => {

                        $("#txtProgramacion").val(response.codigoProgramacion);

                    })
                    .catch(error => {
                        msgException('editProgramacionActividad', error);
                    });                                    
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insProgramacionActividad', error);
        });
}

function delProgramacionActividad(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceProgramacionActividad.delProgramacionActividad(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        var anio = parseInt($("#cboAnios option:selected").text());

                        getProgramacionActividad(anio);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delProgramacionActividad', error);
                });
        }
    });
}

function grabar() {

    var idProgramacionActividad = ($("#hidProgramacionActividad").val() == '' ? 0 : parseInt($("#hidProgramacionActividad").val()));
    var idAnio = parseInt($("#cboAnios").val());
    var anio = parseInt($("#cboAnios option:selected").text());

    var codigoProgramacion = $("#txtProgramacion").val();
    var objetivoPrioritario = $("#txtObjetivoPrioritario").val();
    var denominacion = $("#txtDenominacion").val();
    var descripcion = $("#txtDescripcion").val();
    var lineamiento = $("#txtLineamientos").val();

    var idPoliticas = $("#cboServicio").val();        
    var idObjetivosEstrategicas = $("#cboOES").val();        
    var idAccionesEstrategicas = $("#cboAES").val();        
    var idObjetivosInstitucionales = $("#cboOEI").val();        
    var idAccionesInstitucionalesz = $("#cboAEI").val();        
    var idCategoriaPresupuestal = $("#cboCategoríaPresupuestal").val();        
    var idProductoProyecto = $("#cboProducto").val();        
    var idFuncion = $("#cboFuncion").val();        
    var idDivisionFuncional = $("#cboDivisiónFuncional").val();        
    var idGrupoFuncional = $("#cboGrupoFuncional").val();        
    var idActividadPresupuestal = $("#cboActividadPresupuestal").val();        
    var idFinalidad = $("#cboFinalidad").val();        
    
    var idUnidadMedida = $("#cboFinalidad").val();            
    var actividadOperativa = $("#chkActividadOperativa").prop("checked");
    var actividadInversion = $("#chkActividadInversion").prop("checked");

    var tipoUbigeo = parseInt($("#cboUbigeo").val());
    var ubigeo = "";
    var departamento = "";
    var provincia = "";
    var distrito = "";
    var region = "";
    var pais = "";
    var ciudad = "";

    if (tipoUbigeo == 1) {
        departamento = $("#cboDepartamento").val();
        provincia = $("#cboProvincia").val();
        distrito = $("#cboDistrito").val();
        ubigeo = departamento + provincia + distrito;

    } else if (tipoUbigeo == 2) {
        region = $("#cboRegion").val();
        pais = $("#cboPais").val();
        ciudad = $("#cboCiudad").val();
        ubigeo = region + pais + ciudad;
    } 

    var idMoneda = $("#cboMoneda").val();  

    var idCentroCostos = $("#cboCentroCosto").val();        

    var activo = parseInt($("#cboActivo").val());
    var flag = $("#flagEdit").val();
    var idEstado = ESTADO;

    if (flag == 1) {
        let datos = {
            idProgramacionActividad: idProgramacionActividad,
            idAnio: idAnio,
            anio: anio,
            codigoProgramacion: codigoProgramacion,
            objetivoPrioritario: objetivoPrioritario,
            denominacion: denominacion,
            descripcion: descripcion,
            lineamiento: lineamiento,
            idPoliticas: idPoliticas,
            idObjetivosEstrategicas: idObjetivosEstrategicas,
            idAccionesEstrategicas: idAccionesEstrategicas,
            idObjetivosInstitucionales: idObjetivosInstitucionales,
            idAccionesInstitucionalesz: idAccionesInstitucionalesz,
            idCategoriaPresupuestal: idCategoriaPresupuestal,
            idProductoProyecto: idProductoProyecto,
            idFuncion: idFuncion,
            idDivisionFuncional: idDivisionFuncional,
            idGrupoFuncional: idGrupoFuncional,
            idActividadPresupuestal: idActividadPresupuestal,
            idFinalidad: idFinalidad,
            idUnidadMedida: idUnidadMedida,
            tipoUbigeo: tipoUbigeo,
            ubigeo: ubigeo,
            region: region,
            pais: pais,
            ose: ciudad,
            actividadOperativa: actividadOperativa,
            actividadInversion: actividadInversion,
            idCentroCostos: idCentroCostos,            
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };        
        updProgramacionActividad(datos);

    } else {
        let datos = {
            
            idAnio: idAnio,
            anio: anio,
            codigoProgramacion: codigoProgramacion,
            objetivoPrioritario: objetivoPrioritario,
            denominacion: denominacion,
            descripcion: descripcion,
            lineamiento: lineamiento,
            idPoliticas: idPoliticas,
            idObjetivosEstrategicas: idObjetivosEstrategicas,
            idAccionesEstrategicas: idAccionesEstrategicas,
            idObjetivosInstitucionales: idObjetivosInstitucionales,
            idAccionesInstitucionalesz: idAccionesInstitucionalesz,
            idCategoriaPresupuestal: idCategoriaPresupuestal,
            idProductoProyecto: idProductoProyecto,
            idFuncion: idFuncion,
            idDivisionFuncional: idDivisionFuncional,
            idGrupoFuncional: idGrupoFuncional,
            idActividadPresupuestal: idActividadPresupuestal,
            idFinalidad: idFinalidad,
            idUnidadMedida: idUnidadMedida,
            tipoUbigeo: tipoUbigeo,
            ubigeo: ubigeo,
            region: region,
            pais: pais,
            ose: ciudad,
            actividadOperativa: actividadOperativa,
            actividadInversion: actividadInversion,
            idCentroCostos: idCentroCostos,            
            idEstado: idEstado
        };
        insProgramacionActividad(datos);
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idProgramacionActividad: codigo
    };
    delProgramacionActividad(datos);
}

function editar(control) {
    $("#modalRegistro").modal("show");
    $("#mdlTitle").text("Editar Ficha de Datos");
    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    var idProgramacionActividad = $(control).data('input');

    let request =
    {
        idProgramacionActividad: idProgramacionActividad
    }

    editProgramacionActividad(request);
}

function nuevo() {
    limpiarModal();
    llenaCommbos(0);
        
    $("#cboActivo").prop("disabled", true);
    $("#modalRegistro").modal("show");
    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar Ficha de Datos");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    var idAnio = parseInt($("#cboAnios").val());
    var anio = parseInt($("#cboAnios option:selected").text());
    let request = { idAnio: idAnio }

    $("#txtAniosActividades").val(anio);

    fillSelectPoliticas("cboServicio", request, 0, "SELECCIONE", (response) => { });

    $("#chkActividadOperativa").prop("checked", false);
    $("#chkActividadInversion").prop("checked", false);
        
}

function limpiarModal() {
    $("#hidProgramacionActividad").val("");

    $("#txtProgramacion").val("");
    $("#txtObjetivoPrioritario").val("");
    $("#txtDenominacion").val("");
    $("#txtDescripcion").val("");
    $("#txtLineamientos").val("");
    $("#txtEstado").val("");

    $("#cboUbigeo").val(0);
    $("#cboActivo").val(1);
}

function limpiarFiltros() {
    $("#txtFuncionFiltro").val('');
    $("#txtDescripcionFiltro").val('');
    $("#txtEstadoFiltro").val('');
    $("#cboSituacionFiltro").val(1);
    fillSelectAnioPresupuesto("cboAnioFiltro", 0, "SELECCIONE", (response) => { });
}

function llenaCommbos(request) {

    fillSelectObjetivosEstrategicos("cboOES", request, 0, "SELECCIONE", (response) => { });
    fillSelectAccionesEstrategicas("cboAES", request, 0, "SELECCIONE", (response) => { });
    fillSelectObjetivosInstitucioanles("cboOEI", request, 0, "SELECCIONE", (response) => { });
    fillSelectAccionesInstitucioanles("cboAEI", request, 0, "SELECCIONE", (response) => { });
    fillSelectCategoriaPresupuestal("cboCategoríaPresupuestal", request, 0, "SELECCIONE", (response) => { });
    fillSelectProductoProyecto("cboProducto", request, 0, "SELECCIONE", (response) => { });
    fillSelectFuncion("cboFuncion", request, 0, "SELECCIONE", (response) => { });
    fillSelectDivisionFuncional("cboDivisiónFuncional", request, 0, "SELECCIONE", (response) => { });
    fillSelectGrupoFuncional("cboGrupoFuncional", request, 0, "SELECCIONE", (response) => { });
    fillSelectActividadOperativa("cboActividadPresupuestal", request, 0, "SELECCIONE", (response) => { });
    fillSelectFinalidad("cboFinalidad", request, 0, "SELECCIONE", (response) => { });
    fillSelectUnidadMedida("cboUnidadMedida", request, 0, "SELECCIONE", (response) => { });
    fillSelectCentroCostos("cboCentroCosto", request, 0, "SELECCIONE", (response) => { });

    fillSelectUbigeoDepartamento("cboDepartamento", "", "SELECCIONE", (response) => { });
    fillSelectUbigeoExteriorRegion("cboRegion", "", "SELECCIONE", (response) => { });
}

// === GRIDS ===
function cargarGridActividades() {
    getProgramacionActividad(0)    
}

function cargarGridClasificador() {
    getCargarGridClasificador(0, 0);
}

function cargarGridTareas() {
    getCargarGridTareas(0, 0);
}

function cargarGridRecursos() {
    $('#gridRecursos').DataTable({
        destroy: true,
        responsive: true,
        searching: false,
        paging: true,
        info: false,
        data: [
            { nro: 1, ff: '00', clasificador: '2. 1. 1. 4. 1', denominacion: 'Denominación', tipogasto: 'Tipo gasto', tipoitem: 'Tipoitem', metafinanciera: '215.45', estado: 'Activo' },
            { nro: 2, ff: '00', clasificador: '2. 1. 1. 3. 1', denominacion: 'Denominación', tipogasto: 'Tipo gasto', tipoitem: 'Tipoitem', metafinanciera: '632.15', estado: 'Activo' },
        ],
        columns: [
            { data: 'nro' },
            { data: 'ff' },
            { data: 'clasificador' },
            { data: 'denominacion' },
            { data: 'tipogasto' },
            { data: 'tipoitem' },
            { data: 'metafinanciera' },            
            { data: 'estado' }
        ]
    });
}

function cargarGridAcciones() {
    getCargarGridAcciones(0, 0, 0);
}

// ===== MIGRACIÓN DE ACTIVIDADES =====

function inicializarMigracion() {
    $('#btnMigrarActividades').on('click', function () {
        abrirModalSeleccionActividades();
    });

    $(document).on('change', '#chkTodosMigracion', function () {
        const isChecked = $(this).prop('checked');
        $('#tbodyListaActividadesMigracion input[type="checkbox"]').prop('checked', isChecked);
    });

    $('#btnContinuarMigracion').on('click', function () {
        continuarConMigracion();
    });

    $('#btnEjecutarMigracionModal').on('click', function () {
        mostrarConfirmacionFinal();
    });

    $('#btnConfirmarMigracionFinal').on('click', function () {
        ejecutarMigracionFinal();
    });
}

function abrirModalSeleccionActividades() {
    var anioSeleccionado = parseInt($("#cboAnios option:selected").text());
    var idAnio = parseInt($("#cboAnios").val());

    if (!anioSeleccionado || anioSeleccionado === 0 || isNaN(anioSeleccionado)) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe seleccionar un año presupuestal antes de migrar actividades'
        });
        return;
    }

    $('#modalSeleccionActividades').modal('show');
    cargarActividadesYFasesPOI(anioSeleccionado, idAnio);
}

function cargarActividadesYFasesPOI(anio, idAnio) {
    const tbody = $('#tbodyListaActividadesMigracion');
    tbody.html('<tr><td colspan="6" class="text-center"><i class="spinner-border spinner-border-sm me-2"></i>Cargando actividades del año ' + anio + '...</td></tr>');

    let request = {
        anio: anio,
        codigoProgramacion: null,
        denominacion: null,
        descripcion: null,
        estadoDescripcion: null,
        activo: true,
        paginaActual: 1,
        tamanioPagina: 1000
    };

    serviceProgramacionActividad.getProgramacionActividadPaginado(request, headersuarm)
        .then(response => {

            if (!response.data || response.data.length === 0) {
                tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay actividades disponibles para el año ' + anio + '</td></tr>');
                todasLasActividadesMigracion = [];
                return;
            }

            // Filtrar solo las actividades operativas (actividadOperativa = true)
            const actividadesOperativas = response.data.filter(actividad => actividad.actividadOperativa === true);

            if (actividadesOperativas.length === 0) {
                tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay actividades operativas disponibles para el año ' + anio + '</td></tr>');
                todasLasActividadesMigracion = [];
                return;
            }

            todasLasActividadesMigracion = actividadesOperativas.map(actividad => ({
                idProgramacionActividad: actividad.idProgramacionActividad,
                anio: actividad.anio,
                codigoProgramacion: actividad.codigoProgramacion,
                denominacion: actividad.denominacion,
                unidadMedidaDescripcion: actividad.unidadMedidaDescripcion || 'Sin U.M.',
                estadoDescripcion: actividad.estadoDescripcion || 'Sin estado',
                activo: actividad.activo
            }));


            // ✅ PRIMERO: Mostrar actividades en el modal
            mostrarActividadesEnModal();

            // ✅ NO cargar fases POI aquí, solo cuando pase al siguiente modal
        })
        .catch(error => {
            console.error('❌ Error al cargar actividades:', error);
            tbody.html('<tr><td colspan="6" class="text-center text-danger">Error al cargar actividades. Por favor, intente nuevamente.</td></tr>');
            todasLasActividadesMigracion = [];
        });
}

function mostrarActividadesEnModal() {
    const tbody = $('#tbodyListaActividadesMigracion');
    tbody.empty();

    if (todasLasActividadesMigracion.length === 0) {
        tbody.html('<tr><td colspan="6" class="text-center text-muted">No hay actividades disponibles</td></tr>');
        return;
    }

    todasLasActividadesMigracion.forEach((actividad) => {
        const estado = actividad.activo
            ? '<span class="badge bg-success">Activo</span>'
            : '<span class="badge bg-secondary">Inactivo</span>';

        tbody.append(`
            <tr data-id="${actividad.idProgramacionActividad}">
                <td>
                    <input type="checkbox" class="check-actividad-migrar" 
                           data-id="${actividad.idProgramacionActividad}"
                           data-anio="${actividad.anio}"
                           data-codigo="${actividad.codigoProgramacion}"
                           data-denominacion="${actividad.denominacion}"
                           style="cursor: pointer;">
                </td>
                <td>${actividad.anio}</td>
                <td>${actividad.codigoProgramacion}</td>
                <td>${actividad.denominacion}</td>
                <td>${actividad.unidadMedidaDescripcion}</td>
                <td>${estado}</td>
            </tr>
        `);
    });
}

function cargarFasesPOI(idAnio) {
    let request = {
        usuarioConsulta: 'admin', // TODO: Cambiar por usuario actual del sistema
        idAnio: idAnio
    };

    servicePresupuesto.getFasesPOIListado(request, headersuarm)
        .then(response => {

            if (!response || response.length === 0) {
                console.warn('⚠️ No se encontraron fases POI para el año');
                // Generar años por defecto si no hay fases POI
                generarAniosDesdeRango(2025, 2030);
                return;
            }

            // Tomar la primera fase POI
            const primeraFase = response[0];
            obtenerDetalleFasePOI(primeraFase.idFasesPoi);
        })
        .catch(error => {
            console.error('❌ Error al cargar fases POI:', error);
            // Generar años por defecto en caso de error
            console.warn('⚠️ Usando años por defecto debido a error en Fases POI');
            generarAniosDesdeRango(2025, 2030);
        });
}

function obtenerDetalleFasePOI(idFasesPoi) {

    let requestDetalle = {
        usuarioConsulta: obtenerUsuarioConsulta(),
        idFasesPoi: idFasesPoi
    };


    // ✅ CAMBIO: Usar serviceFasesPoi (NO servicePresupuesto)
    serviceFasesPoi.getFasesPoiPorId(requestDetalle, headersuarm)
        .then(response => {

            fasePOIActual = response;

            const anioInicial = response.anioInicial;
            const anioFinal = response.anioFinal;

            generarAniosDesdeRango(anioInicial + 1, anioFinal);
            mostrarModalSeleccionAnios();
        })
        .catch(error => {
            console.error('❌ Error al obtener detalle fase POI:', error);
            console.warn('⚠️ Usando años por defecto debido a error en detalle Fases POI');
            generarAniosDesdeRango(2025, 2030);
            mostrarModalSeleccionAnios();
        });
}
function generarAniosDesdeRango(anioInicial, anioFinal) {
    aniosDisponiblesParaMigrar = [];

    for (let anio = anioInicial; anio <= anioFinal; anio++) {
        aniosDisponiblesParaMigrar.push({
            codigoanio: anio.toString(),
            nombre: anio.toString()
        });
    }

}
function continuarConMigracion() {
    actividadesSeleccionadasParaMigrar = [];

    $('#tbodyListaActividadesMigracion input[type="checkbox"]:checked').each(function () {
        const checkbox = $(this);
        actividadesSeleccionadasParaMigrar.push({
            id: checkbox.data('id'),
            anio: checkbox.data('anio'),
            codigo: checkbox.data('codigo'),
            denominacion: checkbox.data('denominacion')
        });
    });

    if (actividadesSeleccionadasParaMigrar.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe seleccionar al menos una actividad para migrar'
        });
        return;
    }

    // ✅ Cerrar modal de actividades
    $('#modalSeleccionActividades').modal('hide');

    // ✅ AHORA SÍ: Cargar fases POI cuando se pasa al siguiente modal
    setTimeout(() => {
        var idAnio = parseInt($("#cboAnios").val());
        cargarFasesPOIYMostrarAnios(idAnio);
    }, 300);
}

function cargarFasesPOIYMostrarAnios(idAnio) {

    $('#divAniosDestinoMigracion').html(`
        <div class="col-12 text-center p-4">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted">Cargando años disponibles desde Fases POI...</p>
        </div>
    `);

    let requestListado = {
        usuarioConsulta: obtenerUsuarioConsulta(),
        idAnio: idAnio
    };


    // ✅ CAMBIO: Usar serviceFasesPoi (NO servicePresupuesto)
    serviceFasesPoi.getFasesPoiListado(requestListado, headersuarm)
        .then(response => {

            if (!response || response.length === 0) {
                console.warn('⚠️ No se encontraron fases POI para el año');
                generarAniosDesdeRango(2025, 2030);
                mostrarModalSeleccionAnios();
                return;
            }

            const primeraFase = response[0];

            const idFasesPoi = primeraFase.idFasesPoi;

            obtenerDetalleFasePOI(idFasesPoi);
        })
        .catch(error => {
            console.error('❌ Error al cargar fases POI:', error);
            console.warn('⚠️ Usando años por defecto debido a error en Fases POI');
            generarAniosDesdeRango(2025, 2030);
            mostrarModalSeleccionAnios();
        });
}
function obtenerUsuarioConsulta() {
    var usuarioConsulta = 'admin';
    try {
        var userData = localStorage.getItem('dd1483a079919b267cec7834478fe10f');
        if (userData) {
            var userObj = JSON.parse(userData);
            usuarioConsulta = userObj.usuario || 'admin';
        }
    } catch (e) {
        console.error('Error al obtener usuario:', e);
    }
    return usuarioConsulta;
}

function mostrarModalSeleccionAnios() {

    $('#spanCantidadActividades').text(actividadesSeleccionadasParaMigrar.length);
    mostrarActividadesSeleccionadas();
    mostrarAniosDisponibles();
    $('#modalSeleccionAnios').modal('show');
}

function mostrarActividadesSeleccionadas() {
    const tbody = $('#tbodyActividadesSeleccionadas');
    tbody.empty();

    actividadesSeleccionadasParaMigrar.forEach(actividad => {
        tbody.append(`
            <tr>
                <td>${actividad.anio}</td>
                <td>${actividad.codigo}</td>
                <td>${actividad.denominacion}</td>
            </tr>
        `);
    });
}

function mostrarAniosDisponibles() {
    const divAnios = $('#divAniosDestinoMigracion');
    divAnios.empty();

    const aniosOrigen = [...new Set(actividadesSeleccionadasParaMigrar.map(a => a.anio.toString()))];
    const aniosFiltrados = aniosDisponiblesParaMigrar.filter(anio => !aniosOrigen.includes(anio.codigoanio));

    if (aniosFiltrados.length === 0) {
        divAnios.html('<div class="col-12 text-center p-3 text-muted">No hay años disponibles para migración</div>');
        return;
    }

    aniosFiltrados.forEach(anio => {
        divAnios.append(`
            <div class="col-md-4 col-sm-6 mb-2">
                <div class="form-check">
                    <input class="form-check-input check-anio-destino" type="checkbox" 
                           value="${anio.codigoanio}" id="anioDestino${anio.codigoanio}" 
                           style="cursor: pointer;">
                    <label class="form-check-label" for="anioDestino${anio.codigoanio}" 
                           style="cursor: pointer;">
                        ${anio.nombre}
                    </label>
                </div>
            </div>
        `);
    });
}

function mostrarConfirmacionFinal() {
    aniosSeleccionadosParaMigrar = [];

    $('.check-anio-destino:checked').each(function () {
        aniosSeleccionadosParaMigrar.push(parseInt($(this).val()));
    });

    if (aniosSeleccionadosParaMigrar.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: 'Debe seleccionar al menos un año destino'
        });
        return;
    }

    const totalActividades = actividadesSeleccionadasParaMigrar.length;
    const totalAnios = aniosSeleccionadosParaMigrar.length;
    const totalCopias = totalActividades * totalAnios;
    const anioOrigen = actividadesSeleccionadasParaMigrar[0].anio;

    const resumen = `
        <div class="text-start">
            <p class="mb-2"><strong>Resumen de la migración:</strong></p>
            <ul class="mb-2">
                <li>Año origen: <strong>${anioOrigen}</strong></li>
                <li><strong>${totalActividades}</strong> actividad(es) operativa(s)</li>
                <li>Hacia <strong>${totalAnios}</strong> año(s): <strong>${aniosSeleccionadosParaMigrar.join(', ')}</strong></li>
                <li>Total de actividades a crear: <strong>${totalCopias}</strong></li>
            </ul>
            <p class="text-muted mt-3">
                <small>
                    <i class="bi bi-info-circle"></i> 
                    Se copiarán todas las tareas, clasificadores, acciones y recursos asociados.
                </small>
            </p>
        </div>
    `;

    $('#resumenFinalMigracion').html(resumen);
    $('#modalSeleccionAnios').modal('hide');

    setTimeout(() => {
        $('#modalConfirmacionFinal').modal('show');
    }, 300);
}

async function ejecutarMigracionFinal() {
    const btnConfirmar = $('#btnConfirmarMigracionFinal');
    const textoOriginal = btnConfirmar.html();

    try {
        btnConfirmar.prop('disabled', true)
            .html('<i class="spinner-border spinner-border-sm me-2"></i>Migrando...');

        const anioOrigen = actividadesSeleccionadasParaMigrar[0].anio;

        const request = {
            anioOrigen: anioOrigen,
            aniosDestino: aniosSeleccionadosParaMigrar,
            actividades: actividadesSeleccionadasParaMigrar.map(a => a.id),
            ipCreacion: "127.0.0.1",
            usuarioCreacion: obtenerUsuarioConsulta()
        };


        // ✅ CAMBIO: Usar servicePresupuesto para copiar (este SÍ es correcto)
        const resultado = await servicePresupuesto.copiarProgramacionAnios(request, headersuarm);


        $('#modalConfirmacionFinal').modal('hide');

        const totalCopias = actividadesSeleccionadasParaMigrar.length * aniosSeleccionadosParaMigrar.length;

        Swal.fire({
            icon: 'success',
            title: '¡Migración Exitosa!',
            html: `
                <div class="text-start">
                    <p class="mb-3">Se han migrado correctamente:</p>
                    <ul class="mb-3">
                        <li><strong>${actividadesSeleccionadasParaMigrar.length}</strong> actividades operativas</li>
                        <li>Desde el año: <strong>${anioOrigen}</strong></li>
                        <li>A los años: <strong>${aniosSeleccionadosParaMigrar.join(', ')}</strong></li>
                        <li>Total de nuevas actividades: <strong>${totalCopias}</strong></li>
                    </ul>
                    <div class="alert alert-success mb-0">
                        <small>
                            <i class="bi bi-check-circle"></i> 
                            ${resultado.message || 'Se han copiado todas las tareas, clasificadores, acciones y recursos asociados.'}
                        </small>
                    </div>
                </div>
            `,
            confirmButtonText: 'Aceptar',
            width: 600,
            confirmButtonColor: '#0d6efd'
        }).then(() => {
            limpiarVariablesMigracion();

            var anioActual = parseInt($("#cboAnios option:selected").text());
            if (anioActual) {
                getProgramacionActividad(anioActual);
            }
        });

    } catch (error) {
        console.error('❌ Error en migración:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error en Migración',
            text: error.message || 'Ocurrió un error durante la migración. Por favor, intente nuevamente.',
            confirmButtonColor: '#dc3545'
        });
    } finally {
        btnConfirmar.prop('disabled', false).html(textoOriginal);
    }
}
function limpiarVariablesMigracion() {
    todasLasActividadesMigracion = [];
    actividadesSeleccionadasParaMigrar = [];
    aniosSeleccionadosParaMigrar = [];
    aniosDisponiblesParaMigrar = [];
    fasePOIActual = null;
}

async function descargarReporteActividad(idProgramacionActividad) {
    try {
        Swal.fire({
            title: 'Generando reporte completo...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // Llamar a AMBOS servicios en paralelo
        const [reporteActividad, reporteFinanciero] = await Promise.all([
            serviceReporte.getReporteActividad({ idProgramacionActividad }, headersuarm),
            serviceReporteFinanciero.getReporteFinanciero({ idProgramacionActividad }, headersuarm)
        ]);

        Swal.close();

        // Validar reporte de actividad
        const actividad = reporteActividad.actividad;
        const tareas = reporteActividad.tareas || [];
        const acciones = reporteActividad.acciones || [];

        if (!actividad) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin datos',
                text: 'No se encontró información para esta actividad.'
            });
            return;
        }

        // Validar reporte financiero
        const headerFinanciero = reporteFinanciero.header;
        const jerarquia = reporteFinanciero.jerarquia || [];
        const totalGeneral = reporteFinanciero.totalGeneral;

        // Crear workbook con AMBAS hojas
        const wb = XLSX.utils.book_new();

        // HOJA 1: Metas Físicas
        const hoja1 = generarHojaMetasFisicas(actividad, tareas, acciones);
        XLSX.utils.book_append_sheet(wb, hoja1, 'Metas Físicas');

        // HOJA 2: Programación Financiera (si hay datos)
        if (headerFinanciero) {
            const hoja2 = generarHojaReporteFinanciero(headerFinanciero, jerarquia, totalGeneral);
            XLSX.utils.book_append_sheet(wb, hoja2, 'Programación Financiera');
        }

        // Descargar archivo con ambas hojas
        const nombreArchivo = `POI_${actividad.codigoProgramacionActividad}_${actividad.anio}.xlsx`;
        XLSX.writeFile(wb, nombreArchivo);

    } catch (error) {
        console.error('Error generando reporte:', error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo generar el reporte.'
        });
    }
}

// ===== HELPER: AGRUPAR JERARQUÍA POR TAREA =====
function agruparPorTarea(jerarquia) {
    const tareaMap = new Map();

    for (const item of jerarquia) {
        const idTarea = item.idTarea;

        if (!tareaMap.has(idTarea)) {
            tareaMap.set(idTarea, {
                idTarea: idTarea,
                codigoTarea: item.codigoTarea,
                descripcionTarea: item.descripcionTarea,
                fuente: null,
                clasificador: null,
                detalles: []
            });
        }

        const tarea = tareaMap.get(idTarea);

        if (item.ordenNivel === 1) {
            // FUENTE
            tarea.fuente = item;
        } else if (item.ordenNivel === 2) {
            // CLASIFICADOR
            tarea.clasificador = item;
        } else if (item.ordenNivel === 3) {
            // DETALLE
            tarea.detalles.push(item);
        }
    }

    return Array.from(tareaMap.values());
}

// ===== HELPER: OBTENER PROPIEDAD DE MES (montO_ENERO con O mayúscula) =====
function obtenerPropiedadMes(indice) {
    const meses = [
        'montO_ENERO', 'montO_FEBRERO', 'montO_MARZO', 'montO_ABRIL',
        'montO_MAYO', 'montO_JUNIO', 'montO_JULIO', 'montO_AGOSTO',
        'montO_SETIEMBRE', 'montO_OCTUBRE', 'montO_NOVIEMBRE', 'montO_DICIEMBRE'
    ];
    return meses[indice];
}

// ===== HELPER: OBTENER PROPIEDAD DE MES PARA TOTAL GENERAL (camelCase) =====
function obtenerPropiedadMesTotalGeneral(indice) {
    const meses = [
        'montoEnero', 'montoFebrero', 'montoMarzo', 'montoAbril',
        'montoMayo', 'montoJunio', 'montoJulio', 'montoAgosto',
        'montoSetiembre', 'montoOctubre', 'montoNoviembre', 'montoDiciembre'
    ];
    return meses[indice];
}

// ===== ESTILOS PARA REPORTE FINANCIERO =====
const SFinanciero = {
    // Fila FUENTE: Celeste con texto negro
    fuente: {
        fill: { fgColor: { rgb: 'BDD7EE' } }, // Celeste claro
        font: { bold: true, color: { rgb: '000000' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    fuenteNum: {
        fill: { fgColor: { rgb: 'BDD7EE' } },
        font: { bold: true, color: { rgb: '000000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    fuenteTotal: {
        fill: { fgColor: { rgb: '9BC2E6' } }, // Celeste más oscuro para total
        font: { bold: true, color: { rgb: '000000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },

    // Fila CLASIFICADOR: Amarillo con texto negro
    clasificador: {
        fill: { fgColor: { rgb: 'FFE699' } }, // Amarillo claro
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    clasificadorNum: {
        fill: { fgColor: { rgb: 'FFE699' } },
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    clasificadorTotal: {
        fill: { fgColor: { rgb: 'FFD966' } }, // Amarillo más oscuro para total
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    }
};

// ===== GENERAR HOJA REPORTE FINANCIERO =====
function generarHojaReporteFinanciero(header, jerarquia, totalGeneral) {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const ws = {};
    const merges = [];
    let fila = 1;

    function setCell(col, row, cellObj) {
        ws[XLSX.utils.encode_cell({ c: col, r: row - 1 })] = cellObj;
    }

    // Total columnas: FUENTE/GENÉRICA/ESPECÍFICA(1) + 12 meses + TOTAL = 14 columnas (0-13)
    const LAST_COL = 13;

    // === CENTRO DE COSTOS ===
    setCell(0, fila, celda('Centro de costo:', S.cabeceraOscura));
    setCell(1, fila, celda(header.centroCostosPadreDescripcion || '', S.cabeceraOscuraValor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Centro de costo:', S.cabeceraOscura));
    setCell(1, fila, celda(header.centroCostosDescripcion || '', S.cabeceraOscuraValor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;
    fila++; // fila vacía

    // === PLAN ESTRATÉGICO INSTITUCIONAL ===
    setCell(0, fila, celda('Plan Estratégico Institucional', S.cabeceraOscura));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Objetivo Estratégico Institucional:', S.etiqueta));
    setCell(1, fila, celda(header.objetivosInstitucionalesDescripcion || '', S.valor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Acción Estratégica Institucional:', S.etiqueta));
    setCell(1, fila, celda(header.accionesInstitucionalesDescripcion || '', S.valor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;
    fila++; // fila vacía

    // === ESTRUCTURA FUNCIONAL PROGRAMÁTICA ===
    setCell(0, fila, celda('Estructura Funcional Programática', S.cabeceraOscura));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    const estructuraItems = [
        ['Programa:', header.categoriaPresupuestalDescripcion || ''],
        ['Producto:', header.productoProyectoDescripcion || ''],
        ['Actividad:', header.actividadPresupuestalDescripcion || ''],
        ['Función:', header.funcionDescripcion || ''],
        ['División funcional:', header.divisionFuncionalDescripcion || ''],
        ['Grupo funcional:', header.grupoFuncionalDescripcion || '']
    ];

    for (const [etq, val] of estructuraItems) {
        setCell(0, fila, celda(etq, S.etiqueta));
        setCell(1, fila, celda(val, S.valor));
        merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
        fila++;
    }
    fila++; // fila vacía

    // === ENCABEZADO TABLA FINANCIERA ===
    setCell(0, fila, celda('FUENTE /GENÉRICA / ESPECÍFICA', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila, c: 0 } });

    setCell(1, fila, celda('PROGRAMACIÓN FINANCIERA', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: 12 } });

    setCell(13, fila, celda('TOTAL ANUAL', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 13 }, e: { r: fila, c: 13 } });
    fila++;

    // Meses
    for (let i = 0; i < 12; i++) {
        setCell(1 + i, fila, celda(meses[i], S.encabezadoTabla));
    }
    fila++;

    // === FILA ACTIVIDAD (UNA SOLA VEZ CON TOTAL GENERAL) ===
    setCell(0, fila, celda(header.actividadPresupuestalDescripcion || '', S.actividad));

    // Usar totalGeneral para los montos de la actividad
    for (let i = 0; i < 12; i++) {
        const mesProp = obtenerPropiedadMesTotalGeneral(i);
        setCell(1 + i, fila, celda(totalGeneral[mesProp] || 0, S.actividadNum));
    }
    setCell(13, fila, celda(totalGeneral.montoTotal || 0, S.actividadTotal));
    fila++;

    // === DATOS JERÁRQUICOS POR TAREA ===
    const tareas = agruparPorTarea(jerarquia);

    for (const tarea of tareas) {
        const fuenteData = tarea.fuente;

        // FILA FUENTE (CELESTE)
        setCell(0, fila, celda(fuenteData.fuenteFinanciamiento || '', SFinanciero.fuente));
        for (let i = 0; i < 12; i++) {
            const mesProp = obtenerPropiedadMes(i);
            setCell(1 + i, fila, celda(fuenteData[mesProp] || 0, SFinanciero.fuenteNum));
        }
        setCell(13, fila, celda(fuenteData.montO_TOTAL || 0, SFinanciero.fuenteTotal));
        fila++;

        // FILA CLASIFICADOR (AMARILLO)
        const clasificadorData = tarea.clasificador;
        setCell(0, fila, celda(clasificadorData.clasificadorTareaDescripcion || '', SFinanciero.clasificador));
        for (let i = 0; i < 12; i++) {
            const mesProp = obtenerPropiedadMes(i);
            setCell(1 + i, fila, celda(clasificadorData[mesProp] || 0, SFinanciero.clasificadorNum));
        }
        setCell(13, fila, celda(clasificadorData.montO_TOTAL || 0, SFinanciero.clasificadorTotal));
        fila++;

        // FILAS DETALLES (SALMÓN - mantener estilos originales)
        for (const detalle of tarea.detalles) {
            setCell(0, fila, celda(detalle.clasificadorDetalleDescripcion || '', S.accion));
            for (let i = 0; i < 12; i++) {
                const mesProp = obtenerPropiedadMes(i);
                setCell(1 + i, fila, celda(detalle[mesProp] || 0, S.accionNum));
            }
            setCell(13, fila, celda(detalle.montO_TOTAL || 0, S.accionTotal));
            fila++;
        }
    }

    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    ws['!merges'] = merges;
    ws['!cols'] = [
        { wch: 50 },  // FUENTE/GENÉRICA/ESPECÍFICA
        ...Array(12).fill({ wch: 7 }),  // Meses
        { wch: 12 }   // Total Anual
    ];
    ws['!rows'] = Array(fila).fill({ hpt: 25 });

    return ws;
}
// ===== HELPERS DE ESTILO =====
function celda(v, estilos) {
    return { v: v, t: typeof v === 'number' ? 'n' : 's', s: estilos };
}

function celdaFormula(f, estilos) {
    return { f: f, t: 'n', s: estilos };
}

const S = {
    cabeceraOscura: {
        fill: { fgColor: { rgb: '1F4E79' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { vertical: 'center' }
    },
    cabeceraOscuraValor: {
        fill: { fgColor: { rgb: '1F4E79' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
        alignment: { vertical: 'center', wrapText: true }
    },
    encabezadoTabla: {
        fill: { fgColor: { rgb: '2E75B6' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    actividad: {
        fill: { fgColor: { rgb: '1F4E79' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    actividadNum: {
        fill: { fgColor: { rgb: '1F4E79' } },
        font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    actividadTotal: {
        fill: { fgColor: { rgb: 'BDD7EE' } },
        font: { bold: true, color: { rgb: '1F4E79' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    tarea: {
        fill: { fgColor: { rgb: 'FFFFFF' } },
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    tareaNum: {
        fill: { fgColor: { rgb: 'FFFFFF' } },
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    tareaTotal: {
        fill: { fgColor: { rgb: 'BDD7EE' } },
        font: { bold: false, color: { rgb: '1F4E79' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    accion: {
        fill: { fgColor: { rgb: 'FCE4D6' } },
        font: { bold: false, color: { rgb: 'C00000' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    accionNum: {
        fill: { fgColor: { rgb: 'FCE4D6' } },
        font: { bold: false, color: { rgb: 'C00000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    accionTotal: {
        fill: { fgColor: { rgb: 'BDD7EE' } },
        font: { bold: false, color: { rgb: 'C00000' }, sz: 10 },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    etiqueta: {
        fill: { fgColor: { rgb: 'F2F2F2' } },
        font: { bold: true, color: { rgb: '000000' }, sz: 10 },
        alignment: { vertical: 'center' },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    },
    valor: {
        fill: { fgColor: { rgb: 'FFFFFF' } },
        font: { bold: false, color: { rgb: '000000' }, sz: 10 },
        alignment: { vertical: 'center', wrapText: true },
        border: { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
    }
};

function generarHojaMetasFisicas(actividad, tareas, acciones) {
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const ws = {};
    const merges = [];
    let fila = 1;

    function setCell(col, row, cellObj) {
        ws[XLSX.utils.encode_cell({ c: col, r: row - 1 })] = cellObj;
    }

    const LAST_COL = 15;

    setCell(0, fila, celda('Centro de costos', S.cabeceraOscura));
    setCell(1, fila, celda(actividad.centroCostosPadreDescripcion || '', S.cabeceraOscuraValor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Centro de costos', S.cabeceraOscura));
    setCell(1, fila, celda(actividad.centroCostosDescripcion || '', S.cabeceraOscuraValor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;
    fila++;

    setCell(0, fila, celda('Plan Estratégico Institucional', S.cabeceraOscura));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Objetivo Estratégico Institucional:', S.etiqueta));
    setCell(1, fila, celda(actividad.objetivosInstitucionalesDescripcion || '', S.valor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    setCell(0, fila, celda('Acción Estratégica Institucional:', S.etiqueta));
    setCell(1, fila, celda(actividad.accionesInstitucionalesDescripcion || '', S.valor));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;
    fila++;

    setCell(0, fila, celda('Estructura Funcional Programática', S.cabeceraOscura));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    fila++;

    const estructuraItems = [
        ['Programa:', '-'],
        ['Producto:', actividad.productoProyectoDescripcion || ''],
        ['Actividad:', actividad.actividadPresupuestalDescripcion || ''],
        ['Función:', actividad.funcionDescripcion || ''],
        ['División funcional:', actividad.divisionFuncionalDescripcion || ''],
        ['Grupo funcional:', actividad.grupoFuncionalDescripcion || ''],
        ['Meta:', '-']
    ];
    for (const [etq, val] of estructuraItems) {
        setCell(0, fila, celda(etq, S.etiqueta));
        setCell(1, fila, celda(val, S.valor));
        merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila - 1, c: LAST_COL } });
        fila++;
    }
    fila++;

    setCell(0, fila, celda('CÓDIGO POI', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 0 }, e: { r: fila, c: 0 } });
    setCell(1, fila, celda('ACTIVIDAD / TAREA / ACCIÓN', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 1 }, e: { r: fila, c: 1 } });
    setCell(2, fila, celda('UNIDAD DE MEDIDA ACTIVIDAD/TAREA', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 2 }, e: { r: fila, c: 2 } });
    setCell(3, fila, celda('METAS FÍSICAS', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 3 }, e: { r: fila - 1, c: 14 } });
    setCell(15, fila, celda('TOTAL ANUAL', S.encabezadoTabla));
    merges.push({ s: { r: fila - 1, c: 15 }, e: { r: fila, c: 15 } });
    fila++;

    for (let i = 0; i < 12; i++) {
        setCell(3 + i, fila, celda(meses[i], S.encabezadoTabla));
    }
    fila++;

    const filaActRef = fila;
    setCell(0, fila, celda(actividad.codigoProgramacionActividad || '', S.actividad));
    setCell(1, fila, celda(actividad.descripcionActividad || '', S.actividad));
    setCell(2, fila, celda(actividad.unidadMedidaActividadDescripcion || '', S.actividad));
    const mesesActividad = [
        actividad.totalEneroActividad, actividad.totalFebreroActividad, actividad.totalMarzoActividad,
        actividad.totalAbrilActividad, actividad.totalMayoActividad, actividad.totalJunioActividad,
        actividad.totalJulioActividad, actividad.totalAgostoActividad, actividad.totalSetiembreActividad,
        actividad.totalOctubreActividad, actividad.totalNoviembreActividad, actividad.totalDiciembreActividad
    ];
    for (let i = 0; i < 12; i++) {
        setCell(3 + i, fila, celda(mesesActividad[i] || 0, S.actividadNum));
    }
    setCell(15, fila, celda(actividad.totalAnualActividad || 0, S.actividadTotal));
    fila++;

    for (const tarea of tareas) {
        setCell(0, fila, celda(tarea.codigoProgramacionTarea || '', S.tarea));
        setCell(1, fila, celda(tarea.descripcionTarea || '', S.tarea));
        setCell(2, fila, celda(tarea.unidadMedidaTareaDescripcion || '', S.tarea));
        const mesesTarea = [
            tarea.totalEneroTarea, tarea.totalFebreroTarea, tarea.totalMarzoTarea,
            tarea.totalAbrilTarea, tarea.totalMayoTarea, tarea.totalJunioTarea,
            tarea.totalJulioTarea, tarea.totalAgostoTarea, tarea.totalSetiembreTarea,
            tarea.totalOctubreTarea, tarea.totalNoviembreTarea, tarea.totalDiciembreTarea
        ];
        for (let i = 0; i < 12; i++) {
            setCell(3 + i, fila, celda(mesesTarea[i] || 0, S.tareaNum));
        }
        setCell(15, fila, celda(tarea.totalAnualTarea || 0, S.tareaTotal));
        fila++;

        const accionesDeTarea = acciones.filter(
            a => a.idProgramacionTareaAccion === tarea.idProgramacionTarea
        );
        for (const accion of accionesDeTarea) {
            setCell(0, fila, celda(accion.codigoProgramacionAccion || '', S.accion));
            setCell(1, fila, celda(accion.descripcionAccion || '', S.accion));
            setCell(2, fila, celda(accion.unidadMedidaAccionDescripcion || '', S.accion));
            const mesesAccion = [
                accion.eneroAccion, accion.febreroAccion, accion.marzoAccion,
                accion.abrilAccion, accion.mayoAccion, accion.junioAccion,
                accion.julioAccion, accion.agostoAccion, accion.setiembreAccion,
                accion.octubreAccion, accion.noviembreAccion, accion.diciembreAccion
            ];
            for (let i = 0; i < 12; i++) {
                setCell(3 + i, fila, celda(mesesAccion[i] || 0, S.accionNum));
            }
            setCell(15, fila, celda(accion.totalAnualAccion || 0, S.accionTotal));
            fila++;
        }
    }

    ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: fila - 1, c: LAST_COL } });
    ws['!merges'] = merges;
    ws['!cols'] = [
        { wch: 20 },
        { wch: 50 },
        { wch: 18 },
        ...Array(12).fill({ wch: 7 }),
        { wch: 12 }
    ];
    ws['!rows'] = [];
    for (let i = 0; i < fila; i++) {
        ws['!rows'][i] = { hpt: 30 };
    }

    return ws;
}