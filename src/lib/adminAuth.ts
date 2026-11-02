// ============================================================
//  ADMIN LOGIN SETTINGS  -  USERNAME / PASSWORD YAHAN BADLO
// ============================================================
// Is file ko GitHub par edit karke commit karoge to Vercel redeploy
// ke baad naya username/password lag jayega.
//
// Note: ye file sirf server par chalti hai (browser ko nahi bheji jaati).

export const ADMIN_USERNAME = "ASPP2916";
export const ADMIN_PASSWORD = "ipsaorbit@2916";

// Cookie banane ke liye secret. Isko bhi kuch bhi random likh sakte ho.
export const ADMIN_SECRET = "ipsa-orbit-secret-change-me";

export const ADMIN_COOKIE_NAME = "ipsa_admin_session";

// Username + password + secret se token banta hai.
// Password badloge to purane sab login apne aap logout ho jayenge.
export async function makeAdminToken(): Promise<string> {
  const data = new TextEncoder().encode(
    `${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${ADMIN_SECRET}`
  );
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
