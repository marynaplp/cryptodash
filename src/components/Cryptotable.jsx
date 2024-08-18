// File: src/components/CryptoTable.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './cryptotable.css';

function CryptoTable() {
  const [cryptos, setCryptos] = useState([]);
  const { user, setUser, setFavorites } = useContext(AuthContext);

  useEffect(() => {
    // Fetch cryptocurrency data from CoinGecko API
    const fetchCryptos = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
        setCryptos(response.data);
        setUser(prevUser => ({
          ...prevUser,
          cryptos: response.data,
        }));
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptos();
  }, [setUser]);

  const handleFavorite = async (crypto) => {
    const isFavorite = user.favorites.includes(crypto.id);
    const action = isFavorite ? 'remove' : 'add';

    try {
      await axios.post(`http://localhost:5000/favorites/${user.username}`, {
        cryptoId: crypto.id,
        action,
      });

      const updatedFavorites = isFavorite
        ? user.favorites.filter(fav => fav !== crypto.id)
        : [...user.favorites, crypto.id];

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error(`Error updating favorites for ${crypto.name}:`, error);
    }
  };

  return (
    <div className="crypto-table">
      <h2>Cryptocurrency Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Market Cap</th>
            <th>Chart</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map(crypto => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td className={crypto.price_change_percentage_24h < 0 ? 'negative' : 'positive'}>
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </td>
              <td>${crypto.market_cap.toLocaleString()}</td>
              <td><img src={crypto.image} alt={crypto.name} width="20" /></td>
              <td>
                <button onClick={() => handleFavorite(crypto)}>
                  {user.favorites.includes(crypto.id) ? '★' : '☆'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoTable;
