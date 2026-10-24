import { jsonResponse } from "@/app/api/auth/_authUtils";

function clearAuthCookie() {
  return {
    "Set-Cookie":
      "authToken=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0",
  };
}

function handleLogout() {
  try {
    return jsonResponse({ message: "Logged out successfully" }, 200, clearAuthCookie());
  } catch (error) {
    console.log("Error during logout:", error);
    return jsonResponse(
      { message: "Failed to log out", error: error.message },
      500
    );
  }
}

// Frontend `authLogin.signOut()` uses POST; GET kept for backwards compat.
export async function POST() {
  return handleLogout();
}

export async function GET() {
  return handleLogout();
}