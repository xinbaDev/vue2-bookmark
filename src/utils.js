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

function filterBookmarkByText(bookmarkLists, search_text, mode) {
  let booklists = [];
  if (mode == 'title') {
    for (let i = 0; i < bookmarkLists.length; i++) {
      let filtered_bookmark = bookmarkLists[i];
      if (filtered_bookmark.title.toLowerCase().indexOf(search_text) != -1) {
        booklists.push(filtered_bookmark);
      }
    }
  } else if (mode == 'url') {
    for (let i = 0; i < bookmarkLists.length; i++) {
      let filtered_bookmark = bookmarkLists[i];
      if (filtered_bookmark.url.indexOf(search_text) != -1) {
        booklists.push(filtered_bookmark);
      }
    }
  }
  return booklists;
}

function filterBookmarkByDateRange(bookmarkLists, dateRange) {
  let booklists = [];
  if (dateRange == null) {
    return [];
  }
  for (let i = 0; i < bookmarkLists.length; i++) {
    let filtered_bookmark = bookmarkLists[i];
    if ((dateRange.start < filtered_bookmark.dateAdded) && (filtered_bookmark.dateAdded < dateRange.end)) {
      booklists.push(filtered_bookmark);
    }
  }
  return booklists;
}

export { sortBookmark, filterBookmarkByText, filterBookmarkByDateRange};
