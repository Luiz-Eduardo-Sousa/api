import express from 'express';
import { PrismaClient } from "./generated/prisma/index.js";
import e from 'express';


const prisma = new PrismaClient();
const app = express();


app.use(express.json());



app.post('/users', async (req, res) => {

   await prisma.user.create({ 
        data: {
            email: req.body.email,
            name: req.body.name,
            age: req.body.age
        }
      });
});

app.put('/users/:id', async (req, res) => {

  await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }
  });
});

app.get('/users', async (req, res) => {

  let users = []

  if(req.query) {
    users = await prisma.user.findMany({
      where: {
        name: req.query.name,
        email: req.query.email,
        age: req.query.age
      }
    });
  } else {
    users = await prisma.user.findMany();
  }

  res.status(200).json(users);
});

app.delete('/users/:id', async (req, res) => {
  await prisma.user.delete({
    where: { id: Number(req.params.id) }
  });
  res.status(204).json({message: "User deleted"});
});

app.listen(3000);