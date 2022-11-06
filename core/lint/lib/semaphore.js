// @ts-check

export class Semaphore {
	/**
		 * @param {number} maximum
		 * @param {number} delay
		 */
	constructor(maximum, delay = 150) {
		/** @private */
		this._maximum = maximum;
		/** @private */
		this._delay = delay;
		/** @private */
		this._activeCount = 0;
		/** @private */
		this._queue = [];
	}

	acquire() {
		if (this._activeCount === this._maximum) {
			const response = new Promise(resolve => {
				this._queue.push(resolve);
			});

			return response;
		}

		this._activeCount += 1;
		return this._release;
	}

	/** @private */
	_release = () => {
		this._activeCount -= 1;

		if (this._queue.length > 0) {
			setTimeout(this._queue.shift(), this._delay, this._release);
		}
	};
}
