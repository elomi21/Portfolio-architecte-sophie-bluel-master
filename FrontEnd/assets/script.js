let works = [];

const fetchWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  works = response.json();
  return works;
};

const displayWorks = (works) => { // fonction qui me permet d'afficher dans la div .gallery un tableau work contenant les elements categoryId/imageURL/title contenu respectivement dans les balise html figure/ img src/figcaption
  let gallery = document.querySelector(".gallery");
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

//définir le nom de chaque filtre en récupérant dans works les category.name new set = garder 1 exemplaire de chaque category
const displayCategories = (works) => {
  let Allcategories = works.map((work) => work.category.name);// on map pour récupérer seulement l'élément category.name
  let UniqCategories = [...new Set(Allcategories)]; // ...new set permet de récupérer une seule work.category.name de chaque, on évite les doublons. on dédoublonne
  let filters = document.querySelector(".filters");// on ajoute dans la div .filters x boutons en fonction du nombre de categories trouvées
  for (let i = 0; i < UniqCategories.length; i++)
    filters.innerHTML += `<button class="filter-btn" data-categorie="${
      i + 1
    }">${UniqCategories[i]}</button>`;

  document.querySelectorAll(".filter-btn").forEach((button) => {//pour chaque button contenu dans la class .filter-btn  on va ajouter l'évenement suivant
    button.addEventListener("click", (e) => {
      const btnClicked = e.target; // Ajout d'un évenement au clic sur les boutons
      let category = btnClicked.dataset.categorie; 
      const ancienBtnSelected = document.querySelector(".button-selected");
      ancienBtnSelected.classList.remove("button-selected");
      btnClicked.classList.add("button-selected");
      //on clic sur btn cat-0 ça active la class .button-selected 
      //si on clic sur btn cat-1 on active .button-selected mais on retire(remove).button-selected du btn-0


      //filtrer les images en fonction du bouton cliqué
      let filteredWorks = []; // tableau qui va contenir les work.categoryId correspond à la category(le bouton cliqué) 

      filteredWorks = works.filter(function (work) {
        if (category !== "0") {
          // si le bouton cliqué(ayant une data-categorie > 0)  est != de o alors
          return work.categoryId == category; // on affiche les work dont la categoryId 1-2 ou 3 correspond au bouton cliqué ayant pour categorie 1-2ou 3
        } else {
          return work; // autrement affiche toutes les work
        }
      });
      displayWorks(filteredWorks);
      console.log(filteredWorks)
    });
  });
};

const showGalleryByfilters = async () => {
  works = await fetchWorks();
  displayWorks(works);
  displayCategories(works);
};
showGalleryByfilters();
// cette fonction me permet de récupérer
// l'ensemble des fonctions précedentes  
// je les applique en appelant la fonction showGalleryByfilters();
