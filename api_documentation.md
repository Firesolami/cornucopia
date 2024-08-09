## API Documentation

### Base URL
`http://localhost:3000/api`

### Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`

### Endpoints

#### User Endpoints

- **POST /signup**
  - **Description**: Create a new user account.
  - **Request Body**:
    - `username`: (string) User's username (min: 3 characters).
    - `password`: (string) User's password (min: 8 characters).
  - **Responses**:
    - `200 OK`: Account created successfully.
    - `400 Bad Request`: Username already exists or validation error.

- **POST /signin**
  - **Description**: Sign in a user.
  - **Request Body**:
    - `username`: (string) User's username.
    - `password`: (string) User's password.
  - **Responses**:
    - `200 OK`: Sign in successful, returns JWT token.
    - `400 Bad Request`: Incorrect username or password.

- **GET /user-info**
  - **Description**: Retrieve information about the currently authenticated user.
  - **Responses**:
    - `200 OK`: User information retrieved successfully.
    - `404 Not Found`: User not found.

#### Photo Endpoints

- **GET /home**
  - **Description**: Retrieve the latest 8 photos of the user.
  - **Responses**:
    - `200 OK`: Photos retrieved successfully.
    - `404 Not Found`: No photos available.

- **GET /storage**
  - **Description**: Retrieve all photos of the user.
  - **Responses**:
    - `200 OK`: Photos retrieved successfully.
    - `404 Not Found`: No photos available.

- **GET /storage/:id**
  - **Description**: Retrieve details of a specific photo.
  - **Parameters**:
    - `id`: (string) Photo ID.
  - **Responses**:
    - `200 OK`: Photo details retrieved successfully.
    - `404 Not Found`: Photo not found.

- **POST /storage**
  - **Description**: Upload a new photo.
  - **Request Body**:
    - `file`: (file) Photo file.
  - **Responses**:
    - `201 Created`: Photo uploaded successfully.
    - `400 Bad Request`: No photo selected or duplicate name.

- **PATCH /storage/:id**
  - **Description**: Update the name of a photo.
  - **Parameters**:
    - `id`: (string) Photo ID.
  - **Request Body**:
    - `photoName`: (string) New photo name.
  - **Responses**:
    - `200 OK`: Photo updated successfully.
    - `400 Bad Request`: Photo name missing.

- **DELETE /storage/:id**
  - **Description**: Delete a specific photo.
  - **Parameters**:
    - `id`: (string) Photo ID.
  - **Responses**:
    - `200 OK`: Photo deleted successfully.
    - `404 Not Found`: Photo not found.

#### Folder Endpoints

- **GET /folders**
  - **Description**: Retrieve all folders of the user.
  - **Responses**:
    - `200 OK`: Folders retrieved successfully.
    - `404 Not Found`: No folders available.

- **GET /folders/:id**
  - **Description**: Retrieve details of a specific folder, including photos.
  - **Parameters**:
    - `id`: (string) Folder ID.
  - **Responses**:
    - `200 OK`: Folder and photos retrieved successfully.
    - `404 Not Found`: Folder not found.

- **POST /folders**
  - **Description**: Create a new folder.
  - **Request Body**:
    - `folderName`: (string) Name of the new folder.
  - **Responses**:
    - `201 Created`: Folder created successfully.
    - `400 Bad Request`: Folder name already in use.

- **PATCH /folders/:id**
  - **Description**: Update the name of a folder.
  - **Parameters**:
    - `id`: (string) Folder ID.
  - **Request Body**:
    - `folderName`: (string) New folder name.
  - **Responses**:
    - `200 OK`: Folder updated successfully.
    - `400 Bad Request`: Folder name missing.

- **DELETE /folders/:id**
  - **Description**: Delete a specific folder and all its photos.
  - **Parameters**:
    - `id`: (string) Folder ID.
  - **Responses**:
    - `200 OK`: Folder deleted successfully.
    - `404 Not Found`: Folder not found.

- **POST /folders/:id**
  - **Description**: Upload a photo to a specific folder.
  - **Parameters**:
    - `id`: (string) Folder ID.
  - **Request Body**:
    - `file`: (file) Photo file.
  - **Responses**:
    - `201 Created`: Photo uploaded to the folder successfully.
    - `400 Bad Request`: Duplicate photo name.

- **GET /folder-names**
  - **Description**: Retrieve names of all folders of the user.
  - **Responses**:
    - `200 OK`: Folder names retrieved successfully.
    - `404 Not Found`: No folders available.

#### Share Endpoints

- **POST /generate-share-url**
  - **Description**: Generate a shareable URL for a folder.
  - **Request Body**:
    - `expiresIn`: (string) Expiration duration (`1d`, `7d`, `30d`).
  - **Parameters**:
    - `id`: (string) Folder ID.
  - **Responses**:
    - `201 Created`: Share URL generated successfully.
    - `400 Bad Request`: Invalid expiration value or missing ID.

- **GET /share/:shareId**
  - **Description**: Retrieve details of a shared folder.
  - **Parameters**:
    - `shareId`: (string) Share URL ID.
  - **Responses**:
    - `200 OK`: Shared folder and photos retrieved successfully.
    - `404 Not Found`: Folder not found or share URL expired.

- **GET /share/:shareId/storage/:id**
  - **Description**: Retrieve a specific photo from a shared folder.
  - **Parameters**:
    - `shareId`: (string) Share URL ID.
    - `id`: (string) Photo ID.
  - **Responses**:
    - `200 OK`: Photo retrieved successfully.
    - `404 Not Found`: Photo not found or share URL expired.
