// @ts-check
export const name = 'Require Timeout';
export const description = 'Prevent actions jobs from stalling by explicitly declaring a timeout';

/** @param {import('../types.js').Action} action */
export function lint(action, {error}) {
	for (const [jobName, jobDefinition] of Object.entries(action.jobs)) {
		if ('uses' in jobDefinition) {
			continue;
		}

		if (typeof jobDefinition['timeout-minutes'] !== 'number') {
			const failureMessage = typeof jobDefinition['timeout-minutes'] === 'undefined'
				? 'does not have a timeout' : 'is not a number';

			error(`.jobs.${jobName} ${failureMessage}`);
		}
	}
}
