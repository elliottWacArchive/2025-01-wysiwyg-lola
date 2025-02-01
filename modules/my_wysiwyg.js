class MyWysiwyg {
    constructor(element, options = {buttons: ["bold", "italic", "color"]}) {
        this.element = element;
        this.options = options;
        // console.log(this.element);
        // console.log(this.options);
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
                        // const selection = windsetStyleow.getSelection();
                        // console.log(selection);
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

    changeStyle(elem) {

    }
    // SECURISE LE MULTI SELECTION DE MOZILLA, A CALL AVEC TT LES BOUTONS DE STYLE
    setStyle(style) {
        const selection = window.getSelection();
        console.log(selection);
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                const range = selection.getRangeAt(i);
                let node = range.startContainer.parentElement;
                console.log(node);
                let all = range.cloneContents();
                console.log(all);
                console.log(this.isAlradyStyle(style, node));                 
                if (this.isAlradyStyle(style, all.childNodes)) {
                    console.log("trouvé " + style)
                    let node = range.startContainer.parentNode;
                    console.log(node);
                    let all = range.cloneContents();
                    console.log("AAAAAAAA");
                    
                    console.log(all); // FAIRE EN SORTE QUE ÇA SUPPRIME LA BALISE STYLE À L'INTERIEUR DE LA BALISE
                } else {
                    this.applyStyle(style, node);
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
        // console.log(noeuds.length);
        // for (let i = 0; i < noeuds.length; i++){
        // noeuds.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                console.log("Text node:", node.textContent); // VERIFIE SI LE TYPE DU NODE EST UN TEXTE
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                console.log("Element node:", node.tagName); // VERIFIE SI LE TYPE DU NODE EST UNE BALISE Exemple: DEL
                if (node.tagName === style) {
                    // node.remove(); RAJOUTER UNE FONCTION POUR Y EXTRAIRE LE TEXTE
                    return true; 
                }
                else { this.isAlradyStyle(style, node.childNodes); }
            }
            return false;
        // });
    }
    // LE RANGECOUNT RENVOIE LE NOMBRE DE SELECTIONS QU'IL Y A SUR LA PAGE GetRangeAt
    // ContainsNode

    // getCurrentRange() {
    //     let selection = window.getSelection();
    //     return selection.rangeCount ? selection.getRangeAt(0) : null;
    // }

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

    applyStyle(style, selec) {

        console.log(selec);
        console.log(style);
        
        let span = document.createElement("span");
        

        
        // span.appendChild(range.extractContents());
        // range.deleteContents();
        // range.insertNode(span);
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