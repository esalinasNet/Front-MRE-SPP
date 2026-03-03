var ESTADO = 1;
var IDPROGRAMACION = 0;
var CODIGOPROGRAMACION = "";
var IDTAREAS = 0;

$(function () {

    //fillSelectAnios("cboAniosAccionesFiltro", 0, "SELECCIONE", (response) => { });  

    $("#btnGrabarAcciones").click(function () {
        grabarAcciones();
    });

    $("#btnCerrarAcciones").click(function () {
        $("#modalAcciones").modal("hide");
    });

    $("#btnNuevaAccion").click(function () {
        nuevaAccion();
    });

    //Año filtro para tareas y Actividad Operativa de la Acción
   /* var _anio = document.getElementById("cboAniosAccionesFiltro");
    _anio.addEventListener("change", function () {

        var idAnio = parseInt($("#cboAniosAccionesFiltro").val());
        var anio = parseInt($("#cboAniosAccionesFiltro option:selected").text());
        let request = { idAnio: idAnio }

        getCargarGridAcciones(anio, 99999 ,99999);

        fillSelectActividadesOperativas("cboActividadOperativaAccionesFiltro", request, 0, "SELECCIONE", (response) => { });

        var act = document.getElementById("cboActividadOperativaAccionesFiltro");
        act.addEventListener("change", function () {

            var idActividad = parseInt($("#cboActividadOperativaAccionesFiltro").val());

            let request = {
                idAnio: idAnio,
                idProgramacionActividad: idActividad
            }

            fillSelectTareasPorActividad("cboTareaAccionesFiltro", request, 0, "SELECCIONE", (response) => { });

            var tarea = document.getElementById("cboTareaAccionesFiltro");
            tarea.addEventListener("change", function () {

                var idProgramacionActividad = parseInt($("#cboActividadOperativaAccionesFiltro").val());
                var idProgramacionTareas = parseInt($("#cboTareaAccionesFiltro").val());

                getCargarGridAcciones(anio, idProgramacionActividad, idProgramacionTareas);

            });            
        });
    });
    */
    //Año del Modal de Acciones
   /* var _anio = document.getElementById("cboAnioAcciones");
    _anio.addEventListener("change", function () {

        var idAnio = parseInt($("#cboAnioAcciones").val());
        let request = {
            idAnio: idAnio,
            idProgramacionActividad: IDPROGRAMACION
        }

        fillSelectTareasPorActividad("cboCodigoTareasAcciones", request, 0, "SELECCIONE", (response) => { });
        fillSelectUnidadMedida("cboUnidadMedidaAcciones", request, 0, "SELECCIONE", (response) => { });

        $("#txtActividadOperativaAcciones").val(CODIGOPROGRAMACION);

        var tarea = document.getElementById("cboCodigoTareasAcciones");
        tarea.addEventListener("change", function () {

            var idTareas = parseInt($("#cboCodigoTareasAcciones").val());

            var idProgramacionActividad = $("#hidProgramacionActividadAcciones").val();
            let request = {
                idProgramacionActividad: idProgramacionActividad,
                idProgramacionTareas: idTareas
            };
            //trae el codigo generado 
            serviceProgramacionAcciones.getProgramacionTareasAccionesPorId(request, headersuarm)
                .then(response => {

                    $("#txtCodigoAcciones").val(response.codigoAcciones);

                })
                .catch(error => {
                    msgException('editProgramacionActividad', error);
                });            
        });        
    }); */

    $(".numero-mes").on("input", function () {
        this.value = this.value.replace(/[^0-9]/g, '');

        // Ejecutar suma
        calcularTotalAnual();
    });

    $("#chkRepresentativaAcciones").change(function () {
        if ($(this).is(":checked")) {
            $("#chkAcumulativaAcciones").prop("checked", false);
        }
        calcularTotalAnual();
    });

    $("#chkAcumulativaAcciones").change(function () {
        if ($(this).is(":checked")) {
            $("#chkRepresentativaAcciones").prop("checked", false);
        }
        calcularTotalAnual();
    });

    $("#txtEneroAcciones, #txtFebreroAcciones, #txtMarzoAcciones, #txtAbrilAcciones, #txtMayoAcciones, #txtJunioAcciones, #txtJulioAcciones, #txtAgostoAcciones, #txtSetiembreAcciones, #txtOctubreAcciones, #txtNoviembreAcciones, #txtDiciembreAcciones")
        .on("input", function () {
            calcularTotalAnualAcciones();
        });
});

