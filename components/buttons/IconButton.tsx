import { NotificationIcon, SearchIcon } from "../Icons";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
}

const IconButton = ({ children, handleClick }: Props) => {
  return (
    <button
      className="border border-gray-300 rounded-sm p-1"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const SearchButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <IconButton handleClick={handleClick}>
      <SearchIcon size={25} color="black" />
    </IconButton>
  );
};

export const NotificationButton = ({
  handleClick,
}: {
  handleClick: () => void;
}) => {
  return (
    <IconButton handleClick={handleClick}>
      <NotificationIcon size={25} color="black" />
    </IconButton>
  );
};
