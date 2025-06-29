import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ';               // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchRecipe(slug) {
  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
  return data;
}

function renderRecipe(recipe) {
  if (!recipe) {
    document.getElementById('recipe-title').textContent = 'Recipe not found.';
    return;
  }

  document.getElementById("recipe-title").textContent = recipe.title || "N/A";
  document.getElementById("recipe-description").textContent = recipe.description || "N/A";

  document.getElementById("prep-time").textContent = recipe.prep_time || "N/A";
  document.getElementById("cook-time").textContent = recipe.cook_time || "N/A";
  document.getElementById("servings").textContent = recipe.servings || "N/A";

  // Ingredients
  const ingredientsList = document.getElementById("recipe-ingredients");
  ingredientsList.innerHTML = "";
  if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  } else {
    ingredientsList.innerHTML = "<li>N/A</li>";
  }

  // Method
  const methodList = document.getElementById("recipe-method");
  methodList.innerHTML = "";
  if (recipe.method && Array.isArray(recipe.method)) {
    recipe.method.forEach(step => {
      const li = document.createElement("li");
      li.textContent = step;
      methodList.appendChild(li);
    });
  } else {
    methodList.innerHTML = "<li>N/A</li>";
  }

  // Nutritional info
  let nutritionText = "N/A";
  if (recipe.nutritional_info) {
    try {
      const info = typeof recipe.nutritional_info === "string" ? JSON.parse(recipe.nutritional_info) : recipe.nutritional_info;
      nutritionText = `Calories: ${info.calories || "N/A"}, Protein: ${info.protein || "N/A"}, Carbs: ${info.carbohydrates || "N/A"}, Fat: ${info.fat || "N/A"}, Fiber: ${info.fiber || "N/A"}`;
    } catch {
      nutritionText = "N/A";
    }
  }
  document.getElementById("nutrition").textContent = nutritionText;

  // Tags / Cuisine / Category - expect arrays
  document.getElementById("tags-basic").textContent = (recipe.tags || []).join(", ") || "N/A";
  document.getElementById("tags-cuisine").textContent = (recipe.cuisine || []).join(", ") || "N/A";
  document.getElementById("tags-category").textContent = (recipe.category || []).join(", ") || "N/A";

  // Notes
  document.getElementById("notes").textContent = recipe.notes || "N/A";

  // Interesting facts
  document.getElementById("facts").textContent = recipe.facts || "N/A";

  // Video
function convertToEmbedUrl(url) {
  if (!url) return '';
  const videoIdMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return '';
}

// Inside renderRecipe or fetchAndRenderRecipe
const embedUrl = convertToEmbedUrl(recipe.video_url);
document.getElementById("recipe-video").src = embedUrl;

// Get slug from URL query string
function getSlugFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

// Initialize
(async function () {
  const slug = getSlugFromURL();
  if (!slug) {
    document.getElementById('recipe-title').textContent = "No recipe specified.";
    return;
  }

  const recipe = await fetchRecipe(slug);
  renderRecipe(recipe);
})();
