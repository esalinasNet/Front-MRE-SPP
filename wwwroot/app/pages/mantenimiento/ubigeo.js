const API_URL = basePath.sgeoAPi;
var ESTADO = 1;
var SELECIONADO = 1;
var VAL_UBIGEO = "";

function inicializarCombosUbigeo() {
    $("#cboUbigeoProvinciaFiltro").prop("disabled", true);
    $("#cboUbigeoDistritoFiltro").prop("disabled", true);

    fillSelectUbigeoDepartamento("cboUbigeoDepartamentoFiltro", "", "SELECCIONE", (response) => {
        listarUbigeo();
    });
}
$(function () {
    $("#cboUbigeoProvinciaFiltro").prop("disabled", true);
    $("#cboUbigeoDistritoFiltro").prop("disabled", true);
        
    validarLogin((response) => {
        console.log("response", response);
        if (response)

            inicializarCombosUbigeo();
            
    });
    $("#btnBuscar").click(function () {
        listarUbigeo();
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

    var depa = document.getElementById("cboUbigeoDepartamentoFiltro");
    depa.addEventListener("change", function () {
        $("#cboUbigeoProvinciaFiltro").prop("disabled", false);

        var departamento = $("#cboUbigeoDepartamentoFiltro").val();

        fillSelectUbigeoProvincia("cboUbigeoProvinciaFiltro", 0, "TODOS", departamento, function () { });
        listarUbigeo();
    });

    var prov = document.getElementById("cboUbigeoProvinciaFiltro");
    prov.addEventListener("change", function () {
        $("#cboUbigeoDistritoFiltro").prop("disabled", false);

        var departamento = $("#cboUbigeoDepartamentoFiltro").val();
        provincia = $("#cboUbigeoProvinciaFiltro").val();
        fillSelectUbigeoDistrito("cboUbigeoDistritoFiltro", 0, "TODOS", departamento, provincia, function () { });
        listarUbigeo();
    });

    var dis = document.getElementById("cboUbigeoDistritoFiltro");
    dis.addEventListener("change", function () {
        listarUbigeo();
    });
           
    mantenimientoUbigeo()

    var Ubigeodepa = document.getElementById("cboDepartamento");
    Ubigeodepa.addEventListener("change", function () {
        $("#cboProvincia").prop("disabled", false);

        var departamento = $("#cboDepartamento").val();

        fillSelectUbigeoProvincia("cboProvincia", 0, "TODOS", departamento, function () { });

    });

});

function mantenimientoUbigeo() {

    //Funcinabilidad del CheckPoint
    const txtDepartamento = document.getElementById("txtDepartamento");
    const txtProvincia = document.getElementById("txtProvincia");
    const txtDistrito = document.getElementById("txtDistrito");
    const cboDepartamento = document.getElementById("cboDepartamento");
    const rowUbigeoDepartamento = document.getElementById("rowUbigeoDepartamento");

    function resetInputs() {
        txtDepartamento.disabled = true;
        txtProvincia.disabled = true;
        txtDistrito.disabled = true;

        txtDepartamento.required = false;
        txtProvincia.required = false;
        txtDistrito.required = false;

        rowUbigeoDepartamento.style.display = "none";
        rowUbigeoProvincia.style.display = "none";
        rowProvincia.style.display = "none";
        rowDistrito.style.display = "none";
        cboDepartamento.required = false;
    }

    // Estado inicial: Departamento seleccionado
    resetInputs();
    txtDepartamento.disabled = false;
    txtDepartamento.required = true;
    document.getElementById("rdbDepartamento").checked = true;

    // Escuchar cambios en los radios
    document.querySelectorAll('input[name="tipoIngreso"]').forEach(radio => {
        radio.addEventListener('change', function () {
            resetInputs();
            if (this.value === "1") { // Departamento
                txtDepartamento.disabled = false;
                txtDepartamento.required = true;
                rowDepartamento.style.display = "block";
                SELECIONADO = 1;

            } else if (this.value === "2") { // Provincia
                txtProvincia.disabled = false;
                txtProvincia.required = true;
                rowUbigeoDepartamento.style.display = "block";
                rowProvincia.style.display = "block";
                rowDepartamento.style.display = "none";
                cboDepartamento.required = true;
                SELECIONADO = 2;

            } else if (this.value === "3") { // Distrito
                txtDistrito.disabled = false;
                txtDistrito.required = true;
                cboDepartamento.required = true;
                cboProvincia.required = true;
                rowUbigeoDepartamento.style.display = "block";
                rowUbigeoProvincia.style.display = "block";
                rowDistrito.style.display = "block";
                rowProvincia.style.display = "block";
                rowDepartamento.style.display = "none";
                rowProvincia.style.display = "none";
                SELECIONADO = 3;
            }
        });
    });
}
function listarUbigeo() {
    getUbigeo()
}
function getUbigeo() {

    let request =
    {        
        //departamento: $("#cboUbigeoDepartamentoFiltro").val(),
        departamento: ($("#cboUbigeoDepartamentoFiltro").val() && $("#cboUbigeoDepartamentoFiltro").val().trim() !== "")
            ? $("#cboUbigeoDepartamentoFiltro").val().trim()
            : null,        

        //provincia: $("#cboUbigeoProvinciaFiltro").val(),
        provincia: ($("#cboUbigeoProvinciaFiltro").val() && $("#cboUbigeoProvinciaFiltro").val().trim() !== "")
            ? $("#cboUbigeoProvinciaFiltro").val().trim()
            : null,        

        //distrito: $("#cboUbigeoDistritoFiltro").val(),
        distrito: ($("#cboUbigeoDistritoFiltro").val() && $("#cboUbigeoDistritoFiltro").val().trim() !== "")
            ? $("#cboUbigeoDistritoFiltro").val().trim()
            : null,        

        //descripcion: ($("#txtDescripcionFiltro").val() && $("#txtDescripcionFiltro").val().trim() !== "")
        //    ? $("#txtDescripcionFiltro").val().trim()
        //    : null,        

        estadoDescripcion: ($("#txtEstadoFiltro").val() && $("#txtEstadoFiltro").val() !== "")
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

    $("#grid").DataTable().clear();
    $('#grid').DataTable({
        processing: true,
        serverSide: true,
        ajax: function (d, cb) {

            request.draw = d.draw
            request.paginaActual = ((d.start / d.length) + 1)
            request.tamanioPagina = d.length

            serviceUbigeo.getUbigeoPaginado(request, headersuarm)  //cambiar
                .then(response => {
                    cb(response)
                }).catch(error => msgException('getUbigeo', error));

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
                data: 'idUbigeo',
                render: function (data, type, row, meta) {
                    return row.registro;
                }
            },
            { data: 'ubigeo' },
            { data: 'departamento' },
            { data: 'provincia' },
            { data: 'distrito' },
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
                //data: 'idUbigeo',
                data: 'ubigeo',
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

function editUbigeo(request) {
    limpiarModal();

    serviceUbigeo.getUbigeoDepartamentoPorId(request, headersuarm)
        .then(response => {

            let departamento = VAL_UBIGEO.substr(0, 2);

            $("#cboDepartamento").prop("disabled", true);
            fillSelectUbigeoDepartamento("cboDepartamento", departamento, "SELECCIONE", (termino) => { });

                $("#hcodigo").val(response.idUbigeo);                                
                $("#txtDepartamento").val(response.departamento);
                $("#txtEstado").val(response.estadoDescripcion);

                let activo = response.activo;                
                if (activo === true) activo = "1";
                if (activo === false) activo = "0";

                $("#cboActivo").val(String(activo));

                ESTADO = response.estado;
            //});
        })
        .catch(error => {
            msgException('editUbigeo', error);
        });

    serviceUbigeo.getUbigeoProvinciaPorId(request, headersuarm)
        .then(response => {

            let departamento = String(VAL_UBIGEO.substr(0, 2));
            let provincia = String(VAL_UBIGEO.substr(2, 2));

            console.log("depa", departamento, "", provincia, "", response);

            $("#cboDepartamento").prop("disabled", true);
            
            fillGetUbigeoProvincia("cboProvincia", response.idUbigeo, "TODOS", departamento, provincia, function () {
                $("#cboProvincia").val(response.ubigeo);
            });

            $("#hcodigo").val(response.idUbigeo);
            $("#txtProvincia").val(response.provincia);
            $("#txtEstado").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "1";
            if (activo === false) activo = "0";

            $("#cboActivo").val(String(activo));

            ESTADO = response.estado;
            //});
        })
        .catch(error => {
            msgException('editUbigeo', error);
        });

    serviceUbigeo.getUbigeoDistritoPorId(request, headersuarm)
        .then(response => {

            let departamento = String(VAL_UBIGEO.substr(0, 2));
            let provincia = String(VAL_UBIGEO.substr(2, 2));

            $("#cboDepartamento").prop("disabled", true);
            $("#cboProvincia").prop("disabled", true);

            console.log("depa Dis", departamento, "", provincia, "", response);

            $("#hcodigo").val(response.idUbigeo);

            //fillGetUbigeoProvincia("cboProvincia", response.ubigeo, "SELECCIONE", (response) => { });
            $("#txtDistrito").val(response.distrito);
            $("#txtEstado").val(response.estadoDescripcion);

            let activo = response.activo;
            if (activo === true) activo = "1";
            if (activo === false) activo = "0";

            $("#cboActivo").val(String(activo));

            ESTADO = response.estado;
            //});
        })
        .catch(error => {
            msgException('editUbigeo', error);
        }); 
}
function updUbigeo(datos) {

    console.log("llega datos", datos);

    serviceUbigeo.updUbigeo(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");
            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updUbigeo', error);
        });
}

function updUbigeoDepartamento(datos) {
    
    serviceUbigeo.updUbigeoDepartamento(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updUbigeo', error);
        });
}

function updUbigeoProvincia(datos) {

    serviceUbigeo.updUbigeoProvincia(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updUbigeo', error);
        });
}

function updUbigeoDistrito(datos) {

    serviceUbigeo.updUbigeoDistrito(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('updUbigeo', error);
        });
}

function insUbigeo(datos) {

    serviceUbigeo.insUbigeo(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insUbigeo', error);
        });
}

function insUbigeoDepartamento(datos) {

    serviceUbigeo.insUbigeoDepartamento(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insUbigeo', error);
        });
}

