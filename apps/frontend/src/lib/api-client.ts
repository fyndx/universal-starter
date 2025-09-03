import { treaty } from '@elysiajs/eden';
import type { App } from '@universal/api/index.js';
import { env } from '~/config/env';

export const apiClient = treaty<App>(env.EXPO_PUBLIC_API_URL);
