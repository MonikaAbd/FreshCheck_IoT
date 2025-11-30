import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
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
        Přihlášení
      </Typography>
      <Box component="form" onSubmit={handleSubmit} width="300px">
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
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Přihlásit se
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Nemáte účet? <Link to="/register">Registrujte se</Link>
        </Typography>
      </Box>
    </Box>
  );
}
