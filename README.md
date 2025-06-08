# Kanban Task Management

A Kanban-style task management application built with **React**, **Supabase**, and **Tailwind CSS**. This project was developed as part of a front-end challenge and allows users to manage tasks across multiple boards and columns, with support for user authentication and real-time data updates.

---

## 🚀 Features

### 🗂 Boards
- Switch between boards from the sidebar
- Create new boards via modal
- Edit or delete boards (with confirmation)
- Each board contains one or more columns

### 📊 Columns
- Add/remove columns through the board edit modal
- At least one column is required to add tasks
- "Add New Column" opens the board editing interface

### ✅ Tasks
- Add new tasks to specific columns
- Update task status to move it to a new column
- Tasks can be moved between columns via **drag and drop**
- Each task contains subtasks that can be tracked

---

## 🛠 Tech Stack

- **React** – Front-end UI framework
- **Tailwind CSS** – Utility-first CSS framework for fast styling
- **Supabase** – Backend-as-a-Service (database, auth, etc.)
- **Vite** – Lightning-fast dev environment

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/thentrsfs/kanban-task-management.git
cd kanban-task-management

# Install dependencies
npm install

# Run in development mode
npm run dev
