from flask_mysqldb import MySQL

mysql = MySQL()

def get_cursor():
    return mysql.connection.cursor()