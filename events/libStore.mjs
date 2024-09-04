/**
 * Action describes an event that can be dispatched.
 * @template T
 * @typedef {Object} Action<T>
 * @property {string} name The name of the event.
 * @property {(data: T) => CustomEvent<T>} create Creates a new CustomEvent with the given data.
 */

class CustomEventStore {
	#eventLog = [];
	#debugLoggingEnabled = false;
	#actionLogContainer = null;

	/**
	 * Dispatches an event with the given data.
	 * @template T
	 * @param {Action<T>} action
	 * @param {T} data
	 */
	dispatch(action, data) {
		this.#debugLog(`Dispatching event: ${action.name}`, data);
		this.#eventLog.push({ name: action.name, data });
		this.#updateActionLog();

		const event = action.create(data);
		document.dispatchEvent(event);
	}

	/**
	 * Subscribes to an event and calls the callback when the event is dispatched.
	 * @template T
	 * @param {Action<T>} action
	 * @param {(data: T) => void} callback
	 * @returns {[() => void]} Unsubscribe function
	 */
	subscribe(action, callback) {
		const listener = createListener(callback);

		this.#debugLog(`Subscribing to event: ${action.name}`);

		document.addEventListener(action.name, listener);

		// Return an unsubscribe function in a tuple so that the caller need to
		// name the variable to call the function.
		return [
			() => {
				this.#debugLog(`Unsubscribing from event: ${action.name}`);

				document.removeEventListener(action.name, listener);
			},
		];
	}

	toggleDebugLogging() {
		this.#debugLoggingEnabled = !this.#debugLoggingEnabled;

		console.log(
			`Debug logging is now ${this.#debugLoggingEnabled ? "enabled" : "disabled"}`,
		);
	}

	setupActionLogContainer(actionsContainer) {
		this.#actionLogContainer = actionsContainer;
	}

	/**
	 * Updates the action log with the current event log.
	 * The log is printed in reverse order.
	 */
	#updateActionLog() {
		const log = this.#eventLog.toReversed().map(({ name, data }) => {
			const logElement = document.createElement("div");
			const nameEl = document.createElement("strong");
			nameEl.append(name);
			const dataEl = document.createElement("pre");
			dataEl.append(JSON.stringify(data, null, 2));
			dataEl.style.margin = "0";

			logElement.append(nameEl, dataEl);
			return logElement;
		});

		this.#actionLogContainer.replaceChildren(...log);
	}

	/**
	 * Logs a message if debug logging is enabled.
	 * @param {string} message
	 */
	#debugLog(message) {
		if (this.#debugLoggingEnabled) {
			console.log(message);
		}
	}
}

/**
 * Creates a listener that calls the given callback with the event detail.
 * This is so that we can remove the listener later.
 * @template T
 * @param {(event: CustomEvent<T>) => void} callback
 * @returns
 */
function createListener(callback) {
	return (event) => callback(event.detail);
}

/**
 * Creates an action with the given name.
 * The name is used when dispatching the event.
 * The create function is used when subscribing to the event.
 * @template T
 * @param {string} eventName
 * @returns {Action<T>}
 */
export function createAction(eventName) {
	return {
		name: eventName,
		create: (data) =>
			new CustomEvent(eventName, {
				detail: {
					...data,
				},
			}),
	};
}

/**
 * Creates a new EventStore.
 * @returns {CustomEventStore}
 */
export function createCustomEventStore() {
	return new CustomEventStore();
}
