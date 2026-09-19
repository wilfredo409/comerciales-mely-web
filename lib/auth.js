import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "mely-dev-secret-cambiar-en-produccion";
const COOKIE_NAME = "mely_session";
const MAX_AGE = 60 * 60 * 8; // 8 horas

export function signSession(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

export function verifySession(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function setSessionCookie(res, token) {
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function clearSessionCookie(res) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);
}

export function getSessionFromReq(req) {
  const cookies = req.cookies ? req.cookies : parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifySession(token);
}

// Roles permitidos: 'administrador' | 'empleado' | 'facturador'
export function requireRole(req, res, rolesPermitidos) {
  const session = getSessionFromReq(req);
  if (!session) {
    res.status(401).json({ error: "No autenticado. Inicia sesión para continuar." });
    return null;
  }
  if (rolesPermitidos && !rolesPermitidos.includes(session.rol)) {
    res.status(403).json({ error: "No tienes permisos para realizar esta acción." });
    return null;
  }
  return session;
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;
