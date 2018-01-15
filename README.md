# Readme
This is the petfinder sample application.

## Development
In development there are two components to the running application. A Java app server, which runs your backend code and a webpack development server which serves up the frontend resources and does hot reloading.

### Running the Backend
1) Install Java, Gradle, IntelliJ if you don't already have them
1) Import the project into IntelliJ
1) Run `petfinder.site.PetfinderApplication.main` with VM args `-Dspring.profiles.active=development`
1) Go to `http://localhost:8080/` and verify the application is running (you may see a blank page if the frontend isn't running yet, but if it doesn't 404 you are good)

### Running the Frontend
1) Install node if you don't already have it
1) In the project directory run `npm install` from the command line
1) In the project directory run `npm run dev` from the command line
1) Go to `http://localhost:8080/` - you should see simple output which reads "This is the home page."
1) Navigate to page 1 and click the "Login as User" button - you should see a token print and the text "Welcome, user!" show on the page. This means everything is working.

## QA/Heroku
In qa there is just a single executable jar which contains the static resources produced from webpack.

1) To build run `gradle install`
1) Build output can be found in `<Root Project Dir>/build/libs/petfinder-site-1.0-SNAPSHOT.jar`
1) This jar is all you need to run the application, to run locally use the following command: `java -jar build/libs/petfinder-site-1.0-SNAPSHOT.jar --spring.profiles.active=qa`