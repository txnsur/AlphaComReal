CREATE DATABASE alphacom;

USE alphacom;

CREATE TABLE userType (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE reportType (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE reportTypeSpecification (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(100) NOT NULL,
    reportType INT,
    FOREIGN KEY (reportType) REFERENCES reportType(code)
);

CREATE TABLE category (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE enterprise (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50),
    phoneNumber VARCHAR(15),
    stores INT,
    direction VARCHAR(100)
);

CREATE TABLE stores (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    direction VARCHAR(100),
    email VARCHAR(50),
    phoneNumber VARCHAR(15),
    notes VARCHAR(200),
    enterprise INT NOT NULL,
    FOREIGN KEY (enterprise) REFERENCES enterprise(code)
);

CREATE TABLE user (
    code INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    registerBy INT,
    userType INT NOT NULL,
    FOREIGN KEY (userType) REFERENCES userType(code)
);

CREATE TABLE workerStatus (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE worker (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    RFC VARCHAR(13),
    IMSS VARCHAR(11),
    direction VARCHAR(100),
    email VARCHAR(50),
    phoneNumber VARCHAR(15),
    entryDate DATE,
    status INT NOT NULL,
    user INT,
    FOREIGN KEY (user) REFERENCES user(code),
    FOREIGN KEY (status) REFERENCES workerStatus(code)
);

CREATE TABLE reportStatus (
    code INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    description VARCHAR(100) NOT NULL
);

CREATE TABLE report (
    code INT PRIMARY KEY AUTO_INCREMENT,
    startDate DATE NOT NULL,
    endDate DATE,
    description VARCHAR(300) NOT NULL,
    notes VARCHAR(300),
    enterprise INT NOT NULL,
    store INT,
    status INT NOT NULL,
    type INT NOT NULL,
    specification INT,
    solvedBy INT,
    FOREIGN KEY (enterprise) REFERENCES enterprise(code),
    FOREIGN KEY (store) REFERENCES stores(code),
    FOREIGN KEY (status) REFERENCES reportStatus(code),
    FOREIGN KEY (type) REFERENCES reportType(code),
    FOREIGN KEY (specification) REFERENCES reportTypeSpecification(code),
    FOREIGN KEY (solvedBy) REFERENCES worker(code)
);

CREATE TABLE reportsAttendHistory (
    worker INT,
    report INT,
    reason VARCHAR(100),
    FOREIGN KEY (worker) REFERENCES worker(code),
    FOREIGN KEY (report) REFERENCES report(code)
);

CREATE TABLE images (
    code INT PRIMARY KEY AUTO_INCREMENT,
    image VARCHAR(200) NOT NULL,
    report INT NOT NULL,
    FOREIGN KEY (report) REFERENCES report(code)
);

-- Inserts

INSERT INTO userType (name, description) VALUES 
('Admin', 'Administrador del sistema'),
('Worker', 'Usuario trabajador');

INSERT INTO reportType (name, description) VALUES 
('Technical', 'Reporte técnico de fallas'),
('Service', 'Reporte de solicitud de servicio'),
('Complaint', 'Reporte de quejas');

INSERT INTO reportTypeSpecification (name, description, reportType) VALUES 
('Network Issue', 'Problemas relacionados con la red', 1),
('Software Bug', 'Errores de software', 1),
('Maintenance', 'Solicitud de mantenimiento', 2),
('Product Quality', 'Quejas sobre calidad de producto', 3);

INSERT INTO category (name, description) VALUES 
('Technology', 'Productos tecnológicos'),
('Services', 'Servicios generales'),
('Retail', 'Tienda al por menor');

INSERT INTO enterprise (name, email, phoneNumber, stores, direction) VALUES 
('AlphaTech', 'contact@alphatech.com', '555-123-4567', 3, 'Calle Tecnología 123'),
('BetaServices', 'info@betaservices.com', '555-765-4321', 5, 'Av. Servicios 456');

INSERT INTO stores (name, direction, email, phoneNumber, notes, enterprise) VALUES 
('Store 1', 'Calle 1, Ciudad A', 'store1@alphatech.com', '555-111-2222', 'Sucursal principal', 1),
('Store 2', 'Calle 2, Ciudad B', 'store2@alphatech.com', '555-333-4444', NULL, 1),
('Store 3', 'Calle 3, Ciudad C', 'store3@betaservices.com', '555-555-6666', 'Sucursal de servicios', 2);

INSERT INTO user (email, password, registerBy, userType) VALUES 
('admin@alphacom.com', 'admin123', NULL, 1),
('worker@alphacom.com', 'worker123', 1, 2);

INSERT INTO workerStatus (name, description) VALUES 
('Active', 'Trabajador activo en la empresa'),
('Inactive', 'Trabajador inactivo o dado de baja');

INSERT INTO worker (name, last_name, RFC, IMSS, direction, email, phoneNumber, entryDate, status, user) VALUES 
('John', 'Doe', 'DOEJ760101AAA', '12345678901', 'Calle Trabajo 123', 'john.doe@alphatech.com', '555-888-9999', '2020-01-15', 1, 2),
('Jane', 'Smith', 'SMIJ800202BBB', '98765432101', 'Av. Servicios 456', 'jane.smith@betaservices.com', '555-777-6666', '2021-06-20', 1, NULL);

INSERT INTO reportStatus (name, description) VALUES 
('Open', 'Reporte abierto'),
('In Progress', 'Reporte en progreso'),
('Closed', 'Reporte cerrado');

INSERT INTO report (startDate, endDate, description, notes, enterprise, store, status, type, specification, solvedBy) VALUES 
('2024-01-01', NULL, 'Problema de conexión a internet', NULL, 1, 1, 1, 1, 1, 1),
('2024-02-15', '2024-02-20', 'Solicitud de mantenimiento preventivo', 'Revisar sistema HVAC', 2, 3, 3, 2, 3, 2);

INSERT INTO reportsAttendHistory (worker, report, reason) VALUES 
(1, 1, 'Trabajador asignado por disponibilidad'),
(2, 2, 'Especialista en mantenimiento asignado');

INSERT INTO images (image, report) VALUES 
('https://example.com/images/report1.jpg', 1),
('https://example.com/images/report2.jpg', 2);
