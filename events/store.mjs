import { createAction, createCustomEventStore } from "./libStore.mjs";

// Define the actions that can be dispatched.
export const actions = Object.freeze({
	addRowClicked: createAction("[Rows] Add Row Clicked"),
	removeRowClicked: createAction("[Rows] Remove Row Clicked"),
	rowCreated: createAction("[Rows] Row Created"),
	rowRemoved: createAction("[Rows] Row Removed"),
	rowAdded: createAction("[Rows] Row Added"),
});

// Create the store instance. This is the only instance of the store in the application.
export const store = createCustomEventStore();
