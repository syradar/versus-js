import { actions, store } from "./store.mjs";

export function createRow() {
	const id = `id${window.crypto.randomUUID()}`;

	const row = document.createElement("div");

	const removeButton = document.createElement("button");
	removeButton.append("🗑️ Remove");
	removeButton.addEventListener("click", () => {
		store.dispatch(actions.removeRowClicked, { row });
	});

	row.id = id;
	row.append(id, removeButton);
	row.style.display = "grid";
	row.style.gridTemplateColumns = "subgrid";
	row.style.gridColumn = "span 2";
	row.style.gap = "1rem";

	store.dispatch(actions.rowCreated, { row });
}

export function removeElement({ row }) {
	const id = row.id;
	row.remove();
	store.dispatch(actions.rowRemoved, { id });
}

export function addRowToElement(base) {
	return ({ row }) => {
		const id = row.id;
		base.append(row);
		store.dispatch(actions.rowAdded, { id });
	};
}
