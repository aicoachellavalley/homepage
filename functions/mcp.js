import catalog from '../src/data/intent-catalog.json';
import { handleMcp } from '../src/lib/mcp-handler.mjs';
export const onRequest = ({ request }) => handleMcp(request, catalog);
