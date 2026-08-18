import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products by name or product code..."
        className="w-full rounded-(--radius-button) border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-jade-500 focus:ring-2 focus:ring-jade-500"
        aria-label="Search products by name or product code"
      />
    </div>
  );
}
