## Prerequisites (for these steps, we'll assume we're in project's root folder)

1. ```npm install```   

   This will install all the required modules and sub-modules.

2. ```touch .env```

   This will create an environment file for global variables which is going to be used for a lot of components.

   You can follow this example:

   ```
   PASSWORD_STRENGTH=7
   APP_SECRET_KEY='keyboard cat 4 ever'
   APP_TOKEN_LIFETIME=129600
   APP_HOST=localhost
   APP_PORT=8080
   MAIN_WALLET_ID=38816e1d-c647-4f4c-ae32-f13df1de2d6e
   MAIN_WALLET_PASSWORD=iLuvMyKittyKat
   DATABASE_NAME=serviceless
   DATABASE_USER=root
   DATABASE_PASSWORD=rootpass
   DATABASE_DIALECT=mysql
   ```

## How to start the process

1. ```npm start```
