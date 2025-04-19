export const menuCategories = {
  appetizers: {
    icon: "🍽️",
    name: "Appetizers & Starters",
    description: "Light bites to start your event"
  },
  "main-course": {
    icon: "🍳",
    name: "Main Course",
    description: "Primary dishes"
  },
  nonveg: {
    icon: "🍗",
    name: "Non-Vegetarian",
    description: "Meat and seafood specialties"
  },
  breads: {
    icon: "🫓",
    name: "Indian Breads",
    description: "Traditional breads and rotis"
  },
  rice: {
    icon: "🍚",
    name: "Rice Specialties",
    description: "Aromatic rice dishes"
  },
  desserts: {
    icon: "🍰",
    name: "Desserts",
    description: "Sweet endings"
  },
  beverages: {
    icon: "🥤",
    name: "Beverages",
    description: "Refreshing drinks"
  },
  liveCounters: {
    icon: "👨‍🍳",
    name: "Live Stations",
    description: "Interactive cooking experiences"
  }
}

export const menuItems = {
  appetizers: [
    "Paneer Tikka", "Hara Bhara Kabab", "Veg Spring Rolls", "Samosa", "Cheese Balls", 
    "Corn Tikki", "Aloo Chaat", "Dahi Puri", "Sev Puri", "Pani Puri", "Chilli Paneer", 
    "Veg Cutlet", "Masala Papad", "Stuffed Mushrooms", "Mini Dhokla", "Rajma Galouti", 
    "Palak Patta Chaat", "Mini Uttapam", "Khandvi", "Paneer Pakora", "Crispy Baby Corn"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['vegetarian']
  })),

  "main-course": [
    "Butter Paneer", "Kadhai Paneer", "Shahi Paneer", "Paneer Lababdar", "Palak Paneer",
    "Paneer Bhurji", "Malai Kofta", "Mix Veg Curry", "Aloo Gobhi", "Bhindi Masala",
    "Baingan Bharta", "Stuffed Capsicum", "Veg Kolhapuri", "Chana Masala", "Dal Makhani",
    "Rajma Masala", "Punjabi Kadhi", "Methi Mutter Malai", "Dum Aloo Kashmiri",
    "Tinde Masala", "Chole", "Bhindi Do Pyaza", "Veg Jalfrezi", "Arbi Curry",
    "Tawa Subzi", "Jeera Aloo", "Corn Palak", "Navratan Korma", "Gatte Ki Sabzi"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['vegetarian']
  })),

  nonveg: [
    "Butter Chicken", "Chicken Curry", "Chicken Chettinad", "Chicken Do Pyaza",
    "Chicken Tikka Masala", "Chicken Bharta", "Chicken Korma", "Mutton Rogan Josh",
    "Keema Matar", "Mutton Curry", "Fish Curry", "Fish Tikka Masala", "Egg Curry",
    "Egg Masala", "Chicken 65", "Andhra Chicken", "Kadai Mutton", "Laal Maas",
    "Chicken Hyderabadi", "Prawn Curry"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['non-vegetarian']
  })),

  breads: [
    "Roti", "Tandoori Roti", "Phulka", "Naan", "Butter Naan", "Garlic Naan",
    "Lachha Paratha", "Plain Paratha", "Stuffed Paratha", "Paneer Kulcha",
    "Missi Roti", "Bhatura", "Poori", "Roomali Roti", "Amritsari Kulcha",
    "Bajra Roti", "Makki Di Roti", "Ajwain Paratha", "Methi Paratha", "Khamiri Roti"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['vegetarian']
  })),

  rice: [
    "Steamed Rice", "Jeera Rice", "Peas Pulao", "Veg Pulao", "Tamarind Rice",
    "Curd Rice", "Lemon Rice", "Ghee Rice", "Vegetable Biryani", "Hyderabadi Dum Biryani",
    "Kolkata Biryani", "Paneer Biryani", "Chicken Biryani", "Mutton Biryani",
    "Egg Biryani", "Sindhi Biryani", "Kashmiri Pulao", "Zafrani Pulao", "Kichdi",
    "Schezwan Fried Rice", "Tawa Pulao"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: name.includes('Chicken') || name.includes('Mutton') || name.includes('Egg') ? 
      ['non-vegetarian'] : ['vegetarian']
  })),

  desserts: [
    "Gulab Jamun", "Rasgulla", "Rasmalai", "Gajar Ka Halwa", "Moong Dal Halwa",
    "Kheer", "Seviyan", "Phirni", "Malpua", "Basundi", "Ladoo", "Boondi",
    "Jalebi", "Rabri", "Fruit Custard", "Chocolate Mousse", "Ice Cream", "Kulfi",
    "Falooda", "Shahi Tukda", "Barfi", "Kaju Katli", "Besan Ladoo", "Milk Cake"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['vegetarian', 'contains-dairy']
  })),

  beverages: [
    "Masala Chai", "Filter Coffee", "Sweet Lassi", "Salted Lassi", "Mango Lassi",
    "Buttermilk", "Shikanji", "Thandai", "Jaljeera", "Rose Sharbat", "Khus Sharbat",
    "Aam Panna", "Nimbu Pani", "Cold Coffee", "Watermelon Juice", "Orange Juice",
    "Mocktails", "Fruit Punch", "Virgin Mojito", "Kokum Sharbat", "Apple Juice"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    dietary: ['vegetarian']
  })),

  liveCounters: [
    "Live Chaat Counter", "Pani Puri Station", "Dahi Puri Station", "Tandoori Roti Station",
    "Dosa Counter", "Pav Bhaji Counter", "Chinese Live Wok", "Pasta Live Station",
    "Tawa Sabzi Station", "Paneer Tikka Live Grill", "Kathi Roll Counter",
    "Fried Rice & Manchurian", "Bhatura Live Fry", "South Indian Thali Counter"
  ].map(name => ({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    description: `Interactive ${name.toLowerCase()} with fresh preparation`,
    dietary: ['vegetarian']
  }))
}

export const dietaryIcons = {
  'vegetarian': '🌱',
  'vegan': '🌿',
  'non-vegetarian': '🍖',
  'contains-dairy': '🥛',
  'contains-nuts': '🥜',
  'gluten-free': '🌾',
  'spicy': '🌶️'
}

export const occasionTemplates = {
  haldi: {
    name: 'Haldi Ceremony',
    description: 'Traditional pre-wedding Haldi ceremony menu (50-100 guests)',
    menuItems: {
      appetizers: ['paneer-tikka', 'samosa', 'hara-bhara-kabab'],
      'main-course': ['dal-makhani', 'mix-veg-curry', 'paneer-lababdar'],
      breads: ['naan', 'tandoori-roti', 'missi-roti'],
      rice: ['jeera-rice', 'veg-pulao'],
      desserts: ['gulab-jamun', 'rasmalai'],
      beverages: ['masala-chai', 'mango-lassi']
    }
  },
  mehndi: {
    name: 'Mehndi Ceremony',
    description: 'Festive Mehndi ceremony menu (100-150 guests)',
    menuItems: {
      appetizers: ['dahi-puri', 'aloo-chaat', 'paneer-pakora'],
      'main-course': ['kadhai-paneer', 'chole', 'dal-makhani'],
      breads: ['butter-naan', 'lachha-paratha'],
      rice: ['vegetable-biryani'],
      desserts: ['phirni', 'gajar-ka-halwa'],
      beverages: ['thandai', 'rose-sharbat'],
      liveCounters: ['pani-puri-station', 'dosa-counter']
    }
  }
}