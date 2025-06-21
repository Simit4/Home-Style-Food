
// Supabase Initialization
const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo';

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const featuredRecipesContainer = document.getElementById('featured-recipes-container');
const recipesContainer = document.getElementById('recipes-container');
const recipeDetailContainer = document.getElementById('recipe-detail');
const similarRecipesContainer = document.getElementById('similar-recipes-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const categoryFilter = document.getElementById('category-filter');
const paginationContainer = document.getElementById('pagination');
const recipeCountElement = document.getElementById('recipe-count');
const userCountElement = document.getElementById('user-count');
const videoCountElement = document.getElementById('video-count');

// Current page for pagination
let currentPage = 1;
const recipesPerPage = 9;

// Common UI Functions
function showLoading(element) {
  if (!element) return;
  element.innerHTML = `
    <div class="loading-state">
      <i class="fas fa-spinner fa-spin"></i> Loading...
    </div>
  `;
}

function showError(element, message) {
  if (!element) return;
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
        youtube_url,
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
        ${recipe.youtube_url ? `
          <div class="video-thumbnail" onclick="window.location='recipe-detail.html?id=${recipe.id}'">
            <img src="https://img.youtube.com/vi/${recipe.youtube_url}/hqdefault.jpg" 
                 alt="${recipe.title}" 
                 class="recipe-image">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
        ` : `
          <img src="${recipe.image_url || 'img/placeholder.jpg'}" 
               alt="${recipe.title}" 
               class="recipe-image"
               onclick="window.location='recipe-detail.html?id=${recipe.id}'"
               onerror="this.src='img/placeholder.jpg'">
        `}
        <div class="recipe-content">
          <h3 onclick="window.location='recipe-detail.html?id=${recipe.id}'">${recipe.title}</h3>
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

async function loadAllRecipes(searchTerm = '', categoryId = '', page = 1) {
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
        image_url,
        youtube_url,
        categories (name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * recipesPerPage, page * recipesPerPage - 1);

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: recipes, error, count } = await query;

    if (error) throw error;

    recipesContainer.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
      recipesContainer.innerHTML = `
        <div class="no-recipes">
          <i class="fas fa-info-circle"></i> No recipes found
        </div>
      `;
      paginationContainer.innerHTML = '';
      return;
    }

    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';
      recipeCard.innerHTML = `
        ${recipe.youtube_url ? `
          <div class="video-thumbnail" onclick="window.location='recipe-detail.html?id=${recipe.id}'">
            <img src="https://img.youtube.com/vi/${recipe.youtube_url}/hqdefault.jpg" 
                 alt="${recipe.title}" 
                 class="recipe-image">
            <div class="play-button">
              <i class="fas fa-play"></i>
            </div>
          </div>
        ` : `
          <img src="${recipe.image_url || 'img/placeholder.jpg'}" 
               alt="${recipe.title}" 
               class="recipe-image"
               onclick="window.location='recipe-detail.html?id=${recipe.id}'"
               onerror="this.src='img/placeholder.jpg'">
        `}
        <div class="recipe-content">
          <h3 onclick="window.location='recipe-detail.html?id=${recipe.id}'">${recipe.title}</h3>
          <div class="recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.prep_time || 'N/A'} mins</span>
            <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
          </div>
          <a href="recipe-detail.html?id=${recipe.id}" class="btn btn-primary">
            View Recipe <i class="fas fa-chevron-right"></i>
          </a>
        </div>
      `;
      recipesContainer.appendChild(recipeCard);
    });

    // Setup pagination
    setupPagination(count, page, searchTerm, categoryId);

  } catch (error) {
    showError(recipesContainer, 'Failed to load recipes');
    console.error('Error loading recipes:', error);
  }
}