function listarProgramacionAcciones() {
    getCargarGridAcciones(0, 0, 0);
}

function calcularTotalAnual() {
    let total = 0;

    /*let enero = ($("#txtEneroAcciones").val() && $("#txtEneroAcciones").val() !== "0")
        ? parseInt($("#txtEneroAcciones").val())
        : null
    let febrero = ($("#txtFebreroAcciones").val() && $("#txtFebreroAcciones").val() !== "0")
        ? parseInt($("#txtFebreroAcciones").val())
        : null
    let marzo = ($("#txtMarzoAcciones").val() && $("#txtMarzoAcciones").val() !== "0")
        ? parseInt($("#txtMarzoAcciones").val())
        : null
    let abril = ($("#txtAbrilAcciones").val() && $("#txtAbrilAcciones").val() !== "0")
        ? parseInt($("#txtAbrilAcciones").val())
        : null
    let mayo = ($("#txtMayoAcciones").val() && $("#txtMayoAcciones").val() !== "0")
        ? parseInt($("#txtMayoAcciones").val())
        : null
    let junio = ($("#txtJunioAcciones").val() && $("#txtJunioAcciones").val() !== "0")
        ? parseInt($("#txtJunioAcciones").val())
        : null
    let julio = ($("#txtJulioAcciones").val() && $("#txtJulioAcciones").val() !== "0")
        ? parseInt($("#txtJulioAcciones").val())
        : null
    let agosto = ($("#txtAgostoAcciones").val() && $("#txtAgostoAcciones").val() !== "0")
        ? parseInt($("#txtAgostoAcciones").val())
        : null
    let setiembre = ($("#txtSetiembreAcciones").val() && $("#txtSetiembreAcciones").val() !== "0")
        ? parseInt($("#txtSetiembreAcciones").val())
        : null
    let octubre = ($("#txtOctubreAcciones").val() && $("#txtOctubreAcciones").val() !== "0")
        ? parseInt($("#txtOctubreAcciones").val())
        : null
    let noviembre = ($("#txtNoviembreAcciones").val() && $("#txtNoviembreAcciones").val() !== "0")
        ? parseInt($("#txtNoviembreAcciones").val())
        : null
    let diciembre = ($("#txtDiciembreAcciones").val() && $("#txtDiciembreAcciones").val() !== "0")
        ? parseInt($("#txtDiciembreAcciones").val())
        : null 
    
    total = enero + febrero + marzo + abril + mayo + junio + julio + agosto + setiembre + octubre + noviembre + diciembre
    */
    let meses = [
        Number($("#txtEneroAcciones").val()) || 0,
        Number($("#txtFebreroAcciones").val()) || 0,
        Number($("#txtMarzoAcciones").val()) || 0,
        Number($("#txtAbrilAcciones").val()) || 0,
        Number($("#txtMayoAcciones").val()) || 0,
        Number($("#txtJunioAcciones").val()) || 0,
        Number($("#txtJulioAcciones").val()) || 0,
        Number($("#txtAgostoAcciones").val()) || 0,
        Number($("#txtSetiembreAcciones").val()) || 0,
        Number($("#txtOctubreAcciones").val()) || 0,
        Number($("#txtNoviembreAcciones").val()) || 0,
        Number($("#txtDiciembreAcciones").val()) || 0
    ];

    if ($("#chkRepresentativaAcciones").is(":checked")) {
        total = Math.max(...meses);
    }
    else if ($("#chkAcumulativaAcciones").is(":checked")) {
        total = meses.reduce((a, b) => a + b, 0);
    }

    $("#txtTotalAnualAcciones").val(total);
}

