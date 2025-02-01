// document.addEventListener("DOMContentLoaded", () => {
//     // const range = new Range();
//     // const updateRange = () => {
//     //     const selection = window.getSelection();
//     //     selection.removeAllRanges();
//     //     selection.addRange(range);
//     //     console.log(range.toString());
//     // };

//     document.addEventListener("selectionchange", function() {
//         const selection = window.getSelection();
//         // if (selection.rangeCount > 0) {
//         //     const range = selection.getRangeAt(0);
//         //     const start = range.startOffset;
//         //     const end = range.endOffset;
//         //     console.log(`Selection starts at: ${start}, ends at: ${end}`);
//         // }
//         console.log(selection.toString());
//     });
// });

import { MyWysiwyg } from './modules/my_wysiwyg.js';
let mw = new MyWysiwyg(document.getElementById('textarea'), {buttons:["bold", "italic", "color"]});