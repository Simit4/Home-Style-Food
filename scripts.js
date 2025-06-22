// Supabase Initialization


const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace this with your actual anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Load all recipes for recipes.html
async function loadRecipes() {
  const { data, error } = await supabase.from('recipe_db').select('*');

  if (error) {
    console.error('Error loading recipes:', error);
    return;
  }

  const container = document.getElementById('recipes-container');

  data.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    recipeCard.innerHTML = `
      <iframe src="${recipe.video_url}" frameborder="0" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <p>${recipe.description}</p>
      <a href="recipe.html?slug=${recipe.slug}" class="btn-primary">View Recipe</a>
    `;

    container.appendChild(recipeCard);
  });
}

if (document.getElementById('recipes-container')) {
  loadRecipes();
}
