import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Mahsulotlarni olish
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin"); // Agar token bo‘lmasa, login sahifasiga yo‘naltirish
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        setErrorMessage("Admin panelga kirishda xatolik yuz berdi.");
      }
    };
    fetchProducts();
  }, [router]);

  const addProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:8000/products", newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: "", description: "", price: "", quantity: "" });
    } catch (error) {
      setErrorMessage("Mahsulot qo‘shishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <div className="add-product-form">
        <input
          type="text"
          placeholder="Nom"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tavsif"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Narx"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Miqdor"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
        />
        <button onClick={addProduct}>Qo‘shish</button>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
            <p>{product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
