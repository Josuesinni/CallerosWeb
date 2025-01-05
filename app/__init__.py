
from flask import Flask
from flask_modals import Modal
from .routes import (navegacion_bp, clientes_bp, dashboard_bp, 
                        citas_bp, trabajadores_bp, trabajo_bp, 
                        pago_trabajador_bp,pago_cliente_bp, prestamo_bp)

modal = Modal()
def create_app():
    app = Flask(__name__)
    app.config["MYSQL_HOST"]="localhost"
    app.config["MYSQL_USER"] = "root"
    app.config["MYSQL_PASSWORD"] = "root"
    app.config["MYSQL_DB"] = "bd_calleros_tapiceria"
    app.config['SECRET_KEY'] = 'secretkey'
    app.static_folder="static"
    app.register_blueprint(navegacion_bp)
    app.register_blueprint(clientes_bp)
    app.register_blueprint(trabajo_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(citas_bp)
    app.register_blueprint(trabajadores_bp)
    app.register_blueprint(pago_trabajador_bp) 
    app.register_blueprint(pago_cliente_bp)    
    app.register_blueprint(prestamo_bp)    
    modal.init_app(app)
    return app

app = create_app()

from app.database import mysql
mysql.init_app(app)
