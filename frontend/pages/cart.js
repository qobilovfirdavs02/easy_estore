import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCart) {
      setCartItems(storedCart.map((item) => ({ ...item, quantity: 1.0 })));
    }
  }, []);

  const updateQuantity = (id, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: parseFloat(newQuantity) || 1.0 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    localStorage.removeItem("cartItems");
    setCartItems([]);
  };

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePurchase = async () => {
    try {
      const response = await axios.post("http://localhost:8000/purchase", {
        items: cartItems,
      });
      setMessage("Sotib olish muvaffaqiyatli amalga oshirildi!");
      clearCart();
    } catch (error) {
      console.error(error);
      setMessage("Sotib olishda xatolik yuz berdi. Qayta urinib ko'ring.");
    }
  };

  return (
    <div className="cart-container">
      <h1>Savatcha</h1>
      {message && <p className="message">{message}</p>}
      {cartItems.length === 0 ? (
        <p>Savatchangiz bo'sh!</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>{item.price} so'm</strong></p>
              <div className="quantity-container">
                <label htmlFor={`quantity-${item.id}`}>Miqdori:</label>
                <input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.id, e.target.value)
                  }
                  className="quantity-input"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="cart-total">
        <h3>Jami: {calculateTotal().toFixed(2)} so'm</h3>
      </div>
      <div className="cart-actions">
        <button onClick={handlePurchase} className="purchase-btn">
          Sotib olish
        </button>
        <button onClick={clearCart} className="clear-cart-btn">
          Savatchani tozalash
        </button>
        
      </div>
    </div>
  );
}
