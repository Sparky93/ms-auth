## Prerequisites (for these steps, we'll assume we're in project's root folder)

1. ```npm install```   

   This will install all the required modules and sub-modules.

2. ```touch ./config/mysql.conf.js```

   This will create a config file which is going to be used for your **MySQL** instance.

   You can follow this example:

   ```javascript
   const Sequelize = require('sequelize');
   module.exports = new Sequelize('db_name', 'db_user', 'db_pass', {
    host: 'localhost',
    dialect: 'mysql', // if you want to use something else, is enough to change the dialect
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
   });
   ```

## How to start the process

1. ```npm start```
