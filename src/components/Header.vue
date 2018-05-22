<template>
	<div class="imghead">
		<div class="container">
			<div class="row">
				<div class="col-xs-1 logo"></div>
				<a class="app-name" @click="open_web_store">Bookrmark Assistant</a>

				<div class= "fa fa-cog bookmark_setting btn btn_setting" @click="open_options_page" ></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
  name: 'Header',
  methods: {
  	open_options_page() {
  		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
  	},
  	open_web_store() {
  		chrome.tabs.create({url: "https://chrome.google.com/webstore/detail/bookmark-helper/anfdnhenkombplichcifaiecpcfifhdp/"});
  	}
  }
}

</script>

<style scoped>

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

.row {
  margin-right: -15px;
  margin-left: -15px;
}

.row>a:hover {
  text-decoration: none;
  color: #ff9c29;
}
.row>a {
  text-decoration: none;
  color: #191919;
  cursor: pointer;
}

.imghead {
  background: linear-gradient(to bottom, #ffffff 0%, #eaeaea 100%);
  height: auto;
  border-bottom: 1px #aaaaab solid;
}

.app-name {
  font-size: 14px;
  font-weight: 600;
}

.logo {
  background-image: url('../images/icon.png');
  background-size: contain;
  background-repeat: no-repeat;
  height: 22px;
  width: 22px;
}

.bookmark_option {
	padding-left: 20px;
}

.bookmark_setting {
  float:right;
  margin-top: 0px;
}

.btn_setting {
    display: inline-block;
    border-radius: 20px;
    border: 1px #dbdbdb solid;
    background: #fefefe;
    background: -moz-linear-gradient(top, #fefefe 0%, #eeeeee 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #fefefe), color-stop(100%, #eeeeee));
    background: -webkit-linear-gradient(top, #fefefe 0%, #eeeeee 100%);
    background: -o-linear-gradient(top, #fefefe 0%, #eeeeee 100%);
    background: -ms-linear-gradient(top, #fefefe 0%, #eeeeee 100%);
    background: linear-gradient(to bottom, #fefefe 0%, #eeeeee 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#fefefe', endColorstr='#eeeeee', GradientType=0 );
    color: #6a6a6a;
    text-decoration: none;
    font-size: 16px;
    padding: 1px 6px !important;
}

</style>
