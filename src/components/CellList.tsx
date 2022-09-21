import { useTypedSelector } from "../hooks/useTypedSelector";
import CellListItem from "./CellListItem";

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    //order is in the order array, we check id in the order and return data from data object. so we ensure we are getting data in the right order;
    return order.map((id) => data[id]);
  });

  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));
  return <div>{renderedCells}</div>;
};

export default CellList;
