import cellReducer from "./cellsReducer";
import { combineReducers } from "redux";
// import { ReducerState } from "react";

const reducers = combineReducers({
  cells: cellReducer,
});

export default reducers;

//a type that describes our state for our store that help us keep it clean
export type RootState = ReturnType<typeof reducers>;
