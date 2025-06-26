// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // replace with your actual anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

// Get elements from the page
const titleEl = document.getElementById('recipe-title');
const descEl = document.getElementById('recipe-description');
const prepTimeEl = document.getElementById('prep-time');
const cookTimeEl = document.getElementById('cook-time');
const servingsEl = document.getElementById('servings');
const tagsEl = document.getElementById('tags');
const ingredientsList = document.getElementById('recipe-ingredients');
const methodList = document.getElementById('recipe-method');
const notesEl = document.getElementById('notes');
const nutritionEl = document.getElementById('nutrition');
const factsEl = document.getElementById('facts');
const videoFrame = document.getElementById('recipe-video');
const facebookBtn = document.getElementById('share-facebook');
const twitterBtn = document.getElementById('share-twitter');

// Load recipe by slug
async function loadRecipe() {
  if (!slug) {
    titleEl.textContent = 'No recipe specified.';
    return;
  }

  const { data, error } = await supabase
    .from('recipe_db')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    titleEl.textContent = 'Recipe not found.';
    console.error(error);
    return;
  }

  // Populate recipe data
  titleEl.textContent = data.title || '';
  descEl.textContent = data.description || '';
  prepTimeEl.textContent = data.prep_time || '';
  cookTimeEl.textContent = data.cook_time || '';
  servingsEl.textContent = data.servings || '';
  tagsEl.textContent = (data.tags || []).join(', ');
  notesEl.textContent = data.notes || '';
  nutritionEl.textContent = data.nutritional_info || '';
  factsEl.textContent = data.facts || '';
  videoFrame.src = data.video_url || '';

  // Ingredients
  ingredientsList.innerHTML = '';
  if (Array.isArray(data.ingredients)) {
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  }

  // Method
  methodList.innerHTML = '';
  if (Array.isArray(data.method)) {
    data.method.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      methodList.appendChild(li);
    });
  }

  // Social share buttons
  const pageURL = window.location.href;
  facebookBtn.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageURL)}`;
  twitterBtn.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageURL)}&text=${encodeURIComponent(data.title)}`;
}

loadRecipe();
