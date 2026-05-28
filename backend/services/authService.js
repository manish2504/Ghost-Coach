import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';

const SALT_ROUNDS = 12;

export async function registerUser({ name, email, password, sport, role, level }) {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const id = uuidv4();

  const { data, error } = await supabase
    .from('users')
    .insert({
      id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      sport: sport.trim(),
      role: role.trim(),
      level,
    })
    .select('id, name, email, sport, role, level, created_at')
    .single();

  if (error) throw new Error(error.message);

  const token = generateToken(data.id);
  return { user: data, token };
}

export async function loginUser({ email, password }) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken(user.id);
  return { user: safeUser, token };
}

export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, sport, role, level, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return data;
}

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
