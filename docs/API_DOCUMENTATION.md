# Introduction
Sticky Review API provides the web services for the main platform. Please select
*Sticky Review* from the environment to update the API host i.e. `{HOST_PREFIX}`

# Overview
The API endpoints will return JSON data as response as following
```json
{
    "status": true,
    "message": "User friendly message",
    "data": {
        ...
    }
}
```
To ensure to get JSON data always please send `Accept: application/json` in
header.

# Authentication
All the endpoints except Sign up, Sign in, User Reviews and Widgets uses a layer
of authentication using a token (JWT). To get the toke simply use the Sign in
endpoint with a registered email and password, send the token in header as
`Authentication: Bearer {token}` to access the authenticated endpoints.

# Error Codes
The API uses following HTTP status codes for error
- `400`: If the user sends some invalid data.
- `401`: If the user tries to access authenticated endpoint without token.
- `403`: If the user's action is forbidden due to access level.
- `404`: If the user tries to access an not existing endpoint.
- `405`: If the user tries to access an endpoint with worng method.
- `500`: If something went wrong in server due to some error.
- `503`: If the server is down due to maintenance.

# Rate limit
N/A