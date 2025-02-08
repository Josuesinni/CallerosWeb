
function cargarControladoresTrabajos(dataClientes){
    $("#nombre_cliente_trabajo_a").on('change', '', function (e) {
        const valor = parseFloat(this.value);
        if (!isNaN(valor)) {
            $("#telefono_cliente_trabajo_a").val(dataClientes[valor].telefono).attr("readonly", "readonly");
        } else {
            $("#telefono_cliente_trabajo_a").val('').removeAttr("readonly");
        }
    });
}

$(document).ready(function () {
    $("#responsables_trabajo_u").select2({
        width: '100%',
        dropdownParent: $('#infoTrabajo'),
        tags: true
    });
    $(document).on("click", ".event-trabajo", function () {
        var idTrabajo = $(this).data('id');
        fetch('/api/trabajo/informacion_trabajo?id=' + idTrabajo).then(response => response.json()).then(data => {
            $(".modal-body #fecha_trabajo_u").val(new Date(data.datos_trabajo[6]).toISOString().substring(0, 10));
            $(".modal-body #clave_trabajo_u").val(data.datos_trabajo[0]);
            $(".modal-body #clave_cliente_u").val(data.datos_trabajo[1]);
            $(".modal-body #nombre_cliente_trabajo_u").val(data.datos_trabajo[2]);
            $(".modal-body #telefono_cliente_trabajo_u").val(data.datos_trabajo[3]);
            $(".modal-body #descripcion_trabajo_u").val(data.datos_trabajo[5]);
            $(".modal-body #datos_auto_trabajo_u").val(data.datos_trabajo[4]);
            $(".modal-body #pago_trabajo_u").val(data.datos_trabajo[8]);
            var selectedValues = new Array();
            for (let index = 0; index < data.datos_responsable.length; index++) {
                selectedValues[index]=data.datos_responsable[index]
            }
            $("#responsables_trabajo_u").val(selectedValues).trigger('change');
        })
    });
});