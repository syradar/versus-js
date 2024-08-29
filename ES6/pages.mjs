const tag = (tag) => document.createElement(tag);

class PagedContent extends HTMLElement {
	constructor() {
		super();
		this.addEventListener(PagedContent.constants.currentPage, ({ detail }) => {
			this.currentPage = +detail;
		});
		this.addEventListener(PagedContent.constants.pages, ({ detail }) => {
			this.pages = +detail;
		});
	}

	static constants = Object.freeze({
		pages: "pages",
		currentPage: "current-page",
	});

	render() {
		const createPager = () => {
			const nav = tag("nav");
			const ul = tag("ul");
			nav.append(ul);

			for (let i = 1; i <= this.pages; i++) {
				const li = tag("li");
				const button = tag("button");
				button.type = "button";
				button.setAttribute("aria-current", i === this.currentPage ? true : "");
				button.append(`${i}`);
				button.addEventListener("click", () => {
					this.setAttribute(PagedContent.constants.currentPage, i);
				});
				li.append(button);
				ul.append(li);
			}

			return nav;
		};

		const page = tag("div");
		page.append(`Page ${this.currentPage}`);

		this.replaceChildren(createPager(), page, createPager());
	}

	connectedCallback() {
		for (const name of Object.keys(PagedContent.constants)) {
			this.dispatch(name);
		}

		this.render();
	}

	static get observedAttributes() {
		return Object.values(PagedContent.constants);
	}

	dispatch(name, val) {
		this.dispatchEvent(
			new CustomEvent(name, { detail: val ? val : this.getAttribute(name) }),
		);
	}

	attributeChangedCallback(name, _oldValue, newValue) {
		this.dispatch(name, newValue);
		this.render();
	}
}

customElements.define("paged-content", PagedContent);

/* 
<div data-component="popover">
        <button data-element="popover-trigger" aria-controls="id-123" type="button">Open popover</button>
        <div id="id-123">
            <ul>
                <li>Option 1</li>
                <li>Option 2</li>
                <li>Option 3</li>
            </ul>
            <button type="button">Apply</button>
        </div>
    </div>
 */

const popovers = document.querySelectorAll("[data-component=popover]");

for (const popover of popovers) {
	const trigger = popover.querySelector("[data-element=popover-trigger]");
	const content = popover.querySelector("div");

	trigger.addEventListener("click", () => {
		const expanded = trigger.getAttribute("aria-expanded") === "true";
		trigger.setAttribute("aria-expanded", !expanded);
		content.hidden = expanded;
	});

	popover.addEventListener("click", (e) => {
		if (e.target === popover) {
			trigger.setAttribute("aria-expanded", false);
			content.hidden = true;
		}
	});
}
