import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-gray-800 p-4 text-white">
    <div className="container mx-auto flex justify-between">
      <Link href="/">Bosh sahifa</Link>
      <Link href="/cart">Savatcha</Link>
      <Link href="/add-product">Mahsulot Qo'shish</Link>
    </div>
  </nav>
);

export default Navbar;
