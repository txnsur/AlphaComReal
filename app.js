const express = require('express');
const app = express();
const path = require('path');

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

// Ruta para la página 'about'
app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

// Ruta para la página 'blog'
app.get('/blog', (req, res) => {
    res.render('blog', { title: 'Our Blog' });
});

// Ruta para la página 'contact'
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});

// Ruta para la página 'login'
app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Ruta para la página 'register'
app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

// Ruta para la página 'price'
app.get('/price', (req, res) => {
    res.render('price', { title: 'Pricing' });
});

// Ruta para la página 'privacy'
app.get('/privacy', (req, res) => {
    res.render('privacy', { title: 'Privacy Policy' });
});

// Ruta para la página 'service'
app.get('/service', (req, res) => {
    res.render('service', { title: 'Our Services' });
});

// Ruta para la página 'single'
app.get('/single', (req, res) => {
    res.render('single', { title: 'Single Post' });
});

// Registro de usuario
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { user: user, name: name, rol: rol, pass: passwordHash }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    });
});

// Autenticación de usuario
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if (results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name;
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
        });
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "¡Por favor ingrese usuario y contraseña!",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
});

// Cerrar sesión
app.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    })
});

// Middleware para no almacenar caché
app.use(function (req, res, next) {
    if (!req.session.loggedin)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

// Levantar el servidor
app.listen(3000, (req, res) => {
    console.log('SERVER RUNNING IN http://localhost:3000');
});
