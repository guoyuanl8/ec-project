$(function(){
	/*----------------------carousel--------------------------------------*/
	$.ajax({
		type: "get",
		url: "../data/index/main-lbt.json",
		success: function(data){
			var oImgBox = $("#carousel .img-box");
			var oScrollNum = $("#carousel .scroll-num");
			$(data).each(function(i,elem){
				//创建元素
				var oLi = $("<li><a href=''><img src="+$(data)[i].src+" alt='' class='ajaxImg'></a></li>");
				var oSpan = $("<span></span>");
				//添加元素
				oImgBox.append(oLi);
				oScrollNum.append(oSpan);
			});
			var oLastLi = oImgBox.find("li").last().clone(true);
			var oFirstLi = oImgBox.find("li").first().clone(true);
			oImgBox.append(oFirstLi);
			oImgBox.prepend(oLastLi);
			var len = oImgBox.children('li').length; 
			var iLiWidth = 0;
			//console.log(len);
			$('.ajaxImg').each(function(){
				$(this).load(function(){
					//设置ul的长度
					iLiWidth = oImgBox.children('li').eq(0).width();
					oImgBox.css("width",(len)*iLiWidth);
					//console.log(iLiWidth*len);
					new Carousel("carousel");		
				});
			})
			
		

		
			
			
			
				
		}
	});
	function Carousel(id){
		//定义变量
		this.oCarousel = $("#"+id);
		this.oCarouselOut = this.oCarousel.parent();
		this.oPrev =this.oCarousel.find('.prev');
		this.oNext = this.oCarousel.find('.next');
	    this.aSpans =  this.oCarousel.find('.scroll-num').children('span');
	    this.oImgBox = this.oCarousel.find(".img-box");
	    this.aLi     = this.oImgBox.children('li');
	    this.len = this.aLi.length;
	    this.iLiWidth = this.aLi.eq(0).width();	  
	    this.iNum = 0;	//当前小圆点的索引
	    this.index = 0;	//当前的图片的索引
	    this.timer = null;	//	定时器

	    //自动轮播
	    this.autoPlay();
	    var _this = this;

	    //图片盒子的鼠标移入移出事件
	    this.oCarouselOut.hover(
	    	function(){
	    		clearInterval(_this.timer);
	    		_this.oPrev.show();
	    		_this.oNext.show();

	    	},
	    	function(){
	    			_this.autoPlay();
	    		_this.oPrev.hide();
	    		_this.oNext.hide();
	    	}
	    );

	    //点击左右按钮即切换图片
	    this.oPrev.on("click",function(){
	    	_this.index--;
	    	if(_this.index==-1){
	    		_this.index=0;
	    	}
	    	if(_this.index == _this.len-1){    		
	    		_this.iNum = 0;	    		
	    	}else if(_this.index ===0){
	    		_this.index = _this.len-2;
	    		_this.oImgBox.css("left",-_this.iLiWidth*(_this.len-1)-460);
	    		_this.iNum=_this.len-3;
	    	}else{
	    		_this.iNum = _this.index - 1;
	    	}
	    	_this.tab();

	    });
	    this.oNext.on("click",function(){
	    	_this.index++;
	    	if(_this.index ==_this.len){
	    		_this.index=_this.len-1;
	    	}
	    	if(_this.index == _this.len-1){
	    		_this.oImgBox.css("left",-460);
	    		_this.iNum = 0;
	    		_this.index = 1;
	    	}else if(_this.index ===0){
	    		_this.iNum=_this.len-3;
	    	}else{
	    		_this.iNum = _this.index - 1;
	    	}
	    	_this.tab();
	    });

	    //小圆点的鼠标移入移出事件
	    this.aSpans.each(function(i,elem){
	    	$(this).mouseover(function(){
	    		_this.iNum = i;
	    		if(_this.iNum===0){
	    			_this.index= 1;
	    		}else if(_this.iNum == _this.len-3){
	    			_this.index = _this.len-2;
	    		}else{
	    			_this.index= _this.iNum + 1;
	    		}
	    		_this.tab();
	    	});
	    });
	}
	Carousel.prototype.init = function(){

	};
	Carousel.prototype.autoPlay = function(){
		var _this = this;
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			_this.index++;
			if(_this.index==0){
				_this.oImgBox.css("left",-460 - _this.iLiWidth*_this.len-2 );
				_this.index = 5;	
				_this.iNum = 4;
			}
			if(_this.index==_this.len-1){
				_this.oImgBox.css("left",-460 );
				_this.index = 1;
				_this.iNum = 0;
							
			}else{
				_this.iNum = _this.index - 1;
			}
				console.log(_this.iNum,"  " ,_this.index);
			_this.tab();
		},2000);
	};
	Carousel.prototype.tab = function(){
		var _this = this;
		this.oImgBox.stop().animate({"left":-_this.iLiWidth*this.index-460},"slow");
		this.aSpans.each(function(j){
			$(this).removeClass('active');
		});
		
		//console.log(_this.iLiWidth*this.index-460);
		$(this.aSpans).eq(this.iNum).addClass('active');
	
	};

	/*------------------------minor-lbt----------------------------------*/
	$.ajax({
		type: "get",
		url: "../data/index/minor-lbt.json",
		success: function(data){
			var oUl = $(".daily-img-box-big");
			var oDailyBoxSmall = $(".daily-box-small");
			var num = -1;
			for(var key in data){
				
				num++;
				//创建元素
				 var oLi = $("<li class='fl'><a href=''><div class='img fl'><img src="+data[key].src+" alt=''></div><div class='info fr'><h3>"+data[key].h3+"</h3><p class='pro-info'>"+data[key].proInfo+"</p><div class='pro-price'>￥<span>"+data[key].proPrice+"</span></div><div class='comment-preview'></div></div></a></li>");
				 var oImg = $("<span><i></i><img src="+data[key].src+" alt=''></span>");
				//添加元素
				oUl.append(oLi);
				oDailyBoxSmall.append(oImg);
				var oProPrice = oUl.find(".pro-price").eq(num);	
				var oComment = oUl.find(".comment-preview").eq(num);
				if(data[key].priceDown){
					var oPriceDown = $("<em class='price-down'>"+data[key].priceDown+"</em>");
					oProPrice.append(oPriceDown);
				}
				if(data[key].freePostage){
					var oI = $("<i class='free-postage'>"+data[key].freePostage+"</i>");
					oProPrice.append(oI);
				}
				if(data[key].phoneNum){
					oComment.append($("<p class='phone-num'>"+data[key].phoneNum+"</p>"));
				}
				if(data[key].commentDetail){
					oComment.append($("<p class='comment-detail'>"+data[key].commentDetail+"</p>"));
				}

			}
			//设置ul的长度---初始化页面
			var len = oUl.children('li').length;
			var iLiWidth = oUl.children('li').width();
			oUl.css("width",len*iLiWidth).width();
			new Carousel1("daily-selection");
		}
	});

	function Carousel1(id){
			//定义变量
			this.oCarousel = $("#"+id);
			this.oPrev =this.oCarousel.find('.prev');
			this.oNext = this.oCarousel.find('.next');
		    this.aSpans =  this.oCarousel.find('.scroll-num').children('span');
		    this.oImgBox = this.oCarousel.find(".img-box");
		    this.aLi     = this.oImgBox.children('li');
		    this.len = this.aLi.length;
		    this.iLiWidth = this.aLi.eq(0).width();
		    this.iNum = 0;	//当前小圆点的索引
		    this.index = 0;	//当前的图片的索引
		    this.timer = null;	//	定时器
		    //初始化页面
		    this.init();
		    //自动轮播
		    this.autoPlay();
		    var _this = this;

		    //图片盒子的鼠标移入移出事件
		    this.oCarousel.hover(
		    	function(){
		    		clearInterval(_this.timer);

		    	},
		    	function(){
		    			_this.autoPlay();
		    	}
		    );

		    //点击左右按钮即切换图片
		    this.oPrev.on("click",function(){
		    	_this.index--;
		    	if(_this.index == -1){	
		    		_this.index = _this.len-1;
		    		
		    	}
		    	_this.tab();

		    });
		    this.oNext.on("click",function(){
		    	_this.index++;
		    	if(_this.index == _this.len){
		    		_this.index = 0;
		    	}
		    	_this.tab();
		    });

		    //小圆点的鼠标移入移出事件
		    this.aSpans.each(function(i,elem){
		    	$(this).mouseover(function(){
		    		_this.index = i;
		    		_this.tab();
		    	});
		    });
		}

		Carousel1.prototype.init = function(){
			this.aLi.eq(0).addClass('active');
		};
		Carousel1.prototype.autoPlay = function(){
			var _this = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				_this.index++;
				if(_this.index == _this.len){
		    		_this.index = 0;
		    	}
				
				_this.tab();
			},3000);
		};
		Carousel1.prototype.tab = function(){
			var _this = this;
			this.aLi.eq(this.index).stop().animate({"opacity":100},1000).siblings('li').stop().animate({"opacity":0},200);
			this.aSpans.each(function(j){
				$(this).removeClass('active');
			});
			$(this.aSpans).eq(this.index).addClass('active');
		
		};
	/*------tv-ugo-------------------*/

	$.ajax({
		type: "get",
		url: "../data/index/tv-ugo.json",
		success: function(data){
			var oImgBox = $("#live-preview .img-box");
			for(var key in data){
				//创建元素
				var oLi = $("<li class='clear'><a href=''><i></i><img src="+data[key].src1+" alt=''></a><a href=''><i></i><img src="+data[key].src2+" alt=''></a><a href=''><i></i><img src="+data[key].src3+" alt=''></a></li>");
				//添加元素
				oImgBox.append(oLi);
			}

			var len = oImgBox.children('li').length;
			var iLiWidth = oImgBox.children('li').width();
			//设置ul的长度
			oImgBox.css("width",(len)*iLiWidth);

			new Carousel2("live-preview");
			
		}
	});
	function Carousel2(id){
			//定义变量
			this.oCarousel = $("#"+id);
			this.oPrev =this.oCarousel.find('.prev');
			this.oNext = this.oCarousel.find('.next');
		    this.oImgBox = this.oCarousel.find(".img-box");
		    this.aLi     = this.oImgBox.children('li');
		    this.len = this.aLi.length;
		    this.iLiWidth = this.aLi.eq(0).width();
		    this.iNum = 0;	//当前小圆点的索引
		    this.index = 0;	//当前的图片的索引
		    this.timer = null;	//	定时器

		    //自动轮播
		  //  this.autoPlay();
		    var _this = this;


		    //点击左右按钮即切换图片
		    this.oPrev.on("click",function(){
		    	_this.index--;
		    	if(_this.index == -1){	
		    		_this.index = _this.len-1;
		    		
		    	}
		    	_this.tab();

		    });
		    this.oNext.on("click",function(){
		    	_this.index++;
		    	if(_this.index == _this.len){
		    		_this.index = 0;
		    	}
		    	_this.tab();
		    });
		}


		Carousel2.prototype.autoPlay = function(){
			var _this = this;
			clearInterval(this.timer);
			this.timer = setInterval(function(){
				_this.index++;
				if(_this.index == _this.len){
		    		_this.index = 0;
		    	}
				
				_this.tab();
			},1000);
		};
		Carousel2.prototype.tab = function(){
			var _this = this;
			this.oImgBox.stop().animate({"left":-this.iLiWidth*this.index},1000);
	
		};
		/*----------------------------promotion-------------------------*/
	$.ajax({
		type: "get",
		url: "../data/index/promotion.json",
		success: function(data){
			var oPromotionCon = $(".promotion-con");
			for(var key in data){
				//创建元素
				var oConWrap = $("<div class='clear con-wrap'><div class='section fl'><a href=''><img src="+data[key].src1+" alt=''></a></div><div class='section fr'><a href=''><img src="+data[key].src2+" alt=''></a></div></div>");
				//添加元素
				oPromotionCon.append(oConWrap);
			}
		}
	});
	/*---------------------------point-goods-----------------------*/
	var page = 1;
	function pointGoods(){	
		if(page>=5){
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
					var oProduct = $("<div class='product fl'id='"+data[key].id+"'><a href='"+data[key].href+"' target='_blank' ><div class='img-box'><img src="+data[key].src+" alt=''><strong class='promotion-info'>"+data[key].promotionInfo+"</strong></div><h3>"+data[key].h3+"</h3><p class='info'>"+data[key].info+"</p><div class='pro-price'>￥<span>"+data[key].proPrice+"</span><div class='peo-buy'><strong>"+data[key].peoBuy+"</strong>已购买</div></div></a><div class='pro-foot'>品牌，国内发货</div></div>");
					num++;
					var cols = num%3;
					//添加元素
					aProLine.eq(cols).append(oProduct);
					var index = oProduct.index();
					if(data[key].priceDown){
						var oEm = $("<em class='price-down'>"+data[key].priceDown+"</em>");
						$(".product .pro-price").eq(index).append(oEm);
					}
					if(data[key].freePostage){
						var oI = $("<i class='free-postage'>"+data[key].freePostage+"</i>");
						$(".product .pro-price").eq(index).append(oI);
					}

				}
				$(".point-goods-con .product").each(function(i){
					$(this).click(function(){
						//获取当前商品的id
						var iID = $(this).attr("id");
						console.log(iID);
						for(var o in data){
							if(data[o].id==iID){
								//console.log(data[o].detail);
								var oDetail = data[o].detail;
								if(!$.cookie("goodDetail")){
									var goodDetail = {};
									goodDetail["oDetail"+iID] = oDetail;
								}else{
									var goodDetail = JSON.parse($.cookie("goodDetail"));
									goodDetail["oDetail"+iID] = oDetail;
								}
								$.cookie("goodDetail",JSON.stringify(goodDetail),{"expires":200,"path":"/"});
								console.log(JSON.parse($.cookie("goodDetail")));
								break;
							}
						}
					});
				});
				page++;
				//console.log(page);
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