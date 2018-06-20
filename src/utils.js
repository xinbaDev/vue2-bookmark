/**
a: bookmark a
b: bookmark b
isTitieReverse: sort by title reverse
isDateReverse: sort by date reverse
sortType: (1) title, (2) date
**/
function sortBookmark(a, b, sortType, isTitleReverse, isDateReverse) {
  if (b.isImportant > a.isImportant) {
    return 1;
  } else if (b.isImportant < a.isImportant) {
    return -1;
  } else {
    if (sortType == "title") {
      if (isTitleReverse) {
        return (b.title > a.title) ? 1 : -1;
      } else {
        return (a.title > b.title) ? 1 : -1;
      }
    } else {
      if (isDateReverse) {
        return (b.dateAdded > a.dateAdded) ? 1 : -1;
      } else {
        return (a.dateAdded > b.dateAdded) ? 1 : -1;
      }
    }
  }
}

export { sortBookmark };
