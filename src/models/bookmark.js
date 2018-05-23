class Bookmark {

    constructor() {
        this.bookObjList = [];
        this.bookGroup = [];
        this.importance_mark = "***"
        console.log("bookmark init")
    }

    getBookmarks(booklists) {
        this._recurGetChildren(booklists[0]);
    }

    returnBookmarks() {
        return this.bookObjList;
    }

    returnBookGroup() {
        return this.bookGroup;
    }

    deleteBookmarks(id) {
        this.bookObjList.forEach(function(d,i){
            if(d.id == id){
              this.bookObjList.splice(i,1);
            }
        });
    }

    editBookmarks(id,newTitle) {
        this.bookObjList.forEach(function(d,i){
            if(d.id == id){
                this.bookObjList[i].title = newTitle;
            }
        });
    }

    numOfBooks() {
        return this.bookObjList.length;
    }

    _recurGetChildren(bookMark) {
        let _this = this;
        if (bookMark.hasOwnProperty("url")){
            var importance = _this._getImportance(bookMark.title);
            if(importance) {
              bookMark.title = bookMark.title.slice(0,-_this.importance_mark.length);
            }
            bookMark.favicon = "chrome://favicon/" + bookMark.url;
            var book = new Book(bookMark.id, bookMark.url, bookMark.favicon, bookMark.title, new Date(bookMark.dateAdded), importance, bookMark.parentId);
            _this.bookObjList.push(book);
        }

        if (bookMark.hasOwnProperty("children")){
            _this.bookGroup.push({"id":bookMark.id, "title":bookMark.title})

            bookMark.children.forEach(function(book){
              _this._recurGetChildren(book);
            })
        }
    }

    _getImportance(title) {
        var mark = title.slice(title.length-this.importance_mark.length, title.length);
        if(mark == "***"){
            return true;
        }else{
            return false;
        }
    }
}

class Book {

    constructor(id, url, favicon, title, dateAdded, isImportant, parentId){
        this.id           = id;
        this.url          = url;
        this.favicon      = favicon;
        this.title        = title;
        this.dateAdded    = dateAdded;
        this.isImportant  = isImportant;
        this.parentId     = parentId;
    }

    getID() {
        return this.id;
    }

    getFavIcon() {
        return this.favicon;
    }

    getDate() {
        var day   = this.dateAdded.getDate();
        var month = this.dateAdded.getMonth() + 1;
        var year  = this.dateAdded.getFullYear();

        return day+"/"+month+"/"+year;
    }

    get titletext() {
        if (this.title.length > 50)
            return this.title.substr(0, 50) + "...";
        return this.title;
    }

    set titletext(text) {
        this.title = text;
    }
}
 
export default Bookmark