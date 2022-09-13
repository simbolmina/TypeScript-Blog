import { useState } from "react";
import CodeEditor from "./CodeEditor";
import Preview from ".//Preview";
import bundle from "../bundler";

function CodeCell() {
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");

  const clickHandler = async () => {
    const result = await bundle(input);
    setCode(result);
  };

  return (
    <div>
      <CodeEditor
        initialValue="console.log('test')"
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={clickHandler} className="button is-primary">
          Submit
        </button>
        <Preview code={code} />
      </div>
    </div>
  );
}

export default CodeCell;
