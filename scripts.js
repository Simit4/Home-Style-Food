const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadRecipes() {
  const { data: recipes, error } = await supabase.from('recipes').select('*');

  if (error) {
    console.error('Error fetching recipes:', error);
    return;
  }

  const recipesContainer = document.getElementById('recipes-container');
  recipesContainer.innerHTML = '';

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.className = 'recipe-card';

    recipeCard.innerHTML = `
      <iframe src="${recipe.video_url}" title="${recipe.title}" allowfullscreen></iframe>
      <h3>${recipe.title}</h3>
      <h4>Ingredients</h4>
      <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      <h4>Method</h4>
      <ol>${recipe.method.map(m => `<li>${m}</li>`).join('')}</ol>
    `;

    recipesContainer.appendChild(recipeCard);
  });
}

document.addEventListener('DOMContentLoaded', loadRecipes);
