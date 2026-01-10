import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FaUser, FaLock } from "react-icons/fa";

type AuthResponse = {
  message: string;
  username: string;
  userId: number;
};

const API_URL = import.meta.env.VITE_API_URL as string;

async function apiPost<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as TResponse;
  }

  return (await res.text()) as TResponse;
}

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

    if (!API_URL) {
      setMessage("❌ VITE_API_URL is missing. Add it in .env and restart dev server.");
      return;
    }

    const username = email.trim();

    try {
      setIsSubmitting(true);

      if (isLogin) {
        const auth = await apiPost<AuthResponse>("/api/auth/login", {
          username,
          password,
        });

       
        localStorage.setItem("currentUser", JSON.stringify(auth));
        setMessage(`✅ Welcome, ${auth.username}!`);
        navigate("/dashboard");
      } else {

        await apiPost<string>("/api/auth/register", {
          username,
          password,
        });

        setMessage("🎉 Account created. Please log in.");
        setIsLogin(true);
        setEmail("");
        setPassword("");
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
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
          <span className="icon">
            <FaUser />
          </span>
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
          <span className="icon">
            <FaLock />
          </span>
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
          <p
            style={{
              marginTop: "1rem",
              color:
                message.includes("✅") || message.includes("🎉")
                  ? "green"
                  : "crimson",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthComponent;
