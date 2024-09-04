export function initDom() {
	const addRowButton = document.getElementById("add-row");
	const unsubcribeButton = document.getElementById("unsubscribe");
	const toggleLoggingButton = document.getElementById("logging");
	const rowContainer = document.getElementById("row-container");
	const actionsContainer = document.getElementById("actions");

	return {
		addRowButton,
		unsubcribeButton,
		toggleLoggingButton,
		rowContainer,
		actionsContainer,
	};
}
