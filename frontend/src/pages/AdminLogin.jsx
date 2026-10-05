import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !password) {
            setError(
                "Admin email and password are required."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:3000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        email: cleanEmail,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Admin login failed."
                );
            }

            localStorage.setItem(
                "mineptheAdminToken",
                data.token
            );

            localStorage.setItem(
                "mineptheAdmin",
                JSON.stringify(data.admin)
            );

            navigate("/admin-dashboard");

        } catch (error) {
            setError(
                error.message ||
                "Unable to login as admin."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px"
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "440px",
                    padding: "32px",
                    borderRadius: "16px",
                    border: "1px solid #ddd",
                    background: "#fff",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)"
                }}
            >
                <h1>
                    MINEPTHE Admin
                </h1>

                <p>
                    Secure administrator login
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "16px" }}>
                        <label>
                            Admin Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="Admin email"
                            autoComplete="username"
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "6px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label>
                            Admin Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Admin password"
                            autoComplete="current-password"
                            style={{
                                width: "100%",
                                padding: "12px",
                                marginTop: "6px",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                marginBottom: "16px",
                                padding: "12px",
                                borderRadius: "8px",
                                background: "#ffe8e8",
                                color: "#b00020"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "13px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer"
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Admin Login"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "12px"
                    }}
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default AdminLogin;