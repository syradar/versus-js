import { initDom } from "./main-dom.mjs";
import { addRowToElement, createRow, removeElement } from "./rows.mjs";
import { actions, store } from "./store.mjs";

function onClick(element, callback) {
	element.addEventListener("click", callback);
}

const {
	rowContainer,
	actionsContainer,
	addRowButton,
	toggleLoggingButton,
	unsubcribeButton,
} = initDom();

// Subscribe to actions
// Returns an unsubscribe function
const [unsubAddRow] = store.subscribe(actions.addRowClicked, createRow);

// When the unsubscribe button is clicked, unsubscribe from the addRow action
onClick(unsubcribeButton, () => unsubAddRow());

const [_unsubcribeRemoveRow] = store.subscribe(
	actions.removeRowClicked,
	removeElement,
);

const [_unsubcribeRowCreated] = store.subscribe(
	actions.rowCreated,
	addRowToElement(rowContainer),
);

// Set the action log container
store.setupActionLogContainer(actionsContainer);

// When the add row button is clicked, dispatch the addRowClicked action
onClick(addRowButton, () => store.dispatch(actions.addRowClicked));

// When the logging button is clicked, toggle logging
onClick(toggleLoggingButton, () => store.toggleDebugLogging());
