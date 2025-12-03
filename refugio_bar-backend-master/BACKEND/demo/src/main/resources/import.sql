-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES ('ADMIN');
INSERT INTO roles (nombre_rol) VALUES ('MESERO');
INSERT INTO roles (nombre_rol) VALUES ('CLIENTE');

-- Insertar usuario administrador (password: admin123)
INSERT INTO usuarios (id_rol, nombre, apellido, email, password, telefono)
VALUES (1, 'Admin', 'Sistema', 'admin@restaurante.com', '$2a$10$rDkPvvAFV8kqwvKJzwlRv.i.q.wz1w1pz0bYaK.jW9Mh7ZOKoxqhu', '123456789');

-- Insertar mesas
INSERT INTO mesas (numero, capacidad, estado) VALUES (1, 4, 'Disponible');
INSERT INTO mesas (numero, capacidad, estado) VALUES (2, 2, 'Disponible');
INSERT INTO mesas (numero, capacidad, estado) VALUES (3, 6, 'Disponible');
INSERT INTO mesas (numero, capacidad, estado) VALUES (4, 4, 'Disponible');
INSERT INTO mesas (numero, capacidad, estado) VALUES (5, 8, 'Disponible');