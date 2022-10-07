import "./CodeCell.css";
import { useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Preview from ".//Preview";
// import bundle from "../bundler";
import Resizable from "./Resizable";
import { Cell } from "../state";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useCumulativeCode } from "../hooks/useCumulative";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // const [code, setCode] = useState("");
  // const [input, setInput] = useState("");
  // const [err, setErr] = useState("");
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  //get all the code from current cell and prevous cell to bundle them together so variables from prevous cell can be used.
  const cumulativeCode = useCumulativeCode(cell.id);

  //!bundle inside the component, before redux
  // useEffect(() => {
  //   const timer = setTimeout(async () => {
  //     const result = await bundle(cell.content);
  //     // const result = await bundle(input);
  //     setCode(result.code);
  //     setErr(result.err);
  //   }, 1000);

  //!bundle inside redux component
  useEffect(() => {
    if (!bundle) {
      // createBundle(cell.id, cell.content);
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);

    return () => {
      clearTimeout(timer);
    };
    // }, [input]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, cumulativeCode, createBundle]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100% - 10px)",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            // onChange={(value) => setInput(value)}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} bundleStatus={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
