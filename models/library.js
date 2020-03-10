const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    class Book extends Model {};

    // Book model attributes
    Book.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a title"
                },
                notEmpty: {
                    msg: "Please enter a title"
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a title"
                },
                notEmpty: {
                    msg: "Please enter a title"
                }
            }
        },
        genre: {
            type: DataTypes.STRING
        },
        year: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        timestamps: true
    });

    return Book;
};