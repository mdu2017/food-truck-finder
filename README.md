# Readme
This is the food truck finder sample application.

## Running The Project
### MySql
This application uses MySql search as a data backend. To run the app you will have to either install MySql search locally or point to a remote MySql search instance. Configuration options are provided in `application.yml`.

### Development
In development there are three components to the running application. A Java app server, which runs your backend code, mysql which is the data store, and a webpack development server which serves up the frontend resources and does hot reloading.

#### Running the Backend in IntelliJ
1) Install Java, Gradle, IntelliJ if you don't already have them
1) Install and start MySql (see below for instructions)
1) Import the project into IntelliJ
1) Run `FoodTruckFinderApplication.main` with VM args `-Dspring.profiles.active=development`
    * Open FoodTruckFinderApplication.java, right click, and Run FoodTruckFinderApplication.main(), which should fail
    * Up near the top left you should see a dropdown that now says Food truck finder application, click it and select Edit configurations
    * In the menu, you should see a VM Options box, enter `-Dspring.profiles.active=development`, click OK
    * Run the application again, and it should start correctly
1) Go to `http://localhost:8080/` and verify the application is running (you may see a blank page if the frontend isn't running yet, but if it doesn't 404 you are good)

#### Running MySql
1) Install MySql 8.0.17 https://dev.mysql.com/downloads/installer/
    * Mac install guide: https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html
    * Windows install guide: https://dev.mysql.com/doc/refman/5.7/en/windows-installation.html
    * If prompted to choose password encryption type, choose "use legacy password"
2) Create a new Database named `food-truck-finder` (make sure you're using the default utf-8 encoding)
3) Update `application.yml` with your db username/password (root with no password as default might work)

#### Running the Frontend
1) Install node if you don't already have it
1) In the project directory run `npm install` from the command line
1) In the project directory run `npm run dev` from the command line
1) Go to `http://localhost:8080/` - you should see simple output which reads "This is the home page."
1) Navigate to page 1 and click the "Login as User" button - you should see a token print and the text "Welcome, user!" show on the page. This means everything is working.

### QA/Heroku/Running as QA Locally
In qa there is just a single executable jar which contains the static resources produced from webpack.

1) To build run `./gradlew build`
1) Build output can be found in `<Root Project Dir>/build/libs/food-truck-finder-site-1.0-SNAPSHOT.jar`
1) This jar is all you need to run the application, to run locally use the following command: `java -jar build/libs/food-truck-finder-site-1.0-SNAPSHOT.jar --spring.profiles.active=qa`

## Project Overview

### Frontend
#### React
#### Single Bundle
### Backend
#### Package Structure