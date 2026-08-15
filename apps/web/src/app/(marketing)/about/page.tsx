export default function AboutPage() {
	return (
		<section className="px-4 py-16 sm:py-24">
			<div className="mx-auto max-w-3xl">
				<h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
					About
				</h1>
				<p className="text-lg leading-relaxed text-muted-foreground">
					This is the about page. Universal Starter is a production-grade
					monorepo that pairs a mature Next.js web app with an Expo React Native
					mobile app, sharing authentication, types, and design tokens.
				</p>
			</div>
		</section>
	);
}
