import {
  Twitter,
  Instagram,
  Linkedin,
  Store,
  DollarSign,
  Users,
  ShoppingBag,
  Truck,
  Headphones,
  CheckCircle,
} from "lucide-react";

function About() {
  return (
    <div className="container py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <a href="/" className="text-gray-500 hover:underline">
          Home
        </a>
        <span>/</span>
        <span className="text-primary font-medium">About</span>
      </div>

      {/* Our Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h1 className="text-4xl font-bold mb-6 text-primary">Our Story</h1>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              Launched in 2015, <strong>Exclusive</strong> is South Asia's premier online shopping
              marketplace with an active presence in Bangladesh. With over 10,500 sellers and 300
              brands, we proudly serve 3 million customers.
            </p>
            <p>
              With more than 1 million products and growing, we offer a diverse assortment in
              categories ranging from electronics to fashion and more.
            </p>
          </div>
        </div>
        <div>
          <img
            src="https://source.unsplash.com/500x400/?shopping,women"
            alt="Shopping women"
            className="w-full rounded-lg shadow-lg object-cover"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {[
          { value: "10.5k", label: "Sellers active our site", Icon: Store },
          { value: "33k", label: "Monthly Product Sale", highlight: true, Icon: DollarSign },
          { value: "45.5k", label: "Customer active in our site", Icon: Users },
          { value: "25k", label: "Annual gross sale in our site", Icon: ShoppingBag },
        ].map((item, i) => (
          <div
            key={i}
            className={`border rounded-lg p-6 text-center ${
              item.highlight ? "bg-primary text-white" : "bg-white"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                item.highlight ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              <item.Icon className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-bold mb-2">{item.value}</h3>
            <p className="text-sm">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {[
          { name: "Tom Cruise", role: "Founder & Chairman", img: "https://goldenglobes.com/wp-content/uploads/2023/10/17-tomcruiseag.jpg?w=600?w=600" },
          { name: "Tom Holland", role: "Managing Director", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Tom_Holland_by_Gage_Skidmore.jpg/800px-Tom_Holland_by_Gage_Skidmore.jpg" },
          { name: "Elon Musk", role: "Product Designer", img: "https://upload.wikimedia.org/wikipedia/commons/f/f4/USAFA_Hosts_Elon_Musk_%28Image_1_of_17%29_%28cropped%29.jpg" },
        ].map((member, i) => (
          <div key={i} className="text-center">
            <img
              src={member.img}
              alt="Team member"
              className="w-full aspect-square object-cover mb-4 rounded-lg shadow-sm"
            />
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-gray-600 mb-3">{member.role}</p>
            <div className="flex justify-center space-x-3">
              {[Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a href="#" key={idx} className="text-gray-600 hover:text-primary">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140", Icon: Truck },
          { title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support", Icon: Headphones },
          { title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days", Icon: CheckCircle },
        ].map((item, i) => (
          <div key={i} className="text-center p-8 border rounded-lg hover:shadow-md transition-all">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <item.Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;