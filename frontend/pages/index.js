import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Mahsulotlar ro'yxatini olish
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/products");
        setProducts(res.data);
        setFilteredProducts(res.data); // Asl ro'yxatni saqlab qolish
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    // LocalStorage'dan savatcha ma'lumotlarini olish
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  // Savatchaga mahsulot qo'shish
  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item.id === product.id);
    if (existingProduct) {
      alert("Bu mahsulot savatchada bor!");
      return;
    }
    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // localStorage'ga saqlash
    alert(`${product.name} savatchaga qo'shildi!`);
  };

  // Qidiruv funksiyasi
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="container">
      <h1 className="title">Mahsulotlar ro'yxati</h1>
      <div className="cart-link">
        <Link href="/cart">Savatchaga o'tish ({cartItems.length} ta mahsulot)</Link>
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Mahsulotni qidiring..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>{product.price} so'm</strong></p>
              <button onClick={() => addToCart(product)} className="add-to-cart-btn">
                Savatchaga qo'shish
              </button>
            </div>
          ))
        ) : (
          <p>Mahsulot topilmadi...</p>
        )}
      </div>
    </div>
  );
}
