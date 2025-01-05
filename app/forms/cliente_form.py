from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, SelectField
from wtforms.validators import DataRequired, Email, Length

class form_add_cliente(FlaskForm):
    nombre = StringField('Nombre Completo:', validators=[DataRequired(), Length(max=255)])
    telefono = StringField('Teléfono', validators=[DataRequired(), Length(max=15)])

class form_update_cliente(FlaskForm):
    id_cliente=StringField('No. Cliente: ', validators=[DataRequired()])
    nombre = StringField('Nombre Completo:', validators=[DataRequired(), Length(max=255)])
    telefono = StringField('Teléfono', validators=[DataRequired(), Length(max=15)])

class form_delete_cliente(FlaskForm):
    id_cliente=StringField('No. Cliente: ', validators=[DataRequired()])