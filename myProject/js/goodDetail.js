$(function(){
	/*-------放大镜效果----------*/
	//首先通过AJAX获取数据
	var fileName = window.location.href;
	var arr = fileName.split("-");
	var arr1 = arr[1].split(".");
	console.log(arr1);
	var fileNum = arr1[0];
	console.log(fileNum);
	var iId = 0;
	var iPrice = 0;//计算浮动窗口中商品金额的时候会用的
	
	var data = null;
	
	$.ajax({
		type:"get",
		url:"../data/goodDetail/goodDetail"+fileNum+".json",
		async:false
	}).done(function(data){
		//清除localStorage
		//localStorage.removeItem();
		data = data;
		console.log(data.price);
	
			/*---获取该商品的ID，以便在加入购物车的时候检查是否已经加入购物车*/
			console.log(data)
			iId = data.id;
			iPrice = data.price;
			var oColorReg = /^noColor/i;	
			var oSizeReg = /^noSize/i;
			/*----放大镜-----*/
			if(data.magnify){
			 	//加载内容进去之前先清空
			 	$(".big-img-box img").detach();
			 	$(".middle-img-box img").detach();
			 	$(".small-img-box ul li").detach();
			 	//添加节点和内容
				var oGoodImg = data.magnify;
				var oBigImg = $('<img src="'+oGoodImg.src1+'" alt="">');
				$(".big-img-box").append(oBigImg);
				var oMiddleImg = $('<img src="'+oGoodImg.src1+'" alt="">');
				$(".middle-img-box").append(oMiddleImg);
				for(var o in oGoodImg){
					var oLi = $('<li><img src="'+oGoodImg[o]+'" alt=""></li>');
					$(".small-img-box ul").append(oLi);
				}
				//给第一个小图片（li）加一个acitve类名
				$(".small-img-box ul li:first").addClass('active');
			}

			// 商标
			var oBrand = $('<span>'+data.brand+'</span>');
			$("form .brand").append(oBrand);
			// 标题
			$("form .title").html(''+data.title+'');
			// 商品描述
			$("form .description").html(''+data.description+'');
			//价格
			var oPrice = $('<span class="price"><i>￥</i>'+data.price+'</span>');
			$("form .li-pri").append(oPrice);
			// 优惠信息
			var oP = $('<p><span class="tag">'+data.tag+'</span><span class="tag-con">'+data.tagCon+'</span></p>');
			$(".previlege-con").append(oP);
			// 是否有货
			$("form .sfyh").html('<strong>'+data.sfyh+'</strong>，此商品暂时售完');

			/*-----颜色-----*/
			if(data.color){
				var oA = null;
				var oColorArr = [];
				var oIcurColor = null;
				for(var key in data.color){
					if(oColorReg.test(key)){
						oA = $('<a href="##" class="no-goods"><img src="'+data.color[key].src1+'" alt=""><i></i></a>');
						$(".choice-buy .color").append(oA);
					}else{
						oColorArr.push(key);
						oA = $('<a href="##" ><img src="'+data.color[key].src1+'" alt=""><i></i></a>');
						$(".choice-buy .color").append(oA);
					}	
				}
				//默认选择的颜色

				var aColors = $(".choice-buy .color a").not(".no-goods");
				aColors.first().addClass('ck').children('i').addClass('ck');
				oIcurColor = oColorArr[0];
				//手动选择颜色

				aColors.each(function(i,elem){
					$(this).click(function(){
						aColors.each(function(){
							$(this).removeClass('ck').children('i').removeClass('ck');
						});
						$(this).addClass('ck').children('i').addClass('ck');
						//判断当前选择的颜色
						oIcurColor = oColorArr[i];
						//切换颜色的时候重新往放大镜中添加节点和内容
						addPic();
						//再次调用放大镜函数
						new Magnifier("magnifier");
					});
				});
				 /*----把对应颜色的商品加载到商品展览中（放大镜）----*/
				 
				 addPic();
			}
			/*-----end----颜色------end--*/
			/*-----尺码-----*/
			if(data.size){
				var oSpan = null;
				var oSizeArr = [];
				var oIcurSize = null;
				for(var obj in data.size){
					if(oSizeReg.test(obj)){
						oSpan = $('<span class="no-goods"><i></i>'+data.size[obj]+'</span>');
						$(".choice-buy .size-wrap").prepend(oSpan);
					}else{
						oSizeArr.push(data.size[obj]);
						oSizeArr.reverse();
						oSpan = $('<span><i></i>'+data.size[obj]+'</span>');
						$(".choice-buy .size-wrap").prepend(oSpan);
					}	
				}
				//console.log(oSizeArr);
				/*------手动选择尺码-------*/

				var aSizes = $(".choice-buy .size span").not(".no-goods");
				aSizes.each(function(i,elem){
					$(this).click(function(){
						aSizes.each(function(){
							$(this).removeClass('ck').children('i').removeClass('ck');
						});
						$(this).addClass('ck').children('i').addClass('ck');
						//手动选择尺码后，隐藏错误提示框
						$(".size").parent().removeClass('error').find(".box").css("display","none");
						//判断当前选择的尺码
						oIcurSize = oSizeArr[i];
					});
				});
				
			}
			/*-----end-----尺码------end---*/

			/*------点击加入购物车效果-----*/
			var onOff = true;//再次点击加入购物车是否有效的开关
			$(".btn-to-cart").click(function(){
				//判断有没有登录
				if(!$.cookie("hasLogin")){
					if(confirm("请登录")){
						location.href="login.html";
						return false;
					};
				}
				//判断有没有选择尺寸,如果没有，则要报错
				var isChosed = false;
				if(data.size){
					aSizes.each(function(){
						if($(this).hasClass('ck')){	
							isChosed = true;
						}
					});
					if(isChosed === false){
						$(".size").parent().addClass('error').find(".box").css("display","block");
						return false;
					}
					
				}
				//把商品数据存入cookie当中	
				//初始化数据库
				if(!$.cookie("goods")){
					var oGoodInfo = {};			
					$.cookie("goods",JSON.stringify(oGoodInfo),{"expires":200,"path":"/"});		
				}
				//console.log(JSON.parse($.cookie("goods")));		
				function addGoods(){
					//存放商品信息之前，要检查该商品是否已经加入购物车
						//首先获取该商品的ID，然后在cooKie 中对比

					var oGoodInfo = JSON.parse($.cookie("goods") );
					console.log(oGoodInfo);
					for(var oA in oGoodInfo){
						if(oGoodInfo[oA].id == iId){
							alert("该商品已经加入购物车了");
							return false;
						}
					}
					//取出COOKIE添加商品数据
					var src = data.color?data.color[oIcurColor].src1:data.magnify.src1;
					var color = data.color?data.color[oIcurColor]:"";
					var goodNum = parseInt($("#good-num-input").val() );
					oGoodInfo["good"+iId] = {
						"id":iId,
						"src":src,
						"title":data.title,
						"description":data.description,
						"price":data.price,
						"color":color,
						"size":oIcurSize,
						"privilege":20,
						"goodNum":goodNum
					};
			
					$.cookie("goods",JSON.stringify(oGoodInfo),{expires:200,path:"/"});
					var oGoods = JSON.parse($.cookie("goods"));
					console.log(oGoods);
					if(oGoods["good"+iId]){
						alert("商品添加成功");
					}
				}
				//调用函数
				addGoods();
			});
			
			new Magnifier("magnifier");
			/*---------商品详情的楼层---------*/
			var iScrollArr = [];
			var iScrollTop0 = $(".detail-title").offset().top;
			var iScrollTop1 = $(".comment-title").offset().top;
			var iScrollTop2 = $(".ser-title").offset().top;
			iScrollArr.push(iScrollTop0,iScrollTop1,iScrollTop2);
			$(".tab-select a").each(function(i,elem){
				$(this).click(function(){
					$(this).addClass('active').siblings().removeClass('active');
					$("html,body").stop().animate({scrollTop:iScrollArr[i]},"slow");
				});
			});
			
			//浮动窗口
			var iTop = $(".sh-good-detail").offset().top;
			$(window).scroll(function(){
				if($(window).scrollTop()>iTop){
					$(".hide-select").css("display","block");
					$(".good-detail-nav").addClass('fixed-bar');
				}else{
					$(".hide-select").css("display","none");
					$(".good-detail-nav").removeClass('fixed-bar');
				}
				
			});
			//计算浮动窗口中的数据
			getTotal();
			function getTotal(){
				var val = $("#good-num-input").val();
				var iTotal = val*iPrice;
				$(".float-pri").html(iTotal);
				
			}
			/*-----end----商品详情的楼层--end-------*/
			
			/*---商品数量的增减------*/
			var goodsNum = 1;
			$("#less-btn").click(function(){
				goodsNum--;
				if(goodsNum<=1){
					goodsNum = 1;
					$(this).addClass('limited');
				}
				$("#good-num-input").val(goodsNum);
				getTotal();
			});
			$("#add-btn").click(function(){
				goodsNum++;
				if(goodsNum>1){
					$("#less-btn").removeClass('limited');
				}
				$("#good-num-input").val(goodsNum);
				getTotal();
			});
			/*---------封装的行数--------*/
			//往放大镜中加载图片
			function addPic(){ 
			 	//加载内容进去之前先清空
			 	$(".big-img-box img").detach();
			 	$(".middle-img-box img").detach();
			 	$(".small-img-box ul li").detach();
			 	//添加节点和内容
				var oGoodImg = data.color[oIcurColor];
				var oBigImg = $('<img src="'+oGoodImg.src1+'" alt="">');
				$(".big-img-box").append(oBigImg);
				var oMiddleImg = $('<img src="'+oGoodImg.src1+'" alt="">');
				$(".middle-img-box").append(oMiddleImg);
				for(var o in oGoodImg){
					var oLi = $('<li><img src="'+oGoodImg[o]+'" alt=""></li>');
					$(".small-img-box ul").append(oLi);
				}
				//给第一个小图片（li）加一个acitve类名
				$(".small-img-box ul li:first").addClass('active');
			 }

	
	});

	/*---------end----AJAX-----end-----*/
	/*---放大镜功能----*/
	function Magnifier(id){
		//定义变量
		var oGallery = $("#"+id);
		this.oBigBox = oGallery.find(".big-img-box");
		this.oBigBoxWid = this.oBigBox.width();
		this.oBigBoxHei = this.oBigBox.height();
		this.oBigBoxImg = this.oBigBox.find("img");

		this.oMiddleBox = oGallery.find(".middle-img-box");
		this.oMiddleBoxHei = this.oMiddleBox.height();
		this.oMiddleBoxWid = this.oMiddleBox.width();
		this.oSmallBox = oGallery.find(".small-img-box");
		this.oMask = oGallery.find(".mask");
		this.oMaskHeight = this.oMask.height();
		this.oMaskWidth = this.oMask.width();
		this.oPrev = oGallery.find(".prev");
		this.oNext = oGallery.find(".next");
		this.oUl = oGallery.find("ul");
		this.oLiWid = this.oUl.find("li").outerWidth();
		this.oLiLen = this.oUl.find("li").length;
		this.iNum = 0;	//当前图片的索引值

		//初始化设置ul的宽度
		//this.init();

		//middle-img-box的鼠标移入事件
		var _this = this;
		$(".middle-img-box").mouseover(function(e){
			_this.showAndHide(e);
		});
		$(".middle-img-box").mouseout(function(e){
			_this.showAndHide(e);
		});


		//small-img-box中的图片的鼠标点击事件
		$(".small-img-box li").each(function(i,elem){
			$(this).click(function(){
				_this.iNum = i;
				_this.tab();
			});
		});


		//middle-img-box的mousemove事件
		$(".middle-img-box").mousemove(function(e){
			_this.magnify(e);
		});

		//small-img-box 中左右按钮的点击事件
		$(".small-img-box .prev").click(function(){
			_this.ulMoveLeft();
		});

		$(".small-img-box .next").click(function(){
			_this.ulMoveRight();
		});
	}

	Magnifier.prototype.init = function(){
		this.oUl.css("width",this.oLiWid*this.oLiLen+10*this.oLiLen);
	};
	//显示和隐藏功能的实现
	Magnifier.prototype.showAndHide = function(eve){
		if(eve.type ==="mouseover"){
			this.oMask.show();
			this.oBigBox.show();
		} 
		if(eve.type ==="mouseout"){
			this.oMask.hide();
			this.oBigBox.hide();
		}
	};
	//切换图片的操作
	Magnifier.prototype.tab = function(){
		this.oBigBox.find("img").attr("src",this.oSmallBox.find('li').eq(this.iNum).find('img').attr('src'));
	
		this.oMiddleBox.find("img").attr("src",this.oSmallBox.find('li').eq(this.iNum).find('img').attr('src'));
		this.oUl.find("li").each(function(){
			$(this).removeClass('active');
		});
		this.oUl.find("li").eq(this.iNum).addClass('active');
	};
	//放大镜操作
	Magnifier.prototype.magnify = function(eve){
		if(eve.type == "mousemove"){	
			//mask相对于窗口的绝对定位
			var disX = eve.pageX - this.oMaskWidth/2;
			var disY = eve.pageY - this.oMaskHeight/2;
			var offset = this.oMask.offset();
			this.oMask.offset({top: disY,left:disX});
			//限制mask的移动范围,获取mask相对于有定位的父元素，.middle-img-box的相对定位位置
			var oPos = this.oMask.position();
			var iPosTop = oPos.top;
			var iPosLeft = oPos.left;
			if(iPosTop<0){
				iPosTop = 0;
			}else if(iPosTop>this.oMiddleBoxHei -this.oMaskHeight ){
				iPosTop = this.oMiddleBoxHei -this.oMaskHeight;
			}
			if(iPosLeft<0){
				iPosLeft = 0;
			}else if(iPosLeft>this.oMiddleBoxWid - this.oMaskWidth){
				iPosLeft = this.oMiddleBoxWid - this.oMaskWidth;
			}
			//重新设置mask的相对定位位置
			this.oMask.css({
				top: iPosTop,
				left: iPosLeft
			});
			//实现放大功能

				/*-------注意------隐藏元素的宽高用width()/height()获取不到--*/
			this.oBigBoxImgWid = this.oBigBoxImg.width();
			this.oBigBoxImgHei = this.oBigBoxImg.height();

			var rateX = iPosLeft/(this.oMiddleBoxWid - this.oMaskWidth);
			var rateY = iPosTop/(this.oMiddleBoxHei - this.oMaskHeight);
			this.oBigBoxImg.css({
				top: -rateY*(this.oBigBoxImgHei - this.oBigBoxHei),
				left: -rateX*(this.oBigBoxImgWid - this.oBigBoxWid)
			});
		}
		
	};
	//小图片盒子的左右移动
	Magnifier.prototype.ulMoveLeft = function(eve){
		var _this = this;
		if(parseInt(this.oUl.css("right") )>=0){
			this.oUl.css("right",0);
		}else{	
			this.oUl.css({
				"left": function(index,value){
					var val = parseInt(value);
					val -= _this.oLiWid+10;
					return val;
				}
			});
		}
	};
	Magnifier.prototype.ulMoveRight = function(eve){
		var _this = this;
		if(parseInt(this.oUl.css("left") )>=0){
			this.oUl.css("left",0);
		}else{	
			this.oUl.css({
				"left": function(index,value){
				var val = parseInt(value);
					val += _this.oLiWid+10;
					return val;
				}
			});

		}
	};
	
	

});
