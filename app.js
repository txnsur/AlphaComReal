const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Configuración de dotenv
dotenv.config({ path: './env/.env' });

// Configuración de middleware
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

// Registro de usuario
app.post('/register', async (req, res) => {
    const { email, name, role, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 8);
        connection.query(
            'INSERT INTO users (email, name, role, password) VALUES (?, ?, ?, ?)',
            [email, name, role, hashedPassword],
            (error) => {
                if (error) {
                    console.error(error);
                    res.render('register', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Error durante el registro.",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'register'
                    });
                } else {
                    res.render('register', {
                        alert: true,
                        alertTitle: "Registration",
                        alertMessage: "¡Registro exitoso!",
                        alertIcon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        ruta: ''
                    });
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
});

// Autenticación del usuario
app.post('/auth', async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        connection.query(
            'SELECT * FROM user WHERE email = ?',
            [email],
            async (error, results) => {
                if (error) {
                    console.error("Error en la consulta:", error);
                    return res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Hubo un problema con el servidor. Intenta más tarde.",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }

                if (results.length === 0) {
                    return res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Email no encontrado.",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }

                const user = results[0];

                let isMatch;
                if (user.password && user.password.length > 60) {
                    isMatch = await bcrypt.compare(password, user.password);
                } else {
                    isMatch = password === user.password;
                }

                if (!isMatch) {
                    return res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "Contraseña incorrecta.",
                        alertIcon: 'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    });
                }
                req.session.loggedin = true;
                req.session.name = user.name;
                req.session.email = user.email;

                res.redirect('/dashboard');
            }
        );
    } else {
        return res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "¡Por favor ingrese email y contraseña!",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }
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
