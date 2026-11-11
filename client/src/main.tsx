import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Masthead from './components/Masthead';
import FrontPage from './routes/FrontPage';
import Edition from './routes/Edition';
import Search from './routes/Search';
import NotFound from './routes/NotFound';
import './styles/tokens.css';
import './styles/app.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60000, retry: 1, refetchOnWindowFocus: false } }
});

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <>
      <a className="skip-link" href="#content">Skip to the news</a>
      <Masthead />
      <div id="content">
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/telangana" element={<FrontPage key="ts" state="Telangana" />} />
          <Route path="/andhra-pradesh" element={<FrontPage key="ap" state="Andhra Pradesh" />} />
          <Route path="/search" element={<Search />} />
          <Route path="/:state/:district" element={<Edition />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <footer className="colophon wrap">
        <p>
          Headlines come from Google News and are sorted into districts by name every 30 minutes.
          Each story links to the publisher's own page.
        </p>
        <p className="te" lang="te">తెలంగాణ · ఆంధ్రప్రదేశ్</p>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
