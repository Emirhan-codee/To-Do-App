# Modern React Task Manager 📝

## 🚀 Overview
This is a high-performance, responsive To-Do application built with **React** and **Vite**. The project demonstrates the implementation of modern web development patterns, focusing on component-based architecture, persistent data storage, and dynamic user interfaces.

## ✨ Key Features
* **Persistent Data:** Leverages the **Web Storage API (LocalStorage)** to ensure tasks are saved even after page refreshes.
* **Dynamic Progress Tracking:** Features a real-time progress bar that calculates the percentage of completed tasks.
* **Inline Task Editing:** Users can modify existing tasks directly within the list without opening separate modals.
* **Advanced Filtering:** Toggle between 'All', 'Active', and 'Completed' views using state-based filtering logic.
* **Responsive Dark Theme:** A sleek, mobile-friendly dark interface designed with optimized CSS for better readability.

## 🛠️ Tech Stack
* **Frontend Library:** React.js (Functional Components & Hooks).
* **Build Tool:** Vite (for ultra-fast development and bundling).
* **Styling:** Modern CSS-in-JS (Inline styling for dynamic property management).

## 🧠 Technical Deep Dive
### State Management
The application utilizes the `useState` hook to manage the lifecycle of tasks, filtering states, and editing modes. By using **Lazy Initialization** for the initial state, the app optimizes performance by reading from LocalStorage only once during the initial mount.



### Side Effects & Persistence
The `useEffect` hook is implemented to synchronize the application state with the browser's LocalStorage whenever the task list is modified, ensuring a seamless user experience across sessions.

## ⚙️ Installation & Setup
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Emirhan-codee/React-Task-Manager.git](https://github.com/Emirhan-codee/React-Task-Manager.git)
