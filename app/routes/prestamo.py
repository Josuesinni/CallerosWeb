from . import prestamo_bp
from flask import request,redirect,url_for, jsonify
from datetime import date,datetime
from app.utils import procedimientos
@prestamo_bp.route("/api/prestamo/add",methods=["POST"])
def add_prestamo():
    if request.method == 'POST':
        idTrabajador = request.form['prestamo_nombre_trabajador']
        monto = request.form['prestamo_monto']
        fecha = request.form['fecha_prestamo']
        tipo = request.form['prestamo_tipo']
        if tipo=='0':
            procedimientos.llamar_procedimiento('sp_agregarPrestamo',[int(idTrabajador),monto,fecha])
        else:
            procedimientos.llamar_procedimiento('sp_agregarGasto',['Gasto material',monto,datetime.strptime(fecha),12])
    return redirect(url_for('trabajadores.trabajadores'))

@prestamo_bp.route("/api/data/prestamos")
def trabajos_realizados():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_consulta("sp_consultaPrestamos",[id])
    fecha_act = [procedimientos.parseDate(row) for row in resultado]
    return jsonify(fecha_act)
