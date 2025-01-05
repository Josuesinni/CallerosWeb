from app.utils import procedimientos
from app.forms.cliente_form import form_add_cliente, form_update_cliente, form_delete_cliente
from flask_modals import render_template_modal
from . import clientes_bp, jsonify, request, redirect, render_template

@clientes_bp.route("/clientes")
def vista_clientes():
    form_a_cliente=form_add_cliente()
    form_u_cliente=form_update_cliente()
    form_d_cliente=form_delete_cliente()
    return render_template(
        "private/clientes/lista_clientes.html",
        titulo="Clientes",
        form_a_cliente=form_a_cliente,
        form_u_cliente=form_u_cliente,
        form_d_cliente=form_d_cliente
    )

@clientes_bp.route("/api/cliente/lista-clientes")
def lista_clientes():
    result=procedimientos.llamar_vistas("clientes",None)
    return jsonify(result)

@clientes_bp.route("/api/cliente/lista-clientes-con-trabajos")
def lista_clientes_con_trabajos():
    result=procedimientos.llamar_consulta("sp_consultaClientesConTrabajoPendientes",[])
    print("lista_clientes_con_trabajos",result)
    return jsonify(result)

@clientes_bp.route("/api/cliente/add",methods=['POST'])
def add_cliente():
    ajax = '_ajax' in request.form
    form_a_cliente=form_add_cliente()
    if request.method == 'POST':
        if form_a_cliente.validate_on_submit():
            nombre=form_a_cliente.nombre.data
            telefono=form_a_cliente.telefono.data
            if ajax:
                return ''
            procedimientos.llamar_procedimiento("sp_agregarCliente",[nombre,telefono])
            return redirect ("/")
        else:
            errors = form_a_cliente.errors
            print(errors)
        return render_template_modal("private/clientes/lista_clientes.html",form_a_cliente=form_a_cliente)

@clientes_bp.route("/api/cliente/update")
def update_cliente():
    ajax = '_ajax' in request.form
    form_u_cliente=form_update_cliente()
    if request.method == 'POST':
        if form_u_cliente.validate_on_submit():
            id=form_u_cliente.id_cliente.data
            nombre=form_u_cliente.nombre.data
            telefono=form_u_cliente.telefono.data
            if ajax:
                return ''
            result=procedimientos.llamar_procedimiento("sp_actualizarCliente",[id,nombre,telefono])
            return redirect ("/")
        else:
            errors = form_u_cliente.errors
            print(errors)
        return render_template_modal("private/clientes/lista_clientes.html",form_u_cliente=form_u_cliente)

@clientes_bp.route("/api/cliente/delete")
def delete_cliente():
    ajax = '_ajax' in request.form
    form_d_cliente=form_delete_cliente()
    if request.method == 'POST':
        if form_d_cliente.validate_on_submit():
            id=form_d_cliente.id_cliente.data
            if ajax:
                return ''
            result=procedimientos.llamar_procedimiento("sp_bajaCliente",[id])
            return redirect ("/")
        else:
            errors = form_d_cliente.errors
            print(errors)
        return render_template_modal("private/clientes/lista_clientes.html",form_d_cliente=form_d_cliente)