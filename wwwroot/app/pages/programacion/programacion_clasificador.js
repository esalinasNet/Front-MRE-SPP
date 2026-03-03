var ESTADO = 1;
var cidAnio = 0;
var canio = 0;
var cidProgramacionActividad = 0;
var ccodigoProgramacion = "";


$(function () {

    // se remplaza por $("#txtAniosClasificador").val(anio);
    //fillSelectAnios("cboAniosClasificadorFiltro", 0, "SELECCIONE", (response) => { });
    
    $("#btnGrabarClasificador").click(function () {
        grabarClasificador();
    });

    $("#btnCerrarClasificador").click(function () {
        $("#modalClasificador").modal("hide");
    });

    $("#btnNuevoClasificador").click(function () {
        nuevoClasificador();
    });

    $('#gridClasificador').on('change', '.chkFilaCla', function () {

        let table = $('#gridClasificador').DataTable();

        // ✔ Desmarcar todos los demás checkboxes
        $('.chkFilaCla').not(this).prop('checked', false);

        // obtener la fila donde está el checkbox
        let fila = $(this).closest('tr');

        // obtener los datos de esa fila
        let datosFila = table.row(fila).data();

        // ✔ Si está marcado, guardamos, si no, limpiamos
        if ($(this).is(':checked')) {

            // variables que necesites
            let id = datosFila.idProgramacionClasificador;
            let anio = datosFila.anio;
            let codigo = datosFila.codigoEspecifica;
            let denominacion = datosFila.descripcionEspecifica;

            console.log("ID:", id);
            console.log("Año:", anio);
            console.log("Código:", codigo);
            console.log("Denominación:", denominacion);

            //$("#txtActividadOperativaClasificadorFiltro").val(codigo);
            $("#hidProgramacionClasificadorTareas").val(id);

            codigoProgramacion = $("#txtActividadOperativaClasificador").val();
            $("#txtActividadOperativaTareasFiltro").val(codigoProgramacion);

            $("#txtClasificadorTareasFiltro").val(codigo);

            _anio = parseInt($("#txtAniosClasificadorFiltro").val());
            $("#txtAniosTareasFiltro").val(_anio);

            var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

            //ya no va directo de actividad a treas
            //getCargarGridTareas(anio, idProgramacionActividad, id);

            // si quieres guardar en variables globales:
            window.itemSeleccionado = datosFila;

        } else {
            // si se desmarca, limpiamos la variable
            window.itemSeleccionado = null;
        }
    });


    //console.log("cidAnio", cidAnio)
    //console.log("canio", canio)
    //console.log("cidProgramacionActividad", cidProgramacionActividad)
    //console.log("ccodigoProgramacion", ccodigoProgramacion)

    //$("#txtActividadOperativaClasificadorFiltro").val(codigoProgramacion);
    //getCargarGridClasificador(canio, cidProgramacionActividad);

    //Año filtro para clasificador y Actividad Operativa
    //var _anio = document.getElementById("cboAniosClasificadorFiltro");
    //_anio.addEventListener("change", function () {

        //var idAnio = parseInt($("#cboAniosClasificadorFiltro").val());
        //var anio = parseInt($("#cboAniosClasificadorFiltro option:selected").text());

        //let request = { idAnio: cidAnio }    

        /*getCargarGridClasificador(canio, 99999);

        fillSelectActividadesOperativas("cboActividadOperativaClasificadorFiltro", request, 0, "SELECCIONE", (response) => { });

        var act = document.getElementById("cboActividadOperativaClasificadorFiltro");
        act.addEventListener("change", function () {

            var idActividad = parseInt($("#cboActividadOperativaClasificadorFiltro").val());

            getCargarGridClasificador(canio, idActividad);
        });*/

    //});

    //para el formulario de datos

    /*var anio = document.getElementById("cboAnioClasificador");
    anio.addEventListener("change", function () {

        var idAnio = parseInt($("#cboAnioClasificador").val());
        let request = { idAnio: idAnio }

        console.log("año", idAnio);        
        fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoClasificador", request, 0, "SELECCIONE", (response) => { });

        fillSelectClasificadorDelGasto("cboClasificadordelGasto", request, 0, "SELECCIONE", (response) => { });
    });*/

    var fuente = document.getElementById("cboClasificadordelGasto");
    fuente.addEventListener("change", function () {

        var idAnio = parseInt($("#hAniosPresupuestalClasificador").val());
        let request = { idAnio: idAnio }
                
        fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoClasificador", request, 0, "SELECCIONE", (response) => { });

    });

});

