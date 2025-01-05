from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, SelectField
from wtforms.validators import DataRequired, Email, Length
from app.utils import procedimientos

class form_add_trabajador(FlaskForm):
    nombre_trabajador_a = StringField('Nombre:', validators=[DataRequired(), Length(max=45)])
    apellido_paterno_a = StringField('Apellido Paterno:', validators=[DataRequired(), Length(max=45)])
    apellido_materno_a = StringField('Apellido Materno:', validators=[DataRequired(), Length(max=45)])
    idRol_a = SelectField("Roles:")
    idNomina_a = SelectField("Nominas:")
    
    def __init__(self):
        super(form_add_trabajador, self).__init__()
        self.idRol_a.choices=[(c[0],c[1]) for c in procedimientos.llamar_vistas("roles")]
        self.idNomina_a.choices=[(c[0],c[1]) for c in procedimientos.llamar_vistas("nominas")]

class form_update_trabajador(FlaskForm):
    id_trabajador_u= StringField('Id trabajador:')
    nombre_trabajador_u = StringField('Nombre:', validators=[DataRequired(), Length(max=45)])
    apellido_paterno_u = StringField('Apellido Paterno:', validators=[DataRequired(), Length(max=45)])
    apellido_materno_u = StringField('Apellido Materno:', validators=[DataRequired(), Length(max=45)])
    idRol_u = SelectField("Roles:")
    idNomina_u = SelectField("Nominas:")
    
    def __init__(self):
        super(form_update_trabajador, self).__init__()
        self.idRol_u.choices=[(c[0],c[1]) for c in procedimientos.llamar_vistas("roles")]
        self.idNomina_u.choices=[(c[0],c[1]) for c in procedimientos.llamar_vistas("nominas")]

class form_delete_trabajador(FlaskForm):
    id_trabajador_d= StringField('Id trabajador:')