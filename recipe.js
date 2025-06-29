// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get recipe slug from URL query param ?slug=
function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

async function fetchRecipe(slug) {
  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching recipe:', error);
    document.getElementById('recipe-title').textContent = 'Recipe not found.';
    return null;
  }

  return data;
}

function renderList(containerId, items, ordered = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  if (!items || items.length === 0) return;

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);
  });
}

function renderNutrition(nutritionData) {
  const nutritionEl = document.getElementById('nutrition');
  if (!nutritionData) {
    nutritionEl.textContent = 'Nutritional info not available';
    return;
  }

  let nutritionObj;

  try {
    nutritionObj = typeof nutritionData === 'string' ? JSON.parse(nutritionData) : nutritionData;
  } catch (err) {
    console.error('Error parsing nutritional info JSON:', err);
    nutritionEl.textContent = 'Nutritional info not available';
    return;
  }

  const nutritionText = Object.entries(nutritionObj)
    .map(([key, val]) => `${capitalizeFirstLetter(key)}: ${val}`)
    .join(', ');

  nutritionEl.textContent = nutritionText;
}

function renderTags(tags) {
  const tagsEl = document.getElementById('tags');
  if (!tags || tags.length === 0) {
    tagsEl.textContent = 'N/A';
    return;
  }
  if (typeof tags === 'string') {
    tagsEl.textContent = tags;
  } else {
    tagsEl.textContent = tags.join(', ');
  }
}

function renderRecipe(recipe) {
  document.getElementById('recipe-title').textContent = recipe.title || 'No title';
  document.getElementById('recipe-description').textContent = recipe.description || '';

  document.getElementById('prep-time').textContent = recipe.prep_time || 'N/A';
  document.getElementById('cook-time').textContent = recipe.cook_time || 'N/A';
  document.getElementById('servings').textContent = recipe.servings || 'N/A';

  renderList('recipe-ingredients', recipe.ingredients);
  renderList('recipe-method', recipe.method, true);

  renderNutrition(recipe.nutritional_info);
  renderTags(recipe.tags);

  document.getElementById('notes').textContent = recipe.notes || 'N/A';
  document.getElementById('facts').textContent = recipe.facts || 'N/A';

  // Video iframe src
  const videoEl = document.getElementById('recipe-video');
  if (recipe.video_url) {
    videoEl.src = recipe.video_url;
  } else {
    videoEl.style.display = 'none';
  }
}

async function main() {
  const slug = getSlug();
  if (!slug) {
    document.getElementById('recipe-title').textContent = 'No recipe specified.';
    return;
  }

  const recipe = await fetchRecipe(slug);
  if (recipe) {
    renderRecipe(recipe);
  }
}

main();
