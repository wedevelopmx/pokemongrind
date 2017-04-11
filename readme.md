# WEDEVELOP - Pokemongrind

## Instalacion

1. Download

   ```
   git clone https://github.com/wedevelopmx/pokemongrind.git
   ```

2. NPM dependencies

   ```
   npm install
   ```

3. Bower Dependencies

   ```
   bower install
   ```
   Note: We are using [flatkit theme](http://flatfull.com/themes/flatkit) stored in our private repositories, you have to buy license and modify bower references.

4. Building App

   ```
   grunt build
   ```

5. Define the environment

  You have to define the environment you will be working through a system environment variable.

  ```
   export NODE_ENV=development|production
  ```

6. Database Initialization

  Once you have install the database, you have to run a script in order to populate some basic information.

  ```
    node ./bin/initialize
  ```

7. Running application

   ```
   npm start
   ```

   Now you can access the application on [http://localhost:3000](http://localhost:3000)

## Production deployment

1. Install mysql database using [this tutorial](https://www.digitalocean.com/community/tutorials/a-basic-mysql-tutorial). It is important you define a good password for root.

2. Then login into mysql and create a new database and user for our application.

    ```
    create database pokemongrind;
    create user '<your user>'@'localhost' identified by '<your password>';
    grant all privileges on pokemongrind.* to '<your user>'@'localhost';
    ```

3. Finally replace the database credentials in /app/config/config.json

## License

Copyright (c) 2016 [WeDevelop](http://wedevelop.mx/ "WeDevelop")

No permission is granted to use this code in any fashion. Please contact company in order to get a demo.
