const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Configuración de dotenv
dotenv.config({ path: './env/.env' });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configura Express para buscar vistas en views y en AlphaDashboard
app.set('views', [
    path.join(__dirname, 'views')
]);
app.set('view engine', 'ejs');

// Configuración de archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/mail', express.static(path.join(__dirname, 'mail')));
app.use('/scss', express.static(path.join(__dirname, 'scss')));

// Configuración de express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Conexión a la base de datos
const connection = require('./database/db');

// Middleware para no almacenar caché
app.use((req, res, next) => {
    if (!req.session.loggedin) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    }
    next();
});

// Rutas estáticas (otros formularios)
const staticRoutes = [
    { path: '/about', view: 'about', title: 'About Us' },
    { path: '/contact', view: 'contact', title: 'Contact Us' },
    { path: '/login', view: 'login', title: 'Login' },
    { path: '/register', view: 'register', title: 'Register' },
    { path: '/price', view: 'price', title: 'Pricing' },
    { path: '/privacy', view: 'privacy', title: 'Privacy Policy' },
    { path: '/service', view: 'service', title: 'Our Services' },
    { path: '/products', view: 'products', title: 'Our Products' },
    { path: '/404', view: '404', title: 'Page not Found' },
];

// Rutas estáticas para las vistas
staticRoutes.forEach(({ path, view, title }) => {
    app.get(path, (req, res) => res.render(view, { title }));
});

// Rutas para renderizar vistas
app.get('/', (req, res) => {
    res.render('index', {
        login: req.session.loggedin || false,
        name: req.session.name || 'Debe iniciar sesión',
    });
});


// Levantar el servidor
app.listen(3000, () => {
    console.log('SERVER RUNNING IN http://localhost:3000');
});