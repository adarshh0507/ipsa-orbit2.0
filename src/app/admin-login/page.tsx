"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const params = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (res.ok) {
        const next = params.get("next");
        window.location.href = next && next.startsWith("/admin") ? next : "/admin";
      } else {
        setError("Galat ID ya password");
      }
    } catch {
      setError("Kuch gadbad hui, dobara try karo");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "#0b1020" }}>
      <form
        onSubmit={onSubmit}
        style={{ width: "100%", maxWidth: 380, background: "#141b33", border: "1px solid #26304f", borderRadius: 16, padding: 28, color: "#fff", fontFamily: "system-ui, sans-serif" }}
      >
        <h1 style={{ fontSize: 22, margin: 0 }}>Admin Login</h1>
        <p style={{ opacity: 0.7, fontSize: 14, margin: "6px 0 20px" }}>IPSA Orbit admin panel</p>

        <label style={{ fontSize: 13, opacity: 0.8 }}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          style={inputStyle}
        />

        <label style={{ fontSize: 13, opacity: 0.8 }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          style={inputStyle}
        />

        {error && <p style={{ color: "#ff7b7b", fontSize: 14, margin: "0 0 12px" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: "#4f7cff", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Check ho raha hai..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: 12,
  margin: "6px 0 16px",
  borderRadius: 10,
  border: "1px solid #2c3759",
  background: "#0b1020",
  color: "#fff",
  fontSize: 15,
  outline: "none",
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
