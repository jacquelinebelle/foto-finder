var add = document.querySelector('.add-btn');
add.disabled = true;
var view = document.querySelector('.view-btn');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var inputs = document.querySelectorAll('.foto-inputs');
var fileInput = document.querySelector('.file');
var favNum = document.querySelector('.view-number');
var currentFavNum = 0;
var fotoGallery = document.querySelector('.fotos');
var fotosArr = JSON.parse(localStorage.getItem('stringFotos')) || [];
var reader = new FileReader();
// var fotosArr = [];

// 1. docs for ls (practice in the console)
// 2. create your source of truth for photos
  // make sure that there is ALWAYS sth in ls
// 2.5 update the loadFotos to load fotos from ls
// 3. saveToStorage
// 4. hook up the remove button (swap fotosArr for "photos" collection in localstorage)
// 

// we want to save ALL photos in ls under key "photos"
        // at the beginning of the program
        // if ls "photos" DOES NOT exist, create it ([])

// does the "photos" exist in LS? 
  // yes:
  // no: 

// var file = document.querySelector('input[type=file]').files[0];

window.onload = loadFotos(fotosArr);
window.onload = noFotos();
add.addEventListener('click', readFoto);
fotoGallery.addEventListener('click', clickHandler);
fotoGallery.addEventListener('focusout', editFotos);
titleInput.addEventListener('keyup', disableButton);
captionInput.addEventListener('keyup', disableButton);
fileInput.addEventListener('change', disableButton);

function loadFotos(array) {
  // refactor to .map()
  // assumption: get your photos arr from LS
  // "photos" variable should come from localstorage
  fotosArr = [];
  array.forEach(function (foto) {
    var newFoto = new Foto(foto.id, foto.title, foto.caption, foto.file, foto.favorite);
    fotosArr.push(newFoto);
    displayFoto(newFoto);
  });
}

function saveFoto(e) {
  e.preventDefault();
  var id = Date.now();
  var title = titleInput.value;
  var caption = captionInput.value;
  var file = e.target.result; 
  var newFoto = new Foto(id, title, caption, file);
  fotosArr.push(newFoto);
  newFoto.saveToStorage();
  displayFoto(newFoto);
  clearFotoFields();
}

function clearFotoFields() {
  titleInput.value = '';
  captionInput.value = '';
}

function displayFoto(fotoObj) {
  // fotoCard = utils.fotoTemplate(fotoObj);
  var fotoCard =  
    `<section class="foto-card" data-id="${fotoObj.id}">
        <h3 class="foto-title" contenteditable="true">${fotoObj.title}</h3>
        <img class="foto" src=${fotoObj.file} />
        <h3 class="foto-caption" contenteditable="true">${fotoObj.caption}</h3>
        <div class="favorite-section">
          <input type="image" src="assets/delete.svg" class="foto-btn" id="delete" alt="Delete">
          ${fotoObj.favorite}<input type="image" src="assets/favorite.svg" class="foto-btn favorite" id="favorite" alt="Favorite">
          <input type="image" src="assets/favorite-active.svg" class="foto-btn favorite hidden" id="favorite-active" alt="Favorite">
        </div>
      </section>`
  fotoGallery.insertAdjacentHTML('afterbegin', fotoCard);
}


function readFoto(e) {
  e.preventDefault();
  if (fileInput.files[0]) {
    reader.readAsDataURL(fileInput.files[0]); 
    reader.onload = saveFoto;
  }
  document.location.reload()
}

function clickHandler(e) {
  // switch/case statement: checking the same thing, act on diff values
  if(e.target.id === 'delete') {
    deleteFoto(e);
  }
  else if (e.target.id === 'favorite') {
    favoriteFoto(e);
  }
}

function deleteFoto(e) {
  var fotoCard = e.target.closest('.foto-card');
  var fotoId = parseInt(fotoCard.dataset.id);
  fotoCard.remove();
  var selectFoto = findFoto(fotoId)
  selectFoto.deleteFromStorage();
  document.location.reload()
}

function findFoto(fotoId) {
  return fotosArr.find(function(foto) {
    return foto.id === fotoId
  });
}

function remove() {
  fotoGallery.innerHTML = '';
}

function editFotos(e) {
  var fotoCard = e.target.closest('.foto-card');
  var fotoId = parseInt(fotoCard.dataset.id);
  var fotoTitle = fotoCard.firstChild.nextSibling;
  var editTitle = fotoTitle.innerText;
  // var fotoFile = fotoCard.firstChild.nextSibling.nextSibling.nextSibling;
  var fotoCaption = fotoCard.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
  var editCaption = fotoCaption.innerText;
  var selectFoto = findFoto(fotoId);
  selectFoto.updateFoto(editTitle, editCaption);
}

function favoriteFoto(e) {
  var fotoCard = e.target.closest('.foto-card');
  var fotoId = parseInt(fotoCard.dataset.id);
  var selectFoto = findFoto(fotoId);
  selectFoto.updateFavorite();
  changeHeart(e, selectFoto);
  if (selectFoto.favorite) {
    currentFavNum++;
  } else {
    currentFavNum--;
  }

  // keep currentFavNum in LS
  // state to persist should be in LS
  console.log('currentFavNum:', currentFavNum)
}

function favoriteNumber() {
  favNum.innerText = currentFavNum;
}

function changeHeart(e, selectFoto) {
  var favorite = e.target;
  var favoriteActive = e.target.nextSibling.nextSibling;
  if (selectFoto.favorite) {
    favorite.classList.add('hidden');
    favoriteActive.classList.remove('hidden');
  } else {
    favorite.classList.remove('hidden');
    favoriteActive.classList.add('hidden');
  }
}

function disableButton() {
    if (!titleInput.value || !captionInput.value || !fileInput.value) {
      add.disabled = true;
    } else {
     add.disabled = false;
    }
};

function noFotos() {
  if (!fotosArr.length) {
    document.querySelector('.none').classList.remove('hidden');
  } else {
    document.querySelector('.none').classList.add('hidden');
  }
}
  

// function disableButton(button) {
//   console.log('disabled');
//   button.disabled = true;
// }

// function enableButton(button) {
//   button.disabled = false;
// }

// function addPhoto(fotoObj) {
//   var id = Date.now();
//   var title = titleInput.value;
//   var caption = captionInput.value;
//   var file = fotoObj.target.result; 
//   var newFoto = new Foto(id, title, caption, file);
//   fotoGallery.innerHTML += `<section class="foto-card" data-id="${fotoObj.id}">
//           <h3 class="foto-title" contenteditable="true">${fotoObj.title}</h3>
//           <h4 class="foto-caption" contenteditable="true">${fotoObj.caption}</h4>
//           <img src=${fotoObj.file} />
//           <div class="favorite-section">
//             <input type="image" src="assets/delete.svg" class="foto-btn" id="delete" alt="Delete">
//             <input type="image" src="assets/favorite.svg" class="foto-btn favorite" id="favorite" alt="Favorite">
//           </div>
//         </section>`;
//   fotosArr.push(newFoto)
//   newFoto.saveToStorage(fotosArr)
// }