function getCargarGridAcciones(anio, idActividadOperativa, idProgramacionTareas) {

    console.log("en acciones", anio, idActividadOperativa, idProgramacionTareas);

    let request =
    {
        anio: anio,
        idProgramacionActividad: idActividadOperativa,
        idProgramacionTareas: idProgramacionTareas,
        codigoAcciones: null,        
        estadoDescripcion: null,
        paginaActual: 0,
        tamanioPagina: 0,
        activo: true
    };

    $("#gridAcciones").DataTable().clear();
    $('#gridAcciones').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceProgramacionAcciones.getProgramacionAccionesPaginado(request, headersuarm)  //cambiar
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
                data: 'idProgramacionAcciones',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'codigoAcciones' },
            { data: 'descripcionAcciones' },
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
            {
                data: 'acumulativa',
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
                data: 'idProgramacionAcciones',
                render: function (data, type, row) {
                    var resultado = '';
                    resultado += '<button onclick="editarAccion(this)" data-input="' + data + '" class="btn   btn-sm btn-outline-dark"><i class="bi-pencil"></i></button> ';
                    resultado += '<button onclick="eliminarAccion(this)" data-input="' + data + '" class="btn   btn-sm  btn-outline-danger"><i class="bi-trash"></i></button> ';
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

function editProgramacionAcciones(request) {

    limpiarModalAcciones();

    serviceProgramacionAcciones.getProgramacionAccionesPorId(request, headersuarm)
        .then(response => {

            //fillSelectAnios("cboAnioAcciones", response.idAnio, "SELECCIONE", (termino) => {

            $("#txtAnioAcciones").val(response.anio);

                var idAnio = response.idAnio
                let request = { idAnio: idAnio };

                let idUnidadMedida = $("#hidUnidadMedidaActividad").val()
                fillSelectUnidadMedida("cboUnidadMedidaAcciones", request, idUnidadMedida, "SELECCIONE", (response) => { });

               var idActividad = response.idProgramacionActividad;

                request = {
                    idAnio: idAnio,
                    idProgramacionActividad: idActividad
                }
                //fillSelectTareasPorActividad("cboCodigoTareasAcciones", request, response.idProgramacionTareas, "SELECCIONE", (termino) => { });

                $("#txtCodigoTareasAcciones").val(response.codigoTareas);

                $("#hidAcciones").val(response.idProgramacionAcciones);
                $("#hidProgramacionActividadAcciones").val(response.idProgramacionActividad);

                $("#txtActividadOperativaAcciones").val(response.codigoProgramacion);

                $("#txtCodigoAcciones").val(response.codigoAcciones);
                $("#txtDenominacionAcciones").val(response.descripcionAcciones);


                $("#chkRepresentativaAcciones").prop("checked", response.representativa == true || response.representativa == 1);
                $("#chkAcumulativaAcciones").prop("checked", response.acumulativa == true || response.acumulativa == 1);

                $("#txtEstadoAcciones").val(response.estadoDescripcion);

                let activo = response.activo;
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivoAcciones").val(String(activo));
                ESTADO = response.estado;

                $("#txtEneroAcciones").val(response.enero);
                $("#txtFebreroAcciones").val(response.febrero);
                $("#txtMarzoAcciones").val(response.marzo);
                $("#txtAbrilAcciones").val(response.abril);
                $("#txtMayoAcciones").val(response.mayo);
                $("#txtJunioAcciones").val(response.junio);
                $("#txtJulioAcciones").val(response.julio);
                $("#txtAgostoAcciones").val(response.agosto);
                $("#txtSetiembreAcciones").val(response.setiembre);
                $("#txtOctubreAcciones").val(response.octubre);
                $("#txtNoviembreAcciones").val(response.noviembre);
                $("#txtDiciembreAcciones").val(response.diciembre);
                $("#txtTotalAnualAcciones").val(response.totalAnual);
            //});
        });
};

function updProgramacionAcciones(datos) {

    serviceProgramacionAcciones.updProgramacionAcciones(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                //var anio = parseInt($("#cboAniosAccionesFiltro option:selected").text());
                //var idActividad = parseInt($("#cboActividadOperativaAccionesFiltro").val());
                //var idTareas = parseInt($("#cboTareaAccionesFiltro").val());

                var anio = parseInt($("#txtAnioAcciones").val());
                var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
                var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());

                getCargarGridTareas(anio, idProgramacionActividad);

                getCargarGridAcciones(anio, idProgramacionActividad, idProgramacionTareas);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                $("#modalAcciones").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updProgramacionAcciones', error);
        });
}