function listarProgramacionClasificador() {
    getCargarGridClasificador(0, 0);
}

function getCargarGridClasificador(anio, idActividadOperativa) {

    let request =
    {
        anio: anio,
        idProgramacionActividad: idActividadOperativa,
        codigoClasificador: null,
        descripcionClasificador: null,        
        estadoDescripcion: null,
        paginaActual: 0,
        tamanioPagina: 0,
        activo: true
    };

    $("#gridClasificador").DataTable().clear();
    $('#gridClasificador').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceProgramacionClasificador.getProgramacionClasificadorPaginado(request, headersuarm)  //cambiar
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
                className: "text-center",
                render: function (data, type, row, meta) {
                    return `<input type="checkbox" class="chkFilaCla" data-id="${row.idProgramacionClasificador}" />`;
                }
            },
            {
                data: 'idProgramacionClasificador',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'codigoProgramacion' },
            { data: 'descripcionFuente' },

            { data: 'codigoEspecifica' },
            { data: 'descripcionEspecifica' },                        
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
            /*{
                data: 'idProgramacionClasificador',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editarClasificador(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminarClasificador(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
                    return resultado;
                }
            }*/
        ],
        destroy: true,
        bLengthChange: false,
        bFilter: false,
        bInfo: true
    });
}

function editProgramacionClasificador(request) {
    limpiarModalClasificador();

    serviceProgramacionClasificador.getProgramacionClasificadorPorId(request, headersuarm)
        .then(response => {

            //fillSelectAnios("cboAnioClasificador", response.idAnio, "SELECCIONE", (termino) => {
            $("#txtAniosClasificador").val(response.anio);

                $("#hidClasificador").val(response.idProgramacionClasificador);
                $("#hidProgramacionActividadClasificador").val(response.idProgramacionActividad);

                $("#txtActividadOperativaClasificador").val(response.codigoProgramacion);
                $("#txtCodigoClasificador").val(response.codigoClasificador);
                $("#txtDenominacionClasificador").val(response.descripcionClasificador);

                var idAnio = response.idAnio
                let request = { idAnio: idAnio };

                fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoClasificador", request, response.idFuenteFinanciamiento, "SELECCIONE", (termino) => { });
                fillSelectClasificadorDelGasto("cboClasificadordelGasto", request, response.idClasificador, "SELECCIONE", (termino) => { });

                $("#txtEstadoClasificador").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivoClasificador").val(String(activo));
                ESTADO = response.estado;

            //});
        })
};

function updProgramacionClasificador(datos) {

    serviceProgramacionClasificador.updProgramacionClasificador(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                //var anio = parseInt($("#cboAniosClasificadorFiltro option:selected").text());
                //var idActividad = parseInt($("#cboActividadOperativaClasificadorFiltro").val());
                var anio = parseInt($("#txtAniosClasificador").val());

                var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

                getCargarGridClasificador(anio, idProgramacionActividad);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalClasificador").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updProgramacionClasificador', error);
        });
}

function insProgramacionClasificador(datos) {

    serviceProgramacionClasificador.insProgramacionClasificador(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                var anio = parseInt($("#txtAniosClasificador").val());
                
                var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

                getCargarGridClasificador(anio, idProgramacionActividad);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalClasificador").modal("hide");
                limpiarModalClasificador();
                //var idProgramacionActividad = $("#hidProgramacionActividadClasificador").val();
                let request = { idProgramacionActividad: idProgramacionActividad };

                serviceProgramacionClasificador.getProgramacionActividadClasificadorPorId(request, headersuarm)
                    .then(response => {

                        $("#txtCodigoClasificador").val(response.codigoClasificador);

                    })
                    .catch(error => {
                        msgException('editProgramacionActividad', error);
                    });

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insProgramacionClasificador', error);
        });
}

function delProgramacionClasificador(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceProgramacionClasificador.delProgramacionClasificador(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        var anio = parseInt($("#txtAniosClasificador").val());

                        var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

                        getCargarGridClasificador(anio, idProgramacionActividad);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delProgramacionClasificador', error);
                });
        }
    });
}

