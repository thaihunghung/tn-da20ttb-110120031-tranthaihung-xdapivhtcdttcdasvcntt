const { Sequelize } = require('sequelize');

const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

async function Connection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công.');
  } catch (error) {
    console.error(
      'Kết nối thất bại', error
    );
  }
}
Connection();
module.exports = sequelize;
