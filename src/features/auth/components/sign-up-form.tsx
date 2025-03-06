"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { authClient as client } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundLines } from "@/components/ui/background-lines";
import Navbar from "@/features/home/ui/navbar/navbar";

export const SignUpForm = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function convertImageToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<BackgroundLines className="">
			<Navbar />
		<div className="grid dark bg-black place-items-center h-fit">
			<Card className="z-50 rounded-xl max-w-md mt-12">
				<CardHeader>
					<CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						Enter your information to create an account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="first-name">First name</Label>
								<Input
									id="first-name"
									placeholder="Max"
									required
									onChange={(e) => setFirstName(e.target.value)}
									value={firstName}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="last-name">Last name</Label>
								<Input
									id="last-name"
									placeholder="Robinson"
									required
									onChange={(e) => setLastName(e.target.value)}
									value={lastName}
								/>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="m@example.com"
								required
								onChange={(e) => setEmail(e.target.value)}
								value={email}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="new-password"
								placeholder="Password"
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password_confirmation">Confirm Password</Label>
							<Input
								id="password_confirmation"
								value={passwordConfirmation}
								onChange={(e) => setPasswordConfirmation(e.target.value)}
								autoComplete="new-password"
								placeholder="Confirm Password"
							/>
						</div>
						<Button
							type="submit"
							className="w-full"
							disabled={loading}
							onClick={async () => {
								await client.signUp.email({
									email,
									password,
									name: `${firstName} ${lastName}`,
									image: image ? await convertImageToBase64(image) : "",
									callbackURL: "/dashboard",
									fetchOptions: {
										onResponse: () => setLoading(false),
										onRequest: () => setLoading(true),
       	                            // onError: () => toast.message("Failed to sign in"),
										onSuccess: () => router.push("/chat"),
									},
								});
							}}
						>
							{loading ? <Loader2 size={16} className="animate-spin" /> : "Create an account"}
						</Button>
						<div className="flex flex-wrap items-center gap-2 w-full">
							<Button
								variant="outline"
								className="gap-2 flex-1 w-full py-4"
								onClick={async () => {
									await client.signIn.social({ provider: "google" });
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
									<path fill="currentColor" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"/>
									<path fill="currentColor" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
								</svg>
								Continue with Google
							</Button>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<div className="flex flex-col justify-center w-full border-t py-4">
						<div className="flex justify-center font-semibold"><a className="text-blue-500 underline mr-2" href="/sign-in">Sign In </a> Instead</div>
					</div>

				</CardFooter>
			</Card>
		</div>
		</BackgroundLines>
	);
};
