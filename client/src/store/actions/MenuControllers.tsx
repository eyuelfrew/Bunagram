import {
  VIEW_MENU_DISABLE,
  VIEW_MENU_ENABLED,
} from "../actionTypes/actionTypes";
export const ViewMenu = () => {
  return { type: VIEW_MENU_ENABLED };
};

//close menu
export const CloseMenu = () => {
  return { type: VIEW_MENU_DISABLE };
};
