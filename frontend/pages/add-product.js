import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });

  const [message, setMessage] = useState("");

  // Formani o'zgartirish funksiyasi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Formani yuborish funksiyasi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/products", {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      });
      if (res.status === 201) {
        setMessage("Mahsulot muvaffaqiyatli qo'shildi!");
        setFormData({ name: "", description: "", price: "", quantity: "" }); // Formani tozalash
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Mahsulotni qo'shishda xatolik yuz berdi.");
    }
  };

  return (
    <div className="add-product-container">
      <h1>Yangi mahsulot qo'shish</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label htmlFor="name">Mahsulot nomi</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Tavsif</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Narx</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Miqdor</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Qo'shish
        </button>
      </form>
    </div>
  );
}
