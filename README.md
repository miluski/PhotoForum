# PhotoForum

This is a project which main concept is to compare two frontend frameworks - Next.js and Angular

## API Endpoints

- /api/v1/auth/is-authorized - GET - for checking if user has saved cookies with tokens

- /api/v1/auth/login - POST - for user login request, tokens is not required, required body:

```json
{
	"login": "login (min 5 chars, max 20 chars, not null)",
	"password": "password (8 digits, 1 uppercase, 1 lowercase, 1 special char, 1 number, not null)"
}
```

- /api/v1/auth/register - POST - for user register request, tokens is not required, required body:

```json
{
	"login": "login (min 5 chars, max 20 chars, not null)",
	"password": "password (8 digits, 1 uppercase, 1 lowercase, 1 special char, 1 number, not null)",
	"name": "name (min 3 chars, max 50 chars, not null)",
	"surname": "surname (min 5 chars, max 60 chars, not null)",
	"avatarPath": "(should be empty string)"
}
```

- /api/v1/auth/refresh-tokens - POST - for refresh tokens request, valid refresh token is required in cookies

- /api/v1/auth/logout - POST - for logout user request, valid refresh token is required in cookies

- /api/v1/photos/new - POST - for adding new photo on server, requires token and body:

```json
{
	"path": "base64_image_representation_from_frontend"
}
```

- /api/v1/photos/posts - GET - for retrieving all photos posts from db, tokens is not required

- /api/v1/photos/public/name.extension - GET - for retrieving photo with extension from media folder, tokens is not required, allowed extensions: .png, .jpg, .jpeg, .webp, required path variable:

```
name.extension - for example photo.png
```

- /api/v1/photos/photo-id/add-comment - POST - for adding comment to photo, tokens is required (especially access token) for retrieving from it assigned user login which is adding comment, required path variable and body:

```json
path-variable:

photo-id - for example 1

body: "Here should be comment for photo as simply string"
```

- /api/v1/photos/photo-id/add-to-favourites - POST - for adding photo to favourites of user photos, tokens is required (especially access token) for retrieving from it assigned user login, required path variable:

```
photo-id - for example 1
```

- /api/v1/photos/photo-id/remove-from-favourites - DELETE - for remove photo from favourites of user photos, tokens is required (especially access token) for retrieving from it assigned user login, required path variable:

```
photo-id - for example 1
```

- /api/v1/users/edit - PATCH - for editing user object, requires access token to get edited user id and to authorize and body:

You must pass only one of above fields to edit user object:

```json
{
	"login": "editedLogin (min 5 chars, max 20 chars, not null)",
	"password": "password (8 digits, 1 uppercase, 1 lowercase, 1 special char, 1 number, not null)",
	"name": "name (min 3 chars, max 50 chars, not null)",
	"surname": "surname (min 5 chars, max 60 chars, not null)",
	"avatarPath": "base_64_representation_from_frontend"
}
```

- /api/v1/users/get-favourite-photos - GET for retrieving photos which user marks as favourite. requires access token in request cookies

## Running

### Frontend part

To run frontend part of app run following command in PhotoForum dir (not backend or frontend or another path):

```
windows:
docker compose -f compose.windows.yaml up --build --force-recreate

linux/macos:
docker compose -f compose.linux.yaml up --build --force-recreate
```

### Backend part

To run backend backend part of app provide following command in PhotoForum dir (not backend or frontend or another path):

```
windows:
docker compose -f compose.backend.windows.yaml up --build --force-recreate

linux/macos:
docker compose -f compose.backend.linux.yaml up --build --force-recreate
```

## Required files

In backend part you should have file called application.properties in backend/src/main/resources folder. It should contains:

```
spring.application.name=backend
server.port=4443
server.ssl.key-store=/certs/keystore.p12
server.ssl.key-store-password=your_keystore_file_pass
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
spring.datasource.url=jdbc:postgresql://photo-forum-postgres:5432/postgres
spring.datasource.username=your_database_login
spring.datasource.password=your_database_pass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
jwt.secret=your_jwt_secret
jwt.expiration=your_jwt_expiration
jwt.refresh.expiration=your_jwt_refresh_expiration
photo.dir=/media
```

In main folder (PhotoForum) you should have file called .env with content:

```
POSTGRES_DB=postgres
POSTGRES_PASSWORD=your_database_password
POSTGRES_USER=your_database_login
```