function insUbigeoProvincia(datos) {

    serviceUbigeo.insUbigeoProvincia(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insUbigeo', error);
        });
}

function insUbigeoDistrito(datos) {

    serviceUbigeo.insUbigeoDistrito(datos, headersuarm)
        .then(response => {
            if (response.result > 0) {
                getUbigeo();
                alertify.success(tituloAlert.seguridad, response.message, () => { });
                $("#modalRegistro").modal("hide");

                inicializarCombosUbigeo();

            } else {
                alertify.error(tituloAlert.seguridad, response.message, () => { });
            }
        })
        .catch(error => {
            msgException('insUbigeo', error);
        });
}
function delUbigeo(datos) {
    alertify.confirm("Aviso", "¿ESTÁ SEGURO DE ELIMINAR EL REGISTRO DE AÑO?", "question", (result) => {
        if (result.isConfirmed) {
            serviceUbigeo.delUbigeo(datos, headersuarm)
                .then(response => {
                    if (response.result > 0) {
                        getUbigeo();
                        alertify.success(tituloAlert.seguridad, response.message, () => { });

                    } else {
                        alertify.error(tituloAlert.seguridad, response.message, () => { });
                    }
                })
                .catch(error => {
                    msgException('delUbigeo', error);
                });
        }
    });
}

