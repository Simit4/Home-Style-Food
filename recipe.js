import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to convert YouTube link to embed format
function convertToEmbedUrl(url) {
  if (!url) return '';
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

async function fetchAndRenderRecipe() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    document.getElementById('recipe-title').innerText = 'Recipe not found';
    return;
  }

  const { data: recipe, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !recipe) {
    document.getElementById('recipe-title').innerText = 'Recipe not found';
    return;
  }

// ✅ Increment views
if (recipe && recipe.id) {
  await supabase
    .from('recipe_db')
    .update({ views: (recipe.views || 0) + 1 })
    .eq('id', recipe.id);
}

  
  renderRecipe(recipe);
}

function renderRecipe(recipe) {
  document.getElementById('recipe-title').innerText = recipe.title;
  document.getElementById('recipe-description').innerText = recipe.description;
  document.getElementById('prep-time').innerText = recipe.prep_time;
  document.getElementById('cook-time').innerText = recipe.cook_time;
  document.getElementById('servings').innerText = recipe.servings;

  // Ingredients
  const ingredientsList = document.getElementById('recipe-ingredients');
  ingredientsList.innerHTML = '';
  recipe.ingredients.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    ingredientsList.appendChild(li);
  });

  // Method
  const methodList = document.getElementById('recipe-method');
  methodList.innerHTML = '';
  recipe.method.forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    methodList.appendChild(li);
  });

  // Nutrition
  const nutrition = recipe.nutritional_info;
  if (nutrition) {
    document.getElementById('nutrition').innerHTML = `
      <strong>Calories:</strong> ${nutrition.calories}<br>
      <strong>Protein:</strong> ${nutrition.protein}<br>
      <strong>Carbohydrates:</strong> ${nutrition.carbohydrates}<br>
      <strong>Fiber:</strong> ${nutrition.fiber}<br>
      <strong>Fat:</strong> ${nutrition.fat}
    `;
  }

  // Tags / Cuisine / Category
document.getElementById('tags').textContent = recipe.tags?.join(', ') || 'Not available';
document.getElementById('cuisine').textContent = recipe.cuisine?.join(', ') || 'Not available';
document.getElementById('category').textContent = recipe.category?.join(', ') || 'Not available';
  

  // Notes & Facts
document.getElementById('notes').textContent = recipe.notes || 'No additional notes available.';
document.getElementById('facts').textContent = recipe.facts || 'No fun facts found.';

  // Video
  const embedUrl = convertToEmbedUrl(recipe.video_url);
  document.getElementById('recipe-video').src = embedUrl || '';
}

fetchAndRenderRecipe();
