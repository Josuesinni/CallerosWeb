let registros;
const btnAnterior = document.querySelector('#btnAnterior');
const btnSiguiente = document.querySelector('#btnSiguiente');
const no_paginacion = document.querySelector('#no_paginacion');
const tbody = document.querySelector('#tbody');
let pagina_actual = 1;
const registrosPorPagina = 5;
let no_paginas;
let paginasVisibles = 5;
const posicionCentral = 2;

getData().then(cargarData).catch(error=>console.log(error));
function cargarData(datos){
    registros = datos;
    no_paginas = Math.ceil(registros.length / registrosPorPagina);
    setPaginaActual(pagina_actual);
}

btnAnterior.addEventListener('click', () => {
    setPaginaActual(pagina_actual - 1);
})
btnSiguiente.addEventListener('click', () => {
    setPaginaActual(pagina_actual + 1);
})



function controlDePaginas() {
    document.querySelectorAll('.page-link').forEach(pageLinkElement => {
        let index = pageLinkElement.getAttribute('page-index');
        if (index) {
            pageLinkElement.remove();
        }
    });

    const paginas = [];
    let limiteSuperior = paginasVisibles;
    if (no_paginas < paginasVisibles) {
        limiteSuperior = no_paginas;
    } else if (pagina_actual + posicionCentral >= no_paginas) {
        limiteSuperior = no_paginas;
    } else if (pagina_actual > posicionCentral) {
        limiteSuperior = pagina_actual + posicionCentral;
    }
    
    let limiteInferior = limiteSuperior - paginasVisibles <= 0 ? 0 : limiteSuperior - paginasVisibles;
    for (let i = 0; i < paginasVisibles; i++) {
        if ((limiteInferior + i + 1) <= limiteSuperior) {
            paginas.push(limiteInferior + i + 1);
        }
    }
    
    for (let i = paginas.length-1; i >= 0; i--) {
        const numero_pagina = document.createElement("li");
        numero_pagina.classList.add("page-item");
        numero_pagina.innerHTML = `<a class="page-link" role=""button" page-index=${paginas[i]}>${paginas[i]}</a>`
        const prevLiElement = document.querySelector('#numeros_paginacion :nth-child(1)');
        prevLiElement.after(numero_pagina);
        if (pagina_actual == i) numero_pagina.classList.add("active");
    }
    document.querySelectorAll(".page-link").forEach(pageLink => {
        const pageIndex = Number(pageLink.getAttribute("page-index"));
        if (pageIndex) {
            pageLink.addEventListener("click", () => {
                setPaginaActual(pageIndex);
            })
        }
    });
}

function setPaginaActual(numeroPagina) {
    pagina_actual = numeroPagina;
    llenarTabla();
    controlDePaginas();
    setEstilosPaginaActual();
    actualizarEstadoBotones();
}
function setEstilosPaginaActual() {
    const prevPaginaActual = document.querySelector('li.page-item.active');
    prevPaginaActual.classList.remove('active');
    document.querySelectorAll('.page-link').forEach(pageLinkElement => {
        const pageIndex = Number(pageLinkElement.getAttribute('page-index'));
        if (pageIndex == pagina_actual) {
            const newActivePage = pageLinkElement.parentNode;
            newActivePage.classList.add('active');
        }
    });
}
function actualizarEstadoBotones() {
    if (pagina_actual === 1) {
        btnAnterior.classList.add("disabled");
    } else {
        btnAnterior.classList.remove("disabled");
    }
    if (pagina_actual === no_paginas) {
        btnSiguiente.classList.add("disabled");
    } else {
        btnSiguiente.classList.remove("disabled");
    }
}
