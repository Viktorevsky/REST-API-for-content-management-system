import { FastifyInstance } from "fastify";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import  { registerSchema, loginSchema } from '../schemas/auth.schema'
  

export default async function auth(app: FastifyInstance) {
  app.post("/auth/login", async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = await app.jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      { expiresIn: "7d" }
    );

    return reply.send({ accessToken: token });
  })
  app.post("/auth/register", async (request, reply) => {
    const { username, email, password } = registerSchema.parse(request.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return reply.status(409).send({ error: "User with this email already exists" });
    }
    
    const HashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { username, email, password: HashedPassword },
    });

    const token = await app.jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      { expiresIn: "7d" }
    );

    return reply.send({ accessToken: token });
})
}