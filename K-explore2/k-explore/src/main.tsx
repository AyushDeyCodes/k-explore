import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ThemeProvider } from '@/hooks/useTheme';
import { ToastProvider } from '@/hooks/useToast';
import { FavouritesProvider } from '@/hooks/useFavourites';
import '@/index.css';

// Provider order matters: FavouritesProvider calls useToast, so ToastProvider must wrap it.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <FavouritesProvider>
            <App />
          </FavouritesProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
