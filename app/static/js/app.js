async function getListaClientes() {
    let response = await fetch('/api/cliente/lista-clientes-con-trabajos');
    let listaClientes = await response.json();
    return listaClientes;
}
getListaClientes().then(cargarClientesParaPagos).catch(error => console.log(error));

async function getTrabajosCliente(){
    let response = await fetch('/api/trabajo/trabajos_cliente?id=' + id_cliente);
    let trabajos = await response.json();
    return trabajos;
};

function cargarClientesParaPagos(listaClientes) {
    let dataClientes = [];
    for (cliente of listaClientes) {
        dataClientes.push({ 'id': cliente[0], 'text': cliente[1] });
    }
    $("#nombre_cliente_pago").select2({
        theme: 'bootstrap-5',
        placeholder: "Ingresa el nombre del cliente...",
        width: '100%',
        data: dataClientes,
        dropdownParent: $('#recibirPago')
    });
    id_cliente = $("#nombre_cliente_pago").val();
    controladorPago();
    getTrabajosCliente().then(cargar_trabajos).catch(error=>console.log(error));
}

let datos_trabajo = [{ 'id': '', 'text': '', 'descripcion': '', 'total_pagar': '' }];
let id_cliente = 1;

function controladorPago() {
    $("#nombre_cliente_pago").on('change', '', function () {
        id_cliente = $(this).val();
        getTrabajosCliente().then(cargar_trabajos).catch(error=>console.log(error));
        $("#datos_auto_pago").empty().trigger("change");
        //console.log(id_cliente);
    });
    $("#datos_auto_pago").on('change', '', function (e) {
        let valor=$(this).val();
        //console.log(valor);
        if(valor!=null){
            id_cliente=$(this).prop('selectedIndex');
            cargar_informacion_trabajo();
        }else{
            clearDatosTrabajo();
        }
    });
}

function clearDatosTrabajo(){
    $("#detalles_trabajo_pago").val("");
    //console.log(datos_trabajo);
    let total=null;
    if(datos_trabajo[id_cliente]!=undefined){
        total=datos_trabajo[id_cliente].total_pagar;
    }
    if (total != null) {
        $("#total_pagar_trabajo_cliente").text("$" + total);
        //document.getElementById("monto_pago_cliente").max = total;
        $("#monto_pago_cliente").attr("readonly", false);
        controladorMonto(total);
    }else{
        $("#btnPago").attr('disabled');
    }
}

function cargar_trabajos(data) {
    datos_trabajo=[{ 'id': '', 'text': '', 'descripcion': '', 'total_pagar': '','restante':'' }];
    for (d of data) {
        datos_trabajo.push({ 'id': d[0], 'text': d[1], 'descripcion': d[2], 'total_pagar': d[3],'restante':d[4] });
    }
    //console.log(datos_trabajo);
    $("#datos_auto_pago").select2({
        theme: 'bootstrap-5',
        placeholder: "Selecciona el auto del trabajo a cobrar...",
        width: '100%',
        data: datos_trabajo,
        dropdownParent: $('#recibirPago')
    });
}
function cargar_informacion_trabajo() {
    if (datos_trabajo.length > 1) {
        $("#detalles_trabajo_pago").val(datos_trabajo[id_cliente].descripcion);
        let total=datos_trabajo[id_cliente].restante;
        if (total != null) {
            $("#total_pagar_trabajo_cliente").text("$" + total);
            //document.getElementById("monto_pago_cliente").max = total;
            $("#monto_pago_cliente").attr("readonly", false);
            controladorMonto(total);
        }else{
            $("#btnPago").attr('disabled');
        }
    }
}

function controladorMonto(total_pagar){
    const total=total_pagar;
    $( "#monto_pago_cliente" ).change(function() {
        $("#restante").text("$"+parseFloat(total-$(this).val())+".00");
    });
}
let dineroEnCaja;
async function getFinanzas() {
    const urls =[
        '/api/data/efectivo',
        '/api/data/tarjeta']
        ;
    try {
        const respuestas = await Promise.all(urls.map(url => fetch(url)));
        dineroEnCaja = await Promise.all(respuestas.map(res => res.json()));
        console.log(dineroEnCaja)
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getFinanzas().then(actualizarDinero);

function actualizarDinero(){
    $("#dineroEfectivo").text(dineroEnCaja[0]);
    $("#dineroTarjeta").text(dineroEnCaja[1]);
    $("#dineroTotal").text((Number.parseFloat(dineroEnCaja[1])+Number.parseFloat(dineroEnCaja[0])).toFixed(2));
}


$("document").ready(function () {
    const hamBurger = document.querySelector(".toggle-btn");

    hamBurger.addEventListener("click", function () {
        document.querySelector("#sidebar").classList.toggle("expand");
    });

    $(".navbar-toggler").click(function () {
        const isExpanded = $(this).attr('aria-expanded');
        if (isExpanded == 'true') {
            $(".show-nav").removeClass("bi-arrow-down-circle");
            $(".show-nav").addClass("bi-arrow-up-circle");
        } else {
            $(".show-nav").removeClass("bi-arrow-up-circle");
            $(".show-nav").addClass("bi-arrow-down-circle");
        }
    });

    document.querySelector('#sidebar').addEventListener('classChange', function () {
        const sideCont = document.querySelector('#side-cont');
        if (this.classList.contains('expand')) {
            sideCont.style.display = 'inline-block';
        } else {
            sideCont.style.display = 'none';
        }
    });
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    const sidebar = document.querySelector('#sidebar');
    const sideCont = document.querySelector('#side-cont');

    // Función para actualizar la visibilidad de #side-cont
    function updateSideCont() {
        if (mediaQuery.matches && sidebar.classList.contains('expand')) {
            sideCont.style.display = 'inline-block';
        } else if (mediaQuery.matches) {
            sideCont.style.display = 'none';
        } else {
            sideCont.style.display = ''; // Deja que el CSS predeterminado maneje el estilo
        }
    }

    // Detecta cambios en la clase del sidebar
    const observer = new MutationObserver(updateSideCont);
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });

    // Detecta cambios en la media query
    mediaQuery.addEventListener('change', updateSideCont);

    // Inicializa el estado
    updateSideCont();
});
