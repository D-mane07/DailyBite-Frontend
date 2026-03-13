const PRIVATE_ROBOTS = "noindex, nofollow";

export const DEFAULT_METADATA = {
  title: "DailyBite | Fast Local Delivery",
  description:
    "DailyBite helps you discover nearby shops, order food quickly, and track delivery in real time.",
  robots: "index, follow",
  image: "/DailyBite.png",
};

const ROUTE_METADATA = [
  {
    match: (pathname) => pathname === "/",
    title: "Home | DailyBite",
    description:
      "Explore nearby restaurants and stores, order in seconds, and get fast local delivery with DailyBite.",
  },
  {
    match: (pathname) => pathname === "/signup",
    title: "Create Account | DailyBite",
    description:
      "Create your DailyBite account to start ordering from nearby shops and restaurants.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/signin",
    title: "Sign In | DailyBite",
    description: "Sign in to your DailyBite account and continue your orders.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/forgetpass",
    title: "Reset Password | DailyBite",
    description: "Reset your DailyBite account password securely.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/createeditshop",
    title: "Manage Shop | DailyBite",
    description: "Create or edit your shop profile and details on DailyBite.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/additems",
    title: "Add Items | DailyBite",
    description: "Add new products and menu items to your DailyBite shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/edititem/"),
    title: "Edit Item | DailyBite",
    description: "Update item details, pricing, and availability in your shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/cartitem",
    title: "Your Cart | DailyBite",
    description: "Review your selected items before checkout.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/checkout",
    title: "Checkout | DailyBite",
    description: "Confirm address, payment, and delivery details for your order.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/placeorder",
    title: "Place Order | DailyBite",
    description: "Place your order and receive delivery updates instantly.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/ownerorders",
    title: "Owner Orders | DailyBite",
    description: "Manage incoming customer orders for your shop.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname === "/userorders",
    title: "My Orders | DailyBite",
    description: "View your order history and latest delivery updates.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/trackorder/"),
    title: "Track Order | DailyBite",
    description: "Track your order location and estimated delivery status.",
    robots: PRIVATE_ROBOTS,
  },
  {
    match: (pathname) => pathname.startsWith("/shop/"),
    title: "Shop | DailyBite",
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
