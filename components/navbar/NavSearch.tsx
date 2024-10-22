import { Input } from "../ui/input";

export default function NavSearch() {
  return (
    <Input
      type="search"
      placeholder="find a property..."
      className="max-w-xs dark:bg-muted "
    />
  );
}
