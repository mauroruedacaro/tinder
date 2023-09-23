const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// Configurar Sequelize y la conexión a la base de datos
const sequelize = new Sequelize('database', 'usuario', 'contraseña', {
    host: 'localhost',
  dialect: 'postgres', 
});

// Definir modelos Sequelize para las tablas
const User = sequelize.define('User', {
    nombre: Sequelize.STRING,
    correoElectronico: Sequelize.STRING,
  // Agregar otros campos de perfil aquí
});

const Skill = sequelize.define('Skill', {
    nombre: Sequelize.STRING,
});

const UserSkill = sequelize.define('UserSkill', {
  // Puntuación de habilidades y otros campos relacionados
});

const JobOffer = sequelize.define('JobOffer', {
    título: Sequelize.STRING,
    descripción: Sequelize.TEXT,
  // Otros campos relacionados con la oferta
});

// Definir relaciones entre los modelos
User.belongsToMany(Skill, { through: UserSkill });
Skill.belongsToMany(User, { through: UserSkill });

User.hasMany(JobOffer);
JobOffer.belongsTo(User);

// Configurar middleware
app.use(bodyParser.json());

// Rutas de la API
app.get('/api/users', async (req, res) => {
  // Implementa la lógica para buscar usuarios según sus habilidades
    try {
    // Por ejemplo, puedes usar Sequelize para hacer la consulta
    const users = await User.findAll({
        include: [{
        model: Skill,
        where: { nombre: 'Habilidad a buscar' }, // Modifica esto según la habilidad deseada
        }],
    });
    res.json(users);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al buscar usuarios.' });
    }
});

app.post('/api/joboffers', async (req, res) => {
  // Implementa la lógica para crear una oferta de trabajo
    try {
    const { título, descripción, userId } = req.body;
    const jobOffer = await JobOffer.create({ título, descripción, userId });
    res.json(jobOffer);
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la oferta de trabajo.' });
    }
});

// Iniciar el servidor
sequelize.sync().then(() => {
    app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
    });
});
