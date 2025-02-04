import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", {
        username,
        password,
      });
      
      // JWT tokenni saqlash (localStorage yoki cookie'da)
      localStorage.setItem("token", response.data.access_token);

      // Admin sahifasiga yo'naltirish
      router.push("/admin");
    } catch (error) {
      setErrorMessage("Foydalanuvchi yoki parol noto'g'ri");
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Panelga Kirish</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Foydalanuvchi nomi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Kirishingiz</button>
      </form>
    </div>
  );
}
