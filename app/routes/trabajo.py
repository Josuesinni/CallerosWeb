from . import trabajo_bp, jsonify, render_template, url_for, request, redirect, flash
import json
from app.forms.trabajo_form import form_add_trabajo, form_update_trabajo
from flask_modals import render_template_modal
from app.utils import procedimientos
from datetime import datetime, date
@trabajo_bp.route("/trabajos",  methods=["GET", "POST"])
def historial_trabajos():
    trabajos=procedimientos.llamar_vistas("trabajos", None)
    return render_template(
        "private/trabajo/historial_trabajos.html",
        titulo="Trabajos",
        trabajos=trabajos
        )

@trabajo_bp.route("/api/trabajo/lista_trabajos",  methods=["GET", "POST"])
def lista_trabajos():
    resultado=procedimientos.llamar_vistas("trabajos", None)
    resultado_fechas_modificadas = [procedimientos.parseDate(row) for row in resultado]
    return jsonify(resultado_fechas_modificadas)


@trabajo_bp.route("/api/trabajo/trabajos_agendados",  methods=["GET", "POST"])
def get_trabajos():
    mes = request.args.get('mes', type=int)
    anio = request.args.get('anio', type=int)
    resultado=procedimientos.llamar_consulta("sp_consultaTrabajos",[int(mes+1),int(anio)])
    resultado_fecha_act = [procedimientos.parseDate(row) for row in resultado]
    return jsonify(resultado_fecha_act)

@trabajo_bp.route("/api/trabajo/add",  methods=["GET", "POST"])
def add_trabajo():
    ajax = '_ajax' in request.form
    form_a_trabajo=form_add_trabajo()
    if request.method == 'POST':
        if form_a_trabajo.validate_on_submit():
            nombre = request.form.get('nombre_cliente_trabajo_a')
            telefono=form_a_trabajo.telefono_cliente_trabajo_a.data
            telefono2=request.form.get('telefono_adicional')
            pago=form_a_trabajo.pago_trabajo_a.data
            datos_auto=form_a_trabajo.datos_auto_trabajo_a.data
            descripcion_trabajo=form_a_trabajo.descripcion_trabajo_a.data
            fecha=form_a_trabajo.fecha_trabajo_a.data
            is_facturado=request.form.get('is_facturado')
            is_totalidad=request.form.get('is_totalidad')
            cantidad_factura=request.form.get('cantidad_factura')
            print(telefono2,is_facturado,is_totalidad,cantidad_factura)
            if ajax:
                return '' 
            print(nombre, telefono, datos_auto, descripcion_trabajo, fecha,pago)
            procedimientos.llamar_procedimiento("sp_agregarTrabajo",[nombre, telefono, telefono2, datos_auto, descripcion_trabajo, fecha, pago])
            if is_facturado == '1':
                idTrabajo = procedimientos.llamar_sentencia("SELECT LAST_INSERT_ID()",False)
                total=  (float(pago)*0.16) if (is_totalidad=='1') else (float(cantidad_factura)*0.16)
                print(idTrabajo[0], 1, total)
                procedimientos.llamar_procedimiento("sp_agregarFactura",[idTrabajo[0], 1, total])
            return redirect ("/")
        else:
            errors = form_a_trabajo.errors
            print(errors)
        return render_template_modal("public/index.html",form_a_trabajo=form_a_trabajo)

