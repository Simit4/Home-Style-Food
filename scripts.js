
// Supabase Initialization
const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const featuredRecipesContainer = document.getElementById('featured-recipes-container');
const recipesContainer = document.getElementById('recipes-container');
const recipeDetailContainer = document.getElementById('recipe-detail');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recipeCountElement = document.getElementById('recipe-count');
const userCountElement = document.getElementById('user-count');

// Common UI Functions
function showLoading(element) {
  element.innerHTML = `
    <div class="loading-state">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>
  `;
}

function showError(element, message) {
  element.innerHTML = `
    <div class="error-state">
      <i class="fas fa-exclamation-triangle"></i> ${message}
    </div>
  `;
}

// Recipe Functions
async function loadFeaturedRecipes() {
  if (!featuredRecipesContainer) return;
  
  showLoading(featuredRecipesContainer);
  
  try {
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select(`
        id,
        title,
        description,
        prep_time,
        difficulty,
        image_url,
        categories (name)
      `)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    featuredRecipesContainer.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
      featuredRecipesContainer.innerHTML = `
        <div class="no-recipes">
          <i class="fas fa-info-circle"></i> No featured recipes found
        </div>
      `;
      return;
    }

    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';
      recipeCard.innerHTML = `
        <img src="${recipe.image_url || 'img/placeholder.jpg'}" 
             alt="${recipe.title}" 
             class="recipe-image"
             onerror="this.src='img/placeholder.jpg'">
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <div class="recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.prep_time || 'N/A'} mins</span>
            <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
            ${recipe.categories ? `<span><i class="fas fa-tag"></i> ${recipe.categories.name}</span>` : ''}
          </div>
          <p class="recipe-description">${recipe.description || 'A delicious home-cooked recipe'}</p>
          <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-primary">
            View Recipe <i class="fas fa-chevron-right"></i>
          </a>
        </div>
      `;
      featuredRecipesContainer.appendChild(recipeCard);
    });

  } catch (error) {
    showError(featuredRecipesContainer, 'Failed to load featured recipes');
    console.error('Error loading featured recipes:', error);
  }
}

async function loadAllRecipes(searchTerm = '') {
  if (!recipesContainer) return;
  
  showLoading(recipesContainer);
  
  try {
    let query = supabase
      .from('recipes')
      .select(`
        id,
        title,
        prep_time,
        difficulty,
        image_url
      `)
      .order('created_at', { ascending: false });

    if (searchTerm) {
      query = query.ilike('title', `%
