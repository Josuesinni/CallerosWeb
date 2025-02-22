from . import citas_bp, jsonify,  render_template, url_for,request, redirect, flash
import json
from datetime import datetime
from app.forms.cita_form import form_add_cita, form_update_cita, form_delete_cita
from flask_modals import render_template_modal
from app.utils import procedimientos

@citas_bp.route("/api/cita/citas_agendadas", methods=['GET'])
def citas_agendadas():
    mes = request.args.get('mes', type=int)
    anio = request.args.get('anio', type=int)
    resultado=procedimientos.llamar_consulta("sp_consultaCitasAgendadas",[int(mes+1),int(anio)])
    resultado_fechas_modificadas = [procedimientos.parseDate(row) for row in resultado]
    return jsonify(resultado_fechas_modificadas)

@citas_bp.route("/api/cita/citas_sin_agendar")
def citas_sin_agendar():
    resultado=procedimientos.llamar_consulta("sp_consultaCitasSinAgendar",[])
    return jsonify(resultado)

@citas_bp.route("/api/cita/informacion_cita",  methods=["GET"])
def get_cita():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_busqueda("sp_buscarCita", [int(id)])
    return jsonify(resultado)

@citas_bp.route("/api/cita/add",  methods=["GET", "POST"])
def add_cita():
    ajax = '_ajax' in request.form
    form_a_cita=form_add_cita()
    if request.method == 'POST':
        if form_a_cita.validate_on_submit():
            nombre = request.form.get('nombre_cliente_cita_a')
            telefono=form_a_cita.telefono_cliente_cita_a.data
            descripcion=form_a_cita.descripcion_cita_a.data
            agendar_cita=form_a_cita.agendar_cita.data
            fecha=form_a_cita.fecha_cita_a.data
            telefono_adicional = request.form.get('telefono_adicional_cita')
            if ajax:
                return ''
            if agendar_cita == '0':
                fecha=None
            procedimientos.llamar_procedimiento("sp_agregarCita",[nombre, telefono, telefono_adicional, descripcion, fecha])
            return redirect ("/")
        else:
            errors = form_a_cita.errors
            print(errors)
        return render_template_modal("public/index.html",form_a_cita=form_a_cita)

@citas_bp.route("/api/cita/update",  methods=["POST"])
def update_cita():
    ajax = '_ajax' in request.form
    form_u_cita=form_update_cita()
    if request.method == 'POST':
        if form_u_cita.validate_on_submit():
            id_cita = form_u_cita.id_cita_u.data
            descripcion = form_u_cita.descripcion_cita_u.data
            fecha = form_u_cita.fecha_cita_u.data
            estatus = form_u_cita.estatus_cita_u.data
            if ajax:
                return ''
            if agendar_cita == '0':
                fecha=None
            procedimientos.llamar_procedimiento("sp_actualizarCita",[id_cita, descripcion, fecha, estatus])
            return redirect ("/")
        else:
            errors = form_u_cita.errors
            print(errors)
        return render_template_modal("public/index.html",form_u_cita=form_u_cita)

@citas_bp.route("/api/cita/delete",  methods=["GET","POST"])
def delete_cita():
    ajax = '_ajax' in request.form
    form_u_cita=form_update_cita()
    if request.method == 'POST':
        id_cita = form_u_cita.id_cita_u.data
        estado=procedimientos.llamar_procedimiento("sp_bajaCita",[id_cita])
        return jsonify({"status":estado})

@citas_bp.route("/api/cita/delete2",  methods=["GET","POST"])
def delete_cita2():
    ajax = '_ajax' in request.form
    if request.method == 'POST':
        id_cita = request.form['id_cita_add_trabajo']
        estado=procedimientos.llamar_procedimiento("sp_bajaCita",[id_cita])
        return jsonify({"status":estado})
    
@citas_bp.route("/api/cita/agendar_cita",  methods=["POST"])
def agendar_cita():
    if request.method == 'POST':
        id_cita=request.form['id_cita_sin_agendar']
        fecha=request.form['fecha_cita_sin_agendar']
        procedimientos.llamar_procedimiento("sp_actualizarCita",[id_cita, None, fecha, None])
        return redirect(url_for('navegacion.home'))