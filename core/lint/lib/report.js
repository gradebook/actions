// @ts-check

import {groupArrayByKey} from './group-by-key.js';

/* eslint-disable no-console */
/** @param {import('../types.js').LintError[]} unsortedErrors */
export function report(unsortedErrors) {
	const filteredErrors = unsortedErrors.filter(error => !error.waived);
	const errors = groupArrayByKey(filteredErrors, 'repository');

	for (const [repository, groupedErrors] of Object.entries(errors)) {
		console.log(`${repository}:`);
		const errorsByFile = groupArrayByKey(groupedErrors, 'remoteFileName');

		for (const [remoteFileName, groupedByRemoteFileName] of Object.entries(errorsByFile)) {
			console.log(`  ${remoteFileName}:`);
			const errorsByRule = groupArrayByKey(groupedByRemoteFileName, 'ruleName');
			for (const [ruleName, finalGroupedErrors] of Object.entries(errorsByRule)) {
				console.log(`    ${ruleName}:`);
				for (const error of finalGroupedErrors) {
					if (!error.waived) { // eslint-disable-line max-depth
						console.log(`      ${error.error}`);
					}
				}
			}
		}
	}
}
/* eslint-enable no-console */
