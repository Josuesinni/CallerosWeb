
from app.database import get_cursor
from app.utils import procedimientos
from . import trabajadores_bp, jsonify, render_template, url_for, request, redirect
import json

def consulta_trabajadores(consulta:str):
    cur = get_cursor()
    cur.execute("SELECT * FROM "+consulta+";")
    result = cur.fetchall()
    return result

def insertar_trabajador(informacion):
    try:
        cur = get_cursor()
        cur.callproc("sp_agregarTrabajador", informacion)
        cur.connection.commit()
        return True
    except Exception as e:
        print ("Hay un error:"+{e})
        return False

def buscar_trabajador():
    return None


@trabajadores_bp.route("/api/trabajador/add",  methods=["GET", "POST"])
def add_trabajador():
    ajax = '_ajax' in request.form
    if request.method == 'POST':
        nombre = request.form['nombre-t']
        ap_pat = request.form['ap-pat-t']
        ap_mat = request.form['ap-mat-t']
        rol = request.form['rol-t']
        nomina = request.form['nomina-t']
        if ajax:
            return ''
        status = insertar_trabajador([nombre,ap_pat,ap_mat,int(rol),int(nomina)])
        return redirect("/trabajadores")

@trabajadores_bp.route("/api/trabajador/update",methods=["POST"])
def update_trabajador():
    if request.method == 'POST':
        id = request.form['id-t-u']
        nombre = request.form['nombre-t-u']
        ap_pat = request.form['ap-pat-t-u']
        ap_mat = request.form['ap-mat-t-u']
        rol = request.form['rol-t-u']
        nomina = request.form['ganancia-t-u']
        procedimientos.llamar_procedimiento('sp_actualizarTrabajador',[id,nombre,ap_pat,ap_mat,int(rol),int(nomina)])
    return redirect(url_for('trabajadores.trabajadores'))

@trabajadores_bp.route("/api/trabajador/delete",methods=["POST"])
def delete_trabajador():
    if request.method == 'POST':
        id = request.form.get('id-t-d')
        id2 = request.form['id-t-d']
        
        print(id,id2)
        procedimientos.llamar_procedimiento('sp_bajaTrabajador',[id])
    return redirect(url_for('trabajadores.trabajadores'))


@trabajadores_bp.route("/api/data/trabajadores")
def tabla_trabajadores():
    resultados=procedimientos.llamar_vistas("trabajadores",None)
    return jsonify(resultados)

@trabajadores_bp.route("/api/data/trabajos-realizados")
def trabajos_realizados():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_consulta("sp_consultaTrabajosRealizadosPorTrabajador",[id])
    fecha_act = [procedimientos.parseDate(row) for row in resultado]
    return jsonify(fecha_act)

@trabajadores_bp.route("/api/trabajador/info_trabajador", methods=["GET", "POST"])
def buscarTrabajador():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_busqueda("sp_buscarTrabajador",[id])
    return jsonify(resultado)

@trabajadores_bp.route("/trabajadores")
def trabajadores():
    ganacia=procedimientos.llamar_vistas("nominas",None)
    trabajadores = procedimientos.llamar_consulta("sp_consultaTrabajadores",[])
    return render_template("private/trabajadores/lista_trabajadores.html", titulo="Trabajadores",ganacia=ganacia, trabajadores=trabajadores)