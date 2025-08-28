import { opentelemetry } from "@elysiajs/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto/build/src/platform/node/OTLPTraceExporter";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

export const instrumentation = opentelemetry({
	spanProcessors: [
		new BatchSpanProcessor(
			new OTLPTraceExporter({
				url: `${Bun.env.AXIOM_DOMAIN}/v1/traces`,
				headers: {
					Authorization: `Bearer ${Bun.env.AXIOM_TOKEN}`,
					"X-Axiom-Dataset": `${Bun.env.DATASET_NAME}`,
				},
			}),
		),
	],
});
