from flask_login import UserMixin
from app.database import get_cursor
from flask_login import current_user
import hashlib

#Se crea la clase User en donde se guardan los datos del usuario
class User(UserMixin):
    def __init__(self, id, usuario, password):
        self.id = id
        self.usuario = usuario
        self.password = password
    #Hash a la contraseña
    def set_password(self, password):
        hash = hashlib.sha256(password.encode())
        self.password = hash.hexdigest()
    #Verifica la contraseña
    def check_password(self, password):
        hash = hashlib.sha256(password.encode())
        return self.password==hash.hexdigest()

def check_password(user_password, password):
    hash = hashlib.sha256(password.encode())
    return user_password==hash.hexdigest()

# Función para obtener el usuario por su ID
def get_user_by_id(user_id):
    cursor = get_cursor()
    cursor.execute("""SELECT idusuario, usuario, password FROM usuario WHERE idusuario = %s""", [user_id])
    user_data = cursor.fetchone()
    if user_data:
        return User(user_data[0], user_data[1], user_data[2])
    return None

# Función para obtener el usuario por su usuario
def get_user_by_user(usuario):
    cursor = get_cursor()
    cursor.execute("""SELECT idusuario, usuario, password FROM usuario WHERE usuario = %s""", [usuario])
    user_data = cursor.fetchone()
    if user_data is not None:
        return User(user_data[0], user_data[1], user_data[2])
    return None