async function loadRecipeDetail() {
  if (!recipeDetailContainer) return;
  
  showLoading(recipeDetailContainer);
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    
    if (!recipeId) throw new Error('Recipe ID not specified');

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
      <div class="recipe-header">
        <h2>${recipe.title}</h2>
        <div class="recipe-meta">
          <span><i class="fas fa-clock"></i> ${recipe.prep_time || 'N/A'} mins</span>
          <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
          ${recipe.categories ? `<span><i class="fas fa-tag"></i> ${recipe.categories.name}</span>` : ''}
        </div>
      </div>
      
      ${recipe.youtube_url ? `
        <div class="video-container">
          <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/${recipe.youtube_url}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      ` : `
        <img src="${recipe.image_url || 'img/placeholder.jpg'}" 
             alt="${recipe.title}" 
             class="featured-image"
             onerror="this.src='img/placeholder.jpg'">
      `}
      
      <div class="recipe-body">
        <div class="recipe-description">
          <p>${recipe.description || ''}</p>
        </div>
        
        <div class="ingredients">
          <h3><i class="fas fa-list-ul"></i> Ingredients</h3>
          <ul>${recipe.ingredients.split('\n').filter(i => i.trim()).map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
        
        <div class="instructions">
          <h3><i class="fas fa-list-ol"></i> Instructions</h3>
          <ol>${recipe.instructions.split('\n').filter(i => i.trim()).map((item, i) => `<li><strong>Step ${i + 1}:</strong> ${item}</li>`).join('')}</ol>
        </div>
      </div>
      
      <div class="recipe-actions">
        <button class="btn-secondary" onclick="window.print()">
          <i class="fas fa-print"></i> Print Recipe
        </button>
        <a href="submit-recipe.html" class="btn-primary">
          <i class="fas fa-plus"></i> Share Your Own Recipe
        </a>
      </div>
    `;

    // Load similar recipes
    loadSimilarRecipes(recipe.category_id, recipe.id);

  } catch (error) {
    showError(recipeDetailContainer, error.message);
    console.error('Error loading recipe:', error);
  }
}

async function loadSimilarRecipes(categoryId, excludeId) {
  if (!similarRecipesContainer) return;
  
  showLoading(similarRecipesContainer);
  
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
      .neq('id', excludeId)
      .limit(3);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data: recipes, error } = await query;

    if (error) throw error;

    similarRecipesContainer.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
      similarRecipesContainer.innerHTML = '';
      return;
    }

    similarRecipesContainer.innerHTML = '<h3>You Might Also Like</h3>';
    
    const similarContainer = document.createElement('div');
    similarContainer.className = 'recipes-grid';
    
    recipes.forEach(recipe => {
      const recipeCard = document.createElement('div');
      recipeCard.className = 'recipe-card';
      recipeCard.innerHTML = `
        <img src="${recipe.image_url || 'img/placeholder.jpg'}" 
             alt="${recipe.title}" 
             class="recipe-image"
             onclick="window.location='recipe-detail.html?id=${recipe.id}'"
             onerror="this.src='img/placeholder.jpg'">
        <div class="recipe-content">
          <h3 onclick="window.location='recipe-detail.html?id=${recipe.id}'">${recipe.title}</h3>
          <div class="recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.prep_time || 'N/A'} mins</span>
            <span><i class="fas fa-signal"></i> ${recipe.difficulty || 'Medium'}</span>
          </div>
        </div>
      `;
      similarContainer.appendChild(recipeCard);
    });
    
    similarRecipesContainer.appendChild(similarContainer);

  } catch (error) {
    console.error('Error loading similar recipes:', error);
    similarRecipesContainer.innerHTML = '';
  }
}

// Pagination Functions
function setupPagination(totalRecipes, currentPage, searchTerm, categoryId) {
  if (!paginationContainer || !totalRecipes) return;
  
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);
  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    return;
  }

  let paginationHTML = '<div class="pagination-buttons">';
  
  // Previous button
  if (currentPage > 1) {
    paginationHTML += `
      <button onclick="loadPage(${currentPage - 1}, '${searchTerm}', '${categoryId}')">
        <i class="fas fa-chevron-left"></i> Previous
      </button>
    `;
  }

  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    paginationHTML += `
      <button onclick="loadPage(1, '${searchTerm}', '${categoryId}')">1</button>
      ${startPage > 2 ? '<span>...</span>' : ''}
    `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button ${i === currentPage ? 'class="active"' : ''} 
              onclick="loadPage(${i}, '${searchTerm}', '${categoryId}')">
        ${i}
      </button>
    `;
  }

  if (endPage < totalPages) {
    paginationHTML += `
      ${endPage < totalPages - 1 ? '<span>...</span>' : ''}
      <button onclick="loadPage(${totalPages}, '${searchTerm}', '${categoryId}')">${totalPages}</button>
    `;
  }

  // Next button
  if (currentPage < totalPages) {
    paginationHTML += `
      <button onclick="loadPage(${currentPage + 1}, '${searchTerm}', '${categoryId}')">
        Next <i class="fas fa-chevron-right"></i>
      </button>
    `;
  }

  paginationHTML += '</div>';
  paginationContainer.innerHTML = paginationHTML;
}

