/*------partie du code destiné à la page index en mode déconnecté, accessible au visiteur-----------*/

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

//On affiche seulements les boutons de filtre catégories selon les images présentes dans la galerie
const displayCategories = (works) => {
  let getCategories = fetchCategories();
  let filters = document.querySelector(".filters");
  //on map pour ne récupérer que les work.categoryID
  let worksCategoriesId = works.map((work) => work.categoryId); 
  //ensuite on gére la promise de fechCategories
  getCategories.then((response) => {
    //On vérifie chaques catégories et test si la catégorie est inclus dans worksCategoriesId (la représentation de la gallery)
    response.forEach((categorie) => {
      if (worksCategoriesId.includes(categorie.id)) {
        // on ajoute dans la div .filters x boutons en fonction du nombre de categories qui existe.
        filters.innerHTML += `<button class="filter-btn" data-categorie="${categorie.id}">${categorie.name}</button>`
      }
    });
    document.querySelectorAll(".filter-btn").forEach((button) => {
      //pour chaque button contenu dans la class .filter-btn  on va ajouter l'évenement suivant
      button.addEventListener("click", (e) => {
        const btnClicked = e.target; // Ajout d'un évenement au clic sur les boutons
        let categorieClicked = btnClicked.dataset.categorie;
        const ancienBtnSelected = document.querySelector(".button-selected");
        ancienBtnSelected.classList.remove("button-selected");
        btnClicked.classList.add("button-selected");
        //on clique sur btn cat-0 ça active la class .button-selected
        //si on clic sur btn cat-1 on active .button-selected mais on retire(remove).button-selected du btn-0

        //filtrer les images en fonction du bouton cliqué
        let filteredWorks = []; // tableau qui va contenir les work.categoryId correspond à la category(le bouton cliqué)
        filteredWorks = works.filter(function (work) {
          // si le bouton cliqué(ayant une data-categorie > 0)  est != de o alors
          return work.categoryId == categorieClicked; // on affiche les work dont la categoryId 1-2 ou 3 correspond au bouton cliqué ayant pour categorie 1-2ou 3
        });
        if (categorieClicked !== "0") {
          displayWorks(filteredWorks);
        } else {
          displayWorks(works);
        }
      });
    });
  });
};

//permet d'afficher la gallery et les filtres
const showGalleryByfilters = async () => {
  works = await fetchWorks();
  displayWorks(works);
  displayCategories(works);
};
showGalleryByfilters();


/*-----------------------------------------------------------------*/

const navLogIn = document.querySelector(".login");
const navLogOut = document.querySelector(".logout");
const barEditionMode = document.querySelector(".edition-mode");
const header = document.querySelector("header");
const btnModif = document.querySelector(".btn-modification");
const portfolio = document.getElementById("portfolio");
/*-------recharger la page en mode visiteur-----*/

/*fonction qui supprime le token au clic sur logout ce qui recharge la page index en version visiteur*/
navLogOut.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});

/*------------page index en mode utilisateur connecté----------*/
// quand connecté disparition des filtres + ajout du btn MODIFIER + quelques modif de style

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
  displayCategoriesSelected(categories);
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
    resetImagePreview();
    resetFormField();
  });
}

//-------------------fermeture MODALE--------------------

/*--fonction destiné à la fermeture de la modale en cliquant soit sur la croix soit à l'extétieur de la feneêtre modale-wrapper--*/
function closeModal() {
  scrollBarEdition();
  modalBlackPage.style.display = "none";
  modalVisualGallery.style.display = "none";
  modalAddPictureGallery.style.display = "none";
  resetImagePreview();
  resetFormField();
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
          if (response.status === 204) {
            // mise à jour de la modal-gallery
            //suppression de l'image dans index.html
            const figureToRemove = btnTrashClicked.parentNode;
            figureToRemove.remove();
            //fonction qui permet de supprimer l'image par son work.id de l'api, si elle est trouvé
            works = works.filter((work) => work.id != id);
            displayModalWorks(works);
            // Mise à jour de la gallery
            displayWorks(works);
          } else {
            errorMessageModal(
              "Erreur lors de la suppression de l'image.Veuillez réessayer"
            );
          }
        })
        .catch((error) => {
          console.error(error);
          errorMessageModal("une erreur est survenue. Veuillez réessayer");
        });
    });
  });
}
// fonction pour afficher un message d'erreur dans la modal-wrapper
const errorMessageModalW = document.querySelector(".msg-error-m");
function errorMessageModal(txtError) {
  errorMessageModalW.style.display = "block";
  errorMessageModalW.textContent = txtError;
  setInterval(() => {
    errorMessageModalW.style.display = "none";
    errorMessageModalW.textContent = "";
  }, 5000);
}

//---ajout de photo dans la galerie-modale & gallery ----------

//fonction qui permet de selectionner la catégorie en fonction de son nom

const fetchCategories = async () => {
  const response = await fetch("http://localhost:5678/api/categories");
  categories = await response.json();
  return categories;
};

let categories = [];
fetchCategories();

const displayCategoriesSelected = (categories) => {
  let selectCategorie = document.getElementById("category-select");
  selectCategorie.innerHTML = "<option></option>";
  selectCategorie.innerHTML += categories
    .map((categorie) => {
      return `
      <option data-categorie="${categorie.id + 1}">${categorie.name}</option>`;
    })
    .join("");
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

const imagePreview = document.getElementById("imagePreview");
const btnAddFile = document.querySelector(".label-file");
const infoFile = document.querySelector(".info-file");
//ici la fonction nous permet d'afficher un aperçu de l'image chargé(avec new FileReader)  tout en cachant le logo/le btn/ le texte
inputForm.forEach((input) => {
  input.addEventListener("input", (e) => {
    formChecked(); //ici l'event input permet de vérifier qu'on a bien renseigné les champs (l'event input se déclenche quand on modifie un champ input/select ref mdn)
    const inputFile = e.target;
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
    imagePreview.addEventListener("dblclick", () => {
      resetImagePreview();
      resetFormField();
      errorForm.textContent = "";
    });
  });
});

//fonction qui réinitialise le visuel de la blue-frame
function resetImagePreview() {
  imagePreview.src = "./assets/icons/picture-svgrepo-com 1.svg";
  imagePreview.classList.remove("picture-upload");
  btnAddFile.style.display = "block";
  infoFile.style.display = "block";
}
//fonction qui réinitialise les input du form
function resetFormField() {
  inputForm.forEach((input) => {
    input.value = "";
  });
}
const formValidate = document.querySelector(".form-validate");
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
  })
    .then((response) => {
      if (response.status === 201) {
        response.json().then((work) => {
          works.push(work);
          displayModalWorks(works);
          displayWorks(works);
          resetImagePreview();
          resetFormField();
          formValidate.style.display = "block";
          formValidate.textContent = "L'image a bien été ajoutée";
          setInterval(() => {
            formValidate.style.display = "none";
          }, 3000);
        });
      } else {
        formValidate.style.display = "block";
        formValidate.textContent =
          "Erreur lors de l'ajout de l'image.Veuillez réessayer";
        setInterval(() => {
          formValidate.style.display = "none";
        }, 5000);
      }
    })
    .catch((error) => {
      console.error(error);
      errorMessageModal("une erreur est survenue. Veuillez réessayer");
      setInterval(() => {
        formValidate.style.display = "none";
      }, 5000);
    });
});
