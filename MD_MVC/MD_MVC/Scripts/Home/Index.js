//Home/Index
//Self executing function here
(function () {
    jQuery('#loaderbody').addClass('hide');

    //En el evento 'ajaxStart' removemos la clase 'hide'
    jQuery(document).bind('ajaxStart', function () {
        jQuery('#loaderbody').removeClass('hide');
        //En el evento 'ajaxStop' asignamos la clase 'hide'
    }).bind('ajaxStop', function () {
        jQuery('#loaderbody').addClass('hide');
    });

    //Asignamos los valores a los controles y manejo de los eventos en el DOM
    var numeroFila = 1;
    $("#btn_agregar_producto").click(function (event) {
        //Validamos algunas cosas :P
        if ($("#Producto_Codigo").val() === null) {
            Mensaje("El código del producto es obligatorio", "error");
            $("#Producto_Codigo").focus();
            return;
        }
        if ($("#Producto_Descripcion").val() === null) {
            Mensaje("La descripción del producto es obligatoria", "error");
            $("#Producto_Descripcion").focus();
            return;
        }
        if ($("#Cantidad").val() <= 0) {
            Mensaje("La cantidad del producto es obligatoria", "error");
            $("#Cantidad").focus();
            return;
        }
        if ($("#Precio").val() <= 0) {
            Mensaje("El precio del producto es obligatorio", "error");
            $("#Precio").focus();
            return;
        }
        if ($("#text_Impuesto").val() < 0) {
            Mensaje("El impuesto del producto es obligatorio", "error");
            $("#text_Impuesto").focus();
            return;
        }

        //Tasa de Impuestos y otros cálculos
        var tasaActual = "1." + $("#text_Impuesto").val();
        var montoPorLinea = parseFloat($("#Cantidad").val()) * parseFloat($("#Precio").val());
        var impuestoCalculado = (montoPorLinea * tasaActual) - montoPorLinea;

        //Creamos la fila a insertar
        var fila = "<tr><td>" + numeroFila +
            "</td><td>" + $("#Producto_Codigo option:selected").text() +
            "</td><td>" + $("#Producto_Descripcion option:selected").text() +
            "</td><td class='text-right'>" + parseFloat($("#Cantidad").val().replace(",", "")) +
            "</td><td class='text-right'>" + parseFloat($("#Precio").val().replace(",", "")) +
            "</td><td class='text-right' id='sumImpuestos'>" + new Intl.NumberFormat('es-DO').format(impuestoCalculado).replace(",", "") +
            "</td><td class='text-right' id='sumMontos'>" + new Intl.NumberFormat('es-DO').format((montoPorLinea + impuestoCalculado)).replace(",", "") +
            "</td><td><a onclick='return BorrarFila(" + numeroFila + ")' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span></a></td></tr>";

        //Procedemos a insertar la fila en la tabla
        InsertarFilaAlaTabla(fila);
        numeroFila++;

        //Limpiamos los controles
        LimpiarControles();

        //Sumar campos
        SumarTabla();
    });

    $("#flecha_izquierda").click(function (event) {
        var id_orden = $("#id_orden").val();
        if (id_orden === "") {
            //Buscamos el último registro
            $.ajax({
                url: "/Home/ConsultarUltimoRegistro",
                type: "GET",
                success: function (resultado) {
                    if (resultado.status) {
                        //Llenamos la interfaz con el objeto que nos llega 
                        LlenarInterfazConRegistro(resultado.encabezado, resultado.detalles);
                    }
                    else {
                        Mensaje("Error al consultar el último registro", "error");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Mensaje("Error en la petición al servidor 1", "error");
                }
            });
        }
        else {
            //Buscamos el registro anterior
            id_orden--;
            $.ajax({
                url: "/Home/ConsultarOrden",
                type: "POST",
                data: { Id: id_orden },
                success: function (resultado) {
                    if (resultado.status) {
                        //Llenamos la interfaz con el objeto que nos llega 
                        LlenarInterfazConRegistro(resultado.encabezado, resultado.detalles);
                    }
                    else {
                        Mensaje("Error al consultar el registro", "error");
                    }
                },
                error: function () {
                    Mensaje("Error en la petición al servidor 2", "error");
                }
            });
        }
    });

    $("#flecha_derecha").click(function (event) {
        var id_orden = $("#id_orden").val();
        if (id_orden === "") {
            //Buscamos el último registro
            $.ajax({
                url: "/Home/ConsultarPrimerRegistro",
                type: "GET",
                success: function (resultado) {
                    if (resultado.status) {
                        //Llenamos la interfaz con el objeto que nos llega 
                        LlenarInterfazConRegistro(resultado.encabezado, resultado.detalles);
                    }
                    else {
                        Mensaje("Error al consultar el último registro", "error");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Mensaje("Error en la petición al servidor 3", "error");
                }
            });
        }
        else {
            //Buscamos el registro anterior
            id_orden++;
            $.ajax({
                url: "/Home/ConsultarOrden",
                type: "POST",
                data: { Id: id_orden },
                success: function (resultado) {
                    if (resultado.status) {
                        //Llenamos la interfaz con el objeto que nos llega 
                        LlenarInterfazConRegistro(resultado.encabezado, resultado.detalles);
                    }
                    else {
                        Mensaje("Error al consultar el registro", "error");
                    }
                },
                error: function () {
                    Mensaje("Error en la petición al servidor 4", "error");
                }
            });
        }
    });

    $("#btn_guardar").click(function (event) {
        //Validamos algunas cosas :p
        if ($("#personas").val() === null) {
            swal({ title: "Debe seleccionar una persona valida", type: "info", animation: false, customClass: 'animated tada' });
            return;
        }
        if ($("#Tipos_de_Orden").val() === null) {
            swal({ title: "Debe seleccionar un tipo de orden valida", type: "info", animation: false, customClass: 'animated tada' });
            return;
        }
        if ($("#condiciones").val() === null) {
            swal({ title: "Debe seleccionar una condición valida para la orden ", type: "info", animation: false, customClass: 'animated tada' });
            return;
        }
        if ($("#txt_fecha").val() === "") {
            //Validamos la fecha
            swal({ title: "Debe seleccionar una fecha valida", type: "info", animation: false, customClass: 'animated tada' });
            return;
        }
        //Validamos que hayan filas insertadas
        if (numeroFila <= 1) {
            swal({ title: "Debe insertar al menos una fila para proceder", type: "info", animation: false, customClass: 'animated tada' });
            return;
        }
        //Preguntamos si desean continuar
        swal({
            title: "Desea continuar?", type: "warning", animation: false, showCancelButton: true, customClass: "animated tada"
        }).then((result) => {
            if (result.value) {
                //Aquí procesamos la respuesta positiva
                $.ajax({
                    url: "/Home/GuardarOrden",
                    data: CrearObjetoDesdeLaInterfaz(),
                    type: "POST",
                    success: function (resultado) {
                        if (resultado.status) {
                            swal({ title: resultado.mensaje, type: "success", animation: false, customClass: 'animated tada' }).then((result) => {
                                if (result.value) {
                                    //Abrimos una nueva ventana para la vista previa da la orden
                                    window.open("../../reportes/frm_reporte.aspx?tipo=1&id=" + resultado.idOrden, "_blank");
                                    //Limpiamos el formulario actual
                                    window.location.href = "";
                                }
                            });
                        }
                        else {
                            swal({ title: resultado.mensaje, type: "error", animation: false, customClass: 'animated hinge' });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        Mensaje("Error en la petición al servidor 5", "error");
                    }
                });
            }
        });
    });

    $("#btn_nuevo").click(function (event) {
        //Preguntamos si desean continuar
        swal({ title: "Desea continuar limpiando todo el formulario?", type: "question", animation: false, showCancelButton: true, customClass: "animated swing" }).then((result) => {
            if (result.value) {
                //Aquí procesamos la respuesta positiva
                window.location.href = "";
            }
        });
    });

    $("#btn_cancel").click(function (event) {
        //Preguntamos si desean continuar
        swal({ title: "Desea continuar cancelando la orden actual?", type: "question", animation: false, showCancelButton: true, customClass: "animated flash" }).then((result) => {
            if (result.value) {
                //Validamos que haya un Id de la orden actual
                var idOrdenActual = $("#id_orden").val();
                if (idOrdenActual === "") {
                    Mensaje("No hay orden para cancelar", "info");
                    return;
                }
                //Procedemos a cancelar la orden actual
                $.ajax({
                    url: "/Home/CancelarOrden",
                    data: { idOrden: idOrdenActual },
                    method: "POST",
                    success: function (resultado) {
                        if (resultado.status) {
                            swal({ title: resultado.mensaje, type: "success", animation: false, showCancelButton: false, customClass: "animated swing" }).then((result) => {
                                if (result.value) {
                                    window.location.href = "";
                                }
                            });
                        }
                        else {
                            Mensaje("No pudimos cancelar el registro actual :(", "error");
                        }
                    },
                    error: function () {
                        Mensaje("Error en la petición al servidor 6", "error");
                    }
                });
            }
        });
    });

    $("#btn_imprimir, #btn_imprimir_carta").click(function (event) {
        var idOrden = $("#id_orden").val();
        if (idOrden === "") {
            Mensaje("No hay orden para imprimir", "info");
            return;
        }
        window.open("../../reportes/frm_reporte.aspx?tipo=1&id=" + idOrden, "_blank");
    });

    $("#btn_listado").click(function (event) {
        //Abrimos el formulario de las ordenes           
        $("#ModalOrdenes").modal("show");
    });

    $("#btn_eliminar").click(function (event) {
        //Preguntamos si desean continuar
        swal({ title: "Desea continuar eliminando la orden actual?", type: "question", animation: false, showCancelButton: true, customClass: "animated rubberBand" }).then((result) => {
            if (result.value) {
                //Validamos que haya un Id de la orden actual
                var idOrdenActual = $("#id_orden").val();
                if (idOrdenActual === "") {
                    Mensaje("No hay orden para eliminar", "info");
                    return;
                }
                //Procedemos a eliminar la orden actual
                $.ajax({
                    url: "/Home/EliminarOrden",
                    data: { idOrden: idOrdenActual },
                    method: "POST",
                    success: function (resultado) {
                        if (resultado.status) {
                            swal({ title: resultado.mensaje, type: "success", animation: false, showCancelButton: false, customClass: "animated swing" }).then((result) => {
                                if (result.value) {
                                    window.location.href = "";
                                }
                            });
                        }
                        else {
                            Mensaje("No pudimos eliminar el registro actual :(", "error");
                        }
                    },
                    error: function () {
                        Mensaje("Error en la petición al servidor 7", "error");
                    }
                });
            }
        });
    });

    $("#btn_resumen").click(function (event) {
        //Abrimos el formulario de las ordenes           
        $("#ModalGraficos").modal("show");
    });

    $("#btn_imprimir_media_carta").click(function (event) {
        var idOrden = $("#id_orden").val();
        if (idOrden === "") {
            Mensaje("No hay orden para imprimir", "info");
            return;
        }
        window.open("../../reportes/frm_reporte.aspx?tipo=2&id=" + idOrden, "_blank");
    });

    $("#btn_imprimir_pos").click(function (event) {
        var idOrden = $("#id_orden").val();
        if (idOrden === "") {
            Mensaje("No hay orden para imprimir", "info");
            return;
        }
        window.open("../../reportes/frm_reporte.aspx?tipo=3&id=" + idOrden, "_blank");
    });

    $("#personas").change(function () {
        $.ajax({
            url: "/Home/DatosDePersona",
            data: { id: $("#personas option:selected").val() },
            type: "POST",
            success: function (resultado) {
                if (resultado.persona !== null) {
                    $("#text_persona").val(resultado.persona.Nombre_Completo + "\n" + resultado.persona.Documento + "\n" + resultado.persona.Tipo_Persona);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Mensaje("Error en la petición al servidor 8", "error");
            }
        });
    });

    $("#Producto_Codigo").change(function () {
        $.ajax({
            url: "/Home/DatosDeProducto",
            data: { id: $("#Producto_Codigo option:selected").val() },
            type: "POST",
            success: function (resultado) {
                if (resultado.producto !== null) {
                    $("#Producto_Descripcion").val(resultado.producto.Id).trigger("change.select2");
                    $("#Cantidad").val("1.00");
                    $("#Precio").val(resultado.producto.Precio);
                    $("#text_Impuesto").val(resultado.producto.Tasa);
                    $("#Cantidad").focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Mensaje("Error en la petición al servidor 9", "error");
            }
        });
    });

    $("#Producto_Descripcion").change(function (event) {
        $.ajax({
            url: "/Home/DatosDeProducto",
            data: { id: $("#Producto_Descripcion option:selected").val() },
            type: "POST",
            success: function (resultado) {
                if (resultado.producto !== null) {
                    $("#Producto_Codigo").val(resultado.producto.Id).trigger("change.select2");
                    $("#Cantidad").val("1.00");
                    $("#Precio").val(resultado.producto.Precio);
                    $("#text_Impuesto").val(resultado.producto.Tasa);
                    $("#Cantidad").focus();
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Mensaje("Error al realizar la petición al servidor", "error");
            }
        });
    });

    $("#btn_enviar_correo").click(function (event) {        
        //Validamos que haya un id en contexto
        var idActual = $("#id_orden").val();
        if (idActual === "") {
            Mensaje("No hay documento en contexto para enviar", "info");
            return;
        }
        //Realizamos el envío por AJAX
        $.ajax({
            url: "/Home/EnviarCorreo",
            data: { id: idActual },
            type: "POST",
            success: function (resultado) {
                if (resultado.status) {
                    Mensaje("Correo enviado!", "success");
                }
                else {
                    Mensaje(resultado.mensaje, "info");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Mensaje("Error en la petición al servidor 10", "error");
            }
        });
    });
})();

function SumarTabla() {
    var impuestosTotal = 0;
    var granTotal = 0;
    $("[id*=sumImpuestos]").each(function () {
        impuestosTotal = impuestosTotal + parseFloat($(this).html());
    });
    $("[id*=sumMontos]").each(function () {
        granTotal = granTotal + parseFloat($(this).html());
    });

    $("#txt_subtotal").val(new Intl.NumberFormat('es-DO').format(granTotal - impuestosTotal));
    $("#txt_impuestos").val(new Intl.NumberFormat('es-DO').format(impuestosTotal));
    $("#txt_total").val(new Intl.NumberFormat('es-DO').format(granTotal));
}

function LimpiarControles() {
    $("#Cantidad").val("0.00");
    $("#Precio").val("0.00");
    $("#text_Impuesto").val("0.00");
    $("#Productos_Referencia").val(null);
    $("#Productos_Descripcion").val(null);
}

function InsertarFilaAlaTabla(fila) {
    $("#tablaDetalle").children("tbody").append(fila);
}

function CrearObjetoDesdeLaInterfaz() {
    var datos = {
        persona: $("#personas").val(),
        tipo_de_orden: $("#Tipos_de_Orden").val(),
        fecha: $("#txt_fecha").val(),
        detalles: $("#tablaDetalle").tableToJSON(),
        subTotal: $("#txt_subtotal").val(),
        impuestos: $("#txt_impuestos").val(),
        total: $("#txt_total").val(),
        comentarios: $("#comentarios").val(),
        condiciones: $("#condiciones").val()
    };
    return datos;
}

function LlenarInterfazConRegistro(encabezado, detalles) {
    $("#personas").val(encabezado.Id_Persona).trigger("change");
    $("#Tipos_de_Orden").val(encabezado.Id_Tipo).trigger("change");
    var milisegundos = parseInt(encabezado.Fecha.replace("/Date(", "").replace(")/", ""));
    $("#txt_fecha").removeAttr("type");
    $("#txt_fecha").val(new Date(milisegundos).toLocaleDateString("es-DO"));
    $("#id_orden").val(encabezado.Id);
    $("#condiciones").val(encabezado.Id_Condiciones).trigger("change");
    $("#txt_subtotal").val(parseFloat(encabezado.Subtotal).toFixed(2));
    $("#txt_impuestos").val(parseFloat(encabezado.Impuestos).toFixed(2));
    $("#txt_total").val(parseFloat(encabezado.Total).toFixed(2));
    $("#comentarios").val(encabezado.Comentario);

    $("#tablaDetalle").children("tbody").children("tr").remove();
    for (var i = 0; i < detalles.length; i++) {
        var fila = "<tr>" +
            "<td>" + i + "</td>" +
            "<td>" + detalles[i].Id_Producto + "</td>" +
            "<td>" + detalles[i].Descripcion + "</td>" +
            "<td class='text-right'>" + parseFloat(detalles[i].Cantidad).toFixed(2) + "</td>" +
            "<td class='text-right'>" + parseFloat(detalles[i].Precio).toFixed(2) + "</td>" +
            "<td class='text-right'>" + parseFloat(detalles[i].Impuesto).toFixed(2) + "</td>" +
            "<td class='text-right'>" + parseFloat(detalles[i].Monto).toFixed(2) + "</td>" +
            "</tr>"
        InsertarFilaAlaTabla(fila);
    }
}

function Mensaje(mensaje, tipo) {
    switch (tipo) {
        case "error":
            swal({ title: mensaje, type: tipo, animation: false, customClass: 'animated zoomIn' });
            break;
        case "success":
            swal({ title: mensaje, type: tipo, animation: false, customClass: 'animated zoomInDown' });
            break;
        case "info":
            swal({ title: mensaje, type: tipo, animation: false, customClass: 'animated zoomInUp' });
            break;
        case "warning":
            swal({ title: mensaje, type: tipo, animation: false, customClass: 'animated tada' });
            break;
        default:
            swal({ title: mensaje });
            break;
    }
}