//--------page connexion--------//

const fetchLogin = async (playLoad) => {
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: playLoad,
  });
  return response;
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

  // Appel de la fonction fetch
  fetchLogin(playLoad).then((response) => {
    response.json().then((userInfos) => {
      const userToken = userInfos.token;
      const errorMessage = document.querySelector(".error-message");

      if (response.status === 200 && userToken != null) {
        window.localStorage.setItem("token", userToken); //permet de stocker le token dans la mémoire du navigateur.
        window.location.href = "./index.html"; // redirection vers la page d'accueil
        
      } else {
        errorMessage.textContent =
          "Votre adresse e-mail ou votre mot de passe sont erronés ou ne sont pas enregistrés";
        errorMessage.style.display = "block";
      } 
    });
  });
});
