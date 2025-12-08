import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService.js";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hesla se neshodují!");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password, name });

      alert("Registrace proběhla úspěšně. Nyní se prosím přihlaste.");
      navigate("/login");
    } catch (err) {
      console.error("Chyba při registraci:", err);

      const serverData = err.response?.data;
      let serverMessage = null;

      if (serverData) {
        if (typeof serverData === "string") serverMessage = serverData;
        else if (serverData.message) serverMessage = serverData.message;
        else if (serverData.errors) {
          serverMessage = Array.isArray(serverData.errors)
            ? serverData.errors.join(", ")
            : JSON.stringify(serverData.errors);
        } else {
          serverMessage = JSON.stringify(serverData);
        }
      }

      setError(serverMessage || err.message || "Registrace selhala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" mb={3}>
        Registrace
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="320px">
        <TextField
          fullWidth
          label="Jméno"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Heslo"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Potvrzení hesla"
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Registruji..." : "Registrovat"}
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Už máte účet? <Link to="/login">Přihlaste se</Link>
        </Typography>
      </Box>
    </Box>
  );
}
