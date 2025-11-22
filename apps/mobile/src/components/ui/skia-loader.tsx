interface SkiaCanvasProps {
	component: () => Promise<{ default: React.ComponentType }>;
}

// noop: This file is intentionally left empty to avoid importing SkiaLoader in the web version.
export function SkiaLoader({ component }: SkiaCanvasProps) {
	return <></>;
}
