import jwt from 'jsonwebtoken';
import getSlug from 'speakingurl';
import { uniqueNamesGenerator, starWars } from 'unique-names-generator';

export function generateToken(id: string, username: string) {
  return jwt.sign(
    {
      id,
      username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: '10d' }
  );
}

export function generateSlug(text: string): string {
  return getSlug(text, { lang: 'tr' });
}

export function generateCode(min: number = 10000, max: number = 99999) {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

export function generateName() {
  return uniqueNamesGenerator({ dictionaries: [starWars] });
}
