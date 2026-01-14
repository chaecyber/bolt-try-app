import { useState } from 'react';
import Home from './pages/Home';
import Product from './pages/Product';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const navigate = (page: string, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  return (
    <>
      {currentPage === 'home' && <Home onNavigate={navigate} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
      {currentPage === 'product' && (
        <Product productId={selectedProductId} onNavigate={navigate} />
      )}
    </>
  );
}

export default App;
