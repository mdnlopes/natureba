const apiKey = '722709531ba54d52bbd487ee2d56a5c8';
const apiUrl = `https://api.spoonacular.com/recipes/extract?apiKey=${apiKey}&url=`;

const form = document.querySelector('form');
const inputUrl = document.querySelector('#url');
const resultContainer = document.querySelector('#result');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = inputUrl.value;
  resultContainer.innerHTML = '<p>Gerando receita...</p>';

  fetch(apiUrl + url)
    .then(response => response.json())
    .then(data => {
      let recipe = data;

      recipe.extendedIngredients.forEach(ingredient => {
        if (ingredient.name.includes('leite') || ingredient.name.includes('Lactose')) {
          ingredient.name = 'leite de coco';
        }
        if (ingredient.name.includes('trigo') || ingredient.name.includes('glúten')) {
          ingredient.name = 'arroz integral';
        }
        if (ingredient.name.includes('carne') || ingredient.name.includes('ovos') || ingredient.name.includes('peixe') || ingredient.name.includes('frango') || ingredient.name.includes('porco') || ingredient.name.includes('bacon') || ingredient.name.includes('linguiça') || ingredient.name.includes('presunto') || ingredient.name.includes('salame')) {
          ingredient.name = 'tofu';
        }
      });

      let recipeInstructions = recipe.analyzedInstructions[0].steps;
      let newInstructions = [];

      recipeInstructions.forEach(step => {
        let newStep = step.step;
        recipe.extendedIngredients.forEach(ingredient => {
          if (newStep.includes(ingredient.original)) {
            newStep = newStep.replace(ingredient.original, ingredient.name);
          }
        });
        newInstructions.push(newStep);
      });

      recipe.analyzedInstructions[0].steps = newInstructions;

      let resultHtml = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image}" alt="${recipe.title}">
        <h3>Ingredientes:</h3>
        <ul>
      `;

      recipe.extendedIngredients.forEach(ingredient => {
        resultHtml += `<li>${ingredient.name}</li>`;
      });

      resultHtml += `
        </ul>
        <h3>Modo de Preparo:</h3>
        <ol>
      `;

      recipe.analyzedInstructions[0].steps.forEach(step => {
        resultHtml += `<li>${step}</li>`;
      });

      resultHtml += `</ol>`;

      resultContainer.innerHTML = resultHtml;
    })
    .catch(error => {
      resultContainer.innerHTML = `<p>Ocorreu um erro: ${error}</p>`;
    });
});