class MyWysiwyg {
    constructor(element, options = {buttons: ["bold", "italic", "del", "dev-mode", "color", "font-size", "text-align"]}) {
        this.element = element;
        this.options = options;
        this.initEditor();
        this.devView = false;
    }

    initEditor() {
        this.element.contentEditable = true;
        this.element.style.outline = "none";
        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("wysiwyg-toolbar");
        this.element.parentNode.insertBefore(this.toolbar, this.element);
        this.createButtons();
        this.element.addEventListener('keydown', (event) => {
            if (this.devView == false) {
                let selection = window.getSelection();
                let range = selection.getRangeAt(0);
                let parent = range.commonAncestorContainer;
                if (parent.nodeType === 3) parent = parent.parentNode;
                
                if (parent.id === this.element.id) {
                    if (event.key.length === 1 || event.key === "Enter") {
                            let key = event.key;
                        if (event.key === "Enter" || event.key === " ") {
                            key = "\u00a0";
                        } 
                        event.preventDefault();
            
                        let newP = document.createElement("p");
                        let txt = document.createTextNode(event.key === "Enter" ? "\u00a0" : key);
                        newP.appendChild(txt);
                        parent.appendChild(newP);
            
                        let newRange = document.createRange();
                        newRange.setStart(newP, 0);
                        newRange.setEnd(newP, 0);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    } 
                }
            }
        });
    }

    createButtons() {
        this.options.buttons.forEach(button => {
            let btn = document.createElement("button");
            btn.textContent = button;
            this.toolbar.appendChild(btn);
            if (["color", "font-size", "text-align"].includes(button)) {
                let input = document.createElement("input");
                input.id = button;
                input.type = button === "color" ? "color" : "text";
                input.placeholder = btn.textContent;
                this.toolbar.appendChild(input);
            }
        });
        this.checkButtons();
    }

    // AJOUTER UN BOUTON A LA LISTE POUR QU'IL SOIT PRIS EN COMPTE
    checkButtons() {
        document.addEventListener("click", (e) => {
            if (e.target.nodeName === "BUTTON") {
                let button = e.target.textContent;
                switch (button) {
                    case "bold":
                        this.setStyle("B");
                        break;
                    case "italic":
                        this.setStyle("I");
                        break;
                    case "color":
                        this.setStyle("span", document.getElementById('color').value, 'color'); // A CHANGER
                        break;
                    case "del":
                        this.setStyle("DEL");
                        break;
                    case "dev-mode":
                        this.devMode();
                        break;
                    case "font-size":
                        this.setStyle("span", document.getElementById('font-size').value, 'font-size');
                        break;
                }
            }
        });
    }

    // SECURISE LE MULTI SELECTION DE MOZILLA, A CALL AVEC TT LES BOUTONS DE STYLE
    setStyle(style, value = null, type = null) {
        const selection = window.getSelection();
        console.log(selection);
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i);
                let node = range.startContainer.parentElement;
                console.log("before");
                if (this.isAlradyStyle(style, node, value, type) == -1) {
                    console.log("already style");
                    return;
                } else if (this.isAlradyStyle(style, node, value, type) == 1) {
                    console.log("checked");
                    let node = range.startContainer.parentNode;
                    let pnode = node.parentElement;
                    let buf = range.extractContents();
                    pnode.normalize();
                    node.remove();
                    pnode.innerHTML = buf.textContent;
                } else if (this.isAlradyStyle(style, node, value, type) == 0) {
                    console.log("passe le = a 0");
                    this.applyStyle(style, range, value, type);
                }
            }
        } else {
            console.log("Aucun texte selectionné");
        }
    }

    isAlradyStyle(style, node, value = null, type = null) {
        if (type !== null && node.style[0] == value) {
            console.log(node.style);
            node.style[type] = value;
            return -1;
        } else if ((node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE)) {
                console.log("Element node:", node.tagName); // VERIFIE SI LE TYPE DU NODE EST UNE BALISE Exemple: DEL
                if (node.tagName === style && (value === null || node.classList.contains(type))) {
                    console.log(node);
                    return 1; 
                } else { 
                    this.isAlradyStyle(style, node.childNodes, value);
                } 
        }
        return 0;
    }

    // LE RANGECOUNT RENVOIE LE NOMBRE DE SELECTIONS QU'IL Y A SUR LA PAGE GetRangeAt
    // ContainsNode

    // getCurrentRange() {
    //     let selection = window.getSelection();
    //     return selection.rangeCount ? selection.getRangeAt(0) : null;
    // }

    applyStyle(style, noeudsn, value = null, type = null) {      
        if (value !== null && type !== null) {
            console.log("value", value);
            console.log("type", type);
            let object = document.createElement(style);
            object.classList.add(type);
            object.style[type] = value;
            object.appendChild(noeudsn.extractContents());
            noeudsn.insertNode(object);
            console.log(object);
        } else {  
            let object = document.createElement(style);
            object.appendChild(noeudsn.extractContents());
            noeudsn.insertNode(object);
        }
    }

    // BONUS

    devMode() {
        if (!this.devView) {
            const editView = this.element.innerHTML;
            this.element.textContent = editView;
            this.devView = true;
        } else {
            const editView = this.element.textContent;
            const parser = new DOMParser();
            const doc = parser.parseFromString(editView, "text/html");
            const parsedHtml = doc.body.innerHTML;
            this.element.innerHTML = parsedHtml;
            this.devView = false;
        }
    }
};

export { MyWysiwyg };