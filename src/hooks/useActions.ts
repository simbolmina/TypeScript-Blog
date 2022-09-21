import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";

//this is a custom hook to access all of our action creators from one place

export const useActions = () => {
  //get access to dispatch function from redux
  const dispatch = useDispatch();
  //bind all action creators to dispatch function;
  return bindActionCreators(actionCreators, dispatch);
};

//const { updateCell} = useActions()}
//updateCell( data about updateCell )

//if we did not do it we had to use a dispatch function directly  like:
//const dispatch = useDispatch() ;
// dispatch(actionCreators.updateCell( data, updatedatal)