function insProgramacionAcciones(datos) {

    serviceProgramacionAcciones.insProgramacionAcciones(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {

                var anio = parseInt($("#txtAnioAcciones").val());
                var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
                var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());

                getCargarGridAcciones(anio, idProgramacionActividad, idProgramacionTareas);

                alertify.success(tituloAlert.seguridad, response.message, () => { });

                //$("#modalAcciones").modal("hide");
                limpiarModalAcciones();
                //var idTareas = parseInt($("#cboCodigoTareasAcciones").val());
                //var idProgramacionActividad = $("#hidProgramacionActividadAcciones").val();
                
                let request = {
                    idProgramacionActividad: idProgramacionActividad,
                    idProgramacionTareas: idProgramacionTareas
                };
                serviceProgramacionAcciones.getProgramacionTareasAccionesPorId(request, headersuarm)
                    .then(response => {

                        $("#txtCodigoAcciones").val(response.codigoAcciones);

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

function delProgramacionAcciones(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO ACTUAL?", "question", (result) => {
        if (result.isConfirmed) {
            serviceProgramacionAcciones.delProgramacionAcciones(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {

                        var anio = parseInt($("#txtAnioAcciones").val());
                        var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
                        var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());
                        getCargarGridAcciones(anio, idProgramacionActividad, idProgramacionTareas);

                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delProgramacionAcciones', error);
                });
        }
    });
}

function grabarAcciones() {

    var idProgramacionAcciones = ($("#hidAcciones").val() == '' ? 0 : parseInt($("#hidAcciones").val()));
    var idAnio = parseInt($("#hAniosPresupuestalAcciones").val()); //parseInt($("#cboAnioAcciones").val());
    var anio = parseInt($("#txtAnioAcciones").val()); //parseInt($("#cboAnioAcciones option:selected").text());

    var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
    var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());    

    var codigoAcciones = $("#txtCodigoAcciones").val();
    var descripcionAcciones = $("#txtDenominacionAcciones").val();

    var idUnidadMedida = parseInt($("#cboUnidadMedidaAcciones").val());

    var representativa = $("#chkRepresentativaAcciones").prop("checked"); // ? 1 : 0;
    var acumulativa = $("#chkAcumulativaAcciones").prop("checked"); // ? 1 : 0;

    var metaFisica = 0;
    var metaFinanciera = 0.0;

    let enero = ($("#txtEneroAcciones").val() == '' ? 0 : parseInt($("#txtEneroAcciones").val()));

    let febrero = ($("#txtFebreroAcciones").val() == '' ? 0 : parseInt($("#txtFebreroAcciones").val()));
        
    let marzo = ($("#txtMarzoAcciones").val() == '' ? 0 : parseInt($("#txtMarzoAcciones").val()));
        
    let abril = ($("#txtAbrilAcciones").val() == '' ? 0 : parseInt($("#txtAbrilAcciones").val()));
        
    let mayo = ($("#txtMayoAcciones").val() == "" ? 0 : parseInt($("#txtMayoAcciones").val()));
        
    let junio = ($("#txtJunioAcciones").val() == "" ? 0 : parseInt($("#txtJunioAcciones").val()));
        
    let julio = ($("#txtJulioAcciones").val() == "" ? 0 : parseInt($("#txtJulioAcciones").val()));
        
    let agosto = ($("#txtAgostoAcciones").val() == "" ? 0 : parseInt($("#txtAgostoAcciones").val()));
        
    let setiembre = ($("#txtSetiembreAcciones").val() == "" ? 0 : parseInt($("#txtSetiembreAcciones").val()));
        
    let octubre = ($("#txtOctubreAcciones").val() == "" ? 0 : parseInt($("#txtOctubreAcciones").val()));
        
    let noviembre = ($("#txtNoviembreAcciones").val() == "" ? 0 : parseInt($("#txtNoviembreAcciones").val()));
        
    let diciembre = ($("#txtDiciembreAcciones").val() == "" ? 0 : parseInt($("#txtDiciembreAcciones").val()));        

    var totalAnual = ($("#txtTotalAnualAcciones").val() == "" ? 0 : parseInt($("#txtTotalAnualAcciones").val()))

    var activo = parseInt($("#cboActivoAcciones").val());
    var flag = $("#flagEditAcciones").val();
    var idEstado = ESTADO; //2;

    if (flag == 1) {   //Editar
        let datos = {
            idProgramacionAcciones: idProgramacionAcciones,
            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            idProgramacionTareas: idProgramacionTareas,
            codigoAcciones: codigoAcciones,
            descripcionAcciones: descripcionAcciones,
            idUnidadMedida: idUnidadMedida,
            representativa: representativa,
            acumulativa: acumulativa,
            metaFisica: metaFisica,
            enero: enero,
            febrero: febrero,
            marzo: marzo,
            abril: abril,
            mayo: mayo,
            junio: junio,
            julio: julio,
            agosto: agosto,
            setiembre: setiembre,
            octubre: octubre,
            noviembre: noviembre,
            diciembre: diciembre,
            totalAnual: totalAnual,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)

        };        
        updProgramacionAcciones(datos);
    } else {    //Nuevo
        let datos = {

            idAnio: idAnio,
            anio: anio,
            idProgramacionActividad: idProgramacionActividad,
            idProgramacionTareas: idProgramacionTareas,
            codigoAcciones: codigoAcciones,
            descripcionAcciones: descripcionAcciones,            
            idUnidadMedida: idUnidadMedida,
            representativa: representativa,
            acumulativa: acumulativa,            
            metaFisica: metaFisica,
            enero: enero,
            febrero: febrero,
            marzo: marzo,
            abril: abril,
            mayo: mayo,
            junio: junio,
            julio: julio,
            agosto: agosto,
            setiembre: setiembre,
            octubre: octubre,
            noviembre: noviembre,
            diciembre: diciembre,
            totalAnual: totalAnual,

            idEstado: idEstado,
            activo: (activo == 1 ? true : false)
        };
        insProgramacionAcciones(datos);
    }
}

