from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, SelectField, TextAreaField, DateField
from wtforms.validators import DataRequired, Email, Length, Optional

class form_add_cita(FlaskForm):
    telefono_cliente_cita_a = StringField('Teléfono:', validators=[DataRequired(), Length(max=15)])
    descripcion_cita_a = TextAreaField('Descripción:')
    agendar_cita = SelectField('Agendar Cita:',choices=[('0', 'No'), ('1', 'Si')])
    fecha_cita_a = DateField('Fecha de la Cita:',validators=[Optional()])

class form_update_cita(FlaskForm):
    id_cita_u = StringField('No. Cita:', validators=[DataRequired()], render_kw={"style":"display:none"})
    descripcion_cita_u = TextAreaField('Descripción:')
    fecha_cita_u = DateField('Fecha de la Cita:',validators=[Optional()])
    estatus_cita_u = SelectField('Estado de la cita:',choices=[('0', 'Finalizada'), ('1', 'En espera'),('2', 'Perdida')])

class form_delete_cita(FlaskForm):
    id_cita_u = StringField('No. Cita:', validators=[DataRequired(), Length(max=15)])