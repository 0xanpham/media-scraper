import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET || "";

async function hashPassword(password: string): Promise<string> {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

function createToken(userId: number, username: string): string {
  const token = jwt.sign({ userId, username }, jwtSecret, {
    expiresIn: 30 * 24 * 60 * 60,
  });
  return token;
}

function verifyToken(token: string): number {
  const payload = jwt.verify(token, jwtSecret) as JwtPayload;
  return payload.userId;
}

export { createToken, verifyToken, hashPassword, comparePassword };
