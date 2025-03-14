'use client'

import Nav from "./nav";
import Logo from "./logo";
import SearchBar from "./searchbar";

function Header() {
  return (
    <header className="flex justify-between items-center p-5 bg-black z-99">
      <Logo />
      <SearchBar />
      <Nav />
    </header>
  );
}

export default Header;
