const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs'); // Para leer los archivos del sistema de archivos

// Configuración de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuración de archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/mail', express.static(path.join(__dirname, 'mail')));
app.use('/scss', express.static(path.join(__dirname, 'scss')));

// Configuración de dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

// Configuración de bcryptjs y express-session
const bcrypt = require('bcryptjs');
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Conexión a la base de datos
const connection = require('./database/db');

// Ruta para la página de inicio
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
});

// Ruta para mostrar los archivos en la carpeta 'C:/uploads'
app.get('/files', (req, res) => {
    const uploadDir = 'C:/uploads'; // Ruta donde se encuentran los archivos en el sistema
    const currentPath = req.query.path || ''; // Si no se pasa un parámetro, mostramos la raíz

    const fullPath = path.join(uploadDir, currentPath);

    // Verificar si la carpeta existe antes de intentar leerla
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(500).send('La carpeta no existe');
        }

        // Leer el directorio
        fs.readdir(fullPath, (err, files) => {
            if (err) {
                return res.status(500).send('No se pudo listar los archivos');
            }

            // Filtrar carpetas y archivos
            const directories = files.filter(file => fs.statSync(path.join(fullPath, file)).isDirectory());
            const fileNames = files.filter(file => fs.statSync(path.join(fullPath, file)).isFile());

            // Calcular el path de la carpeta superior (parentPath)
            const parentPath = currentPath ? path.dirname(currentPath) : ''; // Si hay un path actual, calculamos el path superior

            // Mostrar las carpetas y archivos en la vista
            res.render('files', {
                path: path, // Pasamos el módulo path a la vista
                directories: directories,
                files: fileNames,
                currentPath: currentPath, // Ruta actual para que podamos navegar
                parentPath: parentPath // Ruta para "volver atrás"
            });
        });
    });
});

// Ruta para descargar los archivos
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('C:/uploads', fileName);

    // Verificar si el archivo existe
    fs.exists(filePath, (exists) => {
        if (exists) {
            // Iniciar la descarga del archivo
            res.download(filePath, (err) => {
                if (err) {
                    res.status(500).send('Error al descargar el archivo');
                }
            });
        } else {
            res.status(404).send('Archivo no encontrado');
        }
    });
});

// Rutas para las páginas de login, register, etc. (como las tenías)
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/blog', (req, res) => {
    res.render('blog', { title: 'Our Blog' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Levantar el servidor
app.listen(3000, () => {
    console.log('SERVER RUNNING IN http://localhost:3000');
});
