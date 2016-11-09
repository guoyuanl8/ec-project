$(function(){
	//读取COOKIE中的商品数据，然后在购物车中创建相应的商品
	/*---获取COOKIE-----*/
	if(!$.cookie("goods")){
		$(".no-goods-cart").parent().css("display","block");
		$(".has-good-cart").css("display","none");
			
	}else{	

		$(".no-goods-cart").parent().css("display","none");
		var oGoods = JSON.parse($.cookie("goods") );
		console.log(oGoods);
		var iGoodAmount = 0;	//初始化商品金额	
		var iPrivilege =0;	//初始化是否有优惠
		for(var key in oGoods){
			var oCartForm = $(
				'<div class="cart-form clear" id="'+oGoods[key].id+'">'+
					'<div class="c-check fl">'+
						'<input type="checkbox" class="check" checked="checked">'+
					'</div>'+
					'<div class="c-msg fl clear">'+
						'<dl>'+
							'<dt class="good-img fl"><img src="'+oGoods[key].src+'" alt=""></dt>'+
							'<dd class="good-info fl">'+
								'<p class="msg-tit">'+oGoods[key].title+'</p>'+
								'<p class="msg-cor">'+							
								'</p>'+
							'</dd>'+
						'</dl>'+
					'</div>'+
					'<div class="c-price fl">'+
						'￥<i class="price">'+oGoods[key].price+'</i>'+
					'</div>'+
					'<div class="c-quantity fl">'+
						'<div class="tip">'+
							'<a href="##" class="less-btn fl">-</a>'+
							'<input type="text"  value="'+oGoods[key].goodNum+'" class="num fl good-num-input">'+
							'<a href="##" class="add-btn fl">+</a>'+
						'</div>'+
					'</div>'+
					'<div class="c-sum fl">'+
						'￥<span class="sum">'+oGoods[key].price*oGoods[key].goodNum+'</span>'+
					'</div>'+
					'<div class="c-handler fl">'+
						'<i class="del"></i>'+
					'</div>'+
				'</div>'
			);
			$(".cart-form-wrap").append(oCartForm);
			//获取当前添加元素的索引
			var index = oCartForm.index();
			if(oGoods[key].color){
				var oP = $('<p class="msg-cor"></p>');
				var oColorSpan = $('<span>颜色：'+oGoods[key].color+'</span>');
				$(".cart-form-wrap .msg-cor").eq(index).append(oColorSpan);
			}
			if(oGoods[key].size){
				var oSizeSpan = $('<span class="standard">规格：'+oGoods[key].size+'</span>');
				$(".cart-form-wrap .msg-cor").eq(index).append(oSizeSpan);
			}
			/*------节点创建好之后就开始添加事件和功能------*/
			//有无优惠

			if(oGoods[key].privilege){
				iPrivilege = oGoods[key].privilege;
				$("#privilege").html(iPrivilege);
			}
		
			/*--------页面打开时初始化商品总价和实际总金额---------*/

			getToTal(iPrivilege);
		}

		/*-----input的点击事件---------*/

		var iCheckLen = $(":checkbox").length;
		var aCheckInputs = $(":checkbox").get();
		var aCheckAllInputs = $(".check-all").get();
		var iCartFormLen = $(".cart-form").length;
		for(var i=0;i<iCheckLen;i++){
			aCheckInputs[i].onclick = function(){
				if(this.className === "check-all"){
					for(var j=0;j<iCheckLen;j++){
						aCheckInputs[j].checked = this.checked;
					}
				}
				if(this.checked===false){
					for(var s=0;s<aCheckAllInputs.length;s++){
						aCheckAllInputs[s].checked = false;
					}
				}
				//计算总价
				getToTal(iPrivilege);
			};
		}
		//数量的增减(+-的点击事件)
		/*---商品数量的增减------*/
		
		$(".less-btn").each(function(i){
			$(this).click(function(){
				var val = $(".good-num-input").eq(i).val();
				val--;
				if(val<=1){
					val = 1;
					$(this).addClass('limited');
				}
				$(".good-num-input").eq(i).val(val);
				getToTal(iPrivilege);
			});
		});
		$(".add-btn").each(function(i){
			$(this).click(function(){
				var val = $(".good-num-input").eq(i).val();
				val++;
				if(val>1){
					$(".less-btn").eq(i).removeClass('limited');
				}
				$(".good-num-input").eq(i).val(val);
				getToTal(iPrivilege);
			});
		});
		/*--------删除功能-------*/
	
		$(".cart-form .del").each(function(i){
			$(this).click(function(){
				var iId = $(this).parents(".cart-form").attr("id");
				//删除页面中的节点
				$(this).parents(".cart-form").detach();
				getToTal(iPrivilege);
				//删除对应的cookie中的商品的数据
				delete oGoods["good"+ iId];
				//再次保存COOKIE
				$.cookie("goods",JSON.stringify(oGoods),{"expires":200,"path":"/"});
				//删除后判，如果购物车为空（这时候存储商品的内容为空，但是这个JSON对象本身还存在），那么删除这个JSON对象
				if($(".cart-form").length===0){
					$.cookie("goods","",{"expires":-1,"path":"/"});
				}
				//console.log($.cookie("goods"));
			});
		});
		$("#del").parent().click(function(){
			$(".cart-form").each(function(){
				$(this).find("input:checked").parents(".cart-form").detach();
			});
			getToTal(iPrivilege);
			if($(".cart-form").length===0){
				$.cookie("goods","",{"expires":-1,"path":"/"});
			}
		});
		/*---------提交结算---------*/
		$("#account-btn").click(function(){	
			var len = $(".cart-form").length;
			var aInputs = $(".cart-form").find('.check').get();
			var newJson = {};
			var iSubtotal = 0;	//当前商品的价格小计
			var iGoodAmount = 0;	//商品金额
			var iActualMoney = 0;	//实际价格
			var iPrivilege = 0;	//	假设优惠为0元
			var onOff = false;	//判断是否勾选了商品
			//首先要判断有没有勾选商品，如果一件都没有这提示勾选
			for(var s=0;s<len;s++){
				if(aInputs[s].checked===true){
					onOff = true;
				}
			}
			if(!onOff){
				alert("请勾选商品");
				return false;
			}
			for(var i=0;i<len;i++){
				if(aInputs[i].checked===true){

					//获取当前商品的id，然后他对应的商品从原来的cookie中取出来存放在一个新的cookie中的
					var iId = $(".cart-form").eq(i).attr("id");
					iSubtotal = $(".c-sum .sum").eq(i).html();
					iGoodAmount = $("#total-pri").html();
					iActualMoney = $("#actual-money").html();
					iPrivilege = $("#privilege").html();
					newJson["g"+iId] = oGoods["good"+iId];
					newJson["g"+iId].subTotal = iSubtotal;
					newJson.goodAmount = iGoodAmount;
					newJson.actualMoney = iActualMoney;
					newJson.privilege = iPrivilege;
					//console.log(newJson);
				}
			}
			//保存这个新的cookie,然后在结算页获取
			$.cookie("newGoods",JSON.stringify(newJson),{"expires":200,"path":"/"});
			//console.log($.cookie("newGoods"));
			//跳转到结算页面
			location.href="pay.html";
		});
	}
});

//封装获取总金额的函数
function getToTal(privilege){
	var iSelectNum = 0;
	var iPrice =0;
	var iSubtotal = 0;
	var iSelect = 0;	//已选商品数量
	var iGoodAmount = 0;	//商品金额
	var iActualMoney = 0;	//实际价格
	var iPrivilege = privilege;	//	假设优惠为0元

	var len = $(".cart-form").length;
	var aCartForms = $(".cart-form").get();
	var aInputs = $(".cart-form").find('.check').get();

	for(var i=0;i<len;i++){
		iSelectNum =  parseInt($(".good-num-input").eq(i).val());
		iPrice = $(".c-price .price").eq(i).html();
		//当前行的价格小计
		iSubtotal = iSelectNum*iPrice;
		$(".c-sum .sum").eq(i).html(iSubtotal);
		if(aInputs[i].checked===true){
			//已选商数量
			iSelect += iSelectNum;
			//商品金额
			iGoodAmount += iSubtotal;
			//实际价格
			iActualMoney = iPrivilege ? iGoodAmount - iPrivilege : iGoodAmount;		
		}
	}
	$("#total-num").html(iSelect);
	$("#total-pri").html(iGoodAmount);
	$("#actual-money").html("￥"+iActualMoney );

}