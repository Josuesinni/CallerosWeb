

async function getData() {
    resultado = await fetch("/api/data/finanzas");
    datos = await resultado.json()
    return datos;
}

getData().then(crearGraficaPastel).catch(error => console.log(error));

function crearGraficaPastel(datos) {
    data = {
        datasets: [{
            label: 'My First Dataset',
            data: [datos],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }],
        labels: [
            'Ingresos',
            'Gastos Varios',
            'Gastos Fijos'
        ]
    }
    const config = {
        type: 'doughnut',
        data: data,
    };
}
