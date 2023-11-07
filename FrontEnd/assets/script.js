// Déclarration des fonctions - START
const fetchWorks = async () => {
  let worksData = [];
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((worksContent) => (worksData = worksContent));
  return worksData;
};

const displayWorks = async () => {
  let works = await fetchWorks(); //Récupérer les works
  let gallery = document.querySelector(".gallery");
  displayFilter();

  gallery.innerHTML = works
    .map(
      (work) => `
    <figure class="categorie${work.categoryId}">
    <img src=${work.imageUrl} alt="${work.title}">
    <figcaption>${work.title}</figcaption>
    </figure>
    `
    )
    .join(""); // permet de concaténer ce que retourne works.map
};

const displayFilter = async () => {
  let works = await fetchWorks(); //Récupérer les works
  let filters = document.querySelector(".filters");
  let categories = works.map((work) => work.category.name); //Récupérer seulement les names de toutes les catégories des works
  let UniqCategories = [...new Set(categories)]; //Dédoublonner les catégories pour ne garder seulement une catégorie dans le tableau UniqCategories : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Set#d%C3%A9doublonner_un_tableau

  for (let i = 0; i < UniqCategories.length; i++) {
    const category = UniqCategories[i];
    filters.innerHTML += `
    <button class="filter-btn" id="categorie${i + 1}">${category}</button>    
    `; //i+1 pour attribuer le bon id de la catégorie puisque catégorie.id = 0 n'existe pas
  }
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnClicked = e.target;
      const category = btnClicked.id;
      document.querySelectorAll(".filter-btn").forEach((selected) => {
        selected.classList.remove("button-selected");
      });
      btnClicked.classList.toggle("button-selected");
      filterListFigure(category, btnClicked);

      //Filtrer toutes les figure et afficher seulement les catégories "categorie1"
      //Récupérer toutes les figure dans le DOM
      //Utiliser une méthode pour filtrer : seulement les figure ayant pour class "categorie1"
      //Cacher les figure : element.style.display = "none" // Les afficher : element.style.display = ""
    });
  });
};

const filterListFigure = (categorie) => {
  let allFigures = document.querySelectorAll(".gallery > figure");
  for (let i = 0; i < allFigures.length; i++) {
    const figure = allFigures[i];
    const figureCategorie = figure.className;
    figure.style.display = "";

    if (figureCategorie !== categorie && categorie !== "categorie-tous") {
      figure.style.display = "none";
    } else {
      figure.style.display = "";
    }
  }
};

// Déclarration des fonctions - END
// Début du code
displayWorks();
