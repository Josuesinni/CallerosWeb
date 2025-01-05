from app.database import get_cursor
from . import dashboard_bp, jsonify
import json
from flask import render_template, request, redirect, url_for
from app.utils import procedimientos

@dashboard_bp.route("/api/data/efectivo")
def get_efectivo():
    cur = get_cursor()
    cur.execute("""SELECT get_saldo()""")
    result = cur.fetchall()
    return jsonify(result)

@dashboard_bp.route("/api/data/tarjeta")
def get_tarjeta():
    cur = get_cursor()
    cur.execute("""SELECT sum(monto) from pago_cliente where tipo=1""")
    result = cur.fetchall()
    return jsonify(result)

@dashboard_bp.route("/api/data/ingresos")
def get_ingresos():
    cur = get_cursor()
    cur.execute("""SELECT sum(monto) FROM pago_cliente""")
    result = cur.fetchall()
    return jsonify(result)

@dashboard_bp.route("/api/data/lista_ingresos")
def get_lista_ingresos():
    result=procedimientos.llamar_vistas('ingresos',None)
    resultado_fechas_modificadas = [procedimientos.parseDate(row) for row in result]
    return jsonify(resultado_fechas_modificadas)

@dashboard_bp.route("/api/data/gastos_varios")
def get_gastos_varios():
    cur = get_cursor()
    cur.execute(
        """SELECT 
        categoria_gasto.descripcion, 
        ifnull(SUM(monto),0)
        FROM categoria_gasto 
        LEFT JOIN gasto ON (gasto.idCategoria=categoria_gasto.idCategoria) 
        group by categoria_gasto.idCategoria;
        """
        )
    result = cur.fetchall()
    return jsonify(result)

@dashboard_bp.route("/api/data/lista_gastos_varios")
def get_lista_gastos_varios():
    result=procedimientos.llamar_vistas('gastos',None)
    resultado_fechas_modificadas = [procedimientos.parseDate(row) for row in result]

    return jsonify(resultado_fechas_modificadas)

@dashboard_bp.route("/api/data/gastos_fijos")
def get_gastos_fijos():
    cur = get_cursor()
    cur.execute("""SELECT * FROM pago_cliente""")
    result = cur.fetchall()
    return jsonify(result)

@dashboard_bp.route("/estadisticas")
def vista_estadisticas():
    return render_template(
        "private/estadisticas/estadisticas.html",
        titulo="Estadisticas"
    )

@dashboard_bp.route("/api/data/gastos_previstos")
def get_gastos_previstos():
    result=procedimientos.llamar_consulta("sp_consultaResultadosGastos",[])
    return jsonify(result)

@dashboard_bp.route("/api/gasto/add", methods=['POST'])
def add_gasto():
    ajax = '_ajax' in request.form
    if request.method == 'POST':
        importe = request.form['importe_gasto']
        fecha = request.form['fecha_gasto']
        descripcion = request.form['descripcion_gasto']
        categoria = request.form['categoria_gasto']
        if ajax:
            return ''
        result=procedimientos.llamar_procedimiento("sp_agregarGasto",[descripcion,int(importe),fecha,int(categoria)])
        return redirect(url_for('dashboard.vista_estadisticas'))

