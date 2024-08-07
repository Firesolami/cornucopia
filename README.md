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

Here's a brief overview of the available endpoints:

- **User Routes**
  - `POST /api/signup`: Register a new user
  - `POST /api/signin`: User login

- **File Routes**
  - `POST /api/upload-photo`: Upload a new photo
  - `GET /api/storage`: Get all user photos
  - `GET /api/storage/{id}`: Get details of a specific photo
  - `PATCH /api/update-photo`: Update photo details
  - `DELETE /api/storage/{id}/delete`: Delete a photo

- **Folder Routes**
  - `GET /api/folders`: Get all user folders
  - `GET /api/folders/{id}`: Get details of a specific folder
  - `POST /api/create-folder`: Create a new folder
  - `PATCH /api/update-folder`: Update folder details
  - `DELETE /api/folders/{id}/delete`: Delete a folder
  - `POST /api/upload-to-folder`: Upload a photo to a specific folder

- **Sharing Routes**
  - `POST /api/generate-share-url`: Generate a shareable URL for a folder
  - `GET /api/share/{shareId}`: Get details of a shared folder
  - `GET /api/share/{shareId}/storage/{id}`: Get details of a shared photo

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.
