import jwt from "jsonwebtoken";

const JWT_SECRET = "deed3c31c2c1acc319e2afcd049720c8232e6b6ee774c5c0228076e266fa0e6b53b17f11900c757fcfa342437c3c37da825a3cf62a578cadc6a8305f36f616a2";

export interface JWTPayload {
  userId: string;
  email: string;
  exp?: number;
}

export function signToken(payload: Omit<JWTPayload, "exp">): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}