function grabarClasificador() {
    var idProgramacionClasificador = ($("#hidClasificador").val() == '' ? 0 : parseInt($("#hidClasificador").val()));
    var idAnio = parseInt($("#hAniosPresupuestalClasificador").val());
    var anio = parseInt($("#txtAniosClasificador").val());
    var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

    // ✅ ESTOS SON LOS CAMPOS QUE NECESITAS
    var idFuenteFinanciamiento = parseInt($("#cboFuenteFinanciamientoClasificador").val());
    var idClasificador = parseInt($("#cboClasificadordelGasto").val());

    var codigoClasificador = $("#txtCodigoClasificador").val();
    var descripcionClasificador = $("#txtDenominacionClasificador").val();
    var metaFinanciera = 0.0;
    var activo = parseInt($("#cboActivoClasificador").val());
    var flag = $("#flagEditClasificador").val();
    var idEstado = ESTADO;

    if (flag == 1) {   // Editar
        let datos = {
            idProgramacionClasificador: idProgramacionClasificador,
            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            idFuenteFinanciamiento: idFuenteFinanciamiento,  // ✅
            idClasificador: idClasificador,                   // ✅
            codigoClasificador: codigoClasificador,
            descripcionClasificador: descripcionClasificador,
            metaFinanciera: metaFinanciera,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        updProgramacionClasificador(datos);
    } else {    // Nuevo
        let datos = {
            idProgramacionClasificador: idProgramacionClasificador,
            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            idFuenteFinanciamiento: idFuenteFinanciamiento,  // ✅
            idClasificador: idClasificador,                   // ✅
            codigoClasificador: codigoClasificador,
            descripcionClasificador: descripcionClasificador,
            metaFinanciera: metaFinanciera,
            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        insProgramacionClasificador(datos);
    }
}

//**** Clasificador */
function nuevoClasificador() {  // (control) {

    limpiarModalClasificador();

    $("#modalClasificador").modal("show");
    $("#flagEditClasificador").val(0);
    $("#mdlTitleClasificador").text("Registrar Datos de Clasificador");
    $("#txtEstadoClasificador").prop("disabled", true);
    $("#txtEstadoClasificador").val("Emitido");
    

    /*fillSelectAnios("cboAnioClasificador", 0, "SELECCIONE", (response) => { });
        
    var idProgramacionActividad = $(control).attr("data-id");
    var codigoProgramacion = $(control).attr("data-codigo");
    console.log("ID:", idProgramacionActividad);
    console.log("Código:", codigoProgramacion);

    $("#hidProgramacionActividadClasificador").val(idProgramacionActividad);
    $("#txtActividadOperativaClasificador").val(codigoProgramacion); 
    */

    var idProgramacionActividad = parseInt($("#hidProgramacionActividadClasificador").val());

    let request =
    {
        idProgramacionActividad: idProgramacionActividad
    };
    //trae en codigo autogenerado
    serviceProgramacionClasificador.getProgramacionActividadClasificadorPorId(request, headersuarm)
        .then(response => {

            $("#txtCodigoClasificador").val(response.codigoClasificador);
            
        })
        .catch(error => {
            msgException('editProgramacionActividad', error);
        });

    //var idAnio = parseInt($("#cboAnioClasificador").val());
    //request = { idAnio: idAnio }    
    //fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoClasificador", request, 0, "SELECCIONE", (response) => { });

}

function editarClasificador(control) {

    $("#modalClasificador").modal("show");
    $("#mdlTitleClasificador").text("Editar Datos de Clasificador");
    $("#flagEditClasificador").val(1);
    $("#cboActivoClasificador").prop("disabled", false);
    $("#txtEstadoClasificador").prop("disabled", true);

    var idProgramacionClasificador = $(control).data('input');

    let request =
    {
        idProgramacionClasificador: idProgramacionClasificador
    }

    editProgramacionClasificador(request);
}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idAcciones: codigo
    };
    delProgramacionClasificador(datos);
}

function limpiarModalClasificador() {

    $("#hidClasificador").val("");

    //$("#txtActividadOperativaClasificador").val("");
    //$("#txtCodigoClasificador").val("");
    $("#txtDenominacionClasificador").val("");    
    $("#txtEstado").val("");
    $("#cboActivo").val(1);
        
    //var idAnio = parseInt($("#cboAnioClasificador").val());
    var idAnio = parseInt($("#hAniosPresupuestalClasificador").val());

    let request = { idAnio: idAnio }        
    fillSelectFuenteFinanciamiento("cboFuenteFinanciamientoClasificador", request, 0, "SELECCIONE", (response) => { });
    fillSelectClasificadorDelGasto("cboClasificadordelGasto", request, 0, "SELECCIONE", (response) => { });
}