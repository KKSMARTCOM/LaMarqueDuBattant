import React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

export default function CartIcon({ cartCount, openCart }) {
  return (
    <span className="relative">
      <span className="text-white text-xl cursor-pointer" onClick={openCart}><FiShoppingCart /></span>
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-1 min-w-2 h-5 bg-transparent text-red-600 font-bold text-xs flex items-center justify-center  px-1">
          {cartCount}
        </span>
      )}
    </span>
  );
} 