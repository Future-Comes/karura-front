import Logo from "./Logo";
import { Menu } from "./Menu";
import { Search } from "./Search";

export const Header = () => {
  return (
    <header className="flex align-center mb-14">
      <Logo />
      <Menu />
      <div className="ml-auto">
        <Search />
      </div>
    </header>
  );
};
