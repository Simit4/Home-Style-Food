// Supabase Initialization
const supabaseUrl = 'https://your-project-ref.supabase.co';
const supabaseKey = 'your-public-anon-key';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const featuredRecipesContainer = document.getElementById('featured-recipes-container');
const recipesContainer = document.getElementById('recipes-container');
const recipeDetailContainer = document.getElementById('recipe-detail');

// Load Featured Videos
async function loadFeaturedRecipes() {
  showLoading(featuredRecipesContainer);
  
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        id,
        title,
        youtube_url,
        prep_time,
        difficulty
      `)
      .eq('featured', true)
      .limit(4);

    if (error) throw error;

    featuredRecipesContainer.innerHTML = '';
    
    if (!recipes.length) {
      featuredRecipesContainer.innerHTML = '<p>No featured videos yet</p>';
      return;
    }

    recipes.forEach(recipe => {
      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';
      videoCard.innerHTML = `
        <div class="video-thumbnail" onclick="window.location='recipe-detail.html?id=${recipe.id}'">
          <img src="https://img.youtube.com/vi/${recipe.youtube_url}/hqdefault.jpg" 
               alt="${recipe.title}">
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
          <div class="video-duration">3:45</div> <!-- You can fetch this from YouTube API -->
        </div>
        <h3>${recipe.title}</h3>
        <div class="video-meta">
          <span><i class="fas fa-clock"></i> ${recipe.prep_time} min</span>
          <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
        </div>
      `;
      featuredRecipesContainer.appendChild(videoCard);
    });

  } catch (error) {
    showError(featuredRecipesContainer, 'Failed to load videos');
    console.error(error);
  }
}

// Load Recipe Detail with Video
async function loadRecipeDetail() {
  showLoading(recipeDetailContainer);
  
  try {
    const recipeId = new URLSearchParams(window.location.search).get('id');
    if (!recipeId) throw new Error('No recipe specified');

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select(`
        *,
        categories (name)
      `)
      .eq('id', recipeId)
      .single();

    if (error || !recipe) throw error || new Error('Recipe not found');

    recipeDetailContainer.innerHTML = `
      <div class="recipe-video">
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/${recipe.youtube_url}?autoplay=1" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen></iframe>
        </div>
        <h1>${recipe.title}</h1>
        <div class="recipe-meta">
          ${recipe.categories ? `<span><i class="fas fa-tag"></i> ${recipe.categories.name}</span>` : ''}
          <span><i class="fas fa-clock"></i> ${recipe.prep_time} min</span>
          <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
        </div>
      </div>
      
      <div class="recipe-content">
        <div class="ingredients">
          <h2><i class="fas fa-list-ul"></i> Ingredients</h2>
          <ul>${recipe.ingredients.split('\n').map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        
        <div class="instructions">
          <h2><i class="fas fa-list-ol"></i> Instructions</h2>
          <ol>${recipe.instructions.split('\n').map(i => `<li>${i}</li>`).join('')}</ol>
        </div>
      </div>
    `;

  } catch (error) {
    showError(recipeDetailContainer, error.message);
    console.error(error);
  }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  if (featuredRecipesContainer) loadFeaturedRecipes();
  if (recipeDetailContainer) loadRecipeDetail();
});
