<template>

	<div>
		<script src="../lib/moment.min.js"></script>
		<script src="../lib/daterangepicker.js"></script>
		<table v-show="mode == 'time'">
			<td>
				<div id="reportrange" class="pull-right bookmark-calendar" >
				    <i class="glyphicon glyphicon-calendar fa fa-calendar"></i><span></span>
				</div>
			</td>
		</table>

		<table v-show="mode != 'time'">
			<td>
				<div style="position: relative; width: 575px;">
					<input id="search" class="form-control fa" v-model="searchText" :placeholder="numberOfBookMarks"/>
					<i v-if="mode == 'title'" class="icon-bookmark fa fa-bookmark"></i>
					<i v-if="mode == 'url'" class="icon-link fa fa-link"></i>
					<i v-if="mode == 'time'" class="icon-calendar fa fa-calendar"></i>
				</div>
			</td>
		</table>

		<div v-if="isNotEmpty()" id="bookmark_scrollable">
			<table>
				<td class="bookmarkTitle" @click="sortType = 'title'; sortReverse = !sortReverse">Title
					<span v-show="sortType == 'title' && sortReverse" class="fa fa-caret-down sortIcon"></span>
		            <span v-show="sortType == 'title' && !sortReverse" class="fa fa-caret-up sortIcon"></span>
				</td>

				<td class="dateAdded" @click="sortType = 'dateAdded'; sortReverse = !sortReverse">DateAdded
					<span v-show="sortType == 'dateAdded' && sortReverse" class="fa fa-caret-down sortIcon"></span>
		            <span v-show="sortType == 'dateAdded' && !sortReverse" class="fa fa-caret-up sortIcon"></span>
				</td>

				<tr v-for="bookmark in filteredBookmarkLists">
				    <td class="title_bookmark" @mouseover="hoverEdit = true" @mouseleave="hoverEdit = false"> 
				    	
				    	<img :src = "bookmark? bookmark.getFavIcon():''">
				    	<a href='' @click="openLink(bookmark.url)">{{bookmark? bookmark.titletext:""}}</a> 
				    	<!-- <i ng-attr-id="{{'moreControlOpt_' + bookmark.getID()}}" class="fa fa-sm fa-caret-square-o-down moreControlOpt"></i> -->
						
						<i v-show="bookmark? bookmark.isImportant:false" @click="changeImportance(bookmark)" class="fa fa-star icon_yellow moreControlOpt"> </i>
						

				    	<!-- <i v-show="hoverEdit == true" @click="deleteBookmarks(bookmark.getID())" class="fa fa-sm fa-trash moreControlOpt"></i>
				    	<i v-show="hoverEdit == true" @click="editBookmarks(bookmark.getID(),bookmark.title)" class="fa fa-sm fa-edit moreControlOpt"></i> -->
						<!-- <i v-show="hoverEdit == true && !bookmark.isImportant" @click="changeImportance(bookmark)" class="fa fa-star-o moreControlOpt"> </i> -->

				    </td>
					<td class="date_bookmark">
						{{bookmark? bookmark.getDate():""}}
					</td>
				</tr>
				
			</table>
		</div>

		<div v-if="isSearchByDate" class="bookmark_scrollable">
			<table>
				<td class="bookmarkTitle" @click="sortType = 'title'; sortReverse = !sortReverse">Title
					<span v-show="sortType == 'title' && sortReverse" class="fa fa-caret-down sortIcon"></span>
		            <span v-show="sortType == 'title' && !sortReverse" class="fa fa-caret-up sortIcon"></span>
				</td>

				<td class="dateAdded" @click="sortType = 'dateAdded'; sortReverse = !sortReverse">DateAdded
					<span v-show="sortType == 'dateAdded' && sortReverse" class="fa fa-caret-down sortIcon"></span>
		            <span v-show="sortType == 'dateAdded' && !sortReverse" class="fa fa-caret-up sortIcon"></span>
				</td>
				
				<tr v-for="bookmark in filteredBookmarkLists">
				    <td class="title_bookmark" @mouseover="hoverEdit = true" @mouseleave="hoverEdit = false"> 
				    	
				    	<img :src = "bookmark? bookmark.getFavIcon():''">
				    	<a href='' @click="openLink(bookmark.url)">{{bookmark? bookmark.titletext:""}}</a> 
						
						<i v-show="bookmark? bookmark.isImportant:false" @click="changeImportance(bookmark)" class="fa fa-star icon_yellow moreControlOpt"> </i>
						
						
				    	<!-- <i v-show="hoverEdit == true" @click="deleteBookmark(bookmark.getID())" class="fa fa-sm fa-trash moreControlOpt"></i>
				    	<i v-show="hoverEdit == true" @click="editBookmark(bookmark.getID(),bookmark.title)" class="fa fa-sm fa-edit moreControlOpt"></i> -->
						<!-- <i v-show="hoverEdit == true && !bookmark.isImportant" @click="changeImportance(bookmark)" class="fa fa-star-o moreControlOpt"> </i> -->
				    	
				    </td>
					<td class="date_bookmark">
						{{bookmark? bookmark.getDate():""}}
					</td>
				</tr>
			</table>
		</div>

	</div>
