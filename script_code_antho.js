export function My_Wysiwyg($a) {
    return new MyWysiwyg($a, {
        buttons: ["bold", "italic", "color", "barre"]
    });
}

class MyWysiwyg {
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

// IS alrady in style soit matching balise <b> <i> <dell> <span color get picker> <span font size> 
//  balise lien <a href:"GET"> <span style text-decoration:underline><span>
// alignement texte <p>

    isAlradyStyle(style, noeuds) {
        // console.log(noeuds);
        // console.log(noeuds.length);
        // for (let i = 0; i < noeuds.length; i++){
            noeuds.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    console.log("Text node:", node.textContent);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    console.log("Element node:", node.tagName); // Example: DEL
                }
                switch(style) {
                    case "barre":
                        if (node.tagName == ("DEL")) { 
                            console.log("touvé undeur");

                            return true;
                            // break;

                        }
                        default:
                            console.log("pas de match");
                            // return false;
                            break;
                        }
            });
            
    }

   setStyle() {
    const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                    const range = selection.getRangeAt(i);
                    console.log(range);
                    let no = range.startContainer.parentElement;
                    console.log(no);
                    let all = range.cloneContents();
                    console.log(all);
                    
                    if (this.isAlradyStyle("barre", all.childNodes)) {
                        let node = range.startContainer.parentNode;
                        console.log(node);
                        let all = range.cloneContents();
                        console.log(all);
                    };
            }
        }
    }

    
    

applyStyle(style) {
    let range = this.getCurrentRange();
        if (!range || range.collapsed) return;

        let array_style = [, "italic", "color"];
        let span = null;
        let dell = null;
        if (array_style.includes(style)) {
            span = document.createElement("span");
        } else if (style === "barre") {
            dell = document.createElement("del");
        } else if (style == "bold") {

        }
        switch (style) {
            case "bold":
                
                let node = range.startContainer.parentNode;
                console.log(node);
                let all = range.extractContents();
                console.log(all);
                
                // span.style.fontWeight = (range.startContainer.parentNode.style.fontWeight === "bold") ? "normal" : "bold";
                break;
            case "italic":
                // span.style.fontStyle = (range.startContainer.parentNode.style.fontStyle === "italic") ? "normal" : "italic";
                this.setStyle();
                break;
            case "color":
                let color = prompt("Entrez une couleur en hex ou nom de couleur:", "red");
                if (color) span.style.color = color;
                break;
            case "barre":
                //dell = document.createElement("del");
                this.element.appendChild(dell);
                console.log('barr');
                break;
        }
        if (array_style.includes(style)) {
            span.appendChild(range.extractContents());
            range.deleteContents();
            range.insertNode(span);
        } else if (style === "barre") {
            dell.appendChild(range.extractContents());
            range.deleteContents();
            range.insertNode(dell);
            let cook = range.startContainer.parentNode;
            console.log(cook);
            
        }

        // range.insertNode(span);
    }
};

export { MyWysiwyg };