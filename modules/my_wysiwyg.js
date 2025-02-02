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

    // SECURISE LE MULTI SELECTION DE MOZILLA, A CALL AVEC TT LES BOUTONS DE STYLE
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
                    this.setStyle("I", null, null);
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
                case "text-align":
                    this.setStyle( "", document.getElementById('text-align').value, 'text-align');
            }
        }
    })
}
    setStyle(style, value = null, type = null) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i);
                let node = range.startContainer;
                // commonAncestorContainer;
                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentNode;
                }
                if (type == 'text-align'){
                    this.applyStyle('ali', range, value, type);
                }
                const alreadyStyled = this.isAlradyStyle(style, node, value, type);
                if (alreadyStyled === 0) {
                    console.log("Appliquer le style :", style);
                    this.applyStyle(style, range, value, type);
                } else if (alreadyStyled === -1) {
                    console.log("Style déjà appliqué.");
                    return;
                } else if (alreadyStyled === 1) {
                    console.log("Suppression du style.");
                    let extractedContent = range.extractContents();
                    let textContent = extractedContent.textContent;
        
                    // Supprimer l'ancien style en réinsérant le texte brut
                    let textNode = document.createTextNode(textContent);
                    range.insertNode(textNode);
        
                    // Nettoyer le DOM pour éviter les balises vides
                    node.normalize();
                }
            }
        }
    }

    isAlradyStyle(style, node, value = null, type = null) {   
        if (!node || node.nodeType !== Node.ELEMENT_NODE) return 0;
        console.log("Vérification du style sur :", node.tagName);
        if (node.style[type] === value) {
            console.log("Style déjà appliqué :", node.style);
            return 1; // Style déjà présent
        } 
        if (node.tagName === style.toUpperCase() || (node.classList && node.classList.contains(type))) {
            return 1; 
        }
        return this.isAlradyStyle(style, node.parentNode, value, type);
    }

    applyStyle(style, noeudsn, value = null, type = null) {      
        if (value !== null && type !== null) {
            let object = "";
            console.log("value", value);
            console.log("type", type);
            if (style === 'ali'){
                object = noeudsn.startContainer;
                if (object.nodeType === Node.TEXT_NODE) {
                    let wrapper = document.createElement("span");
                    wrapper.appendChild(object);
                    object = wrapper;
                    if (object.nodeType === Node.ELEMENT_NODE) {
                        object.classList.add(type);
                        object.style[type] = value;
                    }
                    object.appendChild(noeudsn.extractContents());
                    noeudsn.insertNode(object);
                } else {  
                let object = document.createElement(style);
                object.appendChild(noeudsn.extractContents());
                noeudsn.insertNode(object);
                }
            }
        }
        console.log("fin");
        
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