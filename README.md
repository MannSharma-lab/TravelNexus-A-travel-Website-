#  TravelNexus

**A modern, responsive and user-friendly travel website** — TravelNexus helps you explore destinations, plan trips, and manage bookings with a clean and interactive interface.

---

##  Overview

TravelNexus is a **frontend-based travel website (HTML, CSS, JavaScript)**.  
It showcases **destinations, travel packages, and booking flow**.  

 The project is frontend-focused, but it’s **ready for backend integration** with **MySQL + PHP/Node.js** for real bookings and authentication.

---

##  Features

- **Home Page** with featured destinations and search  
- **Destination Pages** with galleries, descriptions & highlights  
- **Search & Filters** by location, price, rating, duration  
- **Booking Flow** (frontend ready, backend integration possible)  
- **User Authentication** (login/signup pages prepared)  
- **User Dashboard Concept** (future ready for bookings)  
- **Responsive Design** using HTML + CSS  

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla JS)  
- **Database (future ready):** MySQL  
- **Backend (future ready):** PHP / Node.js  
- **Authentication (future ready):** Sessions / JWT  

---

## Project Structure

```
travelnexus/
├─ css/             # CSS files
├─ images/          # All images
├─ js/              # JavaScript files
├─ about.html
├─ adventure.html
├─ book.html
├─ couple.html
├─ home.html
├─ luxury.html
├─ package.html
└─ scenary.html
```

---

## Example Database Schema (MySQL)

```sql
CREATE DATABASE travelnexus;
USE travelnexus;

-- Users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  package_name VARCHAR(100),
  booking_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Destinations
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url VARCHAR(255)
);
```

---

## Backend Example (PHP)

**db.php**
```php
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "travelnexus";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
```

**auth.php**
```php
<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo "Login successful!";
    } else {
        echo "Invalid credentials!";
    }
}
?>
```

---

## How to Run

1. Download/Clone the repo  
   ```bash
   git clone https://github.com/your-username/travelnexus.git
   cd travelnexus
   ```

2. Open `home.html` in your browser.  

 **Note:** Booking and login/signup won’t work unless backend (MySQL + PHP/Node.js) is connected.

---

## Important Note  

If you don’t want to set up **MySQL** or any **backend code**, you can simply use the **frontend as-is**:  

1. Keep all files arranged as shown in the folder structure.  
2. Open **`home.html`** in your browser.  
3. The project will run with its **frontend features only**.  

Limitations without backend:  
- Booking data (book.html) will not be stored in a real database.  
- Login & Signup pages won’t validate users (dummy only).  
- Dashboard will not show real-time bookings.  

When backend + MySQL is connected, these features will be **fully functional**.  

---

## Screenshots
https://drive.google.com/drive/folders/1fmSSZ-SH0ogA6NZx4uDbu8qcEAWVPA0u

---

## License

This project is licensed under the **MIT License**.  
You are free to use, modify, and share.

---

# Author

**Mann Sharma**  
 Email: 2023bcaaidsmann14707@poornima.edu.in  
 LinkedIn: [Mann Sharma](https://www.linkedin.com/in/mann-sharma-5425b9290)  

---
