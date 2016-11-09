
$(function(){

	/*--------------------用AJAX引入共用的html代码------------------------*/
	
	function loadHtml(url,id){
		$.ajax({
			type: "get",
			url: url,
			async: false,
			success: function(data){
				$("#"+id).html(data);
			}
		});
	}
	loadHtml("common/side-bar.html","side-bar");
	loadHtml("common/top-nav.html","top-nav");
	loadHtml("common/search.html","search");
	loadHtml("common/main-nav.html","main-nav");
	loadHtml("common/footer.html","footer");

	/*打开页面的时候判断用户是否登录*/
	isLogin();
	//当点击既然购物车的时候监控是否登录，如果没有则挑战到登录页面
	$(".to-mycart").click(function(){
		var a_isLogin = isLogin();
		if(a_isLogin =="notLogin"){
			location.href = "login.html";
		}else{
			window.open("shopCar.html","_blank");
		}
	});
	/*-------------------------------top-nav---------------------------------------*/


	/*-----end------打开页面的时候判断用户是否登录*/
	setInterval(function(){
		var len = $("#top-nav .roll li").length;
		var iRollHeight = $("#top-nav .roll li").height()*(len-1);
		if(parseInt($("#top-nav .roll").css("top") )== -iRollHeight){
			$("#top-nav .roll").css("top",0);
		}else{
			$("#top-nav .roll").animate({"top":"-=28"},"slow");
		}	
	},2000);
	
	
	$(".top-list .phone").hover(
		function(){
			$(".top-list .ewm").css("display","block");
		},
		function(){
			$(".top-list .ewm").css("display","none");
		
	});

	/*-------------------------搜索框--------------------------------------------*/

	$("#search .text input").focus(function(){
		$("#search ul").css("display","block");
	});
	$("#search .text input").blur(function(){
		$("#search ul").css("display","none");
	});


	$(".search-shop-cart").hover(
		function(){
			$(".cart-info").show();
		},
		function(){
			$(".cart-info").hide();
		}
	);
	//下拉提示
/*	var searchInput = $("#search .text input").get(0);
	var tipList 	= $("#search ul").get(0);
	//创建script标签
	searchInput.onkeyup =  function(){
		var oScript = document.createElement('script');
		oScript.src = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="+searchInput.value+"&json=1&p=3&cb=test&t";
		document.body.appendChild(oScript);
	};
	function test(data){
		var tipList = $("#search ul").get(0);
		console.log(data);
		console.log(data.s[0]);
		var s = data.s;
		tipList.innerHTML = "";
		for(var i in s){
			var oLi = document.createElement('li');
			oLi.innerHTML = s[i];	
			tipList.appendChild(oLi);
			
		}
		
	}*/
	$("#search .text input").keyup(function(){
		$.ajax({
			url:"https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="+$("#search .text input").val()+"&json=1&p=3",
			dataType:"jsonp",
			jsonp:"cb",
			success: function(data){
				var lists = data.g;
				var oUl = $("#search ul");
				oUl.html("");
				for(var i in lists) {
					var oLi = $("<li></li>");
					oLi.html(lists[i].q);
					oUl.append(oLi);
				}

			}
		});
		
	});
/*-----------end---------搜索框------------------------end-------------*/
	/*-------迷你购物车功能-----*/
	function miniCart(){	
		//判断有没有登录
		if(!$.cookie("hasLogin")){
			return false;
		}
		//从COOKIE中获取商品信息
		//初始化数据库
		// if(!$.cookie("goods")){
		// 	var oGoodInfo = {
		// 	};
		// 	$.cookie("goods",JSON.stringify(oGoodInfo),{"expires":200,"path":"/"});		
		// }		
		//判断有没有商品
		if(!$.cookie("goods")){
			console.log("没找到商品");
			$(".cart-info .no-good").css("display","block");
			return false;	

		}
		var oComGoods = JSON.parse($.cookie("goods"));
		//console.log(oComGoods.proCategoryNum);
		//console.log(oComGoods);
		var iGoodNum = 0;	//记录商品的总数量
		var iTotlMoney = 0;	//记录商品总金额
		//创建结算页脚c-balance
		var oBalance = $('<div class="c-balance clear"><p class="fl"><i id="total-num" class="cart-num">0</i>件商品<span id="total-price"></span></p><button class="fr"><a href="shopCar.html">去购物车结算</a></button></div>');
		$(".search-shop-cart .cart-info").append(oBalance);
		for(var oKey in oComGoods){
			if(oKey == "proCategoryNum"){
				continue;
			}
			var oGInfo = $(
				'<div class="good-info clear">'+
					'<div class="img-b fl">'+
						'<img src="'+oComGoods[oKey].src+'" alt="" >'+
					'</div>'+
					'<p class="fl good-name"><a href="##">'+oComGoods[oKey].title+'</a></p>'+
					'<div class="pri-box fl">'+
						'<span class="price">￥'+oComGoods[oKey].price+'</span>'+
						'x'+
						'<i class="good-num">'+oComGoods[oKey].goodNum+'</i>'+
					'</div>'+
				'</div>'
			);
			$(".good-info-wrap").append(oGInfo);
			iGoodNum += oComGoods[oKey].goodNum;
			iTotlMoney += oComGoods[oKey].price*oComGoods[oKey].goodNum;		
		}
		$(".cart-info .no-good").css("display","none");
		$(".cart-num").html(iGoodNum);
		$("#total-price").html('￥'+iTotlMoney);
		
	}
	//调用函数
	miniCart();

	/*-----------------------main-nav---------------------------*/
	//动态获取菜单选项
	$.ajax({
		type: "get",
		url: "../data/common/main-nav.json",
		success: function(data){
			//console.log(data);
			var aDds = $("#main-nav .cat-body dd");
			var num = -1;
			for(var key in data){
				num++;
				for(var i in data[key]){
					//创建元素
					var oA = $("<a href='#'>"+data[key][i]+"</a>");
					//网页面上添加元素
					aDds.eq(num).append(oA);
				}
			}
		}
	});
	$("#main-nav li").hover(
		function(){	
			$(this).css("background","#e20700");

		},
		function(){
			$(this).css("background","#f70800");
		}
	);
/*	$("#main-nav .nav-cat").hover(
		function(){	
			$("#main-nav .cat-body").css("display","block");

		},
		function(){
			$("#main-nav .cat-body").css("display","none");
		}
	);*/
	$("#main-nav .nav-cat").mouseenter(function() {
		$("#main-nav .cat-body").css("display","block");
	});
	$("#main-nav .nav-cat").mouseleave(function() {
		$("#main-nav .cat-body").css("display","none");
	});

	/*--------------------------------side-bar------------------------------*/

	$("#side-bar li").each(function(i,elem){

		$(this).mouseover(function() {
			if(i == 1){
				$(this).children('em').addClass('num-h');
			}
			$(this).children('a').addClass('a-h').parent().siblings().children('a').removeClass('a-h');
			$(this).children('.div-sidebar').css("display","block").parent().siblings().children('.div-sidebar').css("display","none");
		});
		$(this).mouseout(function() {
			if(i == 1){
				$(this).children('em').removeClass('num-h');
			}
			$(this).children('a').removeClass('a-h');
			$(this).children('.div-sidebar').css("display","none");
		});
	});
	


	

});

