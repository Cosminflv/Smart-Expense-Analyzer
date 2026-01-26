import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FaUser, FaLock } from "react-icons/fa";

import { login, register } from "../../api/authApi";

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const username = email.trim();

    try {
      setIsSubmitting(true);

      if (isLogin) {
        const auth = await login(username, password);
        localStorage.setItem("currentUser", JSON.stringify(auth));
        navigate("/dashboard");
      } else {
        await register(username, password);
        setMessage("🎉 Account created. Please log in.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      const error = err as Error;
      setMessage(`❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-toggle">
        <button
          className={isLogin ? "active" : ""}
          onClick={() => setIsLogin(true)}
          type="button"
        >
          Login
        </button>
        <button
          className={!isLogin ? "active" : ""}
          onClick={() => setIsLogin(false)}
          type="button"
        >
          Sign up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <span className="icon"><FaUser /></span>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="input-wrapper">
          <span className="icon"><FaLock /></span>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        <button className="auth-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : isLogin ? "Login" : "Sign up"}
        </button>

        {message && (
          <p className={`auth-message ${
            message.includes("🎉") || message.includes("✅") ? "success" : "error"
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthComponent;
