const sequelize = require('./index');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
    'User', 
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('admin', 'customer'),
            allowNull: false,
            defaultValue: 'customer'
        }

    }, {}
    
  );

  User.sync()
            .then(() => { console.log("User Model Sync Completed")})
            .catch((err) => {console.log("Error in Syncing User Model", err)})                       //sync() -> it returns a promise         

  module.exports = User;