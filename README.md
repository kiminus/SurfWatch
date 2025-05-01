# How to Run this project
- you will need to install
- [Node.js](https://nodejs.org/en/download/)
### installation
```bash
npm install -g eas-cli
cd client
npm install
cd ../server
pip install -r requirements.txt
```

### run the docker container
```bash
docker-compose up -d
```
- this will run the server on port 8000 and frontend on port 8081
- the first time you run this, it will take a while (especially frontend compilation, which can take about 5 minutes), if nothing happens, try to type `w` in the terminal as it will trigger expo to show web 

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

- **GET** `/sites/{id}/pop` - get heatmap data for a site
- **GET** `/sites/{id}/tide` - get tide data for a site
- **GET** `/sites/{id}` - get all data for a site

### User
> the user should only have access to their own data, so all endpoints should be prefixed with `/user/me/`
> if user need to see other users data, we will need to implement a new endpoint for that

- **GET** `/users/me/` - Get current user info
```json
{
    ...UserData
}
```
- **GET** `/view/users/{id}` - Get other user view data by id
```json
{
    ...UserData
}
```
