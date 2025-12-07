// frontend/src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { apiCall } from "../config/api.js";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (user) {
      try {
        const res = await apiCall('/api/users/wishlist', {
          method: 'GET',
        });
        if (res.ok) {
          const data = await res.json();
          setWishlistItems(data);
        }
      } catch (error) { console.error(error); }
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!user) { alert("Vui lòng đăng nhập!"); return; }
    try {
      const res = await apiCall('/api/users/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product }),
      });
      if (res.ok) setWishlistItems(await res.json());
    } catch (error) { console.error(error); }
  };

  const removeFromWishlist = async (productId) => {
    const productToRemove = wishlistItems.find(item => item._id === productId);
    if (productToRemove) await toggleWishlist(productToRemove);
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist, isInWishlist, refreshWishlist: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);