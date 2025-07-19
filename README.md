# 🩸 BloodBridge

**BloodBridge** is a full-featured MERN-based blood donation platform designed to connect blood donors with recipients efficiently. It includes user roles, donation management, blog content tools, and funding features—all wrapped in a fully responsive, user-friendly experience.

🌐 **Live Site:** [BloodBridge](https://bloodbridge-by-naimur.web.app/)  
🛂 **Admin Login**  
- **Email:** `admin.naimur@gmail.com`  
- **Password:** `Admin@naimur11`


## 🧰 Tech Stack & Tools

### 🔧 Frontend Framework & Build Tools
- React + Vite

### 🎨 Styling
- Tailwind CSS
- DaisyUI

### 🔐 Authentication & Authorization
- Firebase Authentication
- JWT (jsonwebtoken)

### 📦 Additional Libraries & Tools
- TanStack Query (React Query)
- Stripe (React Stripe Elements)
- ImageBB (via API)
- EmailJS
- SweetAlert2 / React Hot Toast
- Jodit React (Blog Rich Text Editor)
- Framer Motion (UI Animation)

## ✨ Key Features

- 🔐 **Authentication**: Firebase email/password auth with secure JWT-based route protection
- 👥 **Role-Based Dashboards**: Donor, Volunteer, and Admin with tailored permissions
- 📝 **Donation Request Management**: Create, view, edit, delete, and respond to donation requests
- 💬 **Blog System**: Add, edit, publish/unpublish blog posts (admin controlled)
- 🔍 **Donor Search**: Find donors by blood group, district, and upazila
- 💰 **Funding**: Stripe integration to collect and display user donations
- 📊 **Admin Insights**: View total users, funds, and donation requests
- 👤 **User Profile**: Edit avatar, location, and blood group (email remains read-only)
- 📥 **Pagination & Filters**: For users, requests, blogs, and funding
- ✅ **Sweet Alerts/Toasts**: Friendly UI feedback on all actions
- 📱 **Responsive Design**: Mobile, tablet, and desktop views supported
- 🔐 **Secure Environment Config**: API keys & secrets stored in `.env.local`


## 🚀 Local Setup Instructions (Client Side Only)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-wdNaimur.git
cd b11a12-client-side-wdNaimur
npm install
```

### 2️⃣ Configure Environment Variables

Create a `.env.local` file in the root of the project and add the following:

```env
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_firebase_auth_domain
VITE_projectId=your_firebase_project_id
VITE_storageBucket=your_firebase_storage_bucket
VITE_messagingSenderId=your_firebase_messaging_sender_id
VITE_appId=your_firebase_app_id

VITE_API_URL=https://your-backend-api-url.com

VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PK_KEY=your_stripe_publishable_key

VITE_EMAIL_SERVICE_ID=your_emailjs_service_id
VITE_EMAIL_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAIL_PUBLIC_KEY=your_emailjs_public_key
```


### 3️⃣ Run the Development Server

```bash
npm run dev
```

Then open: [http://localhost:5173](http://localhost:5173)


## 📁 Repositories

- 💻 [Client Repository](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-wdNaimur)
- 🔧 [Server Repository](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-wdNaimur)

<p align="center"><sub><strong>Designed & Developed by Md. Naimur Rahman</strong></sub></p>
