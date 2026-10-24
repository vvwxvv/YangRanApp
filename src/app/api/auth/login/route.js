import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uri = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB;
const collectionName = "Users";

if (!uri || !dbName) {
  throw new Error("Please define the MONGODB_URL and MONGODB_DB environment variables");
}

let cachedClient = null;

async function connectDB() {
  if (cachedClient) {
    return cachedClient.db(dbName);
  }

  try {
    const client = new MongoClient(uri);
    cachedClient = await client.connect();
    return cachedClient.db(dbName);
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  throw new Error("JWT_SECRET environment variable is not set");
}

export async function POST(req) {
  let body;

  // Parse the request body
  try {
    body = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Invalid JSON" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { email, password } = body || {};

  // Validate input
  if (!email || !password) {
    return new Response(
      JSON.stringify({ message: "All fields are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const db = await connectDB();
    const collection = db.collection(collectionName);

    // Check if the user exists
    const user = await collection.findOne({ email });

    // If the user does not exist
    if (!user) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the password is invalid
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the lastLoginAt field with the current timestamp (as a string)
    const currentTimestamp = new Date().toISOString();
    await collection.updateOne({ email }, { $set: { lastLoginAt: currentTimestamp } });

    // Generate a JWT token with 1-hour expiration
    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Set the token in a secure HTTP-only cookie
    const response = new Response(
      JSON.stringify({
        message: "Login successful",
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLoginAt: currentTimestamp,
        },
        token, // Include the token in the response if needed
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Set secure cookie
    response.headers.append(
      "Set-Cookie",
      `authToken=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60}` // Expires in 1 hour
    );

    return response;
  } catch (error) {
    console.log("Error during login:", error.message, error.stack);

    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle unsupported methods like GET
export async function GET() {
  return new Response(
    JSON.stringify({ message: "Method not allowed" }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    }
  );
}