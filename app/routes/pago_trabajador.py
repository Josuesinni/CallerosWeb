from . import pago_trabajador_bp, request, render_template, url_for, redirect, jsonify
from app.utils import procedimientos
from app.forms.pago_trabajador_form import form_add_pago_trabajador
from datetime import date
@pago_trabajador_bp.route("/pago_trabajador", methods=['GET','POST'])
def pago_trabajador():
    trabajadores=procedimientos.llamar_consulta("sp_consultaTrabajadores",[])
    return render_template(
        "private/pago_trabajador/pago_trabajador.html", 
        titulo="Pago Trabajador",
        trabajadores=trabajadores)


@pago_trabajador_bp.route("/api/pago_trabajador/add_pago", methods=["GET","POST"])
def app_pago():
    if request.method == 'POST':
        if '_ajax' in request.form:
            return jsonify({"error": "Tiene ajax"}), 415
        if not request.is_json:
            return jsonify({"error": "Invalid content type"}), 415
        datos = request.get_json()
        if not datos:
            return jsonify({"error": "No JSON received"}), 400

        print("Incoming JSON:", datos)
        
        datos=request.get_json()
        print(request.json)
        id_trabajador=datos['clave_trabajador']
        total = datos['total']
        fecha = date.today()
        print(id_trabajador,total,fecha)
        procedimientos.llamar_procedimiento("sp_agregarPagoTrabajador",[id_trabajador,total,fecha])
        folio = procedimientos.llamar_sentencia("SELECT LAST_INSERT_ID()",False)
        pagos=datos['pagos_por_trabajos']
        for pago in pagos:
            pago_total = 1 if pago['pago_total'] == True else 0
            print(folio, pago['id'],pago['monto'],id_trabajador, pago_total)
            procedimientos.llamar_procedimiento("sp_agregarDesglosePago",[folio, pago['id'],pago['monto'],id_trabajador, pago_total])
        prestamos=datos['prestamos']
        for prestamo in prestamos:
            procedimientos.llamar_procedimiento("sp_agregarPagoPrestamo",[prestamo['id'],prestamo['monto'],fecha])
            print(prestamo['id'],prestamo['monto'],prestamo['fecha'])
        return jsonify({"message": "Pago registrado correctamente"}), 200