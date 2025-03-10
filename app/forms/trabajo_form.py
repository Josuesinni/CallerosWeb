from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, SelectField, TextAreaField, DateField
from wtforms.validators import DataRequired, Email, Length, Optional

class form_add_trabajo(FlaskForm):
    telefono_cliente_trabajo_a = StringField('Teléfono:', validators=[DataRequired(), Length(max=15)])
    datos_auto_trabajo_a = StringField('Auto:', validators=[DataRequired()])
    descripcion_trabajo_a = TextAreaField('Descripción:', validators=[DataRequired()])
    fecha_trabajo_a = DateField('Fecha de Ingreso:',validators=[Optional()])
    pago_trabajo_a = StringField('Total a Pagar:', validators=[Length(max=15)],default='0')
    

class form_update_trabajo(FlaskForm):
    clave_trabajo_u = StringField('', validators=[DataRequired()], render_kw={'style':'display:none;'})
    clave_cliente_u = StringField('', validators=[DataRequired()], render_kw={'style':'display:none;'})
    nombre_cliente_trabajo_u = StringField('Nombre del Cliente:', validators=[DataRequired()])
    telefono_cliente_trabajo_u = StringField('Teléfono:', validators=[DataRequired(), Length(max=15)])
    datos_auto_trabajo_u = StringField('Auto:', validators=[DataRequired()])
    descripcion_trabajo_u = TextAreaField('Descripción:', validators=[DataRequired()])
    pago_trabajo_u = StringField('Total a Pagar:', validators=[DataRequired(), Length(max=15)])
    fecha_trabajo_u = DateField('Fecha de Ingreso:',validators=[Optional()])
    