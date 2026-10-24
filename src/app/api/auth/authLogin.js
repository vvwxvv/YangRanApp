import Cookies from "js-cookie";

class AuthLogin {
  /**
   * Sign in the user with provided credentials.
   * @param {Object} credentials - The login credentials (e.g., { email, password }).
   * @returns {Promise<Object>} - A result object indicating success or failure.
   */
  async signIn(credentials) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      // If the response is not OK, return an error
      if (!response.ok) {
        return {
          success: false,
          errors: data.message || "An unexpected error occurred.",
        };
      }

      // If a token is available, store it in cookies
      if (data.token) {
        this.setAuthCookies(data.token, data.user);
      }

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.log("Login error:", error);
      return {
        success: false,
        errors: "Unable to connect to the server.",
      };
    }
  }

  /**
   * Check the login status of the user based on the stored token.
   * @returns {Promise<Object>} - A result object indicating if the user is logged in.
   */
  async checkLoginStatus() {
    const token = Cookies.get("authToken");

    // If no token is found, return logged-out status
    if (!token) {
      return { isLoggedIn: false, user: null };
    }

    try {
      const response = await fetch("/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If the response is unauthorized or invalid, remove the token
      if (!response.ok) {
        if (response.status === 401) {
          this.clearAuthCookies();
        }
        return { isLoggedIn: false, user: null };
      }

      const data = await response.json();
      return {
        isLoggedIn: true,
        user: data.user,
      };
    } catch (error) {
      console.log("Verification error:", error);
      this.clearAuthCookies();
      return { isLoggedIn: false, user: null };
    }
  }

  /**
   * Log out the user by removing the token and calling the logout API.
   * @returns {Promise<Boolean>} - Whether the logout was successful.
   */
  async signOut() {
    try {
      const token = Cookies.get("authToken");

      // If no token is found, just clear cookies
      if (!token) {
        this.clearAuthCookies();
        return true;
      }

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear cookies regardless of the logout API response
      this.clearAuthCookies();
      return response.ok;
    } catch (error) {
      console.log("Logout error:", error);
      this.clearAuthCookies();
      return false;
    }
  }

  /**
   * Renew the authentication token if it's expired.
   * @returns {Promise<String|null>} - The new token or null if renewal fails.
   */
  async renewToken() {
    try {
      const token = Cookies.get("authToken");

      // If no token is found, return null
      if (!token) return null;

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If token renewal fails, remove the token
      if (!response.ok) {
        this.clearAuthCookies();
        throw new Error("Token renewal failed");
      }

      const data = await response.json();

      // Update the token in cookies
      if (data.token) {
        this.setAuthCookies(data.token, null); // No user data needed for renewal
      }

      return data.token;
    } catch (error) {
      console.log("Token renewal error:", error);
      this.clearAuthCookies();
      return null;
    }
  }

  /**
   * Set authentication cookies for the token and user data.
   * @param {String} token - The authentication token.
   * @param {Object|null} user - Optional user data.
   */
  setAuthCookies(token, user) {
    Cookies.set("authToken", token, {
      expires: 7, // Expires in 7 days
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // Prevent CSRF
      path: "/",
    });

    if (user) {
      Cookies.set(
        "userInfo",
        JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        }),
        {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          path: "/",
        }
      );
    }
  }

  /**
   * Clear all authentication-related cookies.
   */
  clearAuthCookies() {
    Cookies.remove("authToken");
    Cookies.remove("userInfo");
  }
}

// Create a single instance and export it
export const authLogin = new AuthLogin();