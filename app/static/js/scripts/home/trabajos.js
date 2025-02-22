
function cargarControladoresTrabajos(dataClientes) {
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
    $("#responsables_trabajo_a").select2({
        width: '100%',
        dropdownParent: $('#addTrabajo'),
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
            $("#id_trabajo_trabajadores").val(data.datos_trabajo[0]);
            $("#fecha_ing_responsable").val(new Date(data.datos_trabajo[6]).toISOString().substring(0, 10));
            actualizarResponsables();
        })
    });
});


//form.addEventListener("submit", actualizarResponsables);

$(document).ready(function () {
    $(document).on("submit", ".formDeleteResponsable", function (event) {
        event.preventDefault();  // Evita la recarga de la página
        var url_form = $(this).data('action');
        var formData = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: url_form,
            data: formData,
            success: function (response) {
                if (response.status) {
                    actualizarResponsables(); // Refresca la tabla sin recargar la página
                } else {
                    console.log("Algo falló");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", error);
            }
        });
    });
    $("#formAddResponsable").submit(function (event) {
        event.preventDefault();
        url_form = $(this).data('action');
        var formData = $(this).serialize();
        console.log(formData);
        $.ajax({
            type: 'POST',
            url: url_form,
            data: formData,
            success: function (response) {
                if (response.status) {
                    actualizarResponsables();
                } else {
                    console.log("Algo fallo")
                }
            },
            error: function (xhr, status, error) {
                console.log(error)
            }
        });
    });
    
})



function actualizarResponsables() {
    var idTrabajo = $("#id_trabajo_trabajadores").val();
    console.log(idTrabajo)
    fetch('/api/trabajo/get_responsables?id=' + idTrabajo).then(response => response.json()).then(data => {
        const tbody = document.querySelector("#table_responsables_trabajo");
        let selectResponsables = document.querySelector("#responsables_trabajo");
        tbody.innerHTML = '';
        let contenidoTabla = '';
        data.responsables.forEach(row => {
            const option = selectResponsables.querySelector(`option[value="${row[1]}"]`);
            console.log(row);
            let filas = '';
            filas += `<td>${row[2]}</td>`
            filas += `<td>${option.text}</td>`
            filas += `<td>
            <form data-action="/api/trabajo/delete_responsable_trabajo" method="post" class="formDeleteResponsable">
                <input type="number" hidden="hidden" name="id_registro" id="id_registro" value="${row[0]}">
                <input type="text" hidden="hidden" name="id_trabajador" id="id_trabajador" value="${row[1]}">
                <button type="submit" class="btn btn-danger"><i class="bi bi-trash"></i></button>
            </form>
            </td>`
            contenidoTabla += `<tr>${filas}</tr>`;
        });
        tbody.innerHTML = contenidoTabla;
    })
}