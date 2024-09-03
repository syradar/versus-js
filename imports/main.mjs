const modules = {
	header: () => import("./header.mjs"),
	footer: () => import("./footer.mjs"),
};

/**
 * Gather all views and import their modules.
 * @returns {Promise<void>[]}
 */
function gatherImports() {
	const views = document.querySelectorAll("[data-view]");
	const imports = [];

	for (const view of views) {
		const name = view.getAttribute("data-view");

		const importFunction = modules[name];
		if (!importFunction) {
			console.error(`Module not found for view: ${name}`);
			continue;
		}

		imports.push(initializeModule(name, importFunction, view));
	}

	return imports;
}

/**
 * Import the module and initialize it.
 * @param {string} name
 * @param {() => Promise<any>} importFunction
 * @param {HTMLElement} view
 */
async function initializeModule(name, importFunction, view) {
	try {
		const module = await importFunction();
		module.init(view);
		return Promise.resolve({ name, view });
	} catch (error) {
		return Promise.reject({ name, view });
	}
}

/**
 * Log the results of the module initialization.
 * @param {PromiseSettledResult<{name: string, view: HTMLElement}>[]} results
 */
function logResults(results) {
	for (const result of results) {
		if (result.status === "fulfilled") {
			console.log(
				`Module ${result.value.name} initialized for view:`,
				result.value.view,
			);
		} else {
			console.error(
				`Module ${result.reason.name} failed to initialize for view:`,
				result.reason.view,
			);
		}
	}
}

async function main() {
	Promise.allSettled(gatherImports()).then(logResults);
}

main();
