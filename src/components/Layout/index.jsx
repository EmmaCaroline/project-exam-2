import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <h1>Test</h1>
      </header>
      <main className="flex-grow p-4">
        <Outlet /> {/* This is where page content will be injected */}
      </main>
      <footer></footer>
    </div>
  );
};

export default Layout;
