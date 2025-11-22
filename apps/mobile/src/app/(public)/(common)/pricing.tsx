import { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

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

const PricingPage = () => {
	const [isAnnual, setIsAnnual] = useState(false);

	const pricingTiers: PricingTier[] = [
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

	const commonFeatures = [
		"SSL certificates",
		"99.9% uptime guarantee",
		"Mobile app access",
		"Email support",
		"Basic analytics",
		"Standard integrations",
	];

	const PricingCard = ({ tier }: { tier: PricingTier }) => (
		<View
			className={`
                bg-white rounded-2xl border border-gray-200 p-6 w-full sm:w-[350px] max-w-[350px]
                shadow-sm shadow-black/10
                ${tier.popular ? "border-2 border-purple-500 bg-purple-50 scale-105" : ""}
            `}
		>
			{tier.popular && (
				<View className="absolute top-0 right-0 bg-purple-500 rounded-bl-xl px-3 py-1.5 z-10">
					<Text className="text-white text-xs font-semibold">Most Popular</Text>
				</View>
			)}

			<View className="mb-6">
				<View className="flex-row justify-between items-center mb-4">
					<View
						className={`
                            w-12 h-12 rounded-full bg-gray-200 items-center justify-center
                            ${tier.popular ? "bg-purple-100" : ""}
                        `}
					>
						<Text className="text-2xl">{tier.icon}</Text>
					</View>
					{tier.savings && (
						<View
							className={`
                                rounded px-2 py-1
                                ${tier.popular ? "bg-green-500" : "bg-orange-500"}
                            `}
						>
							<Text className="text-white text-xs font-semibold">
								{tier.savings}
							</Text>
						</View>
					)}
				</View>

				<Text
					className={`
                        text-2xl font-bold text-gray-900 mb-2
                        ${tier.popular ? "text-purple-600" : ""}
                    `}
				>
					{tier.name}
				</Text>

				<View className="flex-row items-baseline mb-2">
					<Text
						className={`
                            text-4xl font-bold text-gray-900
                            ${tier.popular ? "text-purple-600" : ""}
                        `}
					>
						{tier.price}
					</Text>
					<Text className="text-base text-gray-500 ml-2">{tier.period}</Text>
				</View>

				{tier.originalPrice && (
					<Text className="text-base text-gray-500 line-through mb-2">
						{tier.originalPrice}
					</Text>
				)}

				<Text className="text-sm text-gray-500 leading-5">
					{tier.description}
				</Text>
			</View>

			<View className="gap-6">
				<TouchableOpacity
					className={`
                        rounded-lg py-4 px-6 items-center
                        ${
													tier.popular
														? "bg-purple-600"
														: "bg-transparent border border-gray-200"
												}
                    `}
					onPress={() => console.log(`Selected: ${tier.name}`)}
				>
					<Text
						className={`
                            text-base font-semibold
                            ${tier.popular ? "text-white" : "text-gray-900"}
                        `}
					>
						{tier.buttonText}
					</Text>
				</TouchableOpacity>

				<View className="gap-3">
					{tier.features.map((feature, index) => (
						<View
							key={`${tier.id}-${index}`}
							className="flex-row items-center gap-3"
						>
							<View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center">
								<Text className="text-white text-xs font-semibold">✓</Text>
							</View>
							<Text className="text-sm text-gray-600 flex-1">{feature}</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	);

	return (
		<ScrollView
			className="flex-1 bg-white"
			showsVerticalScrollIndicator={false}
		>
			<View className="px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
				{/* Header Section */}
				<View className="items-center mb-8 sm:mb-12">
					<Text className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
						Choose Your Plan
					</Text>
					<Text className="text-base sm:text-lg md:text-xl text-gray-500 text-center leading-6 max-w-[600px] mb-8">
						Select the perfect plan for your needs. Start with our flexible
						monthly option, save with annual billing, or get lifetime access for
						the ultimate value.
					</Text>

					{/* Billing Toggle */}
					<View className="flex-row items-center bg-gray-50 rounded-xl p-4 gap-4">
						<Text
							className={`text-base font-semibold ${!isAnnual ? "text-gray-900" : "text-gray-500"}`}
						>
							Monthly
						</Text>
						<Switch
							value={isAnnual}
							onValueChange={setIsAnnual}
							trackColor={{ false: "#e2e8f0", true: "#a855f7" }}
							thumbColor={isAnnual ? "#fff" : "#f4f3f4"}
						/>
						<View className="flex-row items-center gap-2">
							<Text
								className={`text-base font-semibold ${isAnnual ? "text-gray-900" : "text-gray-500"}`}
							>
								Annual
							</Text>
							<View className="bg-green-500 rounded px-2 py-1">
								<Text className="text-white text-xs font-semibold">
									Save 17%
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Pricing Cards */}
				<View className="flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8 mb-12 sm:mb-16">
					{pricingTiers.map((tier) => (
						<PricingCard key={tier.id} tier={tier} />
					))}
				</View>

				{/* Common Features Section */}
				<View className="bg-gray-50 rounded-2xl p-8 mb-12 sm:mb-16">
					<Text className="text-2xl font-bold text-gray-900 text-center mb-4">
						All Plans Include
					</Text>
					<View className="h-px bg-gray-200 mb-6" />
					<View className="flex-row flex-wrap justify-center gap-4">
						{commonFeatures.map((feature) => (
							<View
								key={`common-feature-${feature}`}
								className="flex-row items-center gap-2 min-w-[45%] sm:min-w-[200px]"
							>
								<View className="w-4 h-4 rounded-lg bg-green-500 items-center justify-center">
									<Text className="text-white text-xs font-semibold">✓</Text>
								</View>
								<Text className="text-sm text-gray-600">{feature}</Text>
							</View>
						))}
					</View>
				</View>

				{/* FAQ Section */}
				<View className="mb-12 sm:mb-16">
					<Text className="text-2xl font-bold text-gray-900 text-center mb-6">
						Frequently Asked Questions
					</Text>
					<View className="gap-4">
						{[
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
						].map((faq) => (
							<View
								key={`faq-${faq.question}`}
								className="bg-white rounded-xl border border-gray-200 p-5"
							>
								<Text className="text-base font-semibold text-gray-900 mb-2">
									{faq.question}
								</Text>
								<Text className="text-sm text-gray-500 leading-5">
									{faq.answer}
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* CTA Section */}
				<View className="items-center gap-4">
					<Text className="text-2xl font-bold text-gray-900 text-center">
						Still have questions?
					</Text>
					<TouchableOpacity
						className="bg-purple-600 rounded-lg py-4 px-8"
						onPress={() => console.log("Contact sales")}
					>
						<Text className="text-white text-base font-semibold">
							📞 Contact Our Sales Team
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
};

export default PricingPage;
