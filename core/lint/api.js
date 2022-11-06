// @ts-check
import {cpus} from 'node:os';
import {readFile} from 'node:fs/promises';
import {load} from 'js-yaml';
import {Semaphore} from './lib/semaphore.js';
import {createErrorContext} from './lib/create-error-context.js';
import * as RequireTimeoutRule from './rules/00-require-timeout.js';
import {report} from './lib/report.js';

const rules = [RequireTimeoutRule];

/**
 * @param {string} fileName
 * @param {string} repository
 * @param {string} remoteFileName
 * @returns {Promise<import('./types.js').LintError[]>}
 */
export async function lintSingle(fileName, repository, remoteFileName) {
	const fileContents = await readFile(fileName, 'utf8').catch(() => null);

	if (fileContents === null) {
		return [{
			fileName,
			repository,
			remoteFileName,
			ruleName: 'Action should exist',
			error: `gradebook/Unable to read ${fileName} (${repository}`,
		}];
	}

	/** @type {import('./types.js').Action} */
	let parsed;

	try {
		// @ts-expect-error
		parsed = load(fileContents, {filename: fileName});
	} catch {
		return [{
			fileName,
			repository,
			remoteFileName,
			ruleName: 'Action should contain valid YAML',
			error: `gradebook/Invalid yaml in ${fileName} (${repository}`,
		}];
	}

	const context = [];

	for (const rule of rules) {
		const error = createErrorContext(context, {fileName, repository, remoteFileName, ruleName: rule.name});
		rule.lint(parsed, {error});
	}

	return context;
}

/**
 * @param {Semaphore} jobQueue
 * @param {Record<'fileName' | 'repository' | 'remoteFileName', string>} file
 * @returns {Promise<import('./types.js').LintError[]>}
 */
async function safelyRunSingle(jobQueue, {fileName, repository, remoteFileName}) {
	const release = await jobQueue.acquire();
	try {
		return await lintSingle(fileName, repository, remoteFileName);
	} catch {
		return [{
			fileName,
			repository,
			remoteFileName,
			ruleName: 'Lint runs successfully',
			error: 'Failed running lint',
		}];
	} finally {
		release();
	}
}

/**
 * @param {Parameters<typeof safelyRunSingle>[1][]} files
 */
export async function lint(files) {
	const jobQueue = new Semaphore(cpus().length - 1, 0);

	const allResults = await Promise.all(files.map(file => safelyRunSingle(jobQueue, file)));

	return allResults.flat();
}
