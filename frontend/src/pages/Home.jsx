import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function Home() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const products = [
    { id: 1, name: "Smartphone", price: 899, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:0/q:90/plain/https://cellphones.com.vn/media/wysiwyg/Phone/Apple/iPhone-16/cate-iphone-16-series-28.jpg" },
    { id: 2, name: "Headphones", price: 199, image: "https://cdn2.fptshop.com.vn/unsafe/2021_3_26_637523738137561484_tai-nghe-airpods-max-dd-1.jpg" },
    { id: 3, name: "Smartwatch", price: 299, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&h=400&q=80" },
    { id: 4, name: "Laptop", price: 1200, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&h=400&q=80" },
    { id: 5, name: "Tablet", price: 499, image: "https://product.hstatic.net/1000259254/product/ipad_pro_12.9-inch__space_grey_bbfeb3c1a1964da2a34162e6c556616d_master.jpg" },
    { id: 6, name: "Bluetooth Speaker", price: 150, image: "https://vn.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dwb2d449f5/2_JBL_FLIP6_3_4_RIGHT_PINK_30192_x1.png?sw=537&sfrm=png" },
    { id: 7, name: "Gaming Mouse", price: 59, image: "https://file.hstatic.net/200000637319/file/7_1dcb8aff245e467c8e46b48a735fdb2c_grande.png" },
    { id: 8, name: "Mechanical Keyboard", price: 129, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&h=400&q=80" },
    { id: 9, name: "Webcam", price: 89, image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/329/122/products/webcam-may-tinh-logitech-pro-hd-c922-1.png?v=1630418561937" },
    { id: 10, name: "Drone", price: 850, image: "https://flycamgiare.vn/wp-content/uploads/2023/06/Flycam-E88-Black.jpg" },
    { id: 11, name: "DSLR Camera", price: 999, image: "https://tokyocamera.vn/wp-content/uploads/2023/10/DJI-osmo-pocket-3-tokyocamera-4.jpg" },
    { id: 12, name: "Fitness Tracker", price: 149, image: "https://product.hstatic.net/1000381291/product/5d6d5d361f784e748b158d7a52e8e10d_4fc92b3273e64f449744991207b2f64b_1024x1024.jpg" },
    { id: 13, name: "VR Headset", price: 349, image: "https://www.droidshop.vn/wp-content/uploads/2024/02/Kinh-thuc-te-ao-apple-vision-pro-1-2.jpg" },
    { id: 14, name: "4K Monitor", price: 649, image: "https://product.hstatic.net/200000637319/product/ezgif-4-9467526f66_9968b2d142b6499ba063fd460f1f1b6b_master.png" },
    { id: 15, name: "Portable Hard Drive", price: 89, image: "https://i.ebayimg.com/images/g/-zsAAOSwwypj2Ndu/s-l1200.jpg" },
  ];

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const addToCart = (product) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = storedCart.find((item) => item.id === product.id);

    let updatedCart;
    if (exists) {
      updatedCart = storedCart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...storedCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    alert(`${product.name} added to cart!`);
  };

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-primary">Welcome to Exclusive</h1>
        <p className="text-xl text-gray-600">Your premier online shopping destination</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-md px-4 py-2 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded-md px-4 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>

        <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary">
          <ShoppingCart className="h-5 w-5" /> View Cart ({cartItems.length})
        </Link>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
            <p className="text-gray-500 mb-3">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="btn btn-primary w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;