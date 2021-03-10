//* Hey Mark! Thought I'd go over your code and do some refactoring for fun.
//* Would love to know your thoughts or anything. This is a cool portfolio app!

// variables
// const filterABV = document.getElementById("filterABV");
// const filterIBU = document.getElementById("filterIBU");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
// let optionsABV = "", optionsIBU = "", page = 1;
const urlBase = "https://api.punkapi.com/v2/beers?page=";  
const optionsState = {abv: "", ibu: ""}  


function getPageNumber(){
    return parseInt(document.getElementById("pageNumber").innerText);
}

//* For radio button event handling, we can query all forms
//* of class .filter-form and check for change.
document.querySelectorAll('.filter-form').forEach(form=>{
    form.addEventListener("change", _=>{
        getBeers();
    });
});

//* Here I took the text we were assigning to optionsABV
//* and optionsIBU, and set them to the "value" properties
//* of the actual radio buttons they correspond to.
//* This way, we can just get the value of whatever
//* radio button has been selected when we check for the
//* "change" event above.

// filters
// filterABV.addEventListener("change", e => {
//    const value = e.target.value; 
//    switch (value) {
//         case "all":
//             optionsABV = "";
//             break
//         case "weak":
//             optionsABV = "&abv_lt=4.6";
//             break
//         case "medium":
//             optionsABV = "&abv_gt=4.5&abv_lt=7.6";
//             break
//         case "strong":
//             optionsABV = "&abv_gt=7.5";
//             break
//    }
//    page = 1;
//    getBeers();
// });

// filterIBU.addEventListener("change", e => {
// });

async function getBeers(page = 1) {
    //* set pageNum to 1 by default ^

    //* no need to pass ibu and abv as params. We need them every time
    //* we call this function anyway. Better to make them local variables.
    const ibu = document.querySelector('input[name="filter-ibu"]:checked').value;
    const abv = document.querySelector('input[name="filter-abv"]:checked').value;

    //* no need for the urlbase to be global either. Only using it here.
    const scopedUrlBase = "https://api.punkapi.com/v2/beers?page=";    
    const url = scopedUrlBase + page + abv + ibu;
    // fetch
    const beerPromise = await fetch(url);
    const beers = await beerPromise.json();
    
    // pagination
    //* No need for pagetext to be variable. We only alter
    //* the innerText of #pageNumber here.
    document.getElementById("pageNumber").innerText = page;

    //* No need for the if-elses. Better to set
    //* Better to use ternary operator
    prevPage.disabled = (page === 1) ? true : false;

    nextPage.disabled = (beers.length < 25) ? true : false;
    
    // render data
    const beersDiv = document.querySelector('.beers');
    
    let beerHtml = "";
    const genericBottle = 'https://cdn.pixabay.com/photo/2014/12/22/00/04/bottle-576717_960_720.png';
    
    beers.forEach(beer => {
       beerHtml += `
        <div class='beer-wrapper card'>
            <div class='beer'>
                <img class='beer__img' src="${beer.image_url ? beer.image_url : genericBottle}">
                <h3>${beer.name}</h3>
                <span class='beer__info'>
                    <span>ABV: ${beer.abv}%</span>
                    <span>IBU: ${beer.ibu}</span>
                </span>
            </div>
            <div class='beer__content'>
                <div class='beer__name'>${beer.name}</div>
                <div class='beer__tagline'>${beer.tagline}</div>
                <div class='beer__description'>${beer.description}</div>
                <div class='beer__food-pairing'>
                    Pair with: ${beer.food_pairing.join(', ')}
                </div>
            </div>
        </div>
       `; 
    });
    
    beersDiv.innerHTML = beerHtml;
}

// pagination
prevPage.addEventListener('click', () => {
    getBeers(getPageNumber() - 1);
});
nextPage.addEventListener('click', () => {
    getBeers(getPageNumber() + 1);
});


// initial get
getBeers();