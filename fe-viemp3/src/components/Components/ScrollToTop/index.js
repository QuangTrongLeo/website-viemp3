// src/components/Components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollableElement = document.querySelector('.col-md-10');
    if (scrollableElement) {
      scrollableElement.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
