import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../../src/shared/lib/mongoose";
import { User } from "../../src/shared/models";

async function runDBTest() {
  try {
    // 1) Connect to MongoDB
    const mongoose = await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clean up any existing data
    await mongoose.connection.dropDatabase();
    console.log("🧹 Cleaned up test database");

    // 2) Create User
    // Generate a unique email for each test run
    const testEmail = `test-${Date.now()}@example.com`;
    
    const user = await User.create({
      name: "Test User",
      role: "STUDENT",
      email: testEmail, // Use unique email
      hash: "$2b$10$8X7z5t7i7z5t7i7z5t7i7u", // Example bcrypt hash
      dob: new Date(2000, 0, 1), // January 1, 2000
      status: "ACTIVE",
    });
    console.log("✅ Created User:", user.toJSON());

    // 3) Read User
    const found = await User.findById(user.id);
    console.log("✅ Found User:", found?.toJSON());

    // 4) Update User
    if (found) {
      found.name = "Updated User";
      await found.save();
      console.log("✅ Updated User:", found.toJSON());
    }

    // 5) Delete User
    await User.findByIdAndDelete(user.id);
    const deleted = await User.findById(user.id);
    console.log("✅ Deleted User:", deleted);
  } catch (err) {
    console.error("❌ DB Test Failed:", err);
    process.exit(1);
  } finally {
    // Close the connection when done
    await mongoose.connection.close();
    process.exit(0);
  }
}

runDBTest();
