const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Inicialización
const app = express();

// Configuración de dotenv
dotenv.config({ path: './env/.env' });

// Configuración de middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configura vistas
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'ejs');

// Configuración de archivos estáticos
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/mail', express.static(path.join(__dirname, 'mail')));
app.use('/scss', express.static(path.join(__dirname, 'scss')));

// Configuración de express-session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);

// Conexión a la base de datos
const connection = require('./database/db');

// Middleware para redirigir a HTTPS
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
});

// Middleware para evitar caché
app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

// Rutas estáticas (otros formularios)
const staticRoutes = [
    { path: '/about', view: 'about', title: 'About Us' },
    { path: '/contact', view: 'contact', title: 'Contact Us' },
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

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', {
        login: req.session.loggedin || false,
        name: req.session.name || 'Debe iniciar sesión',
    });
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
);
