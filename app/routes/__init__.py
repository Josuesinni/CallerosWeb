from flask import abort, render_template, redirect, url_for, request, jsonify, flash
from flask import Blueprint
navegacion_bp = Blueprint('navegacion', __name__, template_folder='templates')
trabajadores_bp = Blueprint('trabajadores', __name__, template_folder='templates')
trabajo_bp = Blueprint('trabajo', __name__, template_folder='templates')
pago_cliente_bp = Blueprint('pago_cliente', __name__, template_folder='templates')
pago_trabajador_bp = Blueprint('pago_trabajador', __name__, template_folder='templates')
clientes_bp = Blueprint('clientes', __name__, template_folder='templates')
dashboard_bp = Blueprint('dashboard', __name__, template_folder='templates')
citas_bp = Blueprint('citas', __name__, template_folder='templates')
prestamo_bp = Blueprint('prestamos', __name__, template_folder='templates')

from . import navegacion
from . import clientes
from . import dashboard
from . import trabajador
from . import citas
from . import pago_cliente
from . import pago_trabajador
from . import trabajo
from . import prestamo
