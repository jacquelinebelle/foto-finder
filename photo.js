class Foto {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite || false;
  }
  saveToStorage() {
    var stringFotos = JSON.stringify(fotosArr);
    localStorage.setItem('stringFotos', stringFotos);
  }
  deleteFromStorage() {
    var fotoIndex = fotosArr.indexOf(this);
    fotosArr.splice(fotoIndex, 1);
    this.saveToStorage(fotosArr);
  }
  updateFoto(editTitle, editCaption) {
    this.title = editTitle;
    this.caption = editCaption;
    this.saveToStorage();
  }
  updateFavorite() {
    this.favorite = !this.favorite;
    this.saveToStorage();
  }
}