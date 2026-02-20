import { kv } from "@vercel/kv";
import type { Session, UserAuth } from "@/app/_data";
import { profiles, sessions, users } from "@/app/_data";
import type { UserProfile } from "@/lib/userTypes";

/**
 * Fix: Do not hard-gate KV usage based on env detection.
 * On Vercel, env availability and runtime differences can make KV_ENABLED brittle.
 * Instead: attempt KV reads/writes, and fall back to in-memory only if KV throws.
 */

function normalizeSession(s: any): any {
  if (!s) return s;
  if (!s.economy) {
    const now = Date.now();
    s.economy = {
      likesUsedToday: 0,
      lastResetAt: now,
      pendingLikes: [],
      notifications: [],
      lastMatchDropAt: 0,
      matchDropHourLocal: 19,
      ambientLastTickAt: 0,
    };
  }
  if (!Array.isArray(s.economy.pendingLikes)) s.economy.pendingLikes = [];
  if (!Array.isArray(s.economy.notifications)) s.economy.notifications = [];
  if (typeof s.economy.likesUsedToday !== "number") s.economy.likesUsedToday = 0;
  if (typeof s.economy.lastResetAt !== "number") s.economy.lastResetAt = Date.now();
  if (typeof s.economy.lastMatchDropAt !== "number") s.economy.lastMatchDropAt = 0;
  if (typeof s.economy.matchDropHourLocal !== "number") s.economy.matchDropHourLocal = 19;
  if (typeof s.economy.ambientLastTickAt !== "number") s.economy.ambientLastTickAt = 0;
  return s;
}

function keyAuth(userId: string) {
  return `aidating:user:auth:${userId}`;
}
function keyProfile(userId: string) {
  return `aidating:user:profile:${userId}`;
}
function keySession(userId: string) {
  return `aidating:session:${userId}`;
}

async function kvGetSafe<T>(key: string): Promise<{ ok: boolean; value: T | null }> {
  try {
    const v = await kv.get<T>(key);
    return { ok: true, value: (v ?? null) as any };
  } catch {
    return { ok: false, value: null };
  }
}

async function kvSetSafe<T>(key: string, value: T): Promise<boolean> {
  try {
    await kv.set(key, value as any);
    return true;
  } catch {
    return false;
  }
}

export async function getUserAuthByEmailOrPhone(args: { email?: string; phone?: string }): Promise<UserAuth | null> {
  // KV: store a simple index list for demo. For production, use a DB.
  const idxRes = await kvGetSafe<Record<string, string>>("aidating:index:auth");
  if (idxRes.ok) {
    const idx = idxRes.value ?? {};
    const hitKey = args.email
      ? idx[`email:${args.email.toLowerCase()}`]
      : args.phone
        ? idx[`phone:${args.phone}`]
        : null;
    if (!hitKey) return null;

    const hit = await kvGetSafe<UserAuth>(hitKey);
    return hit.ok ? hit.value : null;
  }

  const email = args.email?.toLowerCase();
  const phone = args.phone;
  return users.find((u) => (email && u.email?.toLowerCase() === email) || (phone && u.phone === phone)) ?? null;
}

export async function setUserAuth(user: UserAuth): Promise<void> {
  const ok = await kvSetSafe(keyAuth(user.id), user);
  if (ok) {
    // index
    const idxRes = await kvGetSafe<Record<string, string>>("aidating:index:auth");
    const idx = (idxRes.ok ? idxRes.value : null) ?? {};
    if (user.email) idx[`email:${user.email.toLowerCase()}`] = keyAuth(user.id);
    if (user.phone) idx[`phone:${user.phone}`] = keyAuth(user.id);
    await kvSetSafe("aidating:index:auth", idx);
    return;
  }

  const i = users.findIndex((u) => u.id === user.id);
  if (i >= 0) users[i] = user;
  else users.push(user);
}

export async function getUserAuth(userId: string): Promise<UserAuth | null> {
  const res = await kvGetSafe<UserAuth>(keyAuth(userId));
  if (res.ok) return res.value;
  return users.find((u) => u.id === userId) ?? null;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const res = await kvGetSafe<UserProfile>(keyProfile(userId));
  if (res.ok) return res.value;
  return profiles[userId] ?? null;
}

export async function setUserProfile(userId: string, profile: UserProfile): Promise<void> {
  const ok = await kvSetSafe(keyProfile(userId), profile);
  if (ok) return;
  profiles[userId] = profile;
}

export async function getSession(userId: string): Promise<Session | null> {
  const res = await kvGetSafe<Session>(keySession(userId));
  if (res.ok) return normalizeSession(res.value);
  return normalizeSession(sessions[userId] ?? null);
}

export async function setSession(userId: string, session: Session): Promise<void> {
  const ok = await kvSetSafe(keySession(userId), session);
  if (ok) return;
  sessions[userId] = session;
}

export async function ensureSession(userId: string): Promise<Session> {
  const existing = await getSession(userId);
  if (existing) return normalizeSession(existing);

  const now = Date.now();
  const fresh: Session = {
    userId,
    createdAt: now,
    updatedAt: now,
    subscriptionTier: "free",
    profilePool: [],
    swipeHistory: [],
    arcs: {},
    // economy + async match pipeline (added)
    economy: {
      likesUsedToday: 0,
      lastResetAt: now,
      pendingLikes: [],
      notifications: [],
      lastMatchDropAt: 0,
      matchDropHourLocal: 19,
      ambientLastTickAt: 0,
    },
  } as any;

  await setSession(userId, fresh);
  return fresh;
}

export function computeLikeLimit(tier: Session["subscriptionTier"]): number {
  if (tier === "premium") return 999999;
  if (tier === "standard") return 60;
  return 20;
}

export function startOfTodayMs(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// Back-compat exports used by routes
export async function findUserByEmailOrPhone(args: { email?: string; phone?: string }) {
  return getUserAuthByEmailOrPhone(args);
}
export async function createUser(user: UserAuth) {
  // Ensure onboardingSeen default
  const u: any = { onboardingSeen: false, ...user };
  return setUserAuth(u);
}