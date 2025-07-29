"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { auth } from "@/firebase/client";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

import { signUp, signIn } from "@/lib/actions/auth.action";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) =>
    z.object({
        name:
            type === "sign-up"
                ? z.string().min(3, "Name must be at least 3 characters")
                : z.string().optional(),
        email: z.string().email("Enter a valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

const AuthForm = ({ type }: { type: FormType }) => {
    const router = useRouter();
    const isSignIn = type === "sign-in";
    const formSchema = authFormSchema(type);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const { name, email, password } = values;

        try {
            if (type === "sign-up") {
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name ?? "",
                    email,
                });

                if (!result?.success) {
                    toast.error(result?.message || "Signup failed");
                    return;
                }

                toast.success("Account created successfully");
                router.push("/sign-in");

            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredential.user.getIdToken();

                // ✅ Set secure session cookie on server
                const res = await fetch("/api/set-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ idToken }),
                });

                if (!res.ok) {
                    toast.error("Failed to establish session.");
                    return;
                }

                const result = await signIn({ email, idToken });

                if (!result?.success) {
                    toast.error(result?.message || "Sign in failed");
                    return;
                }

                toast.success("Signed in successfully");
                router.refresh(); // ✅ Refresh session-aware layouts
                router.push("/");
            }
        } catch (error: any) {
            console.error("Auth error:", error);

            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already in use. Please sign in instead.");
            } else if (error.code === "auth/invalid-email") {
                toast.error("Invalid email address.");
            } else if (error.code === "auth/wrong-password") {
                toast.error("Incorrect password.");
            } else if (error.code === "auth/user-not-found") {
                toast.error("No user found with this email.");
            } else {
                toast.error(error.message || "Something went wrong.");
            }
        }
    };

    return (
        <div className="w-full max-w-xl rounded-2xl bg-[#111827] p-10 shadow-xl backdrop-blur-md border border-white/10">
            <div className="flex flex-col gap-6 text-white">
                <div className="flex flex-row gap-2 justify-center items-center">
                    <Image src="/logo.svg" alt="logo" height={32} width={38} />
                    <h2 className="text-blue-300 text-2xl font-bold">Intvu</h2>
                </div>

                <h3 className="text-white text-xl font-semibold text-center">
                    Get AI-Ready for Your Dream Job
                </h3>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8 mt-4 form">
                        {!isSignIn && (
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jung Kook" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your email id" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className="w-full bg-blue-400 hover:bg-blue-500 text-white">
                            {isSignIn ? "Sign in" : "Create an Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center">
                    {isSignIn ? "No account yet?" : "Have an account already?"}
                    <Link
                        href={isSignIn ? "/sign-up" : "/sign-in"}
                        className="font-bold text-user-primary ml-1"
                    >
                        {isSignIn ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
