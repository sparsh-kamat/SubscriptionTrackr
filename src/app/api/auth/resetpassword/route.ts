import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Your shared Prisma client
import {
    getVerificationTokenByToken,
    deleteVerificationToken,
} from "@/data/token"; // Import data access functions
import { z } from "zod";
import bcrypt from "bcrypt";

const resetpasswordschema = z
    .object({
        
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Please confirm your password" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
    });

export async function POST(request: NextRequest) {

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    // Parse the request body
    const body = await request.json();
    //validate using zod
    const validation = resetpasswordschema.safeParse(body);

    if (!validation.success) {
        console.error(
            "Validation error in registaration:",
            validation.error.flatten().fieldErrors
        );
        return NextResponse.json(
            { errors: validation.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { password } = validation.data;

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    //validate token presence
    if (!token) {
        console.error("Token is missing");
        // You might want a dedicated error page, but redirecting to signin is common
        return NextResponse.redirect(
            new URL("/auth/signin?error=MissingToken", request.nextUrl.origin)
        );
    }

    try {
        //find the token
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) {
            console.error("Token not found");
            return NextResponse.redirect(
                new URL("/auth/signin?error=InvalidToken", request.nextUrl.origin)
            );
        }

        // Check if the token is expired
        const hasExpired = new Date().getTime() > existingToken.expires.getTime();
        if (hasExpired) {
            console.error("Token has expired");
            return NextResponse.redirect(
                new URL("/auth/register?error=TokenExpired", request.nextUrl.origin)
            );
        }

        //find the user
        const user = await prisma.user.findUnique({
            where: {
                email: existingToken.identifier,
            },
        });

        if (!user) {
            console.error("User not found");
            return NextResponse.redirect(
                new URL("/auth/register?error=UserNotFound", request.nextUrl.origin)
            );
        }

        //update the user
        await prisma.user.update({
            where: {
                email: existingToken.identifier,
            },
            data: {
                password: hashedPassword,
            },
        });
        console.log('User password updated successfully: ${user.email}');

        //delete the token
        await deleteVerificationToken(existingToken.identifier, token);
        console.log("Token deleted successfully");
        //redirect to signin
        return NextResponse.redirect(new URL("/auth/signin?success=PasswordReset", request.nextUrl.origin));


    }
    catch (error) {
        console.error("Error during password change ", error);
        return NextResponse.redirect(
            new URL("/auth/signin?error=VerificationFailed", request.nextUrl.origin)
        );
    }
}
