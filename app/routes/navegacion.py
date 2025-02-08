from . import navegacion_bp, render_template,redirect, request, flash, url_for
from app.forms.cita_form import form_add_cita, form_update_cita
from app.forms.trabajo_form import form_add_trabajo,form_update_trabajo
from app.utils import procedimientos
from flask_login import current_user, logout_user, login_required, login_user
import hashlib
from app.models.login import get_user_by_user, check_password

@navegacion_bp.route("/login", methods=['POST', 'GET'])
def login():
    if current_user.is_authenticated:
        return redirect("/")
    if request.method == 'POST':
        usuario = request.form.get('usuario')
        password = request.form.get('password')
        hash = hashlib.sha256(password.encode())
        print(hash.hexdigest())
        recuerdame = True if request.form.get('recuerdame') else False
        user = get_user_by_user(usuario)
        #Valida que la contraseña ingresada sea igual a la del usuario
        if user and check_password(user.password, password):
            if recuerdame==True:
                login_user(user,remember=True)
            else:
                login_user(user)
            return redirect("/")
        flash('El usuario y/o contraseña no coinciden, favor de intentarlo nuevamente')
    return render_template("public/login.html", titulo="Inicio de Sesión")

@navegacion_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('navegacion.login'))


@navegacion_bp.route("/")
def home():
    if not current_user.is_authenticated:
        return redirect("/login")
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