function grabar() {

    var codigo = ($("#hcodigo").val() == '' ? 0 : parseInt($("#hcodigo").val()));
    var flag = $("#flagEdit").val();

    //var idUbigeo = parseInt($("#cboUbigeo").val());
    var valdepartamento = $("#cboDepartamento").val();    
    var valprovincia = $("#cboProvincia").val();        

    var txtdepartamento = $("#txtDepartamento").val();
    var txtprovincia = $("#txtProvincia").val();
    var txtdistrito = $("#txtDistrito").val();

    var activo = parseInt($("#cboActivo").val());    
    var idEstado = ESTADO; //2;

    //console.log("EDITAR", flag);

    if (flag == 1) {

        if (SELECIONADO == 1) {
            let datos = {
                idUbigeo: codigo,
                departamento: VAL_UBIGEO.substr(0,2),
                descripcion: txtdepartamento,
                idEstado: idEstado,
                activo: (activo == 1 ? true : false)
            };
            
            updUbigeoDepartamento(datos);
        }

        if (SELECIONADO == 2) {
            let datos = {
                idUbigeo: codigo,
                departamento: VAL_UBIGEO.substr(0, 2),
                provincia: VAL_UBIGEO.substr(2, 2),
                descripcion: txtprovincia,
                idEstado: idEstado,
                activo: (activo == 1 ? true : false)
            };

            updUbigeoProvincia(datos);
        }

        if (SELECIONADO == 3) {
            let datos = {
                idUbigeo: codigo,
                departamento: VAL_UBIGEO.substr(0, 2),
                provincia: VAL_UBIGEO.substr(2, 2),
                distrito: VAL_UBIGEO.substr(4, 2),
                descripcion: txtdistrito,
                idEstado: idEstado,
                activo: (activo == 1 ? true : false)
            };

            updUbigeoDistrito(datos);
        }
    } else {
        
        if (SELECIONADO == 1)
        {
            let datos = {
                descripcion: txtdepartamento,
                idEstado: idEstado
            };
            insUbigeoDepartamento(datos);
        }
        if (SELECIONADO == 2)
        {
            let datos = {
                departamento: valdepartamento,
                descripcion: txtprovincia,
                idEstado: idEstado
            };
            insUbigeoProvincia(datos);
        }
        if (SELECIONADO == 3) {
            let datos = {
                departamento: valdepartamento,
                provincia: valprovincia,
                descripcion: txtdistrito,
                idEstado: idEstado
            };
            insUbigeoDistrito(datos);
        }
    }

}

