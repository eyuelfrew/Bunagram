import { MenuBar } from "../../types/Types";
import { VIEW_MENU_DISABLE, VIEW_MENU_ENABLED } from "../actions/actionTypes";

const initialState: MenuBar = {
  isView: false,
};
const menuReducer = (state = initialState, action: { type: string }) => {
  switch (action.type) {
    case VIEW_MENU_ENABLED:
      return { ...state, isView: true };
    case VIEW_MENU_DISABLE:
      return { ...state, isView: false };
    default:
      return state;
  }
};
export default menuReducer;
