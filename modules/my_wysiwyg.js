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
                    this.setStyle("I");
                    break;
                case "color":
                    this.setStyle("span", document.getElementById('color').value, 'color');
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
                let node = range.startContainer.parentElement;
                console.log(node);
                 console.log(selection);
                 
                 console.log(node.firstChild);
                // console.log(node);
                // .startContainer
                // commonAncestorContainer;
                // if (node.nodeType === Node.TEXT_NODE) {
                //     node = node.parentNode;
                // }
                // console.log(node);
                
                if (type === 'text-align'){
                    this.applyStyle('ali', range, value, type);
                }
                const alreadyStyled = this.isAlradyStyle(style, node, value, type);
                console.log(alreadyStyled);
                console.log(node);
                
                if (alreadyStyled === 0) {
                    console.log("Appliquer le style :", style);
                    this.applyStyle(style, range, value, type);
                } else if (alreadyStyled === -1) {
                    console.log("Style déjà appliqué.");
                    return;
                } else if (alreadyStyled === 1) {
                    console.log("Suppression du style.");
                    let extractedContent = range.extractContents();
                    // console.log(extractedContent);
                    // console.log(node);
                    // console.log(range);
                    
                    let textContent = extractedContent.textContent;
                    let textNode = document.createTextNode(textContent);
                    node.style.removeProperty(style);
                    range.insertNode(textNode);
                    // node.normalize();
                }
                console.log(node);
            }
        }
        
    } 

    isAlradyStyle(style, node, value = null, type = null) {
        if (style == 'span' && node.tagName == 'SPAN') {
            node.style[type] = value;
            return -1;
        } else if ((node.nodeType === Node.ELEMENT_NODE) || (node.nodeType === Node.TEXT_NODE)) {
                console.log("Element node:", node.tagName); // VERIFIE SI LE TYPE DU NODE EST UNE BALISE Exemple: DEL
                if (node.tagName === style && (value === null)) {
                    return 1; 
                } else { 
                    this.isAlradyStyle(style, node.childNodes, value);
                } 
        }
        return 0;
    }

    applyStyle(style, range, value = null, type = null) {  
        let node = range.startContainer.parentElement;
        console.log(node);
        // const range = selection.getRangeAt(i);
        // let node = range.startContainer.parentElement;.    
            if (style !== null) {
                let object = document.createElement(style);
                type ? style : value;
                object.classList.add(type);
                if (type === 'lien') {
                    // Petites questions        // const range = selection.getRangeAt(i);

                    object.href = value;
                } else {
                    object.style[type] = value;
                }
                if (object.nodeType === Node.TEXT_NODE) {
                    let wrapper = document.createElement("div");
                    wrapper.appendChild(object);
                    object = wrapper;
                    // div selection
                    console.log(object);
                }  else if (object.nodeType === Node.ELEMENT_NODE) {
                    console.log("in Model modul");
                    // object.classList.add(type);
                    // object.style[type] = value;
                    console.log(object);
                    
                    // noeudsn.appendChild(object.extractContents());
                    // noeudsn.insertNode(object);
                    // let txt = node.extractContents();
                    // console.log(txt);
                    let textContent = range.extractContents();
                    console.log(textContent);
                    // node.insertNode(textContent);
                    // console.log(textContent);
                    // object.appendChild(node.extractContents());
                    // node.insertNode(object);
                    let textNode = document.createTextNode(textContent);
                    console.log(textContent);
                    console.log(textNode);
                    
                    // object.insertNode(textNode);
                    node.appendChild(textNode.textContent);
                    // node.insertNode(textNode);
                    // noeudsn.style.removeProperty(style);
                    // noeudsn.insertNode(textNode);
                    // node.normalize();
                    textNode.appendChild(node);
                    }

            }
            console.log("Fin sans réponse");
            
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
}
export { MyWysiwyg };