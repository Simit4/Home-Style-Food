

// Initialize Supabase client
const supabaseUrl = 'https://ozdwocrbrojtyogolqxn.supabase.co';  // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ';  // Your Supabase anon public key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Get query parameter helper
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Load all recipes on recipes.html
async function loadAllRecipes() {
  const container = document.getElementById('recipes-container');
  if (!container) return;

  const { data: recipes, error } = await supabase
    .from('recipe_db')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading recipes:', error);
    container.innerHTML = '<p>Failed to load recipes.</p>';
    return;
  }

  container.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <h3><a href="recipe.html?slug=${encodeURIComponent(recipe.slug)}">${recipe.title}</a></h3>
      <p>${recipe.description || ''}</p>
      <iframe width="100%" height="180" src="${recipe.video_url}" frameborder="0" allowfullscreen></iframe>
    `;

    container.appendChild(card);
  });
}

// Load single recipe on recipe.html based on slug query param
async function loadSingleRecipe() {
  const slug = getQueryParam('slug');
  if (!slug) return;

  const container = document.getElementById('recipe-content');
  if (!container) return;

  const { data: recipe, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !recipe) {
    console.error('Recipe not found:', error);
    container.innerHTML = '<p>Recipe not found.</p>';
    return;
  }

  // Create ingredients list HTML
  const ingredientsHtml = recipe.ingredients
    .map(ing => `<li>${ing}</li>`)
    .join('');

  // Create method steps HTML
  const methodHtml = recipe.method
    .map((step, i) => `<li>${step}</li>`)
    .join('');

  container.innerHTML = `
    <h2>${recipe.title}</h2>
    <div class="recipe-video">
      <iframe width="100%" height="300" src="${recipe.video_url}" frameborder="0" allowfullscreen></iframe>
    </div>
    <div class="recipe-details">
      <h3>Ingredients</h3>
      <ul>${ingredientsHtml}</ul>

      <h3>Method</h3>
      <ol>${methodHtml}</ol>
    </div>
  `;
}

// Detect page and load accordingly
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('recipes-container')) {
    loadAllRecipes();
  }
  if (document.getElementById('recipe-content')) {
    loadSingleRecipe();
  }
});
