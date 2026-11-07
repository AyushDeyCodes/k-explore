import { Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { ExplorePage } from '@/pages/ExplorePage';
import { EventDetailPage } from '@/pages/EventDetailPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MyRegistrationsPage } from '@/pages/MyRegistrationsPage';
import { FavouritesPage } from '@/pages/FavouritesPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="event/:id" element={<EventDetailPage />} />
        <Route path="register/:id" element={<RegisterPage />} />
        <Route path="my-registrations" element={<MyRegistrationsPage />} />
        <Route path="favourites" element={<FavouritesPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
