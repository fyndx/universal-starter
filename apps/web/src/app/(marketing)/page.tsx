import Link from "next/link";
import {
	ChevronRight,
	Code,
	Layers,
	Shield,
	Sparkles,
	Star,
	Users,
	Zap,
} from "lucide-react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
	return (
		<>
			<HeroSection />
			<FeaturesSection />
			<PricingSection />
			<TestimonialsSection />
			<FAQSection />
		</>
	);
}

function HeroSection() {
	return (
		<section className="relative overflow-hidden px-6 py-20 sm:py-28">
			<div
				className="absolute inset-0 opacity-5"
				style={{
					backgroundImage:
						"radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>
			<div className="relative mx-auto max-w-4xl text-center">
				<div className="mx-auto mb-10 flex h-36 w-36 items-center justify-center rounded-3xl border border-border bg-background/80 shadow-2xl backdrop-blur-xl">
					<Zap className="h-12 w-12 text-primary" />
				</div>

				<h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
					Introducing <span className="text-primary">Universal Starter</span>
				</h1>

				<p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
					The ultimate Next.js + React Native starter kit to launch your product
					faster — powered by Tailwind, Better Auth, and Elysia.
				</p>

				<div className="mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Button
						asChild
						size="lg"
						className="rounded-full px-8 py-6 text-base"
					>
						<Link href="/auth/sign-up">
							Get Started Free
							<ChevronRight className="h-5 w-5" />
						</Link>
					</Button>
					<Button
						asChild
						variant="outline"
						size="lg"
						className="rounded-full px-8 py-6 text-base"
					>
						<Link href="/about">
							Watch Demo
							<span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
								▶
							</span>
						</Link>
					</Button>
				</div>

				<div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
					<Users className="h-4 w-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						1000+ Happy Developers
					</span>
				</div>
			</div>
		</section>
	);
}

function FeaturesSection() {
	const features = [
		{
			id: "web-mobile",
			icon: Layers,
			title: "Web + Native, Diverged",
			description:
				"A mature Next.js web app and an Expo React Native mobile app, sharing auth, types, and design tokens from one monorepo.",
		},
		{
			id: "fast-dev",
			icon: Zap,
			title: "Lightning Fast Development",
			description:
				"Built with Next.js App Router, Turbopack, Tailwind v4, and shadcn/ui for rapid development and optimal performance.",
		},
		{
			id: "production-ready",
			icon: Shield,
			title: "Production Ready",
			description:
				"Includes authentication, admin user management, dark mode, and deployment configurations out of the box.",
		},
		{
			id: "modern-stack",
			icon: Code,
			title: "Modern Tech Stack",
			description:
				"TypeScript, Tailwind CSS, Better Auth, and a typed Elysia API with Eden treaty clients end-to-end.",
		},
	];

	return (
		<section className="bg-muted/30 px-4 py-16 sm:py-24">
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
						Why Choose Universal Starter?
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Everything you need to build and ship your next web and mobile
						application faster than ever.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
					{features.map((feature) => (
						<div
							key={feature.id}
							className="rounded-xl border border-border bg-background p-6 shadow-sm transition-shadow hover:shadow-md"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<feature.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-3 text-xl font-semibold text-foreground">
								{feature.title}
							</h3>
							<p className="leading-relaxed text-muted-foreground">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function PricingSection() {
	const plans = [
		{
			id: "free",
			name: "Free",
			price: "$0",
			period: "forever",
			description: "Perfect for learning and personal projects",
			features: [
				"Complete starter template",
				"Basic authentication",
				"Cross-platform support",
				"Community support",
				"Open source license",
			],
			cta: "Get Started",
			popular: false,
		},
		{
			id: "pro",
			name: "Pro",
			price: "$49",
			period: "one-time",
			description: "Everything you need for professional development",
			features: [
				"Everything in Free",
				"Premium components library",
				"Advanced auth features",
				"Priority support",
				"Commercial license",
				"Deployment guides",
				"Lifetime updates",
			],
			cta: "Upgrade to Pro",
			popular: true,
		},
	];

	return (
		<section className="bg-background px-4 py-16 sm:py-24">
			<div className="mx-auto max-w-4xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
						Simple, Transparent Pricing
					</h2>
					<p className="text-lg text-muted-foreground">
						Choose the plan that fits your needs. Upgrade anytime.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
					{plans.map((plan) => (
						<div
							key={plan.id}
							className={`relative rounded-xl border-2 bg-background p-8 ${
								plan.popular ? "border-primary shadow-lg" : "border-border"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<div className="rounded-full bg-primary px-4 py-1">
										<span className="text-sm font-medium text-primary-foreground">
											Most Popular
										</span>
									</div>
								</div>
							)}

							<div className="mb-6 text-center">
								<h3 className="mb-2 text-2xl font-bold text-foreground">
									{plan.name}
								</h3>
								<div className="flex items-baseline justify-center">
									<span className="text-4xl font-bold text-foreground">
										{plan.price}
									</span>
									<span className="ml-2 text-muted-foreground">
										/{plan.period}
									</span>
								</div>
								<p className="mt-2 text-muted-foreground">{plan.description}</p>
							</div>

							<ul className="mb-8 space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-center">
										<span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
											<span className="text-xs text-primary">✓</span>
										</span>
										<span className="flex-1 text-foreground">{feature}</span>
									</li>
								))}
							</ul>

							<Button
								asChild
								className="w-full"
								variant={plan.popular ? "default" : "outline"}
							>
								<Link href="/auth/sign-up">{plan.cta}</Link>
							</Button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function TestimonialsSection() {
	const testimonials = [
		{
			id: "sarah-chen",
			name: "Sarah Chen",
			role: "Lead Developer",
			company: "TechFlow Inc",
			avatar: "👩‍💻",
			quote:
				"Universal Starter saved us months of setup time. The architecture is solid and the developer experience is amazing.",
		},
		{
			id: "marcus-rodriguez",
			name: "Marcus Rodriguez",
			role: "Founder",
			company: "StartupLab",
			avatar: "👨‍🚀",
			quote:
				"Finally, a starter kit that actually works across web and mobile. Our team can focus on building features instead of configuration.",
		},
		{
			id: "emily-thompson",
			name: "Emily Thompson",
			role: "Mobile Architect",
			company: "Digital Solutions",
			avatar: "👩‍🎨",
			quote:
				"The integration of Better Auth and Tailwind makes state management and styling a breeze. Highly recommended!",
		},
	];

	return (
		<section className="bg-muted/20 px-4 py-16 sm:py-24">
			<div className="mx-auto max-w-6xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
						What Our Customers Say
					</h2>
					<p className="text-lg text-muted-foreground">
						Join thousands of developers who trust Universal Starter
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
					{testimonials.map((testimonial) => (
						<div
							key={testimonial.id}
							className="max-w-sm rounded-xl border border-border bg-background p-6 shadow-sm"
						>
							<div className="mb-4 flex">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star
										key={`star-${testimonial.id}-${i}`}
										className="h-4 w-4 fill-yellow-500 text-yellow-500"
									/>
								))}
							</div>
							<p className="mb-6 italic leading-relaxed text-foreground">
								“{testimonial.quote}”
							</p>
							<div className="flex items-center">
								<div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
									<span className="text-2xl">{testimonial.avatar}</span>
								</div>
								<div className="flex-1">
									<p className="font-semibold text-foreground">
										{testimonial.name}
									</p>
									<p className="text-sm text-muted-foreground">
										{testimonial.role}
									</p>
									<p className="text-sm text-muted-foreground">
										{testimonial.company}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function FAQSection() {
	const faqs = [
		{
			id: "platforms",
			question: "What platforms does Universal Starter support?",
			answer:
				"Universal Starter ships a mature Next.js web app and an Expo React Native mobile app from one monorepo, sharing auth, types, and design tokens.",
		},
		{
			id: "experience",
			question: "Do I need experience with React Native to use this?",
			answer:
				"Basic React knowledge is recommended. The starter includes comprehensive examples to help you get started quickly, even if you're new to React Native.",
		},
		{
			id: "authentication",
			question: "What's included in the authentication system?",
			answer:
				"We use Better Auth which provides email/password authentication, social logins, session management, and security features like CSRF protection and rate limiting.",
		},
		{
			id: "customization",
			question: "Can I customize the UI components and styling?",
			answer:
				"Absolutely! The UI is built with Tailwind CSS and shadcn/ui, making it easy to customize colors, spacing, and components to match your brand.",
		},
		{
			id: "support",
			question: "Is there ongoing support and updates?",
			answer:
				"Yes! The starter kit receives regular updates with new features, security patches, and improvements. Pro users get priority support and early access to new features.",
		},
	];

	return (
		<section className="bg-background px-4 py-16 sm:py-24">
			<div className="mx-auto w-full max-w-3xl">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
						Frequently Asked Questions
					</h2>
					<p className="text-lg text-muted-foreground">
						Everything you need to know about Universal Starter
					</p>
				</div>

				<Accordion type="single" collapsible className="w-full">
					{faqs.map((faq) => (
						<AccordionItem key={faq.id} value={faq.id}>
							<AccordionTrigger>{faq.question}</AccordionTrigger>
							<AccordionContent>
								<p className="leading-relaxed text-muted-foreground">
									{faq.answer}
								</p>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>

				<div className="mt-16 text-center">
					<p className="mb-6 text-muted-foreground">
						Still have questions? We&apos;re here to help.
					</p>
					<Button asChild>
						<Link href="/auth/sign-up">
							<Sparkles className="h-4 w-4" />
							Get Started Today
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
