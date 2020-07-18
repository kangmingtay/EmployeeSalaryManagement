# Employee Salary Management MVP

> .env file will be uploaded for the purpose of development/testing in your local environment only

## Set up development environment / run application
1. Run `docker-compose up app` in the root directory to start the nodejs backend service. 
2. Run `docker-compose up web` in the root directory to web service.

## Set up test environment
1. Run `docker-compose up testdb` in the root directory to start the test database.
2. Run `npm run test` in the root directory to run all unit tests. 


## Assumptions
1. CSV File will always contain a header
2. Uploading a file that contains a new id but existing login will result in an error.
3. Uploading a file that contains an existing id with a different but existing login will result in a swap of logins between the 2 affected rows in the table.
   

