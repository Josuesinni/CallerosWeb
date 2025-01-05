async function getListaGastos() {
    let response = await fetch('/api/data/lista_gastos_varios');
    let listaGastos = await response.json();
    listaGastos.forEach(data => {
        data[1] = "$" + data[1];
        data[0] = data[0].slice(0, 10);
    })
    return listaGastos;
}
async function getListaIngresos() {
    let response = await fetch('/api/data/lista_ingresos');
    let listaGastos = await response.json();
    listaGastos.forEach(data => {
        data[1] = "$" + data[1];
        data[0] = data[0].slice(0, 10);
    })
    return listaGastos;
}

async function getGastosPrevistos() {
    let response = await fetch('/api/data/gastos_previstos');
    let listaGastos = await response.json();
    listaGastos.forEach(data => {
        data[1] = "$" + data[1];
        data[2] = "$" + data[2];
        data[3] = "$" + data[3];
    })
    return listaGastos;
}

getListaGastos().then(cargarListaGastos).catch(error => console.log(error));
getListaIngresos().then(cargarListaIngresos).catch(error => console.log(error));
getGastosPrevistos().then(cargarGastosPrevistos).catch(error => console.log(error));

function cargarListaIngresos(ingresos) {
    let contenidoTabla = '';
    ingresos.forEach(row => {
        let filas = '';
        for (i in row) {
            if (row[i] == null) {
                filas += `<td></td>`
            } else {
                filas += `<td>${row[i]}</td>`
            }
        };
        contenidoTabla += `<tr>${filas}</tr>`;
    });
    document.querySelector('#tbody_ingresos').innerHTML = contenidoTabla;
}
function cargarListaGastos(gastos) {
    let contenidoTabla = '';
    gastos.forEach(row => {
        let filas = '';
        for (i in row) {
            if (row[i] == null) {
                filas += `<td></td>`
            } else {
                filas += `<td>${row[i]}</td>`
            }
        };
        contenidoTabla += `<tr>${filas}</tr>`;
    });
    document.querySelector('#tbody').innerHTML = contenidoTabla;
}
function cargarGastosPrevistos(presupuesto){
    let contenidoTabla = '';
    contenidoTabla+=`<th scope=row>Gastos semanales<th>`
    let filas='';
    presupuesto[10].forEach(fila=>{
        filas += `<td>${fila}</td>`
    });
    contenidoTabla+=`<tr>${filas}</tr>`
    filas='';
    presupuesto[0].forEach(fila=>{
        filas += `<td>${fila}</td>`
    });
    contenidoTabla+=`<tr>${filas}</tr>`
    filas='';
    contenidoTabla+=`<tr>${filas}</tr>`
    presupuesto[11].forEach(fila=>{
        filas += `<td>${fila}</td>`
    });
    contenidoTabla+=`<tr>${filas}</tr>`
    contenidoTabla+=`<th scope=row>Gastos mensuales<th>`
    for(let i=1;i<6;i++){
        filas='';
        presupuesto[i].forEach(fila=>{
            filas += `<td>${fila}</td>`
        });
        contenidoTabla+=`<tr>${filas}</tr>`
    }
    contenidoTabla+=`<th scope=row>Gastos bimestrales<th>`
    filas='';
    presupuesto[6].forEach(fila=>{
        filas += `<td>${fila}</td>`
    });
    contenidoTabla+=`<tr>${filas}</tr>`
    contenidoTabla+=`<th scope=row>Gastos anuales<th>`
    for(let i=7;i<10;i++){
        filas='';
        presupuesto[i].forEach(fila=>{
            filas += `<td>${fila}</td>`
        });
        contenidoTabla+=`<tr>${filas}</tr>`
    }
    document.querySelector('#resultados').innerHTML = contenidoTabla;
}
document.getElementById("fecha_gasto").valueAsDate =new Date();