import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../state";
import { useMemo } from "react";

//this is a custom hook to access all of our action creators from one place. we are binding all action creators together here and everytime we call useActions, a slightly different version of this function is created. thats why we use useMemo.

export const useActions = () => {
  //get access to dispatch function from redux
  const dispatch = useDispatch();
  //bind all action creators to dispatch function;

  //while we need to add add createBundle function action in the CodeCell.tsx it couses infinite loop in usestate() since it will be created again after every component render. so we useMemo ( useEffect + useState ) and make sure createBundle will be created only once.
  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};

//const { updateCell} = useActions()}
//updateCell( data about updateCell )

//if we did not do it we had to use a dispatch function directly  like:
//const dispatch = useDispatch() ;
// dispatch(actionCreators.updateCell( data, updatedatal)
