# Cornucopia API

Cornucopia is a RESTful API built with Express.js, MongoDB, and Cloudinary. It offers endpoints for user authentication, file and folder management, and file sharing functionalities.

## Features

- User Signup and Signin
- Manage Photos and Folders
- Upload Photos to Folders
- Update and Delete Photos and Folders
- Generate Shareable URLs for Folders
- View Shared Folders and Photos

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Cloudinary account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/firesolami/cornucopia.git
   ```

2. Navigate to the project directory:

   ```bash
   cd cornucopia
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

Replace the placeholder values with your actual credentials.

### Running the Application

To start the server, use:

```bash
node --watch app.js
```

The server will run on `http://localhost:3000`.

## API Documentation

The API documentation is available in the `api_documentation.md` file located in the root directory of the project. You can use [Postman](https://www.postman.com/) to visualize and interact with the API endpoints.

### Endpoints Overview

- **User Endpoints**
  - `POST /signup`: Create a new user account.
  - `POST /signin`: Sign in a user.
  - `GET /user-info`: Retrieve information about the authenticated user.

- **Photo Endpoints**
  - `GET /home`: Retrieve the latest 8 photos of the user.
  - `GET /storage`: Retrieve all photos of the user.
  - `GET /storage/:id`: Retrieve details of a specific photo.
  - `POST /storage`: Upload a new photo.
  - `PATCH /storage/:id`: Update the name of a photo.
  - `DELETE /storage/:id`: Delete a specific photo.

- **Folder Endpoints**
  - `GET /folders`: Retrieve all folders of the user.
  - `GET /folders/:id`: Retrieve details of a specific folder.
  - `POST /folders`: Create a new folder.
  - `PATCH /folders/:id`: Update the name of a folder.
  - `DELETE /folders/:id`: Delete a specific folder.
  - `POST /folders/:id`: Upload a photo to a specific folder.
  - `GET /folder-names`: Retrieve names of all folders of the user.

- **Share Endpoints**
  - `POST /generate-share-url`: Generate a shareable URL for a folder.
  - `GET /share/:shareId`: Retrieve details of a shared folder.
  - `GET /share/:shareId/storage/:id`: Retrieve a specific photo from a shared folder.
    
### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
