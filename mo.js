class lol {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.initEditor();
    }

    initEditor() {
        this.wrapper = document.createElement("div");
        this.wrapper.classList.add("wysiwyg-wrapper");
        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("wysiwyg-toolbar");
        this.editor = document.createElement("div");
        this.editor.classList.add("wysiwyg-editor");
        this.editor.contentEditable = true;
        this.editor.innerHTML = this.element.value || "";

        this.element.style.display = "none";
        this.wrapper.appendChild(this.toolbar);
        this.wrapper.appendChild(this.editor);
        this.element.parentNode.insertBefore(this.wrapper, this.element);

        this.createButtons();
        this.editor.addEventListener("input", () => {
            this.element.value = this.editor.innerHTML;
        });
    }

    createButtons() {
        this.options.buttons.forEach(button => {
            let btn = document.createElement("button");
            btn.textContent = button;
            btn.addEventListener("click", () => this.applyStyle(button));
            this.toolbar.appendChild(btn);
        });
    }

    getCurrentRange() {
        let selection = window.getSelection();
        return selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    applyStyle(style) {
        let range = this.getCurrentRange();
        if (!range || range.collapsed) return;

        let span = document.createElement("span");
        
        switch (style) {
            case "bold":
                span.style.fontWeight = (range.startContainer.parentNode.style.fontWeight === "bold") ? "normal" : "bold";
                break;
            case "italic":
                span.style.fontStyle = (range.startContainer.parentNode.style.fontStyle === "italic") ? "normal" : "italic";
                break;
            case "color":
                let color = prompt("Entrez une couleur en hex ou nom de couleur:", "red");
                if (color) span.style.color = color;
                break;
        }
        
        span.appendChild(range.extractContents());
        range.deleteContents();
        range.insertNode(span);
    }
};

export { lol };