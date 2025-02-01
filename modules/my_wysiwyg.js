class MyWysiwyg {
    constructor(element, options = {buttons: ["bold", "italic", "color"]}) {
        this.element = element;
        this.options = options;
        console.log(this.element);
        console.log(this.options);
        this.initEditor();
    }

    initEditor() {
        this.element.contentEditable = true;
        this.element.style.outline = "none";
        this.toolbar = document.createElement("div");
        this.toolbar.classList.add("wysiwyg-toolbar");
        this.element.parentNode.insertBefore(this.toolbar, this.element);
        // this.editor = document.createElement("div");
        // this.editor.classList.add("wysiwyg-editor");
        // this.editor.contentEditable = true;
        // this.editor.innerHTML = this.element.value || "";

        // this.element.style.display = "none";
        // this.wrapper.appendChild(this.toolbar);
        // this.wrapper.appendChild(this.editor);
        // this.element.parentNode.insertBefore(this.wrapper, this.element);

        this.createButtons();
        // this.editor.addEventListener("input", () => {
        //     this.element.value = this.editor.innerHTML;
        // });
    }

    createButtons() {
        this.options.buttons.forEach(button => {
            let btn = document.createElement("button");
            btn.textContent = button;
            btn.addEventListener("click", () => {
                const selection = window.getSelection();
                console.log(selection.anchorOffset + ':' + selection.focusOffset);
                console.log(selection.anchorNode + ':' + selection.focusNode);
                // this.setStyle();
                // let parentP = selection.getRangeAt(0).commonAncestorContainer;
                // while (parentP && parentP.nodeName !== "P") {
                // }
            
                // console.log(parentP);
            });
            
            this.toolbar.appendChild(btn);
        });
    }

    setStyle() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            for (let i = 0; i < selection.rangeCount; i++) {
                    const range = selection.getRangeAt(i);
                    const span = document.createElement("span");
                    span.style.color = "red";
                    span.appendChild(range.extractContents());
                    range.insertNode(span);
            }
        }
    }

    // LE RANGECOUNT RENVOIE LE NOMBRE DE SELECTIONS QU'IL Y A SUR LA PAGE GetRangeAt
    // ContainsNode

    // getCurrentRange() {
    //     let selection = window.getSelection();
    //     return selection.rangeCount ? selection.getRangeAt(0) : null;
    // }
    
    

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

export { MyWysiwyg };

// document.addEventListener("DOMContentLoaded", function(event) {
//     var inst = document.getElementById("textarea");

//     console.log(inst);
//     console.log("AAAAAAAA");
    
    
//     let button = document.querySelector("button");
//     button.addEventListener("click", () => {
//   const selection = window.getSelection();
//   console.log("BB");
  
//   const strongElems = document.getElementsByTagName("strong");

//   if (selection.rangeCount > 0) {
//     selection.removeAllRanges();
//   }

//   for (const node of strongElems) {
//     const range = document.createRange();
//     range.selectNode(node);
//     selection.addRange(range);
//   }

//   function getCurrentRange(){
//     let selection = window.getSelection();
//     return selection.rangeCount ? selection.getRangeAt(0) : null;
// };

//     document.addEventListener('click', () => {

//         console.log(getCurrentRange());
//         console.log("L");
        
//     });

// });

// });

    // var inst = document.getElementById("textarea");
    


// let mw = new MyWysiwyg(inst, {
//     buttons: ["bold", "italic", "color"]
// });