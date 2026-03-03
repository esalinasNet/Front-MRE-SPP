var ESTADO = 1;
let tareasSeleccionadas = [];

$(function () {

    //fillSelectAnios("cboAniosTareasFiltro", 0, "SELECCIONE", (response) => { });  

    $("#btnGrabarTareas").click(function () {        
        grabarTareas();
    });

    $("#btnCerrarTareas").click(function () {
        $("#modalTareas").modal("hide");
    });

    $("#btnNuevaTarea").click(function () {
        nuevaTarea();
    });

    $('#gridTareas').on('change', '.chkFilaTarea', function () {

        tareasSeleccionadas = [];
        const id = $(this).data('id');

        let table = $('#gridTareas').DataTable();

        // ✔ Desmarcar todos los demás checkboxes
        $('.chkFilaTarea').not(this).prop('checked', false);

        // obtener la fila donde está el checkbox
        let fila = $(this).closest('tr');

        // obtener los datos de esa fila
        let datosFila = table.row(fila).data();

        // ✔ Si está marcado, guardamos, si no, limpiamos
        if ($(this).is(':checked')) {
                      
            // variables que necesites
            let idTarea = datosFila.idProgramacionTareas;
            let anio = datosFila.anio;
            let codigo = datosFila.codigoTareas;
            let denominacion = datosFila.descripcionTareas;

            console.log("ID:", idTarea);
            console.log("Año:", anio);
            console.log("Código:", codigo);
            console.log("Denominación:", denominacion);

            if (!tareasSeleccionadas.includes(idTarea)) {
                tareasSeleccionadas.push(idTarea);
            }
                        
            $("#hidProgramacionTareasAcciones").val(idTarea);

            codigoProgramacion = $("#txtActividadOperativaAcciones").val();
            $("#txtActividadOperativaAccionesFiltro").val(codigoProgramacion);

            $("#txtTareaAccionesFiltro").val(codigo);
            $("#txtCodigoTareasAcciones").val(codigo);

            _anio = parseInt($("#txtAniosTareasFiltro").val());
            $("#txtAniosAccionesFiltro").val(_anio);

            var idProgramacionActividad = parseInt($("#hidProgramacionActividad").val());

            $("#btnNuevaAccion").prop("disabled", false);

            console.log("en tareas", _anio, idProgramacionActividad, idTarea);

            getCargarGridAcciones(anio, idProgramacionActividad, idTarea);

            $("#txtAnioRecursoFiltro").val(_anio);
            $("#txtActividadRecursoFiltro").val(codigoProgramacion);
            $("#txtTareaRecursoFiltro").val(codigo);

            getCargarGridRecursos(anio, idProgramacionActividad, idTarea)

            //getCargarGridRecursos(anio, idProgramacionActividad, id);

            // si quieres guardar en variables globales:
            window.itemSeleccionado = datosFila;

        } else {

            tareasSeleccionadas = tareasSeleccionadas.filter(x => x !== idTarea);
            // si se desmarca, limpiamos la variable
            window.itemSeleccionado = null;
        }
    });

    var flag = $("#flagEditTareas").val();  
   

    //Tipo Ubigeo
    $("#cboUbigeoTareas").change(function () {
        var tipo = $(this).val();

        if (tipo === "1") { // Nacional
            $("#divNacionalTareas").show();
            $("#divExtranjeroTareas").hide();
            //fillSelectUbigeoDepartamento("cboDepartamento", "", "SELECCIONE", (response) => { });
        }
        else if (tipo === "2") { // Extranjero
            $("#divNacionalTareas").hide();
            $("#divExtranjeroTareas").show();

            var idAnio = parseInt($("#cboAnioTareas").val());
            let request = { idAnio: idAnio }
            //fillSelectTipoDeCambio("cboMoneda", request, "", "SELECCIONE", (response) => { });
        }
        else {
            $("#divNacionalTareas, #divExtranjeroTareas").hide();
        }
    });

    //Ubigeo Nacional
    var depa = document.getElementById("cboDepartamentoTareas");
    depa.addEventListener("change", function () {
        $("#cboDepartamentoTareas").prop("disabled", false);

        var departamento = $("#cboDepartamentoTareas").val();

        fillSelectUbigeoProvincia("cboProvinciaTareas", 0, "TODOS", departamento, function () { });

    });

    var prov = document.getElementById("cboProvinciaTareas");
    prov.addEventListener("change", function () {
        $("#cboDistritoTareas").prop("disabled", false);

        var departamento = $("#cboDepartamentoTareas").val();
        provincia = $("#cboProvinciaTareas").val();
        fillSelectUbigeoDistrito("cboDistritoTareas", 0, "TODOS", departamento, provincia, function () { });

    });

});

