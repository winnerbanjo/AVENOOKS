const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables manually
const envPath = path.resolve(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals !== -1) {
      const key = trimmed.substring(0, firstEquals).trim();
      const val = trimmed.substring(firstEquals + 1).trim();
      process.env[key] = val;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);

const menuItems = [
  // NIGERIAN SOUPS (Category: SOUPS)
  { 
    name: 'Oha soup', 
    price: 15500, 
    category: 'SOUPS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Traditional Nigerian Oha soup cooked with rich spices, meat, and dry fish.' 
  },
  { 
    name: 'Bitter leaves Soup', 
    price: 15500, 
    category: 'SOUPS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Classic bitter leaf soup cooked to perfection with traditional herbs.' 
  },
  { 
    name: 'Vegetable OKro soup', 
    price: 14500, 
    category: 'SOUPS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Nutritious fresh okra loaded with vegetables, seafood, and assorted meats.' 
  },
  { 
    name: 'Egusi Soup', 
    price: 14500, 
    category: 'SOUPS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Rich melon seed soup cooked with spinach, stockfish, and assorted meats.' 
  },
  { 
    name: 'Seafood Okra soup', 
    price: 16500, 
    category: 'SOUPS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Fresh okro soup loaded with prawns, crabs, fish, and rich spices.' 
  },
  { 
    name: 'Native Catfish Peppersoup', 
    price: 14500, 
    category: 'SOUPS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Fresh catfish cooked in a highly aromatic and spicy pepper broth.' 
  },
  { 
    name: 'Goat meat PEPPERSOUP', 
    price: 10500, 
    category: 'SOUPS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Tender goat meat chunks slow-cooked in a spicy and traditional herbal broth.' 
  },
  { 
    name: 'Fisherman soup', 
    price: 40000, 
    category: 'SOUPS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'A luxurious riverine seafood delicacy cooked with the freshest catch of the day.' 
  },

  // SAUCES & STEW BOWLS (Category: SAUCES & STEWS)
  { 
    name: 'Fish stew', 
    price: 15500, 
    category: 'SAUCES & STEWS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Deeply seasoned tomato and pepper sauce stewed with fried fish.' 
  },
  { 
    name: 'Fried potato wedges and fish sauce', 
    price: 12500, 
    category: 'SAUCES & STEWS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Golden fried potato wedges served with a rich and tasty fish dipping sauce.' 
  },
  { 
    name: 'Goat meat PEPPERSOUP with white rice', 
    price: 14500, 
    category: 'SAUCES & STEWS', 
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600',
    description: 'Spicy goat meat pepper soup served hot with boiled white rice.' 
  },
  { 
    name: 'White rice & beans with goat stew', 
    price: 14500, 
    category: 'SAUCES & STEWS', 
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600',
    description: 'Steamed white rice and honey beans paired with a rich, savory goat meat stew.' 
  },
  { 
    name: 'Prawn-chicken vegetable sauce', 
    price: 15500, 
    category: 'SAUCES & STEWS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'A healthy and colorful stir-fry of prawns, chicken breast, and fresh vegetables.' 
  },

  // PASTA DISHES (Category: PASTA DISHES)
  { 
    name: 'Sichuan Spicy noodles', 
    price: 11500, 
    category: 'PASTA DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Fiery and aromatic stir-fried noodles cooked with Asian spices and veggies.' 
  },
  { 
    name: 'Spaghetti bolognese', 
    price: 16500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Classic Italian spaghetti topped with a rich, slow-simmered beef ragù.' 
  },
  { 
    name: 'Beefy jollof Penne', 
    price: 14500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Penne pasta cooked in spicy, smoky Nigerian Jollof sauce with tender beef chunks.' 
  },
  { 
    name: 'Pasta x turkey-veggie sauce combo', 
    price: 18500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Savory pasta paired with a rich stir-fried turkey and mixed vegetable sauce.' 
  },
  { 
    name: 'Native Goatmeat Pasta', 
    price: 14500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Local style pasta stir-fried with goat meat, scent leaves, and local spices.' 
  },
  { 
    name: 'Penne pasta x steak x salad', 
    price: 14500, 
    category: 'PASTA DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Tender penne pasta served with seared steak strips and a fresh side salad.' 
  },
  { 
    name: 'Native pasta', 
    price: 14500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Rich stir-fried pasta with scent leaves, dried fish, and local native spices.' 
  },
  { 
    name: 'Creamy shrimp pasta x chicken breast', 
    price: 14500, 
    category: 'PASTA DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Rich Alfredo-style pasta topped with pan-seared shrimps and sliced chicken breast.' 
  },
  { 
    name: 'Creamy Alfredo Penne', 
    price: 14500, 
    category: 'PASTA DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    description: 'Rich and velvety cream sauce tossed with penne pasta and parmesan cheese.' 
  },

  // RICES DISHES (Category: RICES DISHES)
  { 
    name: 'Protein fiesta coconut rice', 
    price: 18500, 
    category: 'RICES DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Fragrant coconut rice cooked with mixed proteins (chicken, beef, and prawns).' 
  },
  { 
    name: 'Asun-snail Coconut rice', 
    price: 18500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Rich coconut rice served with spicy peppered snail and smoky grilled goat meat (asun).' 
  },
  { 
    name: 'Coconut rice', 
    price: 16500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600',
    description: 'Aromatic rice cooked in fresh coconut milk, bell peppers, and local spices.' 
  },
  { 
    name: 'Asun Prawn coconut rice', 
    price: 16500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Coconut rice combined with smoky spicy goat meat (asun) and juicy prawns.' 
  },
  { 
    name: 'Nigerian fried rice', 
    price: 14500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Classic Nigerian fried rice cooked with mixed liver, vegetables, and chicken.' 
  },
  { 
    name: 'Native Jollof rice and beans', 
    price: 14500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600',
    description: 'Traditional-style smoky jollof rice cooked together with honey beans and local spices.' 
  },
  { 
    name: 'Mega Meal Jollof rice pack', 
    price: 21500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'A grand platter of smoky Jollof rice served with chicken, plantain, and salad.' 
  },
  { 
    name: 'Shrimp x Prawns Special rice', 
    price: 18500, 
    category: 'RICES DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Stir-fried premium rice loaded with sweet shrimps, king prawns, and veggies.' 
  },
  { 
    name: 'Egg fried rice', 
    price: 14500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Fluffy scrambled eggs stir-fried with rice, spring onions, and soy sauce.' 
  },
  { 
    name: 'Chicken peppersoup and rice', 
    price: 14500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Boiled white rice served with aromatic and spicy chicken pepper soup.' 
  },
  { 
    name: 'Singapore fried rice', 
    price: 15500, 
    category: 'RICES DISHES', 
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=600',
    description: 'Spicy curry stir-fried rice with thin noodles, vegetables, chicken, and shrimp.' 
  },
  { 
    name: 'Chicken vegetable sauce x white rice', 
    price: 14500, 
    category: 'RICES DISHES', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=600',
    description: 'Boiled white rice served with a colorful stir-fry of chicken breast and fresh veggies.' 
  },

  // SALADS (Category: SALADS)
  { 
    name: 'Protein veggie salad', 
    price: 10500, 
    category: 'SALADS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Fresh garden greens topped with boiled eggs, grilled chicken breast strips, and vinaigrette.' 
  },
  { 
    name: 'Avocado beef salad', 
    price: 10500, 
    category: 'SALADS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Crisp lettuce, cucumbers, and ripe avocados tossed with seasoned seared beef strips.' 
  },
  { 
    name: 'Beef veggie salad', 
    price: 10500, 
    category: 'SALADS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'A healthy mix of garden vegetables, carrots, cabbage, and shredded beef.' 
  },
  { 
    name: 'Shrimp salad', 
    price: 16500, 
    category: 'SALADS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Steamed pink shrimps served on a bed of fresh greens, tomatoes, and house dressing.' 
  },
  { 
    name: 'Chicken avocado salad bowl', 
    price: 10500, 
    category: 'SALADS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Fresh avocado chunks, grilled chicken strips, cucumber, cherry tomatoes, and honey mustard.' 
  },
  { 
    name: 'Egg salad', 
    price: 10500, 
    category: 'SALADS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Creamy boiled egg salad mixed with light mayonnaise, celery, and fresh herbs.' 
  },

  // PARFAITS & YOGURT (Category: PARFAITS)
  { 
    name: 'Premium parfait jar', 
    price: 11500, 
    category: 'PARFAITS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600',
    description: 'Layered Greek yogurt, granola, fresh berries, apples, grapes, and pure honey.' 
  },
  { 
    name: 'Exotic Mixed Yogo parfait jar', 
    price: 11500, 
    category: 'PARFAITS', 
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600',
    description: 'Yogurt parfait featuring exotic tropical fruits, mixed nuts, and toasted oats.' 
  },
  { 
    name: 'Exotic parfait bowl', 
    price: 8500, 
    category: 'PARFAITS', 
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600',
    description: 'A refreshing bowl of fruits and premium creamy Greek yogurt.' 
  },

  // BREAKFAST PACKAGE (Category: BREAKFAST PACKAGES)
  { 
    name: 'Moimoi & Pap', 
    price: 10500, 
    category: 'BREAKFAST PACKAGES', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Nigerian steamed bean pudding served with warm, freshly made corn meal (pap).' 
  },
  { 
    name: 'Akara & Pap/Custard', 
    price: 10500, 
    category: 'BREAKFAST PACKAGES', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Crispy fried bean cakes served with hot pap or creamy custard.' 
  },

  // DRINKS & SHAKES (Category: DRINKS & SHAKES)
  { 
    name: 'Tigernut drink', 
    price: 4500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600',
    description: '100% natural, sweet milk extracted from tigernuts, coconut, and dates.' 
  },
  { 
    name: 'Yogo fura', 
    price: 5500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600',
    description: 'Creamy yogurt blended with spicy millet dough balls (fura).' 
  },
  { 
    name: 'Beet Juice', 
    price: 5500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'Freshly pressed beetroot juice, rich in antioxidants and vitamins.' 
  },
  { 
    name: 'Watermelon & Pineapple juice Combo', 
    price: 9000, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'A double refreshing blend of sweet watermelon and tangy pineapple.' 
  },
  { 
    name: 'Biscoff Oreo milkshake', 
    price: 8500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600',
    description: 'Indulgent, thick milkshake blended with Lotus Biscoff cookies and Oreos.' 
  },
  { 
    name: 'Green juice', 
    price: 5500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600',
    description: 'Healthy detox blend of cucumber, celery, green apple, spinach, and ginger.' 
  },
  { 
    name: 'Carrot juice', 
    price: 5500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'Sweet and nutritious fresh carrot juice blended with orange and ginger.' 
  },
  { 
    name: 'Fruity Zobo drink', 
    price: 3000, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'Traditional hibiscus flower drink brewed with pineapples, ginger, and cloves.' 
  },
  { 
    name: 'Choco Tigernut drink', 
    price: 4500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=600',
    description: 'A chocolate-infused natural tigernut milk blend.' 
  },
  { 
    name: 'Premium juice combo', 
    price: 15000, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'A family-sized assortment of our finest freshly squeezed natural fruit juices.' 
  },
  { 
    name: 'Watermelon Juice', 
    price: 4500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'Pure, hydrating cold-pressed watermelon juice.' 
  },
  { 
    name: 'Pineapple + Ginger', 
    price: 4500, 
    category: 'DRINKS & SHAKES', 
    imageUrl: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=600',
    description: 'Tangy fresh pineapple juice with a spicy kick of ginger.' 
  },

  // ADD-ONS & EXTRAS (Category: ADD-ONS)
  { 
    name: 'Potato O’Brien', 
    price: 12500, 
    category: 'ADD-ONS', 
    isBestseller: true, 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Pan-fried potatoes with green and red bell peppers and onions.' 
  },
  { 
    name: 'Chicken or Turkey Box', 
    price: 30000, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'A bulk box containing seasoned grilled chicken or turkey pieces.' 
  },
  { 
    name: 'Peppered Turkey box', 
    price: 35000, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'A family-sized box of crispy fried turkey coated in spicy pepper sauce.' 
  },
  { 
    name: 'Mini Chops Bowl', 
    price: 12500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'An assortment of puff-puff, spring rolls, samosa, and peppered chicken.' 
  },
  { 
    name: 'Chicken Shawarma jumbo', 
    price: 8500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6518c4793f4f?q=80&w=600',
    description: 'Jumbo wrap filled with grilled chicken, sausages, cabbage, and creamy sauces.' 
  },
  { 
    name: 'Fried chicken', 
    price: 4500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Crispy and juicy deep-fried seasoned chicken piece.' 
  },
  { 
    name: 'Fried Mackerel fish', 
    price: 3500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Seasoned deep-fried mackerel fish steak.' 
  },
  { 
    name: 'Coleslaw', 
    price: 1500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'Creamy cabbage and carrot salad mixed with sweet salad cream.' 
  },
  { 
    name: 'Fried Turkey Big', 
    price: 6500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Big sized, spicy peppered or fried turkey piece.' 
  },
  { 
    name: 'Boiled eggs', 
    price: 700, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600',
    description: 'One perfectly hard-boiled egg.' 
  },
  { 
    name: 'Moimoi', 
    price: 2500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
    description: 'Savory steamed bean pudding cooked with egg and fish.' 
  },
  { 
    name: 'Fried plantain', 
    price: 1500, 
    category: 'ADD-ONS', 
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600',
    description: 'Golden fried sweet ripe plantain slices (dodo).' 
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing existing menu items...');
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items.');

    console.log(`Seeding ${menuItems.length} menu items with real food photos...`);
    await MenuItem.insertMany(menuItems);
    console.log('Database seeded successfully with beautiful pictures!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
