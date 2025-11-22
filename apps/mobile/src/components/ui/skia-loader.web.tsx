import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

interface SkiaCanvasProps {
	component: () => Promise<{ default: React.ComponentType }>;
}

export function SkiaLoader({ component }: SkiaCanvasProps) {
	return (
		<WithSkiaWeb
			opts={{
				locateFile: (file) => `/canvaskit.wasm`,
			}}
			getComponent={component}
		/>
	);
}
