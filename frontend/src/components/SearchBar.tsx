import { useEffect, useState } from "react";

type SearchBarProps = {
  onChange: (val: string) => void;
};

export const SearchBar = ({ onChange }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <input
      type='text'
      placeholder='Search by columns'
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      className='p-2 border border-gray-300 rounded'
    />
  );
};
