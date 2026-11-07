import { Link } from 'react-router-dom';
import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Logo } from '@/components/Logo';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com', icon: Github },
  { label: 'X (Twitter)', href: 'https://x.com', icon: Twitter },
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
];

const FOOTER_LINKS = [
  { label: 'Explore', to: '/explore' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy', to: '/about#privacy' },
  { label: 'Terms', to: '/about#terms' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="font-display text-xl font-bold text-ink">Discover. Experience. Register.</p>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            K Explore is a cinematic home for conferences, concerts, workshops and campus nights. Find what is happening
            near you and save your seat in a few taps.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-crimson hover:text-crimson"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Navigate</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.slice(0, 3).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink transition-colors hover:text-crimson">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">Legal</h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.slice(3).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink transition-colors hover:text-crimson">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-[1440px] px-4 py-6 text-xs text-muted sm:px-6 lg:px-8">
          © {new Date().getFullYear()} K Explore. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
