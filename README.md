# 🏨 Hotel Management & Room Booking System

A **full-stack Hotel Management and Room Booking System** built with a **React + TypeScript + TailwindCSS frontend** and a **Django Rest Framework (DRF) backend**.

The system supports **authentication, room management, bookings, team listing**, and media handling, using **JWT-based authentication** for secure access.

---

## 🚀 Key Features

### 👤 Authentication & Authorization (DRF + JWT)

* User registration
* User login with JWT (access & refresh tokens)
* Token refresh support
* Protected routes using `Authorization: Bearer <access_token>`
* Fetch current logged-in user

### 🏨 Room Management

* List available rooms
* View room details
* Create, update, and delete rooms (admin/protected)
* Room images served via media storage

### 📅 Booking Management

* List bookings
* Create room bookings
* View booking details
* Cancel / delete bookings

### 👥 Team Module

* List hotel team members

### 🎨 Frontend Experience

* Responsive UI with TailwindCSS
* Room filtering (category, guests, budget, amenities, bed preference)
* Check-in & check-out date pickers
* Infinite scrolling / lazy loading
* Modern, clean UI built with React + TypeScript

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* TailwindCSS
* IntersectionObserver API

### Backend

* Django
* Django Rest Framework (DRF)
* SimpleJWT (JWT Authentication)
* SQLite / PostgreSQL (configurable)

---

## 🔐 Authentication Details

* Uses **JWT Access & Refresh Tokens**
* Protected endpoints require:

```
Authorization: Bearer <access_token>
```

---

## 📡 API Endpoints

### 🔑 Auth APIs

* `POST /api/auth/register/` — Register user
* `POST /api/auth/login/` — Login (returns JWT tokens)
* `GET /api/auth/me/` — Get current user (protected)
* `POST /api/auth/token/refresh/` — Refresh JWT token

### 🏨 Room APIs

* `GET /api/rooms/` — List rooms
* `POST /api/rooms/` — Create room (protected)
* `GET /api/rooms/{id}/` — Retrieve room
* `PUT /api/rooms/{id}/` — Full update (protected)
* `PATCH /api/rooms/{id}/` — Partial update (protected)
* `DELETE /api/rooms/{id}/` — Delete room (protected)

### 📅 Booking APIs

* `GET /api/bookings/` — List bookings
* `POST /api/bookings/` — Create booking (protected)
* `GET /api/bookings/{id}/` — Retrieve booking
* `DELETE /api/bookings/{id}/` — Cancel / delete booking (protected)

### 👥 Team APIs

* `GET /api/team/` — List team members

### 🖼️ Media

* Room images: `/media/rooms/...`
* Avatars: `/media/avatars/...`

---

## ⚙️ Getting Started

### 🔹 Frontend Setup

```bash
git clone https://github.com/rohitjoshi333/Hotel_Management_System_Master.git
cd Hotel_Management_System_Master
npm install
npm run dev
```

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

## 📌 Future Improvements

* Role-based access control (Admin / Staff / User)
* Payment gateway integration
* Booking availability calendar
* Admin dashboard
* Email notifications

---

## 👨‍💻 Author

**Rohit Joshi**

---

⭐ If you like this project, give it a star on GitHub!
