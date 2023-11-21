/*------Cette partie du code est destiné à la page index en mode déconnecté qui est accessible au visiteur-----------*/

/*-Affichage de la galerie en fonction des filtres choisis-*/

let works = [];

const fetchWorks = async () => {
  const response = await fetch("http://localhost:5678/api/works");
  works = response.json();
  return works;
};

const displayWorks = (works) => {
  // fonction qui me permet d'afficher dans la div .gallery un tableau work contenant les elements categoryId/imageURL/title contenu respectivement dans les balise html figure/ img src/figcaption
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
  let Allcategories = works.map((work) => work.category.name); // on map pour récupérer seulement l'élément category.name
  let UniqCategories = [...new Set(Allcategories)]; // ...new set permet de récupérer une seule work.category.name de chaque, on évite les doublons. on dédoublonne
  let filters = document.querySelector(".filters"); // on ajoute dans la div .filters x boutons en fonction du nombre de categories trouvées
  for (let i = 0; i < UniqCategories.length; i++)
    filters.innerHTML += `<button class="filter-btn" data-categorie="${
      i + 1
    }">${UniqCategories[i]}</button>`;

  document.querySelectorAll(".filter-btn").forEach((button) => {
    //pour chaque button contenu dans la class .filter-btn  on va ajouter l'évenement suivant
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

/*-----------------------------------------------------------------*/

const navLogIn = document.querySelector(".login");
const navLogOut = document.querySelector(".logout");
const barEditionMode = document.querySelector(".edition-mode");
const header = document.querySelector("header");
const btnModif = document.querySelector(".btn-modification");

/*-------recharger la page en mode visiteur-----*/
/*cette fonction a pour but de supprimer le token lorqu'on clique sur logout ce qui recharge la page index en version visiteur*/

navLogOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

/*------------page index en mode utilisateur connecté----------*/
function isLogin() {
  const token = localStorage.getItem("token");
  if (token) {
    let filters = document.querySelector(".filters");
    filters.style.display = "none";
    /*------modif style de la page index en version connecté--------*/
    barEditionMode.style.display = "flex";
    barEditionMode.style.zIndex = "1";
    scrollBarEdition();
    header.style.margin = "38px 0px 92px 0px";
    portfolio.style.margin = "139px 0px 92px 0px";
    btnModif.style.display = "flex";
    navLogIn.style.display = "none";
    navLogOut.style.display = "flex";
  } else {
    navLogIn.style.display = "flex";
    navLogOut.style.display = "none";
  }
}
isLogin();

/*------------page Modale------------------*/

// fonction qui permet d'avoir la bar mode édition qui suit le scoll de la page
function scrollBarEdition() {
  window.addEventListener("scroll", () => {
    const positionScroll = window.scrollY;
    if (positionScroll > 24) {
      barEditionMode.style.position = "sticky";
      barEditionMode.style.top = "0";
    }
  });
}
const modalBlackPage = document.querySelector(".modal");
const modalWhiteBlock = document.querySelector(".modal-wrapper");

//---------------------Affichage MODALE--------------------

/*--fonction destiné à l'affichage de la fenêtre modale en cliquant sur MODIFIER--*/

function openModal() {
  scrollBarEdition();
  barEditionMode.style.zIndex = "1";
  modalBlackPage.style.display = "flex";
  modalWhiteBlock.style.display = "flex";
  displayModalWorks(works);
}
document.querySelector(".js-modal").addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});
//----------------------------------------------------

//-------------------fermeture MODALE--------------------

/*--fonction destiné à la fermeture de la modale en cliquant soit sur la croix soit à l'extétieur de la feneêtre modale-wrapper--*/
function closeModal() {
  scrollBarEdition();
  modalBlackPage.style.display = " none";
  modalWhiteBlock.style.display = "none";
}
// fermeture de la modale au clic sur la croix
document.getElementById("closemodal").addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});
// fermeture de la modale au clic sur la partie extérieur
modalBlackPage.addEventListener("click", (e) => {
  if (e.target === modalBlackPage) {
    // ne prend pas en compte modal-wrapper
    closeModal();
  }
});
// fermeture de la modale au clic sur la touche esc
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal();
  }
});
//---Affichage de la galerie dans la modale-----

//fonction qui me permet d'afficher dans la div .modal-gallery un tableau work contenant les elements log-trash-can/imageURL des work/title contenu respectivement dans les balise html figure/ img src du logo/img src de l'image
const displayModalWorks = (works) => {
  let modalGallery = document.querySelector(".modal-gallery");
  modalGallery.innerHTML = works
    .map(
      (work) => `
        <figure class="position-data ${work.id}">
        <img src="./assets/icons/trash-can-solid.svg" alt="logo-trash-can" class="logo-trash">
        <img src=${work.imageUrl} alt="${work.title}" class="modal-img">
        </figure>
        `
    )
    .join("");
};

//----Supression de photo de la galerie-----




const btnRemovePicture = document.querySelector(".modal-img")