// Global function for pagination buttons
window.loadPage = function(page, searchTerm, categoryId) {
  currentPage = page;
  loadAllRecipes(searchTerm, categoryId, page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Category Functions
async function loadCategories() {
  // For category filter dropdown
  if (categoryFilter) {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
      });
      
      // Add event listener for category filter
      categoryFilter.addEventListener('change', () => {
        currentPage = 1;
        loadAllRecipes(searchInput.value.trim(), categoryFilter.value, currentPage);
      });
      
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
  
  // For recipe submission form
  const recipeCategory = document.getElementById('recipe-category');
  if (recipeCategory) {
    try {
      const { data: categories, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      recipeCategory.innerHTML = '<option value="">Select a category (optional)</option>';
      categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        recipeCategory.appendChild(option);
      });
      
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
}

// Stats Functions
async function loadStats() {
  try {
    // Recipe count
    const { count: recipeCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true });
    
    // User count (if you have a profiles table)
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // Video recipe count
    const { count: videoCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
      .not('youtube_url', 'is', null);
    
    if (recipeCountElement) recipeCountElement.textContent = recipeCount || '100+';
    if (userCountElement) userCountElement.textContent = userCount || '500+';
    if (videoCountElement) videoCountElement.textContent = videoCount || '50+';
    
  } catch (error) {
    console.error('Error loading stats:', error);
    if (recipeCountElement) recipeCountElement.textContent = '100+';
    if (userCountElement) userCountElement.textContent = '500+';
    if (videoCountElement) videoCountElement.textContent = '50+';
  }
}

// Recipe Submission
document.getElementById('recipe-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Get form values
  const recipe = {
    title: form.querySelector('#recipe-title').value.trim(),
    description: form.querySelector('#recipe-description').value.trim(),
    youtube_url: extractYouTubeId(form.querySelector('#recipe-youtube').value.trim()),
    image_url: form.querySelector('#recipe-image').value.trim(),
    prep_time: parseInt(form.querySelector('#recipe-prep').value),
    difficulty: form.querySelector('#recipe-difficulty').value,
    category_id: form.querySelector('#recipe-category').value || null,
    ingredients: form.querySelector('#recipe-ingredients').value.trim(),
    instructions: form.querySelector('#recipe-instructions').value.trim()
  };
  
  // Validate required fields
  if (!recipe.title || isNaN(recipe.prep_time) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Validate ingredients and instructions have content
  if (!recipe.ingredients || !recipe.instructions) {
    alert('Please provide both ingredients and instructions');
    return;
  }
  
  // Disable button during submission
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  
  try {
    const { data, error } = await supabase
      .from('recipes')
      .insert([recipe])
      .select();
    
    if (error) throw error;
    
    alert('Recipe submitted successfully! Thank you for sharing.');
    form.reset();
    
    // Redirect to the new recipe
    if (data && data[0]?.id) {
      window.location.href = `recipe-detail.html?id=${data[0].id}`;
    }
    
  } catch (error) {
    console.error('Error submitting recipe:', error);
    alert('Failed to submit recipe. Please try again.\nError: ' + error.message);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Recipe';
  }
});

// Extract YouTube ID from URL
function extractYouTubeId(url) {
  if (!url) return null;
  
  // Handle various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

// Search Functionality
searchBtn?.addEventListener('click', () => {
  currentPage = 1;
  loadAllRecipes(searchInput.value.trim(), categoryFilter.value, currentPage);
});

searchInput?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentPage = 1;
    loadAllRecipes(searchInput.value.trim(), categoryFilter.value, currentPage);
  }
});

// Newsletter Subscription
document.getElementById('newsletter-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailInput = e.target.querySelector('input');
  const email = emailInput.value.trim();
  
  if (!email) {
    alert('Please enter your email address');
    return;
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);
    
    if (error) throw error;
    
    alert('Thank you for subscribing to our newsletter!');
    emailInput.value = '';
    
  } catch (error) {
    console.error('Subscription error:', error);
    alert('Subscription failed. You may already be subscribed.');
  }
});

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  // Load content based on current page
  if (featuredRecipesContainer) loadFeaturedRecipes();
  if (recipesContainer) loadAllRecipes();
  if (recipeDetailContainer) loadRecipeDetail();
  
  // Load categories for filters and forms
  loadCategories();
  
  // Load stats for about page
  loadStats();
});
