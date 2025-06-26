// recipe.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://ozdwocrbrojtyogolqxn.supabase.co'; // your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZHdvY3Jicm9qdHlvZ29scXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NzE5MzMsImV4cCI6MjA2NjE0NzkzM30.-MAiUtrdza-T2q8POxY-ZcZuZr5QYzFYq5yd-bVYzRQ'; // replace with your actual anon key



const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const urlParams = new URLSearchParams(window.location.search);
const slug = urlParams.get('slug');

const titleEl = document.getElementById('recipe-title');
const descEl = document.getElementById('recipe-description');
const ingredientsList = document.getElementById('recipe-ingredients');
const methodList = document.getElementById('recipe-method');
const videoFrame = document.getElementById('recipe-video');
const prepTimeEl = document.getElementById('prep-time');
const cookTimeEl = document.getElementById('cook-time');
const servingsEl = document.getElementById('servings');
const nutritionEl = document.getElementById('nutrition');
const tagsEl = document.getElementById('tags');
const notesEl = document.getElementById('notes');
const factsEl = document.getElementById('facts');

const shareFb = document.getElementById('share-fb');
const shareX = document.getElementById('share-x');
const shareWhatsapp = document.getElementById('share-whatsapp');

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

  if (error) {
    titleEl.textContent = 'Recipe not found.';
    console.error(error);
    return;
  }

  // Title & description
  titleEl.textContent = data.title;
  descEl.textContent = data.description || '';

  // Prep, cook time, servings
  prepTimeEl.textContent = data.prep_time || 'N/A';
  cookTimeEl.textContent = data.cook_time || 'N/A';
  servingsEl.textContent = data.servings || 'N/A';

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

  // Nutrition info
  nutritionEl.textContent = data.nutritional_info || 'Not available';

  // Tags / Category / Cuisine
  if (Array.isArray(data.tags)) {
    tagsEl.textContent = data.tags.join(', ');
  } else {
    tagsEl.textContent = data.tags || 'N/A';
  }

  // Notes / Tips
  notesEl.textContent = data.notes || 'N/A';

  // Facts
  factsEl.textContent = data.facts || 'N/A';

  // Video
  videoFrame.src = data.video_url || '';
  videoFrame.title = data.title;

  // Setup share buttons
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(data.title);

  shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  shareX.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
  shareWhatsapp.href = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
}

loadRecipe();

