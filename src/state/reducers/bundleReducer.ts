import produce from "immer";
import { ActionType } from "../action-types";
import { Action } from "../actions";

//define an interface that defines structure of data returned from this reducer.
interface BundlesState {
  [key: string]:
    | {
        loading: boolean; // if we bundling/processing the cell
        code: string;
        err: string;
      }
    | undefined;
}

//define initial state object
const initialState: BundlesState = {};

//define reducer and export it
const reducer = produce(
  (state: BundlesState = initialState, action: Action): BundlesState => {
    switch (action.type) {
      case ActionType.BUNDLE_START:
        //when we see a bundle start we throw away existing bundle and update loading true so we can say we are updating it.
        state[action.payload.cellId] = {
          loading: true,
          code: "",
          err: "",
        };
        return state;
      case ActionType.BUNDLE_COMPLETE:
        state[action.payload.cellId] = {
          loading: false,
          code: action.payload.bundle.code,
          err: action.payload.bundle.err,
        };
        return state;
      default:
        return state;
    }
  },
  initialState
);

export default reducer;