function listarProgramacionTareas() {
    getCargarGridTareas(0, 0);
}

function getCargarGridTareas(anio, idActividadOperativa) {   //, idProgramacionClasificador) {

    let request =
    {
        anio: anio,
        idProgramacionActividad: idActividadOperativa,
        //idProgramacionClasificador: idProgramacionClasificador,
        codigoTareas: null,
        //descripcionTareas: null,        
        estadoDescripcion: null,
        paginaActual: 0,
        tamanioPagina: 0,
        activo: true
    };

    $("#gridTareas").DataTable().clear();
    $('#gridTareas').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceProgramacionTareas.getProgramacionTareasPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getProgramacionTareas', error));

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
                    const checked = tareasSeleccionadas.includes(row.idProgramacionTareas) ? 'checked' : '';
                    return `<input type="checkbox" class="chkFilaTarea" data-id="${row.idProgramacionTareas}" ${checked} />`;
                }
            },
            {
                data: 'idProgramacionTareas',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },            
            { data: 'codigoProgramacion' },
            { data: 'codigoTareas' },
            { data: 'descripcionUnidadMedida' },
            {
                data: 'representativa',
                render: function (data, type, row) {
                    // Si es true o 1, marcamos el checkbox
                    const checked = (data === true || data === 1) ? 'checked' : '';
                    return `
                    <input type="checkbox" class="form-check-input" disabled ${checked}>
                `;
                },
                className: "text-center"
            },
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
                data: 'idProgramacionTareas',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editarTarea(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminarTarea(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
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

function editProgramacionTareas(request) {
    limpiarModalTareas();

    serviceProgramacionTareas.getProgramacionTareasPorId(request, headersuarm)
        .then(response => {

            // fillSelectAnios("cboAnioTareas", response.idAnio, "SELECCIONE", (termino) => {
            $("#txtAnioTareas").val(response.anio);

                fillSelectUbigeoDepartamento("cboDepartamentoTareas", "", "SELECCIONE", (response) => { });

                $("#hidTareas").val(response.idProgramacionTareas);
                $("#hidProgramacionActividad").val(response.idProgramacionActividad);

                $("#txtActividadOperativaTareas").val(response.codigoProgramacion);
                $("#txtCodigoTarea").val(response.codigoTareas);
                $("#txtDenominacionTarea").val(response.descripcionTareas);

                var idAnio = response.idAnio
                let request = { idAnio: idAnio };

                let idUnidadMedida = $("#hidUnidadMedidaActividad").val()

                fillSelectUnidadMedida("cboUnidadMedidaTareas", request, idUnidadMedida, "SELECCIONE", (termino) => { });
                fillSelectFuenteFinanciamiento("cboFuenteFinanciamiento", request, response.idFuenteFinanciamiento, "SELECCIONE", (termino) => { });

                $("#cboUbigeoTareas").val($("#htipoUbigeoActividad").val());
                $("#txtUbigeoTareas").val($("#hUbigeoActividad").val());

                /*
                let Tubigeo = true; //response.tipoUbigeo;
                if (Tubigeo === true) Tubigeo = "1";
                if (Tubigeo === false) Tubigeo = "2";
                $("#cboUbigeoTareas").val(String(Tubigeo));

                var ubigeo = "";

                if (response.ubigeo == null) {
                    response.ubigeo = "150101";  //nacional
                }

                if (Tubigeo == 1) {
                    console.log("Tubigeo", Tubigeo);
                    $("#divNacionalTareas").show();
                    $("#divExtranjeroTareas").hide();
                    ubigeo = response.ubigeo; // "150101"

                    var departamento = ubigeo.substring(0, 2); // "15"
                    var provincia = ubigeo.substring(2, 4);    // "01"
                    var distrito = ubigeo.substring(4, 6);     // "01"

                    fillSelectUbigeoDepartamento("cboDepartamentoTareas", departamento, "SELECCIONE", function () {
                        fillSelectUbigeoProvincia("cboProvinciaTareas", provincia, "TODOS", departamento, function () {
                            fillSelectUbigeoDistrito("cboDistritoTareas", distrito, "TODOS", departamento, provincia, function () {

                            });
                        });
                    });
                }*/

                $("#chkRepresentativa").prop("checked", response.representativa == true || response.representativa == 1);

                $("#txtEstadoTareas").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivoTareas").val(String(activo));
                ESTADO = response.estado;
                
            //}); 
        })
};

function updProgramacionTareas(datos) {
   
    serviceProgramacionTareas.updProgramacionTareas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                //var anio = parseInt($("#cboAniosTareasFiltro option:selected").text());
                //var idActividad = parseInt($("#cboActividadOperativaFiltro").val());

                var anio = parseInt($("#txtAniosClasificador").val());

                var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());
                //var idProgramacionClasificador = parseInt($("#hidProgramacionClasificadorTareas").val());

                getCargarGridTareas(anio, idProgramacionActividad); //,idProgramacionClasificador);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalTareas").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updProgramacionTareas', error);
        });
}

