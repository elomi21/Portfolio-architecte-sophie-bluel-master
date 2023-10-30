const fetchWorks = async () => {
  let worksData = [];
  await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((worksContent) => (worksData = worksContent));

  return worksData;
};

const displayWorks = async () => {
  let works = await fetchWorks();
  let gallery = document.querySelector(".gallery");
// methode 1

  works.map((work) =>
    gallery.insertAdjacentHTML(
      "beforeend",
      `
        <figure>
        <img src=${work.imageUrl} alt="${work.title}">
        <figcaption>${work.title}</figcaption>
        </figure>
        `
    )
  );

  // methode 2
  
  // gallery.innerHTML = works.map(
  //   (work) => `
  //       <figure>
  //       <img src=${work.imageUrl} alt="${work.title}">
  //       <figcaption>${work.title}</figcaption>
  //       </figure>
  //       `
  // )
  //   .join("");// permet de concaténer ce que retourne works.map
};

displayWorks();
