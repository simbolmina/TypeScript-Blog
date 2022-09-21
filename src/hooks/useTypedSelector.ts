import { useSelector, TypedUseSelectorHook } from "react-redux";
import { RootState } from "../state";

//by default we dont know type of data is stored in redux store. we we create this hook to get the redux data in a typed manner.

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
