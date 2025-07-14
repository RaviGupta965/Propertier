import { connectDB } from "@/app/lib/mongodb";
import { User } from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectDB();
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return new Response("All fields required", { status: 400 });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response("User already exists", { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });

  return new Response("User registered", { status: 201 });
}