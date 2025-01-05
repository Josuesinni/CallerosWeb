async function get_clientes() {
    resultado = await fetch ('/api/cliente/lista-clientes');
    datos = await resultado.json()
    return datos;
}

get_clientes().then(cargarClientes).catch(error => console.log(error));

function cargarClientes(datosCliente){
    
}