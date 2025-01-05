from . import pago_cliente_bp
from flask import request,redirect, flash
from datetime import date
from app.utils import procedimientos

@pago_cliente_bp.route('/api/pago_cliente/add', methods=["POST"])
def add_pago_cliente():
    ajax = '_ajax' in request.form
    if request.method == 'POST':
        id_trabajo = request.form['datos_auto_pago']
        monto = request.form['monto_pago_cliente']
        tipo = request.form['metodo_pago_cliente']
        fecha = date.today()
        if ajax:
            return ''
        procedimientos.llamar_procedimiento("sp_agregarPagoCliente",[int(id_trabajo),monto,int(tipo),fecha])
        return redirect(request.referrer)