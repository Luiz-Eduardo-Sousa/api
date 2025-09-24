import express from 'express';
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// Criar usuário
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Atualizar usuário
app.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id }, 
      data: {
        email: req.body.email,
        name: req.body.name,
        age: req.body.age
      }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar usuários (com filtros opcionais)
app.get('/users', async (req, res) => {
  try {
    const filters = {};

    if (req.query.name) filters.name = req.query.name;
    if (req.query.email) filters.email = req.query.email;
    if (req.query.age) filters.age = req.query.age;

    const users = await prisma.user.findMany({
      where: Object.keys(filters).length ? filters : undefined
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar usuário
app.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: req.params.id }
    });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
