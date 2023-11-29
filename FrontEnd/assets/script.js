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
         <figure class="categorie${work.categoryId}" data-id="${work.id}">
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
      //on clique sur btn cat-0 ça active la class .button-selected
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
const portfolio = document.getElementById("portfolio");
/*-------recharger la page en mode visiteur-----*/
/*cette fonction a pour but de supprimer le token lorqu'on clique sur logout ce qui recharge la page index en version visiteur*/

navLogOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

/*------------page index en mode utilisateur connecté----------*/
const token = localStorage.getItem("token");
function isLogin() {
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

// fonction qui permet d'avoir la barre "mode édition" qui suit le scoll de la page
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
const modalVisualGallery = document.querySelector(".modal-wrapper");
const modalAddPictureGallery = document.querySelector(".modal-add-picture");

//---------------------Affichage MODALE--------------------

/*--fonction destiné à l'affichage de la fenêtre modale en cliquant sur MODIFIER--*/

function openModal() {
  scrollBarEdition();
  barEditionMode.style.zIndex = "1";
  modalBlackPage.style.display = "flex";
  modalVisualGallery.style.display = "flex";
  modalAddPictureGallery.style.display = "none";
  displayModalWorks(works);
  btnAddPicture();
  backToTheModalWrapper();
  displayCategoriesSelected(works);
}
document.querySelector(".js-modal").addEventListener("click", (e) => {
  e.preventDefault();
  openModal();
});
//----------------------------------------------------
function btnAddPicture() {
  // fonction pour passer de modal-wrapper à modal-add-picture en cliquant sur le bouton "ajouter photo"
  const btnAddPicture = document.querySelector(".btn-add-photo");
  btnAddPicture.addEventListener("click", () => {
    modalVisualGallery.style.display = "none";
    modalAddPictureGallery.style.display = "flex";
  });
}
//fonction pour gérer le retour vers la modal-wrapper en cliquant sur la flêche gauche
function backToTheModalWrapper() {
  const backArrow = document.querySelector(".back-mw");
  backArrow.addEventListener("click", () => {
    modalVisualGallery.style.display = "flex";
    modalAddPictureGallery.style.display = "none";
  });
}

//-------------------fermeture MODALE--------------------

/*--fonction destiné à la fermeture de la modale en cliquant soit sur la croix soit à l'extétieur de la feneêtre modale-wrapper--*/
function closeModal() {
  scrollBarEdition();
  modalBlackPage.style.display = "none";
  modalVisualGallery.style.display = "none";
  modalAddPictureGallery.style.display = "none";
}
// fermeture de la modale au clic sur la croix
document.getElementById("closemodal1").addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});
document.getElementById("closemodal2").addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});
// fermeture de la modale au clic sur la partie extérieur
modalBlackPage.addEventListener("click", (e) => {
  if (e.target === modalBlackPage) {
    // ne prend pas en compte modal-wrapper et modal-add-picture
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
        <figure class="position-data" data-id="${work.id}">
        <img src="./assets/icons/trash-can-solid.svg" alt="logo-trash-can" class="logo-trash">
        <img src=${work.imageUrl} alt="${work.title}" class="modal-img">
        </figure>
        `
    )
    .join("");
  removePicture();
};

//----Supression de photo de la galerie-modale & gallery-----
function removePicture() {
  const btnRemovePicture = document.querySelectorAll(".logo-trash");
  btnRemovePicture.forEach((btnRemovePicture) => {
    btnRemovePicture.addEventListener("click", (e) => {
      const btnTrashClicked = e.target; // Ajout d'un évenement au clic sur les boutons trash, quand on clique on supprime le work par son id
      let id = btnTrashClicked.parentNode.dataset.id;
      fetch("http://localhost:5678/api/works/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.status === 204) {
            const figureToRemove = btnTrashClicked.parentNode;
            figureToRemove.remove();
            //comment sup un ojet spécifique d'un tableau d'objet.je veux modif work
            idToRemove = works.filter((work) => work.id !== id);
             if (idToRemove !== -1) {
               works.splice(idToRemove, 1);
               displayModalWorks(works)
             }

             // Mettre à jour la galerie modale
             displayModalWorks(works);
            console.log(works)
            let gallery = document.querySelector(".gallery");
            const galleryFigureRemove = gallery.querySelector(
              `[data-id="${id}"]`
            );
            galleryFigureRemove.remove();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
  });
}

//------------ajout de photo dans la galerie-modale & gallery ----------

//fonction qui permet de selectionner la catégorie en fonction de son nom
const displayCategoriesSelected = (works) => {
  let Allcategories = works.map((work) => work.category.name); // on map pour récupérer seulement l'élément category.name
  let UniqCategories = [...new Set(Allcategories)]; // on dédoublone pour n'avoir qu'une catégorie de chaque
  selectCategory.innerHTML = "<option></option>";
  for (let i = 0; i < UniqCategories.length; i++)
    selectCategory.innerHTML += `
  <option data-categorie="${i + 1}">${UniqCategories[i]}</option>`; // il y a autant d'élément option que d'UnqiCategories
};

const sendImageForm = document.querySelector(".form-description");
const inputForm = sendImageForm.querySelectorAll("input, select");

const inputFile = document.getElementById("file");
const inputLogo = document.querySelector(".icon-picture");
const inputTitle = document.getElementById("title-picture");
const selectCategory = document.getElementById("category-select");
const submitNewPicture = document.querySelector(".btn-validate");
const errorForm = document.querySelector(".form-error");

//fonction qui permet de vérifier que tous les input & select sont bien remplis avant de pouvoir valider le fomulaire

function formChecked() {
  if (
    inputFile.files.length > 0 &&
    inputTitle.value.length != 0 &&
    selectCategory.options.selectedIndex != 0
  ) {
    submitNewPicture.style.background = "#1D6154";
    errorForm.style.display = "none";
    return true;
  } else {
    submitNewPicture.style.background = "#A7A7A7";
    errorForm.textContent = "Veuillez remplir tous les champs";
    errorForm.style.display = "block";
    submitNewPicture.style = "disabled";
    return false;
  }
}
//ici la fonction nous permet d'afficher un aperçu de l'image chargé(avec new FileReader )  tout cachant le logo/le btn/ le texte
inputForm.forEach((input) => {
  input.addEventListener("input", (e) => {
    formChecked(); //ici l'event input permet de vérifier qu'on a bien renseigné les champs (l'event input se déclenche quand on modifie un champ input/select ref mdn)
    const inputFile = e.target;
    const imagePreview = document.getElementById("imagePreview");
    const btnAddFile = document.querySelector(".label-file");
    const infoFile = document.querySelector(".info-file");
    if (inputFile.files && inputFile.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.classList.add("picture-upload");
        btnAddFile.style.display = "none";
        infoFile.style.display = "none";
      };
      reader.readAsDataURL(inputFile.files[0]);
    }
    //faire fonction à ajouter closemodal
    imagePreview.addEventListener("dblclick", () => {
      imagePreview.src = "./assets/icons/picture-svgrepo-com 1.svg";
      imagePreview.classList.remove("picture-upload");
      btnAddFile.style.display = "block";
      infoFile.style.display = "block";
    });
  });
});

//fonction qui envoie le formulaire en faisant un fetch méthod POST
sendImageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", inputFile.files[0]);
  formData.append("title", inputTitle.value);
  formData.append("category", selectCategory.options.selectedIndex);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
});
