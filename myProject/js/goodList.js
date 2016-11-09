$(function(){
	/*-----------------精品推荐recommendation---------*/
	//倒计时效果
	showTime("2016/12/11,12:12:12",".new-day-timer1");
	setInterval(function(){
		showTime("2016/12/11,12:12:12",".new-day-timer1");
	},100);

	showTime("2016/11/11,12:12:12",".new-day-timer2");
	setInterval(function(){
		showTime("2016/11/11,12:12:12",".new-day-timer2");
	},100);

	/*---------------------------point-goods-----------------------*/
	var page = 1;
	function pointGoods(){	
		if(page==5){
			return false;
		}
		$.ajax({
			type: "get",
			url: "../data/common/point-goods"+page+".json",
			success: function(data){
				var aProLine = $(".point-goods-con .product-line");
				var num = -1;
				for(var key in data){
					//创建元素
					var oProduct = $("	 <div class='product fl'><a href='"+data[key].href+" 'target='_blank'><div class='img-box'><img src="+data[key].src+" alt=''><strong class='promotion-info'>"+data[key].promotionInfo+"</strong></div><h3>"+data[key].h3+"</h3><p class='info'>"+data[key].info+"</p><div class='pro-price'>￥<span>"+data[key].proPrice+"</span><em class='price-down'>"+data[key].priceDown+"</em><i class='free-postage'>"+data[key].freePostage+"</i><div class='peo-buy'><strong>"+data[key].peoBuy+"</strong>已购买</div></div></a><div class='pro-foot'>品牌，国内发货</div></di");
					num++;
					var cols = num%3;
					//添加元素
					aProLine.eq(cols).append(oProduct);
				}
				page++;	
				console.log(page);
			}
		});
	}
	//调用函数-初始化
	pointGoods();
	//添加滚动事件
	$(window).scroll(function(){
		var iScrollTop = $(this).scrollTop();
		var oLastProduct = $(".point-goods-con .product").last();
		var iTop = oLastProduct.offset().top;
		var iHeight = oLastProduct.height();
		if(iScrollTop>=iTop-$(window).height()){
			pointGoods();
		}
	});

});

