const supabaseUrl = 'https://hyzwpjxcfuuqipyozhvh.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5endwanhjZnV1cWlweW96aHZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MDAyOTYsImV4cCI6MjA2NTk3NjI5Nn0.1Z88yKnjP8_rY23C5qyt_gQIK5Obb6VAzaUMycts1eo'; // Replace with your anon key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

function getRecipeId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function loadRecipe() {
  const id = getRecipeId();
  if (!id) {
    alert('Recipe ID not found in URL.');
    return;
  }

  const { data, error } = await supabase.from('recipes').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching recipe:', error);
    document.getElementById('recipe-title').innerText = 'Recipe not found';
    return;
  }

  document.getElementById('recipe-title').innerText = data.title;
  document.getElementById('recipe-subtitle').innerText = data.subtitle || '';

  // Insert video
  const videoWrapper = document.querySelector('.video-wrapper');
  videoWrapper.innerHTML = `<iframe src="${data.video_url}" frameborder="0" allowfullscreen></iframe>`;

  // Populate ingredients
  const ingredientsList = document.getElementById('ingredients-list');
  ingredientsList.innerHTML = '';
  if (data.ingredients && data.ingredients.length > 0) {
    data.ingredients.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ingredientsList.appendChild(li);
    });
  }

  // Populate method
  const methodList = document.getElementById('method-list');
  methodList.innerHTML = '';
  if (data.method && data.method.length > 0) {
    data.method.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      methodList.appendChild(li);
    });
  }
}

window.addEventListener('DOMContentLoaded', loadRecipe);
