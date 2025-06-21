// Your Supabase credentials (replace with your actual keys)
const SUPABASE_URL = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo'; // replace this with your actual anon key

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadRecipes() {
  // Fetch all recipes from recipe_db table
  const { data: recipes, error } = await supabase
    .from('recipe_db')
    .select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  const container = document.getElementById('recipes-container');
  container.innerHTML = '';

  if (!recipes || recipes.length === 0) {
    container.innerHTML = '<p>No recipes found.</p>';
    return;
  }

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    card.innerHTML = `
      <iframe src="${recipe.video_url}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <p>${recipe.description || ''}</p>
      <h4>Ingredients:</h4>
      <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
      <h4>Method:</h4>
      <ol>${recipe.method.map(step => `<li>${step}</li>`).join('')}</ol>
      <a href="recipe.html?slug=${recipe.slug}" class="btn-secondary">View Recipe</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);
