interface ChipListProps {
  list: string[];
}

export const ChipList = ({ list }: ChipListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((item) => (
        <div className="chip">{item}</div>
      ))}
    </div>
  );
};