/*---------------------------------封装的共用函数----------------*/
/*------倒计时效果-----------*/
//封装倒计时的函数
function checkTime(i){
	if(i<10){
		i = "0" + i;
	}
	return i;
}
function showTime(time,selector){
	var endTime = new Date(time);
	var curTime = new Date();
	var leftTime = parseInt((endTime.getTime() - curTime.getTime() )/1000);
	var d = parseInt(leftTime/(24*60*60));
	var h = parseInt(leftTime/(60*60)%24);
	var m = parseInt(leftTime/60%60);
	var s = parseInt(leftTime%60);
	d = checkTime(d);
	h = checkTime(h);
	m = checkTime(m);
	s = checkTime(s);
	$(selector).html(d+"天"+h+"小时"+m+"分钟"+s+"秒");
}

//判断用户是否登录
function isLogin(){
	if($.cookie("hasLogin")){
		var oCookie = $.cookie("hasLogin");
		var oUser = JSON.parse(oCookie).userName;
		$(".top-list li").first().html("欢迎您，"+oUser+"");
		$(".top-list li").eq(1).html('<span><a href="##" id="exit">退出</a></span> |');
		$(".side-userinfo").html('<span style="color:red">'+oUser+'</span>,你好！<i></i>');
		$("#exit").click(function(){
			$.cookie("hasLogin","",{expires:-1});
			$(".top-list li").first().html('<span><a href="regist.html">注册</a></span> |');
			$(".top-list li").eq(1).html('<span><a href="login.html">登录</a></span> |');
			$(".side-userinfo").html('你好！请 <a href="login.html" class="">登录</a> | <a href="regist.html" class="">注册</a>');
		});
	}else{
		return "notLogin";
	}

}