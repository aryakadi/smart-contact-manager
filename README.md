# Smart Contact Manager

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Smart%20Contact%20Manager-blue?style=for-the-badge&logo=vercel)](https://smart-contact-manager-omega.vercel.app/)

Smart Contact Manager is a comprehensive full-stack web application designed to help users securely store, manage, and organize their personal and professional contacts.

## 🚀 Features

- **User Authentication:** Secure user registration and login functionality using JWT (JSON Web Tokens).
- **Contact Management:** Complete CRUD (Create, Read, Update, Delete) operations for your contacts.
- **Image Uploads:** Seamlessly upload and manage profile pictures and contact images, powered by Cloudinary.
- **Search & Filter:** Easily search for contacts by name, email, or other fields.
- **Favorites:** Mark important contacts as favorites for quick access.
- **Dashboard Analytics:** View insights and statistics about your contacts, including weekly trends and group statistics.
- **Responsive Design:** A beautifully designed, modern user interface that works seamlessly across desktop and mobile devices.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React.js powered by Vite for blazing-fast performance.
- **Styling:** Tailwind CSS for a highly customizable and responsive design.
- **HTTP Client:** Axios for making API requests to the backend.

### Backend
- **Framework:** Spring Boot (Java) for building robust and scalable REST APIs.
- **Database:** MongoDB for flexible and scalable NoSQL data storage.
- **Security:** Spring Security for authentication and authorization.
- **Storage:** Cloudinary for cloud-based media asset management.

## 🔗 Live Application

The frontend of the application is deployed and accessible at:
👉 **[Smart Contact Manager - Live Demo](https://smart-contact-manager-omega.vercel.app/)**

## ⚙️ Local Development Setup

To run this project locally, follow these steps:

### Prerequisites
- Node.js (v16+)
- Java (JDK 21+)
- Maven
- MongoDB (Local or Atlas)
- Cloudinary Account

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd smart-contact-manager
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the root of the `backend` directory and configure your environment variables:
   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```
3. Run the Spring Boot application using Maven or your IDE:
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. (Optional) Configure environment variables. By default, the app expects the backend to be running on `localhost:8080` (configured via Vite proxy).
4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
