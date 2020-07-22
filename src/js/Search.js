// Imports csvtoJasonConvert.js file.
import jsonexport from "./csvtoJsonConvert.js";
// Loads synonyms.csv file from the csvFiles folder.
let synonyms = require("dsv-loader!../csvfiles/ControlledVocabulary.csv");
// imports package "Levenshtein Distance" called as "leven" to measure the difference between 2 texts.
const leven = require("leven");
// This is back part of the Image_retrieve.html file.
const markup = `
    <div class="aw">
        <h3> Image Retrieve</h3>
    </div>
  <div class="card">
        <input type="text" name="text1" placeholder="Enter the text to be searched "  id="searchbox"/>
        <button onclick="clicked()" class="searchbutton" id="idSearch">Retrieve Images from the Dataset</button>
        <button onclick="SeachPhotos()" class="searchbutton">Retrieve Images from the Web</button>
        <div id="imageRenderer">
    </div>
`; 

document.body.innerHTML = markup;

/*
 Clicked()->
    This method is used to get keywords from the serach box,
    and this function converts all keywords to lowercase.
    Checks all the space, regular expression and comapres all the input words with every word in .csv file.
*/
window.clicked = () => {
    let comparInput = "";
    let searchinput = document.getElementById("searchbox");
    let searchvalue = searchbox.value.toLowerCase().trim();
    /*
        In this conditions check the keyword are empty or not
    */
    if(searchvalue == ""){
        alert("Empty search");
        return false;
    }
    else if(searchvalue.length < 3){
        alert("Invalid search");
        return false;
    }
    // The following condition will check for outdoor classification.
    else if(searchvalue == "outdoor")
    {
        searchvalue = "sun"+" tree"+" bushes"+" cloud"+" pond"+" bbq"+ " scooter"+" bird"+ " road" + " sandbox";
        searchvalue = UnderStandingInput(searchvalue);
        comparInput = comparison(searchvalue || "");
        keyWordSearch(comparInput);
    }
    // The following condition will check for indoor classification.
    else if(searchvalue == "indoor")
    {	
        searchvalue = "door"+" window"+" painting"+" television"+" table"+" chair"+ " rat"+ " sofa" +" curtain" +" robot"+ " car"+ " pen"+ " carpet"+ " videogame"+ " horse"+ " camera"+ " train"+ " book"+" watermelon";
        searchvalue = UnderStandingInput(searchvalue);
        comparInput = comparison(searchvalue || "");
        keyWordSearch(comparInput);
    }
    else{
        searchvalue = UnderStandingInput(searchvalue);
        comparInput = comparison(searchvalue || "");
        keyWordSearch(comparInput);
    }
    resetData();
};

/*
SearchPhotos()->
    This function is called web API.
    This method retrieves images from the web. It is retrieved from "unsplash.com".
*/

window.SeachPhotos = () =>  {
    $('#imageRenderer').empty();
    let clientId = "PPwkLvLUbLBZPDEzX1Rko0yRMFf8M9s8cYIBQrMlK5w";
    let query = document.getElementById("searchbox").value;
    // below line gets the clientId and query from the user and finds images in unsplash.com.
    let url1 = "https://api.unsplash.com/search/photos/?client_id="+clientId+"&query="+query;
    // fetch url data from the website and search box.
    fetch(url1)
        // retrives data and converts it into json file.
        .then(function(data){
            return data.json();
        })
        // prints all the image data
        .then(function(data){
            console.log(data);

            data.results.forEach(photo => {
                // Retrieves all the images from the unsplash.com.
                let imageRenderer = `
                    <img src="${photo.urls.regular}">
                `;
               // Prints all the images.
               $("#imageRenderer").append(imageRenderer);
            });
        });
};
/*
UnderStandingInput()->
    This method is used to understand the input from the search box, whether it has space
    or the keyword 'or' in between words through regular Expressions.
*/

let UnderStandingInput = inputVal => {
    console.log(inputVal);
    if (/\b \b/.exec(inputVal)) {
        inputVal = inputVal.split(" ");
        console.log("true wpacing b.w letter");
    } else if (/\b or \b/.exec(inputVal)) {
        inputVal = inputVal.split("or");
    } else {
        inputVal = inputVal.split(" ");
        console.log(inputVal);
    }
    return inputVal;
};

/*
Comparison ()->
    This method is used to get keywords and compare differences between the keywords.
    It also compares "Levenshtein Distance".
*/
let comparison = stringArr => {
    if(true){
        let comparisonArray = [];
        _.forEach(synonyms, function(Obj, index) {
            let keywordArray = Obj.Keyword.split(" ");
            _.forEach(stringArr, function(stringVal) {
                _.forEach(keywordArray, function(arrVal) {
                    /* 
                        Trim function removes all the white spaces from the keywords.
                        Below two lines remove white spaces from the keywords and string.
                    */
                    arrVal = arrVal.trim();
                    stringVal = stringVal.trim();
                    if (leven(stringVal, arrVal) < 3) {
                        let compareObject = {};
                        compareObject.imageName = Obj.imageTags;
                        compareObject.leven = leven(stringVal, arrVal);
                        // Below line adds all the images into push stack (ascending) format.
                        comparisonArray.push(compareObject);
                        console.log(
                            "strinVal and arrVal",
                            stringVal,
                            arrVal,
                            leven(stringVal, arrVal),
                            Obj
                        );
                    }
                });
            });
        });
        if (comparisonArray.length > 1) {
            // sorts the values of the Levenshtein Distance
            comparisonArray = comparisonArray.sort(function(a, b) {
                return a.leven - b.leven;
            });
        }
        if (comparisonArray.length > 4) {
            comparisonArray = comparisonArray.filter(function(value) {
                return value.leven === 0;
            });
        }
        console.log("array", comparisonArray);
        return comparisonArray;  
    }
};

/*
    keyWordSearch()->
        This method finds the keyword from the .CSV files.
*/
let keyWordSearch = Arr => {
    let imageRenderer = document.getElementById("imageRenderer");
    imageRenderer.innerHTML = " ";
    for (let i = 0; i < Arr.length; i++) {
        imageRender(Arr, i);
    }
    if(Arr.length === 0){
        alert("Data not found. Please try different keyword.");
    }
};

/*
    imageRender ()->
        This method finds a path and displays all the images.
*/
let imageRender = (Arr, i) => {
    _.forEach(jsonexport, function(mainObj) {
        let match = i;
        _.forEach(Arr, function(value, index, arr) {
            let val = value.imageName;
            // The if condition below, matches all the 1 value images and increments the value by 1.
            if (mainObj[val] === "1") {
                match = match += 1;
            }
            if (match === arr.length && mainObj.appended !== true) {
                mainObj.appended = true;
                mainObj.similarity = i;
                let image1 = new Image();
                let span = document.createElement("div");
                span.innerHTML = `${mainObj.imagesNames}, Difference: ${i}`;
                //When we build the file, the first two lines will remove the last element and display all the images.
                var path = window.location.pathname.split("/");
                var strippedPath = path.slice(0, path.length-1).join("/");
                // Below line finds a path of the images/
                image1.src = `${strippedPath}/images/${mainObj.imagesNames}.png`;
                image1.name = "text1";
                span.setAttribute("class", "imagesdes");
                image1.setAttribute("class", "images");
                imageRenderer.appendChild(span);
                span.appendChild(image1);
            }
        });
    });
};

/*
    resetData ()->
       This method returns to the main function.
*/
let resetData = () => {
    _.forEach(jsonexport, function(mainObj) {
        mainObj.appended = false;
    });
};
