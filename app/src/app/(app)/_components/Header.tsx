import ThemeToggle from "@/components/Toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div></div>
      <div className="flex items-center gap-2 px-4">
        <Link href={"/"}>
          <Button>Home</Button>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
