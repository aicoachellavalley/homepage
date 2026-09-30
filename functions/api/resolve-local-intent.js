import catalog from '../../src/data/intent-catalog.json';
import { handleIntentHttp } from '../../src/lib/mcp-handler.mjs';
export const onRequest = ({ request }) => handleIntentHttp(request, catalog);
