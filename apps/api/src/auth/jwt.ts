import jwt from 'jsonwebtoken';
import { env } from '../env';
import { createUnauthorized } from '../errors';

export type Seat = 'X' | 'O' | 'spectator';

export interface SocketTokenPayload {
  sub: string;
  roomId: string;
  gameId: string;
  seat: Seat;
  name?: string;
  iat?: number;
  exp?: number;
}

const SIGN_OPTIONS: jwt.SignOptions = {
  algorithm: 'HS256',
  issuer: env.JWT_ISSUER,
  expiresIn: '2h',
};

export const signSocketToken = (payload: SocketTokenPayload): string =>
  jwt.sign(payload, env.WS_JWT_SECRET, SIGN_OPTIONS);

export const verifySocketToken = (token: string): SocketTokenPayload => {
  try {
    return jwt.verify(token, env.WS_JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: env.JWT_ISSUER,
    }) as SocketTokenPayload;
  } catch (error) {
    throw createUnauthorized('Invalid or expired token', 'invalid_token');
  }
};
