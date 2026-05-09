import sqlite3
import os

DB_NAME = "erosion.db"

def initialize_database():
    """
    Crea y puebla la base de datos SQLite
    """

    # Elimina la base de datos anterior si existe
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME)
        print(f"Base de datos '{DB_NAME}' existente eliminada")

    try:
        # Conectar a la base de datos
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        print(f"Base de datos '{DB_NAME}' creada exitosamente")

        # Crear la tabla SECTORES
        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS SECTORES (
                                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                               nombre TEXT UNIQUE NOT NULL,
                                                               coeficiente_a REAL,
                                                               coeficiente_b REAL,
                                                               coeficiente_c REAL,
                                                               coeficiente_d REAL
                       )
                       ''')
        print("Tabla 'SECTORES' creada exitosamente")

        # Insertar los datos
        sectores = [
            ('Bocagrande', -0.012, -0.008, -0.15, 2.8),
            ('Castillogrande', -0.010, -0.009, -0.12, 3.0),
            ('El Laguito', -0.014, -0.011, -0.18, 2.5),
            ('La Boquilla', -0.008, -0.006, -0.10, 3.2),
            ('Marbella', -0.011, -0.007, -0.14, 2.9)
        ]

        for sector in sectores:
            cursor.execute('''
                           INSERT OR IGNORE INTO SECTORES 
                (nombre, coeficiente_a, coeficiente_b, coeficiente_c, coeficiente_d) 
                VALUES (?, ?, ?, ?, ?)
                           ''', sector)

        conn.commit()
        print(f"Se insertaron {len(sectores)} sectores exitosamente")

        # Verificar que se insertaron
        cursor.execute("SELECT * FROM SECTORES")
        rows = cursor.fetchall()
        print("\nDatos en la tabla:")
        for row in rows:
            print(f"  {row}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            conn.close()
            print("\nConexión cerrada")

if __name__ == "__main__":
    initialize_database()