//cargar_trabajos();

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
let selEmpleado = document.getElementById("empleados")
$("#empleados").on('change', '', function (e) {
    getInformacionPago().then(cargarTrabajos);
})
getInformacionPago().then(cargarTrabajos);
let informacionPago;
async function getInformacionPago() {
    let responses;
    const urls = [
        '/api/data/trabajos-realizados?id=' + $("#empleados").val(),
        '/api/data/prestamos?id=' + $("#empleados").val()
    ]
    try {
        responses = await Promise.all(urls.map(url => fetch(url)));
        informacionPago = await Promise.all(responses.map(res => res.json()));
        console.log(informacionPago);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function cargarTrabajos() {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = '';
    let contenidoTabla = '';
    informacionPago[0].forEach(trabajo => {
        let da = new Date(trabajo[0]);
        let diaSemana = new Date(da.getUTCFullYear(), da.getUTCMonth(), da.getUTCDate(), 0, 0, 0);
        contenidoTabla +=
            `<tr>
        <td scope='row'>${diasSemana[diaSemana.getDay()] + " " + diaSemana.toLocaleDateString()}</td>
        <td scope='row'>${trabajo[1]}</td>
        <td scope='row'>${trabajo[2]}</td>
        <td scope='row'>${trabajo[3]}</td>
        <td scope='row'>$${trabajo[5]}</td>
        <td scope='row'>
            $<span>${trabajo[7]}</span>
        </td>
        <td scope='row'>
            <div class='input-group'>
                <span class='input-group-text'>$</span>
                <input type='text' hidden class='form-control clave-trabajo' value=${trabajo[6]}>
                <input type='text' class='form-control pago-trabajador' value=${trabajo[4]}>
            </div>
        </td>
        <td scope='row'>
            <input type="checkbox" class="form-check-input check-pago-total" data-value="1">
        </td>
        </tr>`
    });
    tbody.innerHTML = contenidoTabla;
    cargarPrestamos();
}
function cargarPrestamos() {
    const tbody = document.querySelector('#tbody');
    let contenidoTabla = '';

    informacionPago[1].forEach(prestamo => {
        let da = new Date(prestamo[0]);
        let diaSemana = new Date(da.getUTCFullYear(), da.getUTCMonth(), da.getUTCDate(), 0, 0, 0);
        contenidoTabla +=
            `<tr>
        <td scope='row'>${diasSemana[diaSemana.getDay()] + " " + diaSemana.toLocaleDateString()}</td>
        <td scope='row'></td>
        <td scope='row'>Prestamo</td>
        <td scope='row'>${prestamo[2]}</td>
        <td scope='row'>$${prestamo[1]}</td>
        <td scope='row'>
            $<span>${prestamo[4]}</span>
        </td>
        <td scope='row'>
            <div class='input-group'>
                <span class='input-group-text'>$</span>
                <input type='text' hidden class='form-control clave-prestamo' value=${prestamo[3]}>
                <input type='text' class='form-control pago-prestamo' value=${prestamo[1]-prestamo[4]}>
            </div>
        </td>
        </tr>`
    });
    tbody.innerHTML += contenidoTabla;
    let total = getTotal();
    document.getElementById('total_pago').setAttribute("value", total);
    document.getElementById('total_pagar').setAttribute("value", total);
    asig();
    $("#clave_trabajador").val($("#empleados option:selected").val());
    $("#nombre_trabajador").val($("#empleados option:selected").text());
}
function asig() {
    $('.pago-trabajador').on('input', function () {
        let total = getTotal();
        document.getElementById('total_pago').setAttribute("value", total);
        document.getElementById('total_pagar').setAttribute("value", total);
    });
    $('.pago-prestamo').on('input', function () {
        let total = getTotal();
        document.getElementById('total_pago').setAttribute("value", total);
        document.getElementById('total_pagar').setAttribute("value", total);
    });
}


// this is the id of the form
$("#registrarPagoTrabajador").submit(function (e) {
    e.preventDefault();

    // Evitar envíos duplicados
    if ($(this).data("submitted") === true) {
        return;
    }
    $(this).data("submitted", true);

    let values = loadData();  // Obtiene los datos del formulario

    $.ajax({
        type: "POST",
        url: "/api/pago_trabajador/add_pago",
        contentType: "application/json",
        data: JSON.stringify(values),
        dataType: "json",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        success: function (data) {
            alert("Pago registrado")
            console.log("SUCCESS: ", data.message);
            $("#infoPago").modal("hide"); // Cierra el modal después del éxito
        },
        error: function (xhr) {
            console.error("ERROR: ", xhr.responseText);
        },
        complete: function () {
            $("#registrarPagoTrabajador").data("submitted", false); // Permitir otro envío después de completar
        }
    });

});


function loadData() {
    const pago_total = Array.from(document.querySelectorAll('.check-pago-total')).map(input => input.checked);
    const claves_trabajo = Array.from(document.querySelectorAll('.clave-trabajo')).map(input => input.value);
    const montos_pago = Array.from(document.querySelectorAll('.pago-trabajador')).map(input => input.value);
    console.log(pago_total);
    const pagos_por_trabajos = claves_trabajo.map((claves, monto) => {
        return {
            id: claves,
            monto: montos_pago[monto],
            fecha: (new Date().toLocaleDateString()),
            pago_total: pago_total[monto]
        };
    });
    console.log(pagos_por_trabajos);

    const claves_prestamo = Array.from(document.querySelectorAll('.clave-prestamo')).map(input => input.value);
    const montos_prestamo = Array.from(document.querySelectorAll('.pago-prestamo')).map(input => input.value);

    const prestamos = claves_prestamo.map((claves, monto) => {
        return {
            id: claves,
            monto: montos_prestamo[monto],
            fecha: (new Date().toLocaleDateString())
        };
    });
    console.log(prestamos);
    //sendData(pagos_por_trabajos, prestamos)
    let clave_trabajador = $("#empleados option:selected").val();
    let total = $("#total_pagar").val();
    let tipo_pago = $("#metodo_pago").val();
    let data = {
        clave_trabajador, total, pagos_por_trabajos, prestamos, tipo_pago
    }
    return data;
}

function sendData(pagos_por_trabajos, prestamos) {
    let clave_trabajador = $("#empleados option:selected").val();
    let total = $("#total_pagar").val();
    let data = {
        clave_trabajador, total, pagos_por_trabajos, prestamos
    }
    console.log(data);
    fetch('/api/pago_trabajador/add_pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        dataType: 'json',
        body: JSON.stringify(data)
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('POST response: ');
        console.log(text);
    });
}

function getTotal() {
    const lista_pagos = Array.from(document.querySelectorAll('.pago-trabajador')).map(input => input.value)
    const lista_prestamos = Array.from(document.querySelectorAll('.pago-prestamo')).map(input => input.value)
    let total_a_pagar = 0.00;
    let prestamo_a_pagar = 0.00;
    for (let pago in lista_pagos) {
        total_a_pagar += parseFloat(lista_pagos[pago] != '' ? lista_pagos[pago] : '0');
    }
    for (let prestamo in lista_prestamos) {
        prestamo_a_pagar += parseFloat(lista_prestamos[prestamo] != '' ? lista_prestamos[prestamo] : '0');
    }
    total_a_pagar -= prestamo_a_pagar;
    return total_a_pagar;
}
function todayDay() {
    const today = new Date();
    const dia = today.getUTCDate();
    const mes = today.getUTCMonth();
    const year = today.getUTCFullYear();
    $("#fecha_pago").val(year + "-" + ((mes < 10) ? 0 : '') + mes + "-" + ((dia < 10) ? 0 : '') + dia);
}
todayDay();