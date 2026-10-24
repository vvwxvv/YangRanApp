// lib/auth.js
import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}