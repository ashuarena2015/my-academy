import { combineReducers } from "redux";

import usersReducer from "./users";
import globalReducer from "./global";
import feeReducer from  "./fee";

// Define the RootState type (infer types from reducers)
const appReducer = combineReducers({
  users: usersReducer,
  global: globalReducer,
  fee: feeReducer,
});

// Define RootState type for TypeScript
export type RootState = ReturnType<typeof appReducer>;

// Root reducer with action and state types
const rootReducer = (state: RootState | undefined, action: any): RootState => {
  return appReducer(state, action);
};

export default rootReducer;
