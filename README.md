# codeial
Social Networking Site using Node, Express and MongoDB.

## Techs used
* Node+Express
* MongoDB
* PassportJS
* redis-server
* Multer
* scss

## Local Installation process:
* Install MongoDB,
* Install npm, node,
* Setup some environment variables \
  * For zsh shell inside .zshenv
  * For bash shell inside .bashrc

  Set these values inside the file:
```
    # Codeial
    export CODEIAL_ASSET_PATH="./public/assets"
    # export CODEIAL_ENVIRONMENT="development"
    export CODEIAL_SESSION_COOKIE_KEY="some random secret"
    export CODEIAL_DB="xspace_prod"
    export CODEIAL_GOOGLE_CLIENT_ID=""
    export CODEIAL_GOOGLE_CLIENT_SECRET=""
    export CODEIAL_GOOGLE_CALLBACK_URL="http://localhost:8000/user/auth/google/callback"
    export CODEIAL_GMAIL_USERNAME=<mail id for notification>
    export CODEIAL_GMAIL_PASSWORD=<password of the id>
    export CODEIAL_JWT_SECRET="another random secret"
    export CODEIAL_MONGODB_URI=<your mongodb location>

```
* Clone this repository and then install dependencies using,
```
    npm install 
```
* Start the server: 
```
    npm start
```

## Folder Structure
So the project is made following the mvc folder structure. These are the main folders in this project.
 - config 
 - models 
 - controllers  
 - routes 
 - views
 - assets
  
  
## Note
So this project was to learn and practice the node+express frameworks.\
Currently making a frontend part for this using react js with material UI Here you can follow that:
 [Codeial-React](https://github.com/WahidX/codeial-react "")
