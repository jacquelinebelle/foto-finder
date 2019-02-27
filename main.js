var searchInput = document.querySelector('#search');
var searchBtn = document.querySelector('#search-btn');
var titleInput = document.querySelector('#title-input');
var captionInput = document.querySelector('#caption-input');
var inputs = document.querySelectorAll('.foto-inputs');
var fileInput = document.querySelector('.file');
var favNum = document.querySelector('.view-number');
var currentFavNum = 0;
var add = document.querySelector('.add-btn');
add.disabled = true;
var view = document.querySelector('.view-btn');
var showBtn = document.querySelector('#show-more');
var fotoGallery = document.querySelector('.fotos');
var fotosArr = JSON.parse(localStorage.getItem('stringFotos')) || [];
var reader = new FileReader();

window.onload = loadFotos(fotosArr);
window.onload = noFotos();
add.addEventListener('click', readFoto);
fotoGallery.addEventListener('click', clickHandler);
fotoGallery.addEventListener('focusout', editFotos);
titleInput.addEventListener('keyup', disableButton);
captionInput.addEventListener('keyup', disableButton);
fileInput.addEventListener('change', disableButton);
searchInput.addEventListener('input', searchFotos);
showBtn.addEventListener('click', showMore);

function loadFotos(array) {
  fotosArr = [];
  array.forEach(function (foto) {
    var newFoto = new Foto(foto.id, foto.title, foto.caption, foto.file, foto.favorite);
    fotosArr.push(newFoto);
    displayFoto(newFoto);
  });
  var favoriteButtons = document.querySelectorAll('.favorite');
  for (i=0; i < favoriteButtons.length; i++) {
    console.log(JSON.parse(favoriteButtons[i].dataset.favorited))
    if (JSON.parse(favoriteButtons[i].dataset.favorited)) {
      favoriteButtons[i].classList.add('favorite-active');
      console.log('test');
    }

  // hideFotos();
  }
}

function saveFoto(e) {
  var id = Date.now();
  var title = titleInput.value;
  var caption = captionInput.value;
  var file = e.target.result; 
  var favorite = false;
  var newFoto = new Foto(id, title, caption, file, favorite);
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
  var fotoCard =  
    `<section class="foto-card" data-id="${fotoObj.id}">
      <div>
        <h3 class="foto-title" contenteditable="true">${fotoObj.title}</h3>
        <img class="foto" src=${fotoObj.file} />
        <h3 class="foto-caption" contenteditable="true">${fotoObj.caption}</h3>
      </div>
        <div class="favorite-section">
          <div class="foto-btn delete" alt="Delete"></div>
          <div data-favorited="${fotoObj.favorite}" class="foto-btn favorite favoriteHeart" alt="Favorite"></div>
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
  if (!fotosArr.length) {
    document.location.reload()
  }
}

function clickHandler(e) {
  if(e.target.classList.contains('delete')) {
    deleteFoto(e);
  }
  else if (e.target.classList.contains('favorite')) {
    favoriteFoto(e);
  }
}

function deleteFoto(e) {
  var fotoCard = e.target.closest('.foto-card');
  var fotoId = parseInt(fotoCard.dataset.id);
  fotoCard.remove();
  var selectFoto = findFoto(fotoId)
  selectFoto.deleteFromStorage();
  if (!fotosArr.length) {
    document.location.reload()
  }
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
  var fotoCaption = fotoCard.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
  var editCaption = fotoCaption.innerText;
  var selectFoto = findFoto(fotoId);
  selectFoto.updateFoto(editTitle, editCaption);
}

function favoriteFoto(e) {
  var fotoCard = e.target.closest('.foto-card');
  var fotoId = parseInt(fotoCard.dataset.id);
  var selectFoto = findFoto(fotoId);
  var heartSelect = fotoCard.querySelector('.favoriteHeart')
  selectFoto.updateFavorite();
  console.log(selectFoto.favorite);
  changeHeart(e, selectFoto);
  if (!selectFoto.favorite) {
    currentFavNum++;
  } else {
    currentFavNum--;
  }
  selectFoto.saveToStorage();
}

function favoriteNumber() {
  favNum.innerText = currentFavNum;
}

function changeHeart(e, selectFoto) {
  var favorite = e.target;
  var favoriteActive = e.target.nextSibling.nextSibling;
  if (selectFoto.favorite) {
    favorite.classList.add('favorite-active');
  } else if (!selectFoto.favorite) {
    favorite.classList.remove('favorite-active');
  }
}

// function persistHeart(fotoArr) {
//   console.log(fotoArr);
//   heartArr = [];
//   fotoArr.forEach(function(heart) {
//     var favoriteHeart = heart.querySelector('.favorite');
//     favoriteHeart.classList.add('.favorite-active');
//   })
// }

// function displayHeart(fotoObj) {
//   var fotoCard =  
//     `<section class="foto-card" data-id="${fotoObj.id}">
//       <div>
//         <h3 class="foto-title" contenteditable="true">${fotoObj.title}</h3>
//         <img class="foto" src=${fotoObj.file} />
//         <h3 class="foto-caption" contenteditable="true">${fotoObj.caption}</h3>
//       </div>
//         <div class="favorite-section">
//           <div class="foto-btn delete" alt="Delete"></div>
//           <div class="foto-btn favorite-active" alt="Favorite"></div>
//         </div>
//       </section>`
//   fotoGallery.insertAdjacentHTML('afterbegin', fotoCard);
//   // persistHeart(fotoObj);
// }

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

function searchFotos() {
  remove();
  var searchValue = searchInput.value;
  var searchResults = fotosArr.filter(function(foto){
    return foto.title.toLowerCase().includes(searchValue.toLowerCase()) || foto.caption.toLowerCase().includes(searchValue.toLowerCase());
  });
  searchResults.forEach(function(element) {
    displayFoto(element);
  });
}

function hideFotos() {
  var fotosShown = document.querySelectorAll('.foto-card');
    for (var i = 10; i < fotosShown.length; i++) {
      fotosShown[i].classList.add('hidden');
  }
  showBtn.innerText = 'show more!';
}

function showMore() {
  var fotosShown = document.querySelectorAll('.foto-card');
  for (var i = 10; i < fotosShown.length; i++)
  if (showBtn.innerText === 'show more!') {
    console.log('text should be show less');
    showBtn.innerText = 'show less!';
    fotosShown[i].classList.remove('hidden');
  } else {
    console.log('text should be show more');
    showLess();
    // showBtn.innerText = 'show more!';
    // fotosShown[i].classList.add('hidden');
  } 
}

function showLess() {
  console.log('hey');
  var fotosShown = document.querySelectorAll('.foto-card');
  for (var i = 10; i < fotosShown.length; i++)
  fotosShown[i].classList.add('hidden');
  showBtn.innerText = 'show more!';
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