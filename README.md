# README

---

## Prerequisites

Before setting up the project, ensure you have the following tools installed:

- **Node.js**: Latest version
- **Angular CLI**: Version 17.x or later  
  Install it using npm:
  ```
  npm install -g @angular/cli
  ```
- **Go**: Latest version
- **MySQL Workbench**: Latest version  
  Ensure MySQL server is running locally for database access.

---

## Frontend Setup (Angular)

### 1. Navigate to the Frontend Directory
```
cd J2Software/Frontend
```

### 2. Install Dependencies
Inside the 'Frontend' folder, run the following command to install the required Node.js dependencies:
```
npm install
```

### 3. Start the Angular Development Server
After installing dependencies, run the Angular development server:
```
ng serve
```

The application will be available at [http://localhost:4200](http://localhost:4200) by default.

---

## Backend Setup (Go)

### 1. Navigate to the Backend Directory
```
cd J2Software/Backend
```

### 2. Install Go Dependencies
Use Go's package manager to download the necessary dependencies:
```
go mod tidy
```

### 3. Set Up Environment Variables
To configure the application, you need to set the appropriate environment variables such as the database connection string and the server port. 

#### Steps:
- Create a '.env' file in the root of your project directory (if it doesn't already exist).
- Add the following environment variables to the '.env' file:
  ```
  PORT=3000
  DB_Conn='your-database-connection-string'
  ```

#### Ensure the Database Connection:
- The application uses the 'DB_Conn' variable to connect to a MySQL database. This is configured in the 'initializers/database.go' file. If the environment variable is set correctly, the application will use it to connect to the MySQL database. If not, it will default to the connection string specified in the 'database.go' file.

### 4. Run the Go Backend Server
Navigate to the backend directory and run the backend server:
```
cd J2Software/Backend/src/J2 Software
CompileDaemon -command=./J2Software
```

The Go backend will run on [http://localhost:3000](http://localhost:3000).

---

## Setting Up MySQL Workbench

### 1. Install MySQL Server
Download and install MySQL server. If you already have MySQL set up on your machine, ensure it's running before proceeding.

### 2. Configure MySQL Database
- Open MySQL Workbench and connect to your MySQL server using the root credentials (or any user with sufficient privileges).
- Create a new database for your application:
  ```
  CREATE DATABASE your_database_name;
  ```

### 3. Update '.env' File
Make sure the database connection string ('DB_Conn') in your '.env' file has the correct connection string. If you're using MySQL Workbench with a local MySQL server, it will look like this:
```
DB_Conn='root:your_password@tcp(127.0.0.1:3306)/your_database_name'
```
Replace 'root' with your MySQL username, 'your_password' with your MySQL password, and 'your_database_name' with the name of the database you created.

### 4. Verify Database Connection
Ensure your Go application can connect to the database. You can test the connection by running the Go backend server and checking the logs for any database connection errors. If there are issues, double-check your MySQL credentials and port.

---

## Running the Application

Once both the frontend and backend are set up, follow these steps:

### 1. Start the Frontend (Angular)
As mentioned above, run the command:
```
ng serve
```
The Angular frontend will be available at [http://localhost:4200](http://localhost:4200).

### 2. Start the Backend (Go)
Run the backend using:
```
cd J2Software/Backend/src/J2 Software
CompileDaemon -command=./J2Software
```
The Go backend will be available at [http://localhost:3000](http://localhost:3000).

### 3. Verify Database Connection
Make sure the Go backend is able to connect to the MySQL database you set up.