function eliminar(control) {
    var codigo = $(control).data('input');
    let datos = {
        idUbigeo: codigo
    };
    delUbigeo(datos);
}

function editar(control) {

    $("#modalRegistro").modal("show");

    $("#mdlTitle").text("Editar departamento");

    $("#flagEdit").val(1);
    $("#cboActivo").prop("disabled", false);
    $("#txtEstado").prop("disabled", true);

    //var id = $(control).data('input');
    var codigoubigeo = $(control).data('input');
    VAL_UBIGEO = String(codigoubigeo);  //pasamos el vaalor de ubigeo "270101"

    console.log("VAL_UBIGEO ->", VAL_UBIGEO)
    let request =
    {
        //idUbigeo: id
        ubigeo: codigoubigeo
    }

    editUbigeo(request);
}

function nuevo() {
    limpiarModal();    

    $("#modalRegistro").modal("show");

    $("#cboActivo").prop("disabled", true);

    $("#flagEdit").val(0);
    $("#mdlTitle").text("Registrar nuevo Departamento");
    $("#txtEstado").prop("disabled", true);
    $("#txtEstado").val("Emitido");

    fillSelectUbigeoDepartamento("cboDepartamento", 0, "SELECCIONE", (response) => { });
    fillSelectUbigeoProvincia("cboProvincia", 0, "SELECCIONE", (response) => { });
        
}

function limpiarModal() {
    $("#hcodigo").val("");

    $("#txtDepartamento").val("");
    $("#txtProvincia").val("");
    $("#txtDistrito").val("");

    $("#txtEstado").val("");
    $("#cboActivo").val(1);

}

function limpiarFiltros() {   
    $("#cboSituacionFiltro").val(1);
    fillSelectUbigeoDepartamento("cboUbigeoDepartamentoFiltro", "", "SELECCIONE", (response) => { });
    fillSelectUbigeoProvincia("cboUbigeoProvinciaFiltro", "", "SELECCIONE", (response) => { });
    fillSelectUbigeoDistrito("cboUbigeoDistritoFiltro", "", "SELECCIONE", (response) => { });
    $("#cboUbigeoProvinciaFiltro").prop("disabled", true);
    $("#cboUbigeoDistritoFiltro").prop("disabled", true);
    listarUbigeo();
}