</template>


<script>

	import bookmark from "../models/bookmark"
/*	import daterangepicker from "../lib/daterangepicker"*/
	export default {
		name: 'SearchMode',
		props: ['mode'],
		data() {
			return {
				bookmarkManager: "",
				bookmarkLists: {},
				searchText: "",
				isSearchByDate: false,
				sortType: 'title',
				sortReverse: false,
				hoverEdit: false
			}
		},
		computed: {
			numberOfBookMarks() {
				if (this.bookmarkManager){
					var num = this.bookmarkManager.numOfBooks();
			        if(num <= 1){
			            return "Search in your bookmarks";
			        }else{
			            return "Search in your " + num + " bookmarks";
			        }
				}
		        return "Search in your bookmarks";
			},
			filteredBookmarkLists() {
				var booklists = []
				var num = this.bookmarkManager.numOfBooks();
				if (this.mode == 'title') {
					for (var i = 0; i < num; i++) {
						var filtered_bookmark = this.bookmarkLists[i];
						if (filtered_bookmark.title.indexOf(this.searchText) != -1) {
							booklists.push(filtered_bookmark);
						}
					}
				} else if (this.mode == 'url') {
					for (var i = 0; i < num; i++) {
						var filtered_bookmark = this.bookmarkLists[i];
						if (filtered_bookmark.url.indexOf(this.searchText) != -1) {
							booklists.push(filtered_bookmark);
						}
					}
				} else {

				}
				return booklists
			}
		},
		methods: {
			isNotEmpty() {
				return this.searchText != "";
			},
			openLink(url) {
				chrome.tabs.create({url: url});
			},
			changeImportance(bookmark) {
				var id = bookmark.getID();

		        if(bookmark.isImportant){
		            chrome.bookmarkmarks.update(id,{title:bookmark.title});
		        }else{
		            chrome.bookmarkmarks.update(id,{title:bookmark.title + "***"});
		        }

		        bookmark.isImportant=!bookmark.isImportant;
			},
/*			deleteBookmark(bookmark) {

			},
			editBookmark(bookmark) {

			}*/
			getBookmarks() {

				let _this = this;

				this.bookmarkManager = new bookmark()
				console.log(this.bookmarkManager)
				
			    if(this.bookmarkManager.numOfBooks() == 0){
				    chrome.bookmarks.getTree(getBookmarksCallback);
				}

				function getBookmarksCallback(booklist) {
			        _this.bookmarkManager.getBookmarks(booklist);
			        _this.bookmarkLists = _this.bookmarkManager.returnBookmarks();
				}
			}
		},
		created() {
			this.getBookmarks()
		}
	}
</script>


<style scoped>
.icon-calendar{
	position: absolute!important;
	z-index: 500;
	left:10px;
	top:10px;
}

.icon-link{
	position: absolute!important;
	z-index: 500;
	left:10px;
	top:10px;
}

.icon-bookmark{
	position: absolute!important;
	z-index: 500;
	left:10px;
	top:10px;
}

.bookmark-calendar{
	background: #fff; 
	cursor: pointer; 
	padding: 8px 12px; 
	border: 1px solid #ccc; 
	width: 100%;
	height: 34px;
}

.bookmark_scrollable {
	max-height: 300px;
	overflow-x:hidden;
}

.bookmarkTitle {
	border: 1px solid grey;
	text-align: center;
	cursor: pointer;
	width:80%;
	height:40px;
}

.dateAdded {
	border: 1px solid grey;
	text-align: center;
	cursor: pointer;
	width:20%;
	height:40px;
}

.title_bookmark{
	border: 1px solid grey;
	width:80%;
}

.title_bookmark:hover {
    background-color: lightblue;
} 

.date_bookmark{
	border: 1px solid grey;
	text-align: center;
	width:20%;
}

.moreControlOpt{
	float: right;
	cursor: pointer;
}

.moreControlOpt:hover {
    border: 1px solid grey;
} 

#search {
	padding-left: 30px;
}

</style>