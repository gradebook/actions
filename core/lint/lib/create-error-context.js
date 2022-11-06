// @ts-check

/**
 * @param {import('../types.js').LintError[]} context
 * @param {Record<'fileName' | 'repository' | 'remoteFileName' | 'ruleName', string>} metadata
 */
export function createErrorContext(context, {fileName, repository, remoteFileName, ruleName}) {
	return /** @param {string} message */ message => {
		context.push({
			fileName,
			repository,
			remoteFileName,
			ruleName,
			error: message,
		});
	};
}
