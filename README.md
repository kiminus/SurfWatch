> [!note]
> the python model is the single source of truth, the client and server should be generated from the python model using `openapi-typescript`

# Surfwatch

## Project Overview

- Surfwatch is a web application that provides users with information about surfing sites, including tide data, heatmaps, and user-generated content. The application is built using a combination of Python for the backend and React Native for the frontend.
- live demo link: please run the project locally, follow the [instructions below](#how-to-run-the-project-in-development)

# How to Run this project

- you will need to install
  - [Node.js](https://nodejs.org/en/download/) , version 22
  - pip pip 25.1.1
  - Python 3.13.3

## How to run the project in development

### run the client

```bash
cd client
npm install --save-dev
npx expo start
```

- after you see this message in the terminal

```bash
› Metro waiting on exp+client://expo-development-client/?url=...
› Scan the QR code above to open the project in a development build. Learn more: https://expo.fyi/start

› Web is waiting on http://localhost:8081

› Using development build
› Press s │ switch to Expo Go

› Press a │ open Android
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

```

- wait a few seconds and then type `w` in the terminal to open the web app in your browser, a success message should look like this:

```bash
surfwatch-client  | Web Bundled 7937ms node_modules/expo-router/entry.js (782 modules)
surfwatch-client  | Web Bundled 2613ms node_modules/expo-router/entry.js (781 modules)
surfwatch-client  |  LOG  [web] Logs will appear in the browser console
```

---

you can download the android app [here](https://expo.dev/accounts/kiminus/projects/client/builds/3861ecc3-46b3-4505-b4e9-c5c379fafe58)

- click the three dots on the top right corner and select download build
- an `.apk` file will be downloaded, install it on your android device

### run the server and database

- you will need to install [python](https://www.python.org/downloads/) version 3.10 or higher

```bash
cd server # IMPORTANT
docker-compose up --build --remove-orphans
```

- this will run the server on port 8001 and frontend on port 8081

---

# Routes

> [!note]
> backend error is in datatype `AxiosError`, here is what you need to do to convert and use it:
>
> ```typescript
> try {
>   // Your code logic here
> } catch (error) {
>   if (axios.isAxiosError(error)) {
>     setErrorMessage(error.response?.data.detail);
>   } else {
>     setMessage('An unexpected error occurred.');
>   }
> }
> ```

## Client - Server Communication

### Auth

- **POST** `/auth/login` - Login user
- **POST** `/auth/register` - Register user
- **POST** `/auth/logout` - Logout user

### Shared

- **GET** `/api/ip/` - Get user location
- **GET** `/weather/` - Get weather status

### Sites

- **GET** `/sites/rec` - Get recommended Surfing sites
- **GET** `/sites/` - Get all Surfing sites

- **GET** `/sites/{id}/pop` - get heatmap data for a site
- **GET** `/sites/{id}/tide` - get tide data for a site
- **GET** `/sites/{id}` - get all data for a site

- **GET** `/get_image/` - Get image for a site that is uploaded by the IOT

### User

> the user should only have access to their own data, so all endpoints should be prefixed with `/user/me/`
> if user need to see other users data, we will need to implement a new endpoint for that

- **GET** `/users/me/` - Get current user info
- **GET** `/view/users/{id}` - Get other user view data by id (not implemented yet)

### IOT

- **PUT** `/cam/` - IOT upload an image and video for AI processing
- **PUT** `/cam/wave` - IOT update the wave quality data for a site
