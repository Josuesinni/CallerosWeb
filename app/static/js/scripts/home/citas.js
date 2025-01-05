
async function getListaClientes() {
    let response = await fetch('/api/cliente/lista-clientes');
    let listaClientes = await response.json();
    return listaClientes;
}
getListaClientes().then(cargarClientes).catch(error=>console.log(error));

async function getListaCitasSinAgendar() {
    let response = await fetch('/api/cita/citas_sin_agendar');
    let citasSinAgendar = await response.json();
    return citasSinAgendar;
}
getListaCitasSinAgendar().then(cargarCitasSinAgendar).catch(error=>console.log(error));

let dataClientes = [{ 'id': '', 'text': '', 'telefono': '' }];

function cargarClientes(listaClientes){
    for (cliente of listaClientes) {
        dataClientes.push({ 'id': cliente[0], 'text': cliente[1], 'telefono': cliente[2] });
    }
    let configSelect2 = {
        theme: 'bootstrap-5',
        placeholder: "Ingresa el nombre del cliente...",
        tags: true,
        width: '100%',
        data: dataClientes
    }
    configSelect2.dropdownParent = $('#addCita')
    $("#nombre_cliente_cita_a").select2(configSelect2);
    configSelect2.dropdownParent = $('#addTrabajo')
    $("#nombre_cliente_trabajo_a").select2(configSelect2);
    cargarControladoresCita(dataClientes);
    cargarControladoresTrabajos(dataClientes);
}
function cargarCitasSinAgendar(citas){
    const tbody = document.querySelector('#citas_sin_agendar');
    citas.forEach(cita => {
        tbody.innerHTML += `<tr>
            <td scope='row'> ${cita[1]} </td>
            <td scope='row'> ${cita[2]} </td>
            <td scope='row'> ${cita[3]} </td>
            <td scope='row'> <input type='date' class='form-control new-date' id='fecha_cita_${cita[0]}' data-id='${cita[0]}'> </td>
            </tr>`;
    });
    let fechas=document.querySelectorAll(".new-date");
    $(fechas).on('input', function() {
        fechas.forEach(fecha=>{
            let date=new Date($(fecha).val());
            if(date.getUTCFullYear()>=new Date().getUTCFullYear()){
                $('#fecha_modal').text($(fecha).val());
                $('#id_cita_sin_agendar').val($(fecha).data('id'));
                $('#fecha_cita_sin_agendar').val($(fecha).val());
                $('#updateFecha').modal('show');
            }
        });
    });
    
}

function cargarControladoresCita(dataClientes){
    $("#nombre_cliente_cita_a").on('change', '', function (e) {
        const valor = parseFloat(this.value);
        if (!isNaN(valor)) {
            $("#telefono_cliente_cita_a").val(dataClientes[valor].telefono).attr("readonly", "readonly");
        } else {
            $("#telefono_cliente_cita_a").val('').removeAttr("readonly");
        }
    });

    $("#agendar_cita").on('change', '', function (e) {
        if (this.value === '0') {
            $("#form-fecha").attr("hidden", "hidden");
        } else {
            $("#form-fecha").removeAttr("hidden");
        }
    });
}

$(document).on("click", ".event-cita", function () {
    const idCita = $(this).data('id');
    fetch('/api/cita/informacion_cita?id=' + idCita).then(response => response.json()).then(data => {
        $(".modal-body #id_cita_u").val(idCita);
        $(".modal-body #fecha_cita_u").val(new Date(data[4]).toISOString().substring(0, 10));
        $(".modal-body #nombre-cliente-ic").val(data[1]);
        $(".modal-body #telefono-ic").val(data[2]);
        $(".modal-body #descripcion_cita_u").val(data[3]);
        $(".modal-body #estatus_cita_u").val(data[5]);
    })
});