function insProgramacionTareas(datos) {

    serviceProgramacionTareas.insProgramacionTareas(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                var anio = parseInt($("#txtAniosClasificador").val());

                var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());
                //var idProgramacionClasificador = parseInt($("#hidProgramacionClasificadorTareas").val());

                getCargarGridTareas(anio, idProgramacionActividad); //, idProgramacionClasificador);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                //$("#modalTareas").modal("hide");
                limpiarModalTareas();
                //var idProgramacionActividad = $("#hidProgramacionActividad").val();
                let request = {
                    idProgramacionActividad: idProgramacionActividad,
                    //idProgramacionClasificador: idProgramacionClasificador
                };

                serviceProgramacionTareas.getProgramacionActividadTareasPorId(request, headersuarm)
                    .then(response => {

                        $("#txtCodigoTarea").val(response.codigoTareas);

                    })
                    .catch(error => {
                        msgException('editProgramacionActividad', error);
                    });

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insProgramacionTareas', error);
        });
}

function delProgramacionTareas(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceProgramacionTareas.delProgramacionTareas(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        var anio = parseInt($("#txtAniosClasificador").val());

                        var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

                        //var idProgramacionClasificador = parseInt($("#hidProgramacionClasificadorTareas").val());

                        getCargarGridTareas(anio, idProgramacionActividad); // , idProgramacionClasificador);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delProgramacionTareas', error);
                });
        }
    });
}

function grabarTareas() {

    var idProgramacionTareas = ($("#hidTareas").val() == '' ? 0 : parseInt($("#hidTareas").val()));
    var idAnio = parseInt($("#hAniosPresupuestalTareas").val());  //parseInt($("#cboAnioTareas").val());
    var anio = parseInt($("#txtAnioTareas").val());  //parseInt($("#cboAnioTareas option:selected").text());

    var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());
    //var idProgramacionClasificador = parseInt($("#hidProgramacionClasificadorTareas").val());

    var codigoTareas = $("#txtCodigoTarea").val();
    var descripcionTareas = $("#txtDenominacionTarea").val();

    var idUnidadMedida = parseInt($("#cboUnidadMedidaTareas").val());
    var representativa = $("#chkRepresentativa").prop("checked"); // ? 1 : 0;
    var idFuenteFinanciamiento = parseInt($("#cboFuenteFinanciamiento").val());

    //
    var metaFisica = 0;
    var metaFinanciera = 0.0;

    var tipoUbigeo = parseInt($("#cboUbigeoTareas").val());
    var ubigeo = $("#txtUbigeoTareas").val();

    var departamento = "";
    var provincia = "";

    /*if (tipoUbigeo == 1) {
        departamento = $("#cboDepartamentoTareas").val();
        provincia = $("#cboProvinciaTareas").val();
        distrito = $("#cboDistritoTareas").val();
        ubigeo = departamento + provincia + distrito;
    }*/
    //

    var activo = parseInt($("#cboActivoTareas").val());
    var flag = $("#flagEditTareas").val();
    var idEstado = ESTADO; //2;

    if (flag == 1) {   //Editar
        let datos = {
            idProgramacionTareas: idProgramacionTareas,
            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            //idProgramacionClasificador: idProgramacionClasificador,
            codigoTareas: codigoTareas,
            descripcionTareas: descripcionTareas,
            ubigeo: ubigeo,
            idUnidadMedida: idUnidadMedida,
            representativa: representativa,
            idFuenteFinanciamiento: idFuenteFinanciamiento,
            metaFisica: metaFisica,
            metaFinanciera: metaFinanciera,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)

        };
        updProgramacionTareas(datos);
    } else {    //Nuevo
        let datos = {

            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            //idProgramacionClasificador: idProgramacionClasificador,
            codigoTareas: codigoTareas,
            descripcionTareas: descripcionTareas,
            ubigeo: ubigeo,
            idUnidadMedida: idUnidadMedida,
            representativa: representativa,
            idFuenteFinanciamiento: idFuenteFinanciamiento,
            metaFisica: metaFisica,
            metaFinanciera: metaFinanciera,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        insProgramacionTareas(datos);
    }
}

//**** Tareas */
function nuevaTarea(control) {

    limpiarModalTareas();

    $("#modalTareas").modal("show");
    $("#flagEditTareas").val(0);
    $("#mdlTitleTareas").text("Registrar Datos de Tareas");
    $("#txtEstadoTareas").prop("disabled", true);
    $("#txtEstadoTareas").val("Emitido");
    $("#divNacionalTareas").hide();
    $("#divExtranjeroTareas").hide();

    $("#cboUbigeoTareas").val($("#htipoUbigeoActividad").val());
    $("#txtUbigeoTareas").val($("#hUbigeoActividad").val());

    

    var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());
    //var idProgramacionClasificador = parseInt($("#hidProgramacionClasificadorTareas").val());

    let request =
    {
        idProgramacionActividad: idProgramacionActividad
        //idProgramacionClasificador: idProgramacionClasificador

    };
    //trae en codigo autogenerado
    serviceProgramacionTareas.getProgramacionActividadTareasPorId(request, headersuarm)
        .then(response => {

            $("#txtCodigoTarea").val(response.codigoTareas);

        })
        .catch(error => {
            msgException('editProgramacionActividad', error);
        });

    fillSelectUbigeoDepartamento("cboDepartamentoTareas", "", "SELECCIONE", (response) => { });
    fillSelectUbigeoExteriorRegion("cboRegiontareas", "", "SELECCIONE", (response) => { });

}

function editarTarea(control) {

    $("#modalTareas").modal("show");
    $("#mdlTitleTareas").text("Editar Datos de Tareas");
    $("#flagEditTareas").val(1);
    $("#cboActivoTareas").prop("disabled", false);
    $("#txtEstadoTareas").prop("disabled", true);

    var idProgramacionTareas = $(control).data('input');

    let request =
    {
        idProgramacionTareas: idProgramacionTareas
    }

    editProgramacionTareas(request);
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idAcciones: codigo
    };
    delProgramacionTareas(datos);
}

function limpiarModalTareas() {

    $("#hidTareas").val("");

    //$("#txtActividadOperativa").val("");
    //$("#txtCodigoTarea").val("");
    $("#txtDenominacionTarea").val("");
    $("#chkRepresentativa").prop("checked", false);
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
    //$("#cboUbigeoTareas").val(0);
    $("#cboUbigeoTareas").prop("disabled", true);
    $("#cboUnidadMedidaTareas").prop("disabled", true);

    $("#divNacionalTareas").hide();
    $("#divExtranjeroTareas").hide();

    fillSelectUbigeoDepartamento("cboDepartamentoTareas", "", "SELECCIONE", (response) => { });
    fillSelectUbigeoExteriorRegion("cboRegiontareas", "", "SELECCIONE", (response) => { });

    var idAnio = parseInt($("#hAniosPresupuestalTareas").val());

    let request = { idAnio: idAnio }

    let idUnidadMedida = $("#hidUnidadMedidaActividad").val()

    fillSelectUnidadMedida("cboUnidadMedidaTareas", request, idUnidadMedida, "SELECCIONE", (response) => { });
    

    fillSelectFuenteFinanciamiento("cboFuenteFinanciamiento", request, 0, "SELECCIONE", (response) => { });
}