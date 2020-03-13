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
                    msg: "Please enter the title"
                },
                notEmpty: {
                    msg: "Please enter the title"
                }
            }
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter the author"
                },
                notEmpty: {
                    msg: "Please enter the auhtor"
                }
            }
        },
        genre: {
            type: DataTypes.STRING
        },
        year: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    arg: true,
                    msg: "Year of publication has to be a number: YYYY"
                },
                len: {
                    arg: [0,4],
                    msg: "Year can by only 4 numbers long: YYYY"
                }
            }
        }
    }, {
        sequelize,
        timestamps: true
    });

    return Book;
};