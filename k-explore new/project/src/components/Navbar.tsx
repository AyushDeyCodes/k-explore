import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarCheck, Heart, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SearchModal } from '@/components/SearchModal';
import { useTheme } from '@/hooks/useTheme';
import { useFavourites } from '@/hooks/useFavourites';

const NAV_LINKS = [
  { label: 'Explore', to: '/explore' },
  { label: 'Categories', to: '/#categories' },
  { label: 'My Registrations', to: '/my-registrations' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { favouriteIds } = useFavourites();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const isHome = location.pathname === '/';
  const solid = scrolled || !isHome || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-500 ${
        solid ? 'border-b border-line bg-base/95 shadow-card' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/explore'}
                className={({ isActive }) =>
                  `relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive && link.to !== '/#categories' ? 'text-ink' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && link.to !== '/#categories' && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-crimson"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated"
            aria-label="Open search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/favourites"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated"
            aria-label={`Favourites (${favouriteIds.size})`}
          >
            <Heart className="h-5 w-5" />
            {favouriteIds.size > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold text-white">
                {favouriteIds.size}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link
            to="/explore"
            className="ml-2 hidden h-10 items-center rounded-full bg-crimson px-5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-crimson-hover lg:inline-flex"
          >
            Discover events
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-elevated md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-line bg-base md:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {[...NAV_LINKS, { label: 'Favourites', to: '/favourites' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex min-h-12 items-center justify-between rounded-xl px-4 text-base font-medium text-ink transition-colors hover:bg-elevated"
                  >
                    {link.label}
                    <CalendarCheck className="h-4 w-4 text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
