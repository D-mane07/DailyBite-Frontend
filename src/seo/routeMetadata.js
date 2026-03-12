const PRIVATE_ROBOTS = "noindex, nofollow";

export const DEFAULT_METADATA = {
  title: "Vingo | Fast Local Delivery",
  description:
    "Vingo helps you discover nearby shops, order food quickly, and track delivery in real time.",
  robots: "index, follow",
  image: "/Vingo.png",
};

const ROUTE_METADATA = [
  {
    match: (pathname) => pathname === "/",
    title: "Home | Vingo",
    description:
      "Explore nearby restaurants and stores, order in seconds, and get fast local delivery with Vingo.",
  },
  {
    match: (pathname) => pathname === "/signup",
    title: "Create Account | Vingo",
    description:
      "Create your Vingo account to start ordering from nearby shops and restaurants.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/signin",
    title: "Sign In | Vingo",
    description: "Sign in to your Vingo account and continue your orders.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/forgetpass",
    title: "Reset Password | Vingo",
    description: "Reset your Vingo account password securely.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/createeditshop",
    title: "Manage Shop | Vingo",
    description: "Create or edit your shop profile and details on Vingo.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/additems",
    title: "Add Items | Vingo",
    description: "Add new products and menu items to your Vingo shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/edititem/"),
    title: "Edit Item | Vingo",
    description: "Update item details, pricing, and availability in your shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/cartitem",
    title: "Your Cart | Vingo",
    description: "Review your selected items before checkout.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/checkout",
    title: "Checkout | Vingo",
    description: "Confirm address, payment, and delivery details for your order.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/placeorder",
    title: "Place Order | Vingo",
    description: "Place your order and receive delivery updates instantly.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/ownerorders",
    title: "Owner Orders | Vingo",
    description: "Manage incoming customer orders for your shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/userorders",
    title: "My Orders | Vingo",
    description: "View your order history and latest delivery updates.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/trackorder/"),
    title: "Track Order | Vingo",
    description: "Track your order location and estimated delivery status.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/shop/"),
    title: "Shop | Vingo",
    description:
      "Browse items from this shop, add favorites to cart, and order quickly.",
  },
];

export const getRouteMetadata = (pathname) => {
  const match = ROUTE_METADATA.find((route) => route.match(pathname));
  if (!match) {
    return DEFAULT_METADATA;
  }

  const { match: _match, ...metadata } = match;
  return { ...DEFAULT_METADATA, ...metadata };
};
