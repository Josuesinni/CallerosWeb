from app.database import get_cursor
from flask import jsonify
from datetime import datetime, date, time
#Crud basico
def llamar_procedimiento(nombre_procedimiento:str,parametros):
    try:
        cur = get_cursor()
        resu=cur.callproc(nombre_procedimiento, parametros)
        cur.connection.commit()
        print(resu)
        return True
    except Exception as e:
        print (e)
        return False

def llamar_consulta(nombre_procedimiento: str, parametros):
    try:
        cur = get_cursor()
        sentencia=cur.callproc(nombre_procedimiento, parametros)
        resultado=cur.fetchall()
        print(sentencia)
        print(resultado)
        return resultado
    except Exception as e:
        print (e)
        return False

def llamar_busqueda(nombre_procedimiento: str, parametros):
    try:
        cur = get_cursor()
        sentencia=cur.callproc(nombre_procedimiento, parametros)
        resultado=cur.fetchone()
        print(sentencia)
        print(resultado)
        return resultado
    except Exception as e:
        print (e)
        return False

def llamar_vistas(nombre_vista:str, parametros:str):
    cur = get_cursor()
    sentencia="SELECT * FROM "+nombre_vista
    if(parametros):
        sentencia+=" WHERE "+parametros+";"
    print(sentencia)
    cur.execute(sentencia) 
    result = cur.fetchall()
    print(result)
    return result

def llamar_sentencia(sentencia:str,tipo: bool):
    cur = get_cursor()
    cur.execute(sentencia) 
    if(tipo):
        return cur.fetchall()
    return cur.fetchone()
    
def parseDate(row):
    return [
        datetime.combine(col, time.min).isoformat() + "Z" if isinstance(col, date) and not isinstance(col, datetime)
        else col.isoformat() + "Z" if isinstance(col, datetime)
        else col
        for col in row
    ]