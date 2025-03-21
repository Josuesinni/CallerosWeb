//Calendario
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['D', 'L', 'M', 'MI', 'J', 'V', 'S'];

function calendar_app() {
    
    return {
        mes: '',
        anio: '',
        dia: '',
        no_de_dias: [],
        dias_en_blanco: [],
        dias: ['D', 'L', 'M', 'MI', 'J', 'V', 'S'],
        eventos: [],
        no_citas:0,
        no_trabajos:0,
        id: '',
        fecha: '',
        nombre_cliente: '',
        auto: '',
        descripcion: '',
        tipo: '',
        tema: '',
        temas: [
            {
                value: "blue",
                label: "Blue Theme"
            },
            {
                value: "red",
                label: "Red Theme"
            },
            {
                value: "purple",
                label: "Purple Theme"
            }
        ],
        
        async getEventos(mes, anio) {
            this.eventos = [];
            await fetch('/api/cita/citas_agendadas?mes=' + mes + '&anio=' + anio).then(response => response.json()).then(data => {
                for (d of data) {
                    const ev = {
                        id: d[0],
                        fecha: d[4],
                        nombre_cliente: d[1],
                        descripcion: d[3],
                        auto: '',
                        tipo: 'cita',
                        tema: 'blue'
                    }
                    this.eventos.push(ev);
                }
            });
            await fetch('/api/trabajo/trabajos_agendados?mes=' + mes + '&anio=' + anio).then(response => response.json()).then(data => {
                for (d of data) {
                    console.log(d)
                    const ev = {
                        id: d[0],
                        fecha: d[5],
                        nombre_cliente: d[1],
                        descripcion: d[4],
                        auto: d[3],
                        tipo: 'trabajo',
                        tema: 'purple'
                    }
                    this.eventos.push(ev);
                }
            });
            for (const evento in this.eventos.filter(e => new Date(e.fecha).toUTCString()===new Date(Date.UTC(this.anio, this.mes, this.dia)).toUTCString())){
                if(this.eventos[evento].tipo=='cita'){
                    this.no_citas++;
                }else{
                    this.no_trabajos++;
                }
            }
            this.addListaEvento();
        },
        iniciarFecha() {
            let hoy = new Date();
            this.mes = hoy.getMonth();
            this.anio = hoy.getFullYear();
            this.dia = hoy.getDate();
        },
        isHoy(dia) {
            const hoy = new Date();
            const fecha = new Date(this.anio, this.mes, dia);
            return hoy.toDateString() === fecha.toDateString() ? true : false;
        },
        getFecha() {
            return  (this.anio+"-"+((this.mes<10)?0:'')+(this.mes + 1)+ "-"+((this.dia<10)?0:'')+this.dia);
        },
        setFechaCalendario(event){
            let f = event.target.value;
            let d=Number(f.substring(8,10));
            let m=Number(f.substring(5,7))-1;
            let y=Number(f.substring(0,4));
            if(this.anio!=y && this.mes!=m){
                this.anio=y
                this.mes=m
            }else if (this.mes!=m && this.anio==y){
                this.mes=m
            }else if (this.mes==m && this.anio!=y){
                this.anio=y
            }
            this.dia=d;
            this.getNoDeDias();
            this.getEventos(this.mes,this.anio);
            this.setFechaSeleccionada(this.dia);
        },
        getFechaSeleccionada(dia) {
            const hoy = new Date(this.anio, this.mes, this.dia);
            const fecha = new Date(this.anio, this.mes, dia);
            return fecha.toDateString() === hoy.toDateString() ? true : false;
        },
        setFechaSeleccionada(dia) {
            this.dia=dia;
            if (this.dia > this.no_de_dias.length) {
                this.mes++;
                this.getNoDeDias();
                this.dia = 1;
                this.getEventos(this.mes,this.anio);
            }
            if (this.dia < 1) {
                this.mes--;
                this.getNoDeDias();
                this.dia = this.no_de_dias.length;
                this.getEventos(this.mes,this.anio);
            }
            let fecha= new Date(this.anio + "-" + (this.mes+1) + "-" + this.dia).toISOString().substring(0,10);
            $("#fecha_cita_a").val(fecha);
            $("#fecha_trabajo_a").val(fecha);
            $("#fechaSeleccionada").val(fecha);
            $("#fechaSeleccionada").trigger('change');
            this.addListaEvento(dia);
        },
        isEventos(){
            for (const evento in this.eventos.filter(e => new Date(e.fecha).toUTCString()===new Date(Date.UTC(this.anio, this.mes, this.dia)).toUTCString())){
                if(this.eventos[evento].tipo=='cita'){
                    this.no_citas++;
                }else{
                    this.no_trabajos++;
                }
            }
            return (this.no_citas>0||this.no_trabajos>0);
        },
        addListaEvento() {
            let lista_eventos = document.getElementById("lista-eventos");
            $("#lista-eventos").empty();
            
            const fechaSeleccionada = new Date(Date.UTC(this.anio, this.mes, this.dia)).toISOString().replace('.000','');
            const eve = this.eventos;
            let no_citas=0;
            let no_trabajos=0;
            var result = $.grep(eve, function (element) {
                if(element.fecha===fechaSeleccionada){
                    if(element.tipo=='cita'){
                        no_citas++;
                    }else{
                        no_trabajos++;
                    }
                }
                return element.fecha === fechaSeleccionada;
            });

            if (result.length > 0) {
                if(no_citas>0){
                    lista_eventos.innerHTML += "<b>Citas</b>";
                    no_citas=0;
                }
                for (r of result) {
                    if(r.tipo=='trabajo'&&no_trabajos>0){
                        lista_eventos.innerHTML += "<b>Trabajos</b>";
                        no_trabajos=0;
                    }
                    lista_eventos.innerHTML += 
                    `<li>
                        <a class=${(r.tipo=='cita'?'event-cita':'event-trabajo')}
                        data-bs-toggle='modal' href=${(r.tipo=='cita'?'#infoCita':'#infoTrabajo')}
                        data-id='${r.id}'>
                            <b> ${r.nombre_cliente} </b>
                            - ${r.auto}
                        </a>
                        <ul>
                            <li class='pl-2'>
                                ${r.descripcion}
                            </li>
                        </ul>
                    </li>`;
                }
            } else {
                lista_eventos.innerHTML += "<li class='text-justify'>No hay actividades pendientes</li>";
            }
        },
        getNoDeDias() {
            let diasEnElMes = new Date(this.anio, this.mes + 1, 0).getDate();
            
            if (this.mes > 11) {
                this.anio++;
                this.mes = 0;
            } else if (this.mes < 0) {
                this.anio--;
                this.mes = 11;
            }

            let diaDeLaSemana = new Date(this.anio, this.mes).getDay();
            let diasEnBlanco = [];
            for (var i = 1; i <= diaDeLaSemana; i++) {
                diasEnBlanco.push(i);
            }

            let dias = [];
            for (var i = 1; i <= diasEnElMes; i++) {
                dias.push(i);
            }

            this.dias_en_blanco = diasEnBlanco;
            this.no_de_dias = dias;
        }
    }
}

const app_calendar = calendar_app();
