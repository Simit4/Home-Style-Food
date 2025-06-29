// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get slug from URL
const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

// Load recipe
async function loadRecipe() {
  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    document.getElementById('recipe-title').textContent = 'Recipe not found!';
    return;
  }

  renderRecipe(data);
}

// Render recipe details
function renderRecipe(recipe) {
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-description').textContent = recipe.description;
  document.getElementById('prep-time').textContent = recipe.prep_time || 'N/A';
  document.getElementById('cook-time').textContent = recipe.cook_time || 'N/A';
  document.getElementById('servings').textContent = recipe.servings || 'N/A';

  // Ingredients
  const ingredientsList = document.getElementById('recipe-ingredients');
  ingredientsList.innerHTML = '';
  (recipe.ingredients || []).forEach(ingredient => {
    const li = document.createElement('li');
    li.textContent = ingredient;
    ingredientsList.appendChild(li);
  });

  // Method
  const methodList = document.getElementById('recipe-method');
  methodList.innerHTML = '';
  (recipe.method || []).forEach(step => {
    const li = document.createElement('li');
    li.textContent = step;
    methodList.appendChild(li);
  });

  // Nutrition
  renderNutrition(recipe.nutritional_info);

  // Tags, cuisine, category
  renderTags(recipe.tags);
  renderCuisine(recipe.cuisine);
  renderCategory(recipe.category);

  // Notes & Facts
  document.getElementById('notes').textContent = recipe.notes || 'N/A';
  document.getElementById('facts').textContent = recipe.facts || 'N/A';

  // Video
  const videoEl = document.getElementById('recipe-video');
  if (recipe.video_url) {
    videoEl.src = recipe.video_url;
  } else {
    videoEl.style.display = 'none';
  }
}

// Render nutritional info
function renderNutrition(nutritionData) {
  const nutritionEl = document.getElementById('nutrition');
  if (!nutritionData || typeof nutritionData !== 'object') {
    nutritionEl.textContent = 'N/A';
    return;
  }

  const entries = Object.entries(nutritionData)
    .map(([key, value]) => `${capitalize(key)}: ${value}`)
    .join(', ');
  nutritionEl.textContent = entries;
}

// Render tags
function renderTags(tags) {
  const tagsEl = document.getElementById('tags');
  tagsEl.innerHTML = '';

  if (!tags || tags.length === 0) {
    tagsEl.textContent = 'N/A';
    return;
  }

  if (typeof tags === 'string') {
    tags = tags.split(',').map(t => t.trim());
  }

  tags.forEach(tag => {
    const span = document.createElement('span');
    span.className = 'tag-badge';
    span.textContent = tag;
    tagsEl.appendChild(span);
  });
}

// Cuisine & category
function renderCuisine(cuisine) {
  const el = document.getElementById('cuisine');
  el.textContent = cuisine || 'N/A';
}

function renderCategory(category) {
  const el = document.getElementById('category');
  el.textContent = category || 'N/A';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load recipe on page load
loadRecipe();