@trabajo_bp.route("/api/trabajo/update",  methods=["GET", "POST"])
def update_trabajo():
    ajax = '_ajax' in request.form
    form_u_trabajo=form_update_trabajo()
    if request.method == 'POST':
        if form_u_trabajo.validate_on_submit():
            trabajo = form_u_trabajo.clave_trabajo_u.data
            id_cliente = form_u_trabajo.clave_cliente_u.data
            nombre_cliente = form_u_trabajo.nombre_cliente_trabajo_u.data
            telefono_cliente = form_u_trabajo.telefono_cliente_trabajo_u.data
            telefono_adicional = request.form['telefono_adicional_u']
            datos_auto = form_u_trabajo.datos_auto_trabajo_u.data
            descripcion_trabajo = form_u_trabajo.descripcion_trabajo_u.data
            fecha = form_u_trabajo.fecha_trabajo_u.data
            pago = form_u_trabajo.pago_trabajo_u.data
            if request.form.get('is_actualiza'):
                procedimientos.llamar_procedimiento("sp_actualizarCliente",[id_cliente, nombre_cliente,telefono_cliente,None])
            if ajax:
                return ''
            procedimientos.llamar_procedimiento("sp_actualizarTrabajo",[trabajo,id_cliente,datos_auto,descripcion_trabajo,fecha,None,pago,None])
            return redirect ("/")
        else:
            errors = form_u_trabajo.errors
            print(errors)
        return render_template_modal("public/index.html",form_u_trabajo=form_u_trabajo)

@trabajo_bp.route("/api/trabajo/add_responsable_trabajo",  methods=["GET", "POST"])
def add_responsable_trabajo():
    if request.method == "POST":
        fecha = request.form['fecha_ing_responsable']
        responsable = request.form['responsables_trabajo']
        trabajo = request.form['id_trabajo_trabajadores']
        print("Trabajo",trabajo)
        if(trabajo=='' or trabajo is None):
            print("Esta vacio?")
            trabajo = procedimientos.llamar_sentencia("SELECT max(idTrabajo)+1 from trabajo",False)[0]
        print(int(responsable),int(trabajo[0]),datetime.strptime(fecha,"%Y-%m-%d"))
        resultado=procedimientos.llamar_procedimiento("sp_agregarResponsableTrabajo",[int(responsable),int(trabajo),datetime.strptime(fecha,"%Y-%m-%d")])
        return jsonify({'status':resultado})

"""
DECLARE existe int default (select count(*) FROM `bd_calleros_tapiceria`.`responsable_trabajo`
WHERE `idTrabajador`=idTrabajador AND `idTrabajo`=idTrabajo AND `fecha`=fecha);
if existe = 0 then
	INSERT INTO `bd_calleros_tapiceria`.`responsable_trabajo`
	(`idTrabajador`, `idTrabajo`, `fecha`)
	VALUES (idTrabajador,idTrabajo,fecha);
end if;
"""

@trabajo_bp.route("/api/trabajo/delete_responsable_trabajo",  methods=["GET", "POST"])
def remover_responsable_trabajo():
    registro = request.form.get('id_registro')
    responsable = request.form.get('id_trabajador')
    procedimientos.llamar_procedimiento("sp_bajaResponsableTrabajo",[registro,responsable])
    return jsonify({'status':'Ok'})


@trabajo_bp.route("/api/trabajo/update_status",  methods=["GET", "POST"])
def finalizar_trabajo():
    return ''

@trabajo_bp.route("/api/trabajo/informacion_trabajo",  methods=["GET", "POST"])
def get_trabajo():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_busqueda("sp_buscarTrabajo",[int(id)])
    responsables=procedimientos.llamar_consulta("sp_buscarResponsablesTrabajo",[int(id)])
    print(responsables)
    return jsonify({'datos_trabajo':resultado,'datos_responsable':responsables})

@trabajo_bp.route("/api/trabajo/get_responsables", methods=["GET","POST"])
def get_responsables():
    id = request.args.get('id', type=int)
    responsables=procedimientos.llamar_consulta("sp_buscarResponsablesTrabajo",[int(id)])
    return jsonify({'responsables':responsables})


@trabajo_bp.route("/api/trabajo/trabajos_cliente",  methods=["GET", "POST"])
def get_trabajos_clientes():
    id = request.args.get('id', type=int)
    resultado=procedimientos.llamar_consulta("sp_buscarTrabajosCliente",[int(id)])
    print("sp_buscarTrabajosCliente",int(id))
    print(resultado)
    return jsonify(resultado)