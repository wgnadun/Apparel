export const registerFormControls = [
  {
    name: "firstName",
    label: "First Name",
    placeholder: "Enter your first name",
    componentType: "input",
    type: "text",
  },
  {
    name: "lastName",
    label: "Last Name",
    placeholder: "Enter your last name",
    componentType: "input",
    type: "text",
  },
  {
    name: "userName",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    componentType: "input",
    type: "tel",
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Select your country",
    componentType: "select",
    options: [
      { id: "US", label: "🇺🇸 United States (+1)" },
      { id: "GB", label: "🇬🇧 United Kingdom (+44)" },
      { id: "CA", label: "🇨🇦 Canada (+1)" },
      { id: "AU", label: "🇦🇺 Australia (+61)" },
      { id: "DE", label: "🇩🇪 Germany (+49)" },
      { id: "FR", label: "🇫🇷 France (+33)" },
      { id: "IN", label: "🇮🇳 India (+91)" },
      { id: "LK", label: "🇱🇰 Sri Lanka (+94)" },
      { id: "SG", label: "🇸🇬 Singapore (+65)" },
      { id: "AE", label: "🇦🇪 United Arab Emirates (+971)" },
      { id: "PK", label: "🇵🇰 Pakistan (+92)" },
      { id: "BD", label: "🇧🇩 Bangladesh (+880)" },
      { id: "NP", label: "🇳🇵 Nepal (+977)" },
      { id: "JP", label: "🇯🇵 Japan (+81)" },
    ],
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];


export const addProductFormElements = [
  {
    label: "Product Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "e.g., Premium Cotton T-Shirt",
    required: true,
  },
  {
    label: "Product Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Describe your product features, materials, and benefits...",
    required: true,
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    required: true,
    options: [
      { id: "men", label: "Men's Clothing" },
      { id: "women", label: "Women's Clothing" },
      { id: "kids", label: "Kids' Clothing" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    required: true,
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
      { id: "coofandy", label: "Coofandy" },
      { id: "J.VER", label: "J.VER" },
    ],
  },
  {
    label: "Regular Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "0.00",
    required: true,
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "0.00 (optional)",
    required: false,
  },
  {
    label: "Stock Quantity",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "0",
    required: true,
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
];

export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
  coofandy: "Coofandy",
 "  J.VER ":"J.VER"
};

export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
    { id: "coofandy", label: "Coofandy" },
    { id: "J.VER", label: "J.VER" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];