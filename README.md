# Routes

## Client - Server Communication

### Auth

- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/register` - Register user
- **POST** `/api/auth/logout` - Logout user
- **GET** `/api/auth/validate` - Validate user token

### Shared

- **GET** `/api/ip/` - Get user location

### Sites

- **GET** `/sites/rec` - Get recommended Surfing sites
- **GET** `/sites/{id}` - Get recommended Surfing site by id
- **GET** `/sites/` - Get all Surfing sites

- **GET** `/site/{id}/pop` - get heatmap data for a site
- **GET** `/site/{id}/tide` - get tide data for a site

### User

- **GET** `/user/{username}/` - Get user info