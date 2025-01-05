from . import navegacion_bp, render_template
from app.forms.cita_form import form_add_cita, form_update_cita
from app.forms.trabajo_form import form_add_trabajo,form_update_trabajo
from app.utils import procedimientos

@navegacion_bp.route("/")
def home():
    form_a_cita=form_add_cita()
    form_u_cita=form_update_cita()
    form_a_trabajo=form_add_trabajo()
    form_u_trabajo=form_update_trabajo()
    lista_trabajadores=procedimientos.llamar_consulta("sp_listaTrabajadores",[])
    print(lista_trabajadores)
    return render_template("home/index.html", titulo="Inicio", 
                            form_a_cita = form_a_cita,
                            form_u_cita = form_u_cita,
                            form_a_trabajo = form_a_trabajo,
                            form_u_trabajo = form_u_trabajo,
                            lista_trabajadores = lista_trabajadores)