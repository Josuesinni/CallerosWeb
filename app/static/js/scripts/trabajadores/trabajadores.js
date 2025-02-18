
$(document).on("click", ".update-trabajador", function () {
    var idCita = $(this).data('id');
    fetch('/api/trabajador/info_trabajador?id=' + idCita).then(response => response.json()).then(data => {
        $(".modal-body #id-t-u").val(data[0]);
        $(".modal-body #nombre-t-u").val(data[1]);
        $(".modal-body #ap-pat-t-u").val(data[2]);
        $(".modal-body #ap-mat-t-u").val(data[3]);
        $(".modal-body #rol-t-u").val(data[4]);
    })
});
$(document).on("click", ".delete-trabajador", function () {
    var idCita = $(this).data('id');
    console.log(idCita)
    $("#id-t-d").val(Number(idCita));
});
$("#buscar-trabajador").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#tabla-trabajadores tr").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


$("#nombre_trabajador_historial_prestamo").on('change', '', function (e) {
    getPrestamos().then(cargarListaPrestamos);
})
getPrestamos().then(cargarListaPrestamos);
async function getPrestamos(){
    let response = await fetch('/api/data/prestamos?id='+$("#nombre_trabajador_historial_prestamo").val());
    let datos = await response.json();
    return datos;
}
function cargarListaPrestamos(datos){
    const tbody = document.querySelector('#tbody_prestamos');
    let contenidoTabla='';
    datos.forEach(dato=>{
        contenidoTabla+=
        `<tr>
        <td scope='row'>$${dato[1]}</td>
        <td scope='row'>${dato[0].slice(0,10)}</td>
        <td scope='row'></td>
        <td scope='row'>
        <button class='btn-sm btn-primary update-trabajador' data-bs-toggle='modal' data-bs-target='#updatePrestamo' data-id=''><i class='bi bi-pencil-fill'></i></button>
        <button class='btn-sm btn-danger delete-trabajador' data-bs-toggle='modal' data-bs-target='#deletePrestamo' data-id=''><i class='bi bi-trash3-fill'></i></button>
        </td>
        </tr>`
    });
    tbody.innerHTML=contenidoTabla;
}



function getData() {
    const tbody = document.querySelector('#tbody');
    fetch('/api/data/trabajadores').then(response => response.json()).then(data => {
        data.forEach(trabajador => {
            tbody.innerHTML += "<tr>" +
                "<td scope='row'>" + trabajador[1] + "</td>" +
                "<td scope='row'>" + trabajador[2] + "</td>" +
                "<td scope='row'>" + trabajador[3] + "</td>" +
                "<td scope='row'>" + trabajador[4] + "</td>" +
                "<td scope='row'>" + trabajador[5] + "</td>" +
                "<td scope='row'>" +
                "<button class='btn-sm btn-primary update-trabajador' data-bs-toggle='modal' data-bs-target='#updateTrabajador' data-id='" + trabajador[0] + "'><i class='bi bi-pencil-fill'></i></button>" +
                "<button class='btn-sm btn-danger delete-trabajador' data-bs-toggle='modal' data-bs-target='#deleteTrabajador' data-id='" + trabajador[0] + "'><i class='bi bi-trash3-fill'></i></button>" +
                "</td>" +
                "</tr>";
        });
    });
}
getData();