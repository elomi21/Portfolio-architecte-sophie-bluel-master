let worksData = []; 
const fetchWorks = async () => {
    await fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(worksContent => worksData = worksContent)

    console.log(worksData);
}

fetchWorks();