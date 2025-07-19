import { config } from 'dotenv';
config();

import '@/ai/flows/classify-file-purpose.ts';
import '@/ai/flows/summarize-repo.ts';
import '@/ai/flows/explain-files.ts';
import '@/ai/flows/scan-env-vars.ts';
import '@/ai/flows/suggest-entry-points.ts';