//**** Acciones */
function nuevaAccion() {

    limpiarModalAcciones();

    $("#modalAcciones").modal("show");
    $("#flagEditAcciones").val(0);
    $("#mdlTitleAcciones").text("Registrar Datos de Acciones");
    $("#txtEstadoAcciones").prop("disabled", true);
    $("#txtEstadoAcciones").val("Emitido");

    /*fillSelectAnios("cboAnioAcciones", 0, "SELECCIONE", (response) => { });  

    IDPROGRAMACION = $(control).attr("data-id");
    CODIGOPROGRAMACION = $(control).attr("data-codigo");
    var idProgramacionActividad = $(control).attr("data-id");
    var codigoProgramacion = $(control).attr("data-codigo");
    console.log("ID:", idProgramacionActividad);
    console.log("Código:", CODIGOPROGRAMACION);*/

    var idProgramacionActividad = parseInt($("#hidProgramacionActividadAcciones").val());
    var idProgramacionTareas = parseInt($("#hidProgramacionTareasAcciones").val());

    let request = {
        idProgramacionActividad: idProgramacionActividad,
        idProgramacionTareas: idProgramacionTareas
    };
    console.log("request acciones", request);
    //trae el codigo generado 
    serviceProgramacionAcciones.getProgramacionTareasAccionesPorId(request, headersuarm)
        .then(response => {

            $("#txtCodigoAcciones").val(response.codigoAcciones);

        })
        .catch(error => {
            msgException('editProgramacionActividad', error);
        });            

}

function editarAccion(control) {

    $("#modalAcciones").modal("show");
    $("#mdlTitleAcciones").text("Editar Datos de Acciones");
    $("#flagEditAcciones").val(1);
    $("#cboActivoAcciones").prop("disabled", false);
    $("#txtEstadoAcciones").prop("disabled", true);

    var idProgramacionAcciones = $(control).data('input');
    $("#hidAcciones").val(idProgramacionAcciones);

    let request =
    {
        idProgramacionAcciones: idProgramacionAcciones
    }

    //console.log("request", request);
    editProgramacionAcciones(request);
}

function eliminarAccion(control) {
    var idProgramacionAcciones = $(control).data('input');
    let datos = {
        idProgramacionAcciones: idProgramacionAcciones
    };
    delProgramacionAcciones(datos);
}

function limpiarModalAcciones() {

    $("#hidAcciones").val("");
        
    $("#txtDenominacionAcciones").val("");
    $("#chkRepresentativaAcciones").prop("checked", false);
    $("#chkAcumulativaAcciones").prop("checked", false);

    $("#txtEstadoAcciones").val("");
    $("#cboActivoAcciones").val(1);

    $("#cboUnidadMedidaAcciones").prop("disabled", true);

    var idAnio = parseInt($("#hAniosPresupuestalAcciones").val());

    let request = { idAnio: idAnio }

    let idUnidadMedida = $("#hidUnidadMedidaActividad").val()

    fillSelectUnidadMedida("cboUnidadMedidaAcciones", request, idUnidadMedida, "SELECCIONE", (response) => { });    
}
