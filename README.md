# 🔮 PromptForge – AI-Powered Developer Toolkit

PromptForge is a modern web-based toolkit designed to **boost developer productivity** with AI-powered utilities. It provides smart, context-aware tools such as **code explanation**, **bug fixing**, and **regex generation**, all inside a clean and responsive interface.

Built using the **MERN stack**, integrated with **DeepSeek** and **OpenAI**, and secured with **JWT-based authentication**, PromptForge helps developers supercharge their workflows effortlessly.

---

## 🚀 Features

* 🧠 **Code Explainer** – Understand any code instantly using AI.
* 🐛 **Bug Fixer** – Paste buggy code and get one-click fixes with explanations.
* 🔍 **Regex Generator** – Generate complex regex patterns with natural language.
* 👤 **User Dashboard** – Manage sessions, saved prompts, and personal profile.
* 🔐 **JWT Authentication** – Secure access with login, registration, and protected routes.
* ⚡ **DeepSeek & OpenAI Integration** – Real-time smart assistant for fast, contextual help.

---

## 🛠️ Tech Stack

| Category         | Technologies Used                                                           |
| ---------------- | --------------------------------------------------------------------------- |
| Frontend         | `Next.js`, `React`, `TypeScript`, `TailwindCSS`                             |
| Backend          | `Express.js`, `Node.js`, `MongoDB`, `Mongoose`                              |
| Authentication   | `JWT`, `Role-Based Access Control (RBAC)`                                   |
| AI Integration   | `DeepSeek API`, `OpenAI API`                                                |
| State Management | `Context API`, `useReducer`                                                 |
| Styling          | `Tailwind CSS`, `Responsive Design`                                         |
| Deployment       | **Frontend**: Vercel<br>**Backend**: Railway<br>**Database**: MongoDB Atlas |

---

## 📁 Project Structure (Simplified)

```
PromptForge/
├── client/ (Next.js frontend)
├── server/ (Express backend)
└── README.md
```

---

## 🧪 Installation & Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/your-username/promptforge.git
   cd promptforge
   ```

2. **Setup the backend**

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Setup the frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Set environment variables** in `.env` for both frontend and backend:

   ```env
   OPENAI_API_KEY=your_key_here
   JWT_SECRET=your_secret_key
   MONGO_URI=your_mongo_connection_string
   ```

---

## 🌍 Live Demo

[🔗 Visit PromptForge](https://prompt-forge-six.vercel.app)

---

## 📚 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork, open a PR, or submit feedback.

---

## 📜 License

This project is licensed under the **MIT License**.

