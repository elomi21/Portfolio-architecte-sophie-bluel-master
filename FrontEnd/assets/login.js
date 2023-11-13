//--------page connexion--------//

const fetchLogin = async (data) => {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  return response.json();
};

//ajout d'un event listener sur l'événement submit de la balise form.il se déclenche losque le formulaire est validé.
const formLogin = document.querySelector(".form-login");
formLogin.addEventListener("submit", function (submitedForm) {
  submitedForm.preventDefault(); //évite de recharger la page dans un nouvel onglet

  // création de l'objet de la connexion
  const login = {
    email: submitedForm.target.querySelector("[name=email]").value,
    password: submitedForm.target.querySelector("[name=password]").value,
  };

  // conversion de l'objet login en chaine de caractère au format jSON
  const playLoad = JSON.stringify(login);
  console.log(playLoad);

  // Appel de la fonction fetch
  let getFetch = fetchLogin(playLoad);
  getFetch.then(function (promise) {
    console.log(promise);
  });
});
