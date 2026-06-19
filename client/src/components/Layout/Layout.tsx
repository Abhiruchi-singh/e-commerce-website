import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PageNav from './PageNav';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
