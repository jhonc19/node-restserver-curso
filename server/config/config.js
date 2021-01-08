// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//Vencimiento Token
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//Seed de autenticación
process.env.SEED = process.env.SEED || 'seed-development';

//Google Client Id
process.env.CLIENT_ID = process.env.CLIENT_ID || '1073466481152-5o76oj96alq8kjucjaj3l4jj6i2071mc.apps.googleusercontent.com';

//Base de datos
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;