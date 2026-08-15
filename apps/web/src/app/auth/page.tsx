"use client";

import { useRouter } from "next/navigation";
import { Apple, Chrome, Facebook, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Screen } from "@/components/screen";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const PROVIDERS = [
	{ provider: "google" as const, label: "Continue with Google", Icon: Chrome },
	{
		provider: "facebook" as const,
		label: "Continue with Facebook",
		Icon: Facebook,
	},
	{ provider: "github" as const, label: "Continue with Github", Icon: Github },
	{ provider: "apple" as const, label: "Continue with Apple", Icon: Apple },
	{
		provider: "linkedin" as const,
		label: "Continue with Linkedin",
		Icon: Linkedin,
	},
];

export default function AuthIndex() {
	const router = useRouter();

	const handleSocialLogin = async (
		provider: "google" | "facebook" | "github" | "apple" | "linkedin",
	) => {
		const result = await authClient.signIn.social({
			provider,
			callbackURL: "/",
		});
		if (result.error) {
			toast.error("Failed to login", {
				description: result.error.message,
			});
			return;
		}
		router.replace("/home");
	};

	return (
		<Screen className="items-center">
			<div className="flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
				<div className="flex flex-col gap-2">
					<h1 className="text-center text-2xl font-bold">Welcome</h1>
					<p className="text-center text-muted-foreground">
						Sign in to continue
					</p>
				</div>
				<div className="flex flex-col gap-3">
					{PROVIDERS.map(({ provider, label, Icon }) => (
						<Button
							key={provider}
							variant="outline"
							className="w-full"
							onClick={() => handleSocialLogin(provider)}
						>
							<Icon className="h-5 w-5" />
							{label}
						</Button>
					))}

					<div className="py-2">
						<div className="flex items-center justify-center bg-background px-2 text-center">
							<span className="text-xs text-muted-foreground">Or</span>
						</div>
					</div>

					<Button
						className="w-full"
						onClick={() => router.push("/auth/sign-in")}
					>
						Continue with Email
					</Button>
				</div>
				<p className="text-center text-xs text-muted-foreground">
					By continuing, you agree to our Terms of Service and Privacy Policy.
				</p>
			</div>
		</Screen>
	);
}
