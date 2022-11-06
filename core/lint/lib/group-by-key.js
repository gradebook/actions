// @ts-check

/**
 * @param {string} left
 * @param {string} right
 */
/* // Might use in the future
function compareString(left, right) {
	for (let i = 0; i < left.length; ++i) { // eslint-disable-line unicorn/no-for-loop
		const leftCharacter = left[i];
		const rightCharacter = right[i];

		if (rightCharacter === undefined) {
			return 1;
		}

		if (leftCharacter === rightCharacter) {
			continue;
		}

		const leftNumber = Number(leftCharacter);
		const rightNumber = Number(rightCharacter);

		if (Number.isNaN(leftNumber)) {
			if (Number.isNaN(rightNumber)) {
				// @ts-expect-error
				return leftCharacter.codePointAt(0) - rightCharacter.codePointAt(0);
			}

			// Left is a letter, right is a number. Letters come before numbers
			return -1;
		}

		return leftNumber - rightNumber;
	}

	return -1;
} */

/**
 * @template T
 * @param {T[]} data
 * @param {keyof T} keyToSortBy
 * @returns {T[keyToSortBy] extends string ? Record<string, T[]> : never}
 */
export function groupArrayByKey(data, keyToSortBy) {
	const response = {};
	for (const item of data) {
		/** @type {string} */
		// @ts-expect-error
		const groupedKey = item[keyToSortBy];

		response[groupedKey] ??= [];
		response[groupedKey].push(item);
	}

	// @ts-expect-error
	return response;
}
