-- Elimina datos existentes (opcional)
DELETE FROM SECTORES;

-- Insertar los barrios de Cartagena con coeficientes realistas (valores negativos = pérdida de terreno)
INSERT INTO SECTORES (nombre, coeficiente_a, coeficiente_b, coeficiente_c, coeficiente_d) VALUES
                                                                                              ('Bocagrande',    -0.012, -0.008, -0.15, 2.8),
                                                                                              ('Castillogrande',-0.010, -0.009, -0.12, 3.0),
                                                                                              ('El Laguito',    -0.014, -0.011, -0.18, 2.5),
                                                                                              ('La Boquilla',   -0.008, -0.006, -0.10, 3.2),
                                                                                              ('Marbella',      -0.011, -0.007, -0.14, 2.9);