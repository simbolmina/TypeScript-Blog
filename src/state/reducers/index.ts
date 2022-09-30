import cellReducer from "./cellsReducer";
import { combineReducers } from "redux";
// import { ReducerState } from "react";
import bundleReducer from "./bundleReducer";

const reducers = combineReducers({
  cells: cellReducer,
  bundles: bundleReducer,
});

export default reducers;

//a type that describes our state for our store that help us keep it clean
export type RootState = ReturnType<typeof reducers>;
