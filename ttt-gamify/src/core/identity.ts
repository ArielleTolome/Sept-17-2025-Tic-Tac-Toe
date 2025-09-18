import { kv, K } from './storage';
import { customAlphabet } from 'nanoid';

const nano = customAlphabet('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz', 24);

export type Profile = {
  userId: string;
  displayName?: string;
  avatar?: string; // data URL or preset key
  createdAt: number;
  updatedAt: number;
};

let cache: Profile | null = null;

export async function loadProfile() {
  let p = await kv.get<Profile | null>(K.PROFILE, null);
  if (!p) {
    p = {
      userId: 'u_' + nano(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await kv.set(K.PROFILE, p);
  }
  cache = p;
  return p;
}

export function getProfile(): Profile {
  if (!cache) throw new Error('Profile not loaded');
  return cache;
}

export async function updateProfile(patch: Partial<Profile>) {
  const p = { ...getProfile(), ...patch, updatedAt: Date.now() } as Profile;
  cache = p;
  await kv.set(K.PROFILE, p);
}

