from . import pago_trabajador_bp, request, render_template, url_for, redirect, jsonify
from app.utils import procedimientos
from app.forms.pago_trabajador_form import form_add_pago_trabajador
from datetime import date
@pago_trabajador_bp.route("/pago_trabajador")
def pago_trabajador():
    trabajadores=procedimientos.llamar_consulta("sp_consultaTrabajadores",[])
    return render_template(
        "private/pago_trabajador/pago_trabajador.html", 
        titulo="Pago Trabajador",
        trabajadores=trabajadores)


@pago_trabajador_bp.route("/api/pago_trabajador/add", methods=["GET","POST"])
def add_pago_trabajador():
    form_a_pago_trabajador=form_add_pago_trabajador()
    if request == "POST":
        if form_a_pago_trabajador.validate_on_submit():
            id_trabajador=form_a_pago_trabajador.id_trabajador.data
            fecha=form_a_pago_trabajador.fecha_a.data
            total=form_a_pago_trabajador.total_a.data
            
            procedimientos.llamar_procedimiento("sp_agregarPagoTrabajador",[id_trabajador,total,fecha])
            folio= procedimientos.llamar_sentencia("SELECT LAST_INSERT_ID()",False)
            #for a in d:
            #    procedimientos.llamar_procedimiento("sp_agregarDesglosePago",[folio,idTrabajo,monto])
        return redirect(url_for("pago_trabajador"))

@pago_trabajador_bp.route("/api/pago_trabajador/add_pago", methods=["GET","POST"])
def app_pago():
    # POST request
    if request.method == 'POST':
        print('Incoming..')
        datos=request.get_json()
        print(request.json)
        id_trabajador=datos['clave_trabajador']
        total = datos['total']
        fecha = date.today()
        print(id_trabajador,total,fecha)
        #procedimientos.llamar_procedimiento("sp_agregarPagoTrabajador",[id_trabajador,total,fecha])
        #folio= procedimientos.llamar_sentencia("SELECT LAST_INSERT_ID()",False)
        pagos=datos['pagos_por_trabajos']
        for pago in pagos:
            print(pago['id'],pago['monto'],pago['fecha'])
            #procedimientos.llamar_procedimiento("sp_agregarDesglosePago",[folio,idTrabajo,monto])
        prestamos=datos['prestamos']
        for prestamo in prestamos:
            print(prestamo['id'],prestamo['monto'],prestamo['fecha'])
        return 'OK', 200

    # GET request
    else:
        message = {'greeting':'Hello from Flask!'}
        return jsonify(message) 