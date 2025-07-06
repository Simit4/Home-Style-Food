

async function loadFeaturedRecipes() {
  const { data: recipes, error } = await supabase
    .from('recipe_db')
    .select('*')
    .limit(3)
    .order('created_at', { ascending: false });

  if (error) return console.error(error);

  const container = document.getElementById('featured-recipes-container');
  container.innerHTML = '';

  recipes.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');

    const thumb = recipe.thumbnail_url || 'fallback.jpg';
    const videoId = recipe.video_url?.match(/v=([^&]+)/)?.[1];
    const imgSrc = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : thumb;

    card.innerHTML = `
      <img src="${imgSrc}" class="recipe-thumb" alt="${recipe.title}">
      <div class="recipe-content">
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <a href="recipe.html?slug=${recipe.slug}" class="view-btn">View Recipe</a>
      </div>
    `;
    container.appendChild(card);
  });
}

loadFeaturedRecipes();
