from flask_wtf import FlaskForm
from wtforms import StringField, DateField, SelectField
from wtforms.validators import DataRequired, Length
from app.utils import procedimientos

class form_add_pago_trabajador(FlaskForm):
    id_trabajador = StringField('Id Trabajador:', validators=[DataRequired()],render_kw={"style":"display:none"})
    total_a = StringField('Total:',validators=[DataRequired()])
    fecha_a = DateField('Fecha:',validators=[DataRequired()])