# property-search-demo

Demo api to fetch list of properties with input filters

## Setup

- Clone the repository
- Install dependencies using `npm install`
- Import the MySQL dump from [dump](data/dump.sql) in your MySQL database
- Add database config in [config](config.json)
- Start the application using `node server.js`

## DB Setup using docker

- Install Docker
- Pull MySQL Image from Docker repo `docker pull mysql:latest`
- Create mysql container `docker run -p 127.0.0.1:3306:3306 --name=mysql-server -e MYSQL_ROOT_PASSWORD=password -d mysql`
- Pull phpmyadmin image from docker repo `docker pull phpmyadmin/phpmyadmin`
- Create phpMyAdmin container
```
$ docker run --name myadmin -d --link mysql-server:db -p 8080:80 phpmyadmin/phpmyadmin
$ docker exec -it mysql-server /bin/bash
$ mysql -u root -p
// Use `password` as password to login to mysql
```
- Execute the below query to change password to native password
```
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password';
```
- Open https://localhost:8080
- Login using root:password

## Api

- <b>Route:</b> `/properties`
- <b>Method:</b> `POST`
- <b>Request:</b>
  - `lat`: Latitude of user location
  - `lng`: Longitude of user location
  - `budgetMin`: Minimum budget
  - `budgetMax`: Maximum budget
  - `bathroomMin`: Minimum bathroom
  - `bathroomMax`: Maximum bathroom
  - `bedroomMin`: Minimum bedroom
  - `bedroomMax`: Maximum bedroom
  - `offset`: Offset for pagination

## Note

- For pagination 100 limit is predefined inside code
- Offset field is optional, if offset fields is not given then by default it takes it as 0
  