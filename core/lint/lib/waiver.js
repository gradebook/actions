// @ts-check
import {readFile} from 'node:fs/promises';
import {parse} from 'node:querystring';

export const VALID_WAIVER_FIELDS = new Set([
	'repository',
	'remoteFileName',
	'ruleName',
]);

/**
 * @param {Record<'fileName' | 'repository' | 'remoteFileName' | 'ruleName', string>} metadata
 * @param {Record<string, string>[]} waivers
 */
export function isWaived(metadata, waivers) {
	for (const waiver of waivers) {
		let matches = true;
		for (const [key, value] of Object.entries(waiver)) {
			matches &&= key in metadata && metadata[key] === value;
		}

		if (matches) {
			return true;
		}
	}

	return false;
}

/**
 * @param {string | null} waiverFile
 * @returns {Promise<Record<string, string>[]>}
 */
export async function getWaivers(waiverFile) {
	if (!waiverFile) {
		return [];
	}

	const fileContents = await readFile(waiverFile, 'utf8');
	const response = [];

	for (const [index, waiver] of fileContents.trim().split('\n').entries()) {
		if (waiver.startsWith('//')) {
			continue;
		}

		const parsedWaiver = parse(waiver.trim());
		for (const originalKey of Object.keys(parsedWaiver)) {
			let key = originalKey;

			if (key === 'workflowPath') {
				key = 'remoteFileName';
				parsedWaiver.remoteFileName = parsedWaiver.workflowPath;
				delete parsedWaiver.workflowPath;
			}

			if (!VALID_WAIVER_FIELDS.has(key)) {
				throw new Error(`Invalid waiver on line ${index + 1}: unknown filter "${originalKey}`);
			}

			response.push(parsedWaiver);
		}
	}

	// @ts-expect-error
	return response;
}
