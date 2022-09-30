import { useTypedSelector } from "./useTypedSelector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    //get array of cells in the correct order.
    const orderedCells = order.map((id) => data[id]);

    //create a new array of cells which contains the codes, not text.
    const showFunction = `
        import _React from 'react';
        import _ReactDOM from 'react-dom';
    
        var show  = (value) => {
          const root = document.querySelector('#root');
    
          if (typeof value === 'object') {
            if (value.$$typeof && value.props) {
              _ReactDOM.render(value, root)
            } else {
              root.innerHTML = JSON.stringify(value);
            }
          } else {
            root.innerHTML = value;
          }
        }
        `;
    //since we define show() a few times, let and const will cause some errors during usage;
    const showFunctionNoOperation = `var show = () => {} `;
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          cumulativeCode.push(showFunction);
        } else {
          cumulativeCode.push(showFunctionNoOperation);
        }
        cumulativeCode.push(c.content);
      }
      //get all codes untill current code cell, not all of them in the document. there might be more after this the cell and they will be bundled together later as a separate object.
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join("\n");

  // console.log(cumulativeCode);
};
