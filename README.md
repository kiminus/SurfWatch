> ![note]
> the python model is the single source of truth, the client and server should be generated from the python model using `openapi-typescript`

# How to Run this project

- you will need to install
- [Node.js](https://nodejs.org/en/download/) , version 22

# run the docker container

> ![note]
> you need to uncomment the `client` section when deploy to production, so all client, server and database will run in the same container
> for development, you can run the client and server separately

```bash
docker-compose up -d
```

- this will run the server on port 8000 and frontend on port 8081

- after you see this message in the terminal

```bash
surfwatch-server  | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
Starting project at /app/client
surfwatch-client  | Starting Metro Bundler
```

- wait a few seconds and then type `w` in the terminal to open the web app in your browser, a success message should look like this:

```bash
surfwatch-client  | Web Bundled 7937ms node_modules/expo-router/entry.js (782 modules)
surfwatch-client  | Web Bundled 2613ms node_modules/expo-router/entry.js (781 modules)
surfwatch-client  |  LOG  [web] Logs will appear in the browser console
```

- the first time you run this, it will take a while (especially frontend compilation, which can take about 5 minutes), if nothing happens, try to type `w` in the terminal as it will trigger expo to show web

---

# How to run the project without docker (for development)

### run the client

```bash
cd client
npm install --save-dev
npx expo start
```

you can download the android app [here](https://expo.dev/accounts/kiminus/projects/client/builds/3861ecc3-46b3-4505-b4e9-c5c379fafe58)

- click the three dots on the top right corner and select download build
- an `.apk` file will be downloaded, install it on your android device

### run the server and database

- make sure you dont install the `client` in the docker container, run those seperately
- you will need to install [python](https://www.python.org/downloads/) version 3.10 or higher

```bash
docker-compose up -d
```

---

# Routes

> ![note]
> backend error form:
>
> ```javascript
> ApiError: Error {
>     name: 'Error',
>     message: 'HTTP_404: 404 Not Found',
>     details: {...}
> }
> ```

## Client - Server Communication

### Auth

- **POST** `/auth/login` - Login user
- **POST** `/auth/register` - Register user
- **POST** `/auth/logout` - Logout user

### Shared

- **GET** `/api/ip/` - Get user location

### Sites

- **GET** `/sites/rec` - Get recommended Surfing sites
- **GET** `/sites/` - Get all Surfing sites

- **GET** `/sites/{id}/pop` - get heatmap data for a site
- **GET** `/sites/{id}/tide` - get tide data for a site
- **GET** `/sites/{id}` - get all data for a site

### User

> the user should only have access to their own data, so all endpoints should be prefixed with `/user/me/`
> if user need to see other users data, we will need to implement a new endpoint for that

- **GET** `/users/me/` - Get current user info
- **GET** `/view/users/{id}` - Get other user view data by id
