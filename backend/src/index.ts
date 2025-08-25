import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware para interpretar JSON
app.use(express.json());

// Rota de teste
app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong 🏓" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
