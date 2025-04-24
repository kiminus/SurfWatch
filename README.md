# How to Run this project
- you will need to install
- [Node.js](https://nodejs.org/en/download/)
### installation
```bash
npm install -g eas-cli
cd client
npm install
```
### run the client
```bash
cd client
npm install --save-dev
npx expo start
```
you can download the android app [here](https://expo.dev/accounts/kiminus/projects/client/builds/3861ecc3-46b3-4505-b4e9-c5c379fafe58)
- click the three dots on the top right corner and select download build
- an `.apk` file will be downloaded, install it on your android device

# Routes

## Client - Server Communication

> [!NOTE]  
>   if there is an error, we will always return json in format:
>   ```json
>   {
>       "error": "error_message"
>       "detail": "error_detail"
>   }
>   ```

### Auth

- **POST** `/api/auth/login` - Login user
    ```json
    {
        "id": 1
    }
    ```
- **POST** `/api/auth/register` - Register user
    ```json
    {
        "id": 1
    }
    ```
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/validate` - Validate user token

### Shared

- **GET** `/api/ip/` - Get user location

### Sites

- **GET** `/sites/rec` - Get recommended Surfing sites
- **GET** `/sites/` - Get all Surfing sites

- **GET** `/site/{id}/pop` - get heatmap data for a site
- **GET** `/site/{id}/tide` - get tide data for a site
- **GET** `/site/{id}` - get all data for a site

### User

- **GET** `/user/{username}/` - Get user info


