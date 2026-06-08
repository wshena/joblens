import { CiMenuFries, CiSearch, CiBellOn } from "react-icons/ci";

export const MenuIcon = ({ size, color, style }: Icon) => (
  <CiMenuFries size={size} color={color} className={style} />
);

export const SearchIcon = ({ size, color, style }: Icon) => (
  <CiSearch size={size} color={color} className={style} />
);

export const NotificationIcon = ({ size, color, style }: Icon) => (
  <CiBellOn size={size} color={color} className={style} />
);
