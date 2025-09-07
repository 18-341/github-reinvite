"use client";

import { useState } from "react";
import { ORGANIZATIONS, type OrganizationKey } from "./config/organizations";

interface Input {
  owner: string;
  repo: string;
  username: string;
}

interface Invitation {
  id: number;
  invitee?: {
    login?: string;
  };
}

interface InviteResult {
  status: number;
  message: string;
  invitationId?: number;
}

type Result = {
  ok: boolean;
  error?: string;
  input?: Input;
  foundInvitations?: Invitation[];
  deletedInvitations?: { id: number }[];
  invite?: InviteResult | null;
};

export default function Page() {
  const organization = "18-341"; // Hardcoded organization
  const [assignment, setAssignment] = useState<string>(() => {
    // Ensure we have a valid assignment on first load
    const firstAssignment = Object.keys(ORGANIZATIONS[organization].assignments)[0];
    return firstAssignment || "🧑‍💻Lab: Git Started - Your Profile";
  });
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // Calculate repo name based on assignment and username
  const assignmentPrefix = ORGANIZATIONS[organization].assignments[assignment as keyof typeof ORGANIZATIONS[typeof organization]["assignments"]];
  const repoName = username && assignmentPrefix ? `${assignmentPrefix}-${username}` : "";
  const owner = ORGANIZATIONS[organization].owner;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setResult({ ok: false, error: "Username is required" });
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/reinvite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner, repo: repoName, username }),
      });
      const json = await res.json();
      setResult(json);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Request failed";
      setResult({ ok: false, error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #8B0000 0%, #000000 100%)",
      padding: "0.75rem"
    }}>
      <main style={{ 
        maxWidth: 680, 
        margin: "0 auto", 
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        padding: "1rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 style={{ 
            fontSize: "2.5rem", 
            fontWeight: "700", 
            color: "#1a1a1a", 
            margin: "0 0 0.5rem 0",
            background: "linear-gradient(135deg, #8B0000 0%, #000000 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            GitHub Re-invite Tool
          </h1>
          <p style={{ 
            fontSize: "1.1rem", 
            color: "#6b7280", 
            margin: "0",
            lineHeight: "1.6"
          }}>
            Select an assignment and enter your GitHub username to re-invite yourself
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ 
              fontSize: "0.875rem", 
              fontWeight: "600", 
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Assignment
            </label>
            <select 
              value={assignment} 
              onChange={e => setAssignment(e.target.value)}
              style={{
                padding: "0.875rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                outline: "none",
                background: "white",
                cursor: "pointer"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8B0000"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            >
              {Object.entries(ORGANIZATIONS[organization].assignments).map(([key]) => (
                <option key={key} value={key}>📝 {key}</option>
              ))}
            </select>
          </div>


          <div style={{ display: "grid", gap: "0.5rem" }}>
            <label style={{ 
              fontSize: "0.875rem", 
              fontWeight: "600", 
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Username
            </label>
            <input 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="e.g. octocat" 
              required 
              style={{
                padding: "0.875rem 1rem",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                transition: "all 0.2s ease",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = "#8B0000"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ 
            display: "grid", 
            gap: "0.5rem",
            padding: "1rem",
            background: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0"
          }}>
            <label style={{ 
              fontSize: "0.875rem", 
              fontWeight: "600", 
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Generated Repository Name
            </label>
            <div style={{
              padding: "0.875rem 1rem",
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: "1rem",
              color: repoName ? "#374151" : "#9ca3af",
              fontFamily: "monospace"
            }}>
              {repoName || "Enter username to see generated repo name"}
            </div>
          </div>

          <button 
            disabled={loading} 
            type="submit"
            style={{
              padding: "1rem 2rem",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #8B0000 0%, #000000 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 12px rgba(139, 0, 0, 0.4)",
              transform: loading ? "none" : "translateY(0)",
              marginTop: "0.5rem"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(139, 0, 0, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(139, 0, 0, 0.4)";
              }
            }}
          >
            {loading ? "⏳ Working..." : "🚀 Re-invite"}
          </button>
        </form>

        {result && (
          <section style={{ marginTop: "1rem" }}>
            <h2 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "600", 
              color: "#1a1a1a", 
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              {result.ok ? "✅ Result" : "❌ Error"}
            </h2>
            {!result.ok && (
              <div style={{ 
                background: "#fef2f2", 
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "1rem",
                color: "#dc2626"
              }}>
                <pre style={{ 
                  whiteSpace: "pre-wrap", 
                  margin: "0",
                  fontFamily: "inherit"
                }}>
                  {result.error}
                </pre>
              </div>
            )}
            {result.ok && (
              <div style={{ 
                background: "#f0f9ff", 
                border: "1px solid #bae6fd",
                borderRadius: "8px",
                padding: "1.5rem",
                overflow: "hidden"
              }}>
                {result.invite && (result.invite.status === 201 || result.invite.status === 204) && (
                  <div style={{
                    background: "#dcfce7",
                    border: "1px solid #bbf7d0",
                    borderRadius: "6px",
                    padding: "1rem",
                    marginBottom: "1rem"
                  }}>
                    <h3 style={{ 
                      margin: "0 0 0.5rem 0", 
                      fontSize: "1rem", 
                      fontWeight: "600", 
                      color: "#166534" 
                    }}>
                      🎉 Repository Link
                    </h3>
                    <a 
                      href={`https://github.com/${owner}/${repoName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1d4ed8",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontFamily: "monospace",
                        background: "white",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                        display: "inline-block",
                        wordBreak: "break-all"
                      }}
                      onMouseEnter={(e) => (e.target as HTMLAnchorElement).style.textDecoration = "underline"}
                      onMouseLeave={(e) => (e.target as HTMLAnchorElement).style.textDecoration = "none"}
                    >
                      https://github.com/{owner}/{repoName}
                    </a>
                  </div>
                )}
                <pre style={{ 
                  background: "white",
                  padding: "1rem",
                  borderRadius: "6px",
                  overflowX: "auto",
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                  color: "#374151",
                  border: "1px solid #e5e7eb",
                  margin: "0"
                }}>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}