interface SearchBox {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function  SearchBox({ value, onChange, onKeyDown }: SearchBox) {
  return (
    <input
      type="text"
      className="border border-[#E5E7EB] bg-[#0E141F] p-2 rounded-md pl-6 w-full placeholder-gray-300 focus:border-[#52E8FB] focus:ring focus:ring-[#52E8FB] focus:outline-none"
      placeholder="Buscar cliente..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
       onKeyDown={onKeyDown}
    />
  );
}
