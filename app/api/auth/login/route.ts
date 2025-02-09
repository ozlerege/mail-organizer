import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sign } from "jsonwebtoken";

// Validation schema for login request
const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        sessionToken: sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET as string,
          { expiresIn: "30d" }
        ),
      },
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
        },
        sessionToken: session.sessionToken,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session=${
            session.sessionToken
          }; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`,
        },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
