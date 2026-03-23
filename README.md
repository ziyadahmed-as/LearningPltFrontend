# 🎨 LearnPlatform Frontend (React & Vite)

This is the user interface for the LearnPlatform educational system, built with **React** and **Vite**.

## 🚀 Key Features
*   **Premium Component Architecture:** Modern, responsive UI with a white-space focused, premium design.
*   **Tiptap Rich Text Editor:** A Microsoft Word-like editor for creating academic content.
*   **Course Discovery:** Search and filter through categories.
*   **Student Dashboard:** Interactive lesson view with video integration and PDF embedding.
*   **Progress Visualization:** Visual progress bars and sequential completion alerts.
*   **Admin & Instructor Modules:** Dashboards for course oversight and content editing.

---

## 🛠️ Components of Note

### 1. TiptapEditor (Word-like Editor)
Located in `src/components/TiptapEditor.jsx`. 
*   Supports: B, I, U, S, Headings (H1-H3), Lists, Code Blocks, Horizontal Rules, and Links.
*   Uses `@tiptap/react` and `@tiptap/starter-kit`.

### 2. LessonViewPage
Located in `src/pages/LessonViewPage.jsx`.
*   A premium, dual-pane layout for students to learn.
*   Handles **dangerouslySetInnerHTML** safely to render Tiptap content.

---

## ⚙️ Frontend Setup

### 1. Installation
```bash
cd frontend
npm install
```

### 2. Development
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 📖 Authentication
*   Uses **Simple JWT** for authentication.
*   Token management is handled in `src/context/AuthContext.js`.
*   All private routes are protected using a specialized `<ProtectedRoute />` component in `App.jsx`.

## 📦 Project Structure
*   `src/components/`: Reusable UI elements (Navbar, Editor).
*   `src/pages/`: Core application views (Home, Editor, Learning).
*   `src/services/`: API communication using **Axios**.
*   `src/context/`: State management for Auth and Theme.
