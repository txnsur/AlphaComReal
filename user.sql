CREATE DATABASE users;
USE users;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'data entry') NOT NULL,
    pass VARCHAR(255) NOT NULL
);