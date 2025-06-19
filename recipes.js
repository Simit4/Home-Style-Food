// Load all recipes into recipes.html
if (document.getElementById("recipes-list")) {
  fetch('recipes.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("recipes-list");
      data.forEach(recipe => {
        container.innerHTML += `
          <div class="recipe-card">
            <iframe src="${recipe.video}" allowfullscreen></iframe>
            <h3>${recipe.title}</h3>
            <a class="btn-secondary" href="recipe.html?id=${recipe.id}">View Recipe</a>
          </div>
        `;
      });
    });
}

// Load single recipe into recipe.html
if (document.getElementById("recipe-details")) {
  const urlParams = new URLSearchParams(window.location.search);
  const recipeId = urlParams.get("id");

  fetch('recipes.json')
    .then(res => res.json())
    .then(data => {
      const recipe = data.find(r => r.id === recipeId);
      if (!recipe) {
        document.getElementById("recipe-details").innerHTML = "<p>Recipe not found.</p>";
        return;
      }

      const container = document.getElementById("recipe-details");
      container.innerHTML = `
        <h2>${recipe.title}</h2>
        <div class="video-wrapper">
          <iframe src="${recipe.video}" width="100%" height="400" allowfullscreen></iframe>
        </div>
        <section class="ingredients-method">
          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul>${recipe.ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <div class="method">
            <h3>Method</h3>
            <ol>${recipe.method.map(step => `<li>${step}</li>`).join('')}</ol>
          </div>
        </section>
      `;
    });
}
