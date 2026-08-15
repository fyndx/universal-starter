"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface PricingTier {
	id: string;
	name: string;
	price: string;
	originalPrice?: string;
	period: string;
	description: string;
	features: string[];
	buttonText: string;
	popular?: boolean;
	savings?: string;
	icon: string;
}

const PRICING_TIERS: PricingTier[] = [
	{
		id: "monthly",
		name: "Pro Monthly",
		price: "$29",
		period: "/month",
		description: "Perfect for getting started with professional features",
		features: [
			"Up to 5 team members",
			"Advanced analytics",
			"Priority support",
			"Custom integrations",
			"Advanced reporting",
			"API access",
		],
		buttonText: "Start Monthly Plan",
		icon: "🕐",
	},
	{
		id: "annual",
		name: "Pro Annual",
		price: "$290",
		originalPrice: "$348",
		period: "/year",
		description: "Save 17% with annual billing - most popular choice",
		features: [
			"Everything in Monthly",
			"Up to 25 team members",
			"Advanced security features",
			"Custom branding",
			"Dedicated account manager",
			"Advanced workflows",
			"Priority feature requests",
		],
		buttonText: "Start Annual Plan",
		popular: true,
		savings: "Save $58/year",
		icon: "⭐",
	},
	{
		id: "lifetime",
		name: "Lifetime Access",
		price: "$999",
		period: "one-time",
		description: "Pay once, use forever - ultimate value",
		features: [
			"Everything in Annual",
			"Unlimited team members",
			"Lifetime updates",
			"VIP support",
			"Beta access",
			"Custom development",
			"White-label options",
			"Revenue sharing program",
		],
		buttonText: "Get Lifetime Access",
		savings: "Best Value",
		icon: "♾️",
	},
];

const COMMON_FEATURES = [
	"SSL certificates",
	"99.9% uptime guarantee",
	"Mobile app access",
	"Email support",
	"Basic analytics",
	"Standard integrations",
];

const FAQS = [
	{
		question: "Can I change my plan later?",
		answer:
			"Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
	},
	{
		question: "What payment methods do you accept?",
		answer:
			"We accept all major credit cards, PayPal, and bank transfers for annual plans.",
	},
	{
		question: "Is there a refund policy?",
		answer:
			"Yes, we offer a 30-day money-back guarantee for all plans. No questions asked.",
	},
];

export default function PricingPage() {
	const [isAnnual, setIsAnnual] = useState(false);

	return (
		<section className="px-4 py-12 sm:py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 text-center sm:mb-12">
					<h1 className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
						Choose Your Plan
					</h1>
					<p className="mx-auto mb-8 max-w-[600px] text-center text-base leading-6 text-muted-foreground sm:text-lg md:text-xl">
						Select the perfect plan for your needs. Start with our flexible
						monthly option, save with annual billing, or get lifetime access for
						the ultimate value.
					</p>

					<div className="inline-flex items-center gap-4 rounded-xl bg-muted p-4">
						<span
							className={`text-base font-semibold ${
								!isAnnual ? "text-foreground" : "text-muted-foreground"
							}`}
						>
							Monthly
						</span>
						<Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
						<div className="flex items-center gap-2">
							<span
								className={`text-base font-semibold ${
									isAnnual ? "text-foreground" : "text-muted-foreground"
								}`}
							>
								Annual
							</span>
							<span className="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">
								Save 17%
							</span>
						</div>
					</div>
				</div>

				<div className="mb-12 flex flex-col items-center justify-center gap-6 sm:mb-16 lg:flex-row lg:items-start">
					{PRICING_TIERS.map((tier) => (
						<div
							key={tier.id}
							className={`relative w-full max-w-[350px] rounded-2xl border bg-white p-6 shadow-sm sm:w-[350px] ${
								tier.popular
									? "scale-105 border-2 border-purple-500 bg-purple-50"
									: "border-gray-200"
							}`}
						>
							{tier.popular && (
								<div className="absolute right-0 top-0 z-10 rounded-bl-xl bg-purple-500 px-3 py-1.5">
									<span className="text-xs font-semibold text-white">
										Most Popular
									</span>
								</div>
							)}

							<div className="mb-6">
								<div className="mb-4 flex items-center justify-between">
									<div
										className={`flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 ${
											tier.popular ? "bg-purple-100" : ""
										}`}
									>
										<span className="text-2xl">{tier.icon}</span>
									</div>
									{tier.savings && (
										<span
											className={`rounded px-2 py-1 text-xs font-semibold text-white ${
												tier.popular ? "bg-green-500" : "bg-orange-500"
											}`}
										>
											{tier.savings}
										</span>
									)}
								</div>

								<h2
									className={`mb-2 text-2xl font-bold text-gray-900 ${
										tier.popular ? "text-purple-600" : ""
									}`}
								>
									{tier.name}
								</h2>

								<div className="mb-2 flex items-baseline">
									<span
										className={`text-4xl font-bold text-gray-900 ${
											tier.popular ? "text-purple-600" : ""
										}`}
									>
										{tier.price}
									</span>
									<span className="ml-2 text-base text-gray-500">
										{tier.period}
									</span>
								</div>

								{tier.originalPrice && (
									<span className="mb-2 text-base text-gray-500 line-through">
										{tier.originalPrice}
									</span>
								)}

								<p className="text-sm leading-5 text-gray-500">
									{tier.description}
								</p>
							</div>

							<div className="space-y-6">
								<Button
									className={`w-full py-6 ${
										tier.popular ? "bg-purple-600 hover:bg-purple-600/90" : ""
									}`}
									variant={tier.popular ? "default" : "outline"}
								>
									{tier.buttonText}
								</Button>

								<div className="space-y-3">
									{tier.features.map((feature) => (
										<div key={feature} className="flex items-center gap-3">
											<span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
												<span className="text-xs font-semibold text-white">
													✓
												</span>
											</span>
											<span className="flex-1 text-sm text-gray-600">
												{feature}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mb-12 rounded-2xl bg-muted p-8 sm:mb-16">
					<h2 className="mb-4 text-center text-2xl font-bold text-foreground">
						All Plans Include
					</h2>
					<div className="mb-6 h-px bg-border" />
					<div className="flex flex-row flex-wrap justify-center gap-4">
						{COMMON_FEATURES.map((feature) => (
							<div
								key={feature}
								className="flex min-w-[200px] items-center gap-2 sm:min-w-[45%]"
							>
								<span className="flex h-4 w-4 items-center justify-center rounded-lg bg-green-500">
									<span className="text-xs font-semibold text-white">✓</span>
								</span>
								<span className="text-sm text-muted-foreground">{feature}</span>
							</div>
						))}
					</div>
				</div>

				<div className="mb-12 sm:mb-16">
					<h2 className="mb-6 text-center text-2xl font-bold text-foreground">
						Frequently Asked Questions
					</h2>
					<div className="space-y-4">
						{FAQS.map((faq) => (
							<div
								key={faq.question}
								className="rounded-xl border border-border bg-background p-5"
							>
								<h3 className="mb-2 text-base font-semibold text-foreground">
									{faq.question}
								</h3>
								<p className="text-sm leading-5 text-muted-foreground">
									{faq.answer}
								</p>
							</div>
						))}
					</div>
				</div>

				<div className="flex flex-col items-center gap-4 text-center">
					<h2 className="text-2xl font-bold text-foreground">
						Still have questions?
					</h2>
					<Button className="bg-purple-600 py-6 hover:bg-purple-600/90">
						📞 Contact Our Sales Team
					</Button>
				</div>
			</div>
		</section>
	);
}
