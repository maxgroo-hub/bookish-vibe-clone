import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isSupabaseConfigured } from "./lib/supabase.ts";

function SetupScreen() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      background: "#0f172a",
      color: "#f1f5f9",
      padding: "2rem",
    }}>
      <div style={{
        maxWidth: "520px",
        width: "100%",
        background: "#1e293b",
        borderRadius: "12px",
        padding: "2.5rem",
        border: "1px solid #334155",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
      }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📚</div>
        <h1 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", fontWeight: 700 }}>
          LibraVault Setup Required
        </h1>
        <p style={{ margin: "0 0 1.5rem", color: "#94a3b8", lineHeight: 1.6 }}>
          This app needs Supabase credentials to run. Add the following secrets in the{" "}
          <strong style={{ color: "#e2e8f0" }}>Secrets</strong> tab of your Replit project:
        </p>
        <div style={{
          background: "#0f172a",
          borderRadius: "8px",
          padding: "1rem 1.25rem",
          marginBottom: "1.5rem",
          border: "1px solid #334155",
        }}>
          {["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"].map((key) => (
            <div key={key} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.4rem 0",
              fontFamily: "monospace",
              fontSize: "0.9rem",
            }}>
              <span style={{ color: "#f97316" }}>●</span>
              <span style={{ color: "#7dd3fc" }}>{key}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: "0", color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6 }}>
          You can find these values in your{" "}
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer"
            style={{ color: "#38bdf8", textDecoration: "none" }}>
            Supabase project dashboard
          </a>{" "}
          under Project Settings → API. After adding the secrets, restart the workflow.
        </p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(isSupabaseConfigured ? <App /> : <SetupScreen />);
