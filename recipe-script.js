const supabaseUrl = 'https://your-project-id.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'your-anon-key'; // Replace with your anon key
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
