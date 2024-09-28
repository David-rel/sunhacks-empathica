// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; // Adjust the path according to where your prisma instance is located
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, username, email, password } = await request.json();

    // Validate the incoming data
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.userProfile.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await prisma.userProfile.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
