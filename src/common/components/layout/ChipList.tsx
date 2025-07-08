interface ChipListProps {
  list: string[];
}

export const ChipList = ({ list }: ChipListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item, index) => (
        <div className="chip" key={`chip-${index}-${item}`}>
          {item}
        </div>
      ))}
    </div>
  );
};
