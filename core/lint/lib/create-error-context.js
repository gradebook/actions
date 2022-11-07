// @ts-check

import {isWaived} from './waiver.js';

/**
 * @param {import('../types.js').LintError[]} context
 * @param {Record<string, string>[]} waivers
 * @param {Record<'fileName' | 'repository' | 'remoteFileName' | 'ruleName', string>} metadata
 */
export function createErrorContext(context, waivers, metadata) {
	const {fileName, repository, remoteFileName, ruleName} = metadata;
	return /** @param {string} message */ message => {
		context.push({
			fileName,
			repository,
			remoteFileName,
			ruleName,
			error: message,
			waived: isWaived(metadata, waivers),
		});
	};
}
