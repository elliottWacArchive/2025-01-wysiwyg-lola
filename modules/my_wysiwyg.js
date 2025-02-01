class MyWysiwyg {
    constructor(element, options = {buttons: ["bold", "italic", "color"]}) {
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
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let parent = range.commonAncestorContainer;
        
            if (parent.nodeType === 3) parent = parent.parentNode;
            
            if (parent.id === this.element.id) {
                console.log('parent est le parent lol');
                if (event.key.length === 1 || event.key === "Enter") {
                    console.log(event.key);
                    event.preventDefault();
        
                    let newP = document.createElement("p");
                    let txt = document.createTextNode(event.key === "Enter" ? "" : event.key);
                    newP.appendChild(txt);
                    parent.appendChild(newP);
        
                    let newRange = document.createRange();
                    newRange.setStart(newP, 0);
                    newRange.setEnd(newP, 0);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                }
            }
        });
    }

    createButtons() {
        this.options.buttons.forEach(button => {
            let btn = document.createElement("button");
            btn.textContent = button;
            this.toolbar.appendChild(btn);
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
                        this.setStyle("span"); // A CHANGER
                        break;
                    case "del":
                        this.setStyle("DEL");
                        break;
                    case "dev-mode":
                        this.devMode();
                        break;
                }
            }
        });
    }

    // SECURISE LE MULTI SELECTION DE MOZILLA, A CALL AVEC TT LES BOUTONS DE STYLE
    setStyle(style) {
        const selection = window.getSelection();
        console.log(selection);
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i);
                let node = range.startContainer.parentElement;
                console.log(range);
                let all = range.cloneContents();
                // console.log(all);
                console.log(node);
                console.log(this.isAlradyStyle(style, node));
                console.log("ICI recherche noeud de style");
                
                console.log(all.childNodes);

                if (this.isAlradyStyle(style, node)) {
                    let node = range.startContainer.parentNode;
                    let all = range.cloneContents();
                    console.log("trouvé " + style)
                    console.log(node);
                    console.log(all); // FAIRE EN SORTE QUE ÇA SUPPRIME LA BALISE STYLE À L'INTERIEUR DE LA BALISE
                    
                } else {
                    console.log(range);
                    this.applyStyle(style, range);
                }
            }
        } else {
            console.log("Aucun texte selectionné");
        }
        // const selection = window.getSelection();
        // if (selection.rangeCount > 0) {
        //     for (let i = 0; i < selection.rangeCount; i++) {
        //         this.applyStyle(style, i); // A CHANGER
        //     }
        // }
    }

    isAlradyStyle(style, node) {
        console.log(node);
        console.log(style);
        if (node.nodeType === Node.ELEMENT_NODE) {
            console.log("Element node:", node.tagName); // VERIFIE SI LE TYPE DU NODE EST UNE BALISE Exemple: DEL
            if (node.tagName === style) {
                // node.remove(); RAJOUTER UNE FONCTION POUR Y EXTRAIRE LE TEXTE
                console.log(node);
                this.deleteStyleText(style, node);
                console.log("Pret à supprimer noeud");
                return true; 
            } else { 
                console.log(node.childNodes);
                this.isAlradyStyle(style, node.childNodes);
            } 
        }
        return false;
    }

    deleteStyleText(style, node) {
        let text = node.textContent;
        console.log(text);
        let parent = node.parentNode;
        console.log(parent);
        let textNode = document.createTextNode(text);
        parent.replaceChild(textNode, node);
    }
    // LE RANGECOUNT RENVOIE LE NOMBRE DE SELECTIONS QU'IL Y A SUR LA PAGE GetRangeAt
    // ContainsNode

    // getCurrentRange() {
    //     let selection = window.getSelection();
    //     return selection.rangeCount ? selection.getRangeAt(0) : null;
    // }

    applyStyle(style, noeuds) {        
        let object = document.createElement(style);
        object.appendChild(noeuds.extractContents());
        noeuds.insertNode(object);
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