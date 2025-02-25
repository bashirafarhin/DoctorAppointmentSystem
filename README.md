# Doctor Appointment System

Doctor Appointment System allows patients to book appointments with doctors easily. Doctors can accept or reject appointments, and admins can monitor users, doctors, and the number of appointments.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [License](#license)

## Overview
You can visit the website at  [DoctorAppointmentSystem](https://bookdoctorappointment-jv18.onrender.com/).

## Demo
https://github.com/user-attachments/assets/88585024-3c3b-4ecf-a0b4-34e298e03abf

## Features
- Authentication using local login
- Authorization using JSON Web Token (JWT)
- Book appointments with doctors
- Doctors can accept or reject appointments
- Admin dashboard to monitor users and doctors
- Track the number of appointments per doctor
- Notifications for appointment updates
- profile management

## Tech Stack Used
### Frontend
- React
- React Router DOM
- Redux toolkit
- Axios
- React MUI
- cloudinary

### Backend
- Node.js
- Express
- MongoDB
- Nodemailer
- jsonwebtoken
  
## Installation

#### Start Frontend
1. Clone the Repository
```bash
git clone https://github.com/bashirafarhin/DoctorAppointmentSystem.git
```

2. Navigate to the Project Directory
```bash
cd DoctorAppointmentSystem/client
```
3. Install Frontend Dependencies
```bash
npm install
```

4. Configure Frontend Environment Variables
- Create a `.env` file in the client directory.
- Copy the contents from `.env.sample` present in the client folder and fill it with your credentials.

5. Start Frontend Development Server
```bash
npm run start
```
The frontend will run on `http://localhost:3000`.

#### Start Backend

1. On a new terminal, navigate to the server directory.
```bash
cd DoctorAppointmentSystem/server
```

2. Install Backend Dependencies
```bash
npm install
```

3. Configure Backend Environment Variables
- Create a `.env` file in the server directory.
- Copy the contents from `.env.sample` present in the server folder and fill it with your credentials.

4. Start Backend Server
```bash
nodemon server.js
```
The backend server will run on `http://localhost:8000`.
