'use server';

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

type SignUpParams = {
    uid: string;
    name: string;
    email: string;
};

type SignInParams = {
    email: string;
    idToken: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
};

// ✅ Sign Up
export async function signUp(params: SignUpParams) {
    const { uid, name, email } = params;

    try {
        const userRef = db.collection("users").doc(uid);
        const userRecord = await userRef.get();

        if (userRecord.exists) {
            return {
                success: false,
                message: "User already exists. Please sign in instead.",
            };
        }

        await userRef.set({
            name,
            email,
            createdAt: new Date().toISOString(),
        });

        return {
            success: true,
            message: "Account created successfully.",
        };
    } catch (err) {
        const error = err as { code?: string; message?: string };
        console.error("❌ Firebase sign-up error:", error);

        if (error.code === "auth/email-already-exists") {
            return {
                success: false,
                message: "This email is already in use.",
            };
        }

        return {
            success: false,
            message: error.message || "Failed to create an account.",
        };
    }
}

// ✅ Sign In
export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord) {
            return {
                success: false,
                message: "User does not exist. Please sign up.",
            };
        }

        await setSessionCookie(idToken);

        return {
            success: true,
            message: "Signed in successfully.",
        };
    } catch (err) {
        const error = err as { code?: string; message?: string };
        console.error("❌ Firebase sign-in error:", error);

        return {
            success: false,
            message: error.message || "Failed to log into an account.",
        };
    }
}

// ✅ Set Session Cookie
export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies(); // ✅ await is required here

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000,
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

// ✅ Get Current User
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies(); // ✅ await is required here
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        const userDoc = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();

        if (!userDoc.exists) return null;

        return {
            ...userDoc.data(),
            id: userDoc.id,
        } as User;
    } catch (error) {
        console.error("⚠️ Session verification error:", error);
        return null;
    }
}

// ✅ Check if user is authenticated
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}
