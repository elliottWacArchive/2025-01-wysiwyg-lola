class MyWysiwyg {
    constructor(element, options = {buttons: ["bold", "italic", "color"]}) {
        this.element = element;
        this.options = options;
        console.log(this.element);
        console.log(this.options);
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
    }

    createButtons() {
        this.options.buttons.forEach(button => {
            let btn = document.createElement("button");
            btn.textContent = button;
            // btn.addEventListener("click", () => {
            //     const selection = window.getSelection();
            //     console.log(selection.anchorOffset + ':' + selection.focusOffset);
            //     console.log(selection.anchorNode + ':' + selection.focusNode);
            //     const range = selection.getRangeAt(0);
            //     const allParagraphs = document.querySelectorAll("p");
            //     console.log(allParagraphs);
            //     let parentP = range.commonAncestorContainer;
            //     while (parentP && parentP.nodeName !== "P") {
            //         parentP = parentP.parentNode;
            //     }
            //     if (!parentP) return;
            //     const paragraphIndex = Array.from(allParagraphs).indexOf(parentP);
            //     console.log("Numéro du <p> sélectionné :", paragraphIndex);
            // });
            // btn.addEventListener("click", () => {
            //     const selection = window.getSelection();
            //     if (!selection.rangeCount) return;
            //     console.log(selection);
            //     const range = selection.getRangeAt(0);
            //     const allParagraphs = Array.from(document.querySelectorAll("p"));
            
            //     // cherche tt les p
            //     let startP = range.startContainer;
            //     let endP = range.endContainer;
            
            //     while (startP && startP.nodeName !== "P") startP = startP.parentNode;
            //     while (endP && endP.nodeName !== "P") endP = endP.parentNode;
            
            //     if (!startP || !endP) return "Pas de <p> trouvé";
            
            //     // recup l'index du p
            //     const startIndex = allParagraphs.indexOf(startP);
            //     const endIndex = allParagraphs.indexOf(endP);
            
            //     console.log("Paragraphes sélectionnés :", { startIndex, endIndex });
            // });
            // btn.addEventListener("click", () => {
            //     const selection = window.getSelection();
            //     if (!selection.rangeCount) return;
            //     console.log(selection);
            //     const range = selection.getRangeAt(0);
            //     const selectedHtml = range.cloneContents();
            //     const div = document.createElement("div");
            //     div.appendChild(selectedHtml);
            //     console.log(div.innerHTML);
            // });
            // btn.addEventListener("click", () => {
            //     const selection = window.getSelection();
            //     if (!selection.rangeCount) return;
            
            //     const range = selection.getRangeAt(0);
            //     const fragment = range.cloneContents();
                
            //     const html = Array.from(fragment.childNodes).map(node => node.outerHTML || node.textContent).join("");
                
            //     console.log(html);
            // });
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
                        this.setStyle("bold");
                        break;
                    case "italic":
                        this.setStyle("italic");
                        break;
                    case "color":
                        this.setStyle("color");
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
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                this.applyStyle(style, i);
            }
        }
    }

    // LE RANGECOUNT RENVOIE LE NOMBRE DE SELECTIONS QU'IL Y A SUR LA PAGE GetRangeAt
    // ContainsNode

    getCurrentRange() {
        let selection = window.getSelection();
        return selection.rangeCount ? selection.getRangeAt(0) : null;
    }

    // ÇA PEUT VOUS AIDER A GERER LES PRESENCES DANS LES PARAGRAPHES
    containsBoldText(paragraph) {
        return paragraph.querySelector('b, strong') !== null;
    }

    containsItalicText(paragraph) {
        return paragraph.querySelector('i, em') !== null;
    }

    containsColoredText(paragraph) {
        return paragraph.querySelector('span[style*="color"]') !== null;
    }

    applyStyle(style, i) {
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