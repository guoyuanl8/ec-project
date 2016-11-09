$(function(){
	/*---取出在购物车中新存的cookie------*/
	var oNewGoods = JSON.parse($.cookie("newGoods"));
	//console.log(oNewGoods);
	//创建商品对象，放入页面中
	for(var key in oNewGoods){
		if(key== "goodAmount" || key == "actualMoney" || key == "privilege"){
			continue;
		}
		var oCartForm = $(
			'<div class="cart-form clear">'+
				'<div class="c-msg fl clear">'+
					'<dl>'+
						'<dt class="good-img fl"><img src="'+oNewGoods[key].src+'" alt=""></dt>'+
						'<dd class="good-info fl">'+
							'<p class="msg-tit">'+oNewGoods[key].title+'</p>'+
							'<p class="msg-cor">'+						
							'</p>'+
						'</dd>'+
					'</dl>'+
				'</div>'+
				'<div class="c-price fl">'+
					'￥<i class="price">'+oNewGoods[key].price+'</i>'+
				'</div>'+
				'<div class="c-quantity fl">'+
					'x <i>'+oNewGoods[key].goodNum+'</i>'+
				'</div>'+
				'<div class="c-sum fl">'+
					'￥<span class="sum">'+oNewGoods[key].subTotal+'</span>'+
				'</div>'+
			'</div>'
		);
		//添加到页面中
		$(".cart-form-box").append(oCartForm);
		//获取当前添加元素的索引
		var index = oCartForm.index();
		if(oNewGoods[key].color){
			var oP = $('<p class="msg-cor"></p>');
			var oColorSpan = $('<span>颜色：'+oNewGoods[key].color+'</span>');
			$(".cart-form .msg-cor").eq(index).append(oColorSpan);
		}
		if(oNewGoods[key].size){
			var oSizeSpan = $('<span class="standard">规格：'+oNewGoods[key].size+'</span>');
			$(".cart-form .msg-cor").eq(index).append(oSizeSpan);
		}
	}
	//更新结算时的商品金额、实付金额、优惠
	$("#total-pri").html("￥"+oNewGoods.goodAmount);
	$("#actual-money").html(oNewGoods.actualMoney);
	$("#privilege").html(oNewGoods.privilege);

	/*------三级联动--------*/
	//获取地址信息
	$.ajax({
		type:"get",
		url:"../data/common/address.json",
		success: function(data){
			var iProLen = data.regions.length;
			var html = "<option>---请选择省份---</option>";
			for(var i=0;i<iProLen;i++){
				html += '<option>'+data.regions[i].name+'</option>';
			}
			$(html).appendTo($("#province"));
		}
	});
	//当省发生变化的时候，在获取相应省下面的市，并填充到页面
	$("#province").change(function(){
		//获取省对应的索引值
		var iProIndex = $("#province option:selected").index()-1;
		$.ajax({
			type:"get",
			url:"../data/common/address.json",
			success: function(data){
			var iCityLen = data.regions[iProIndex].regions.length;
			var html = '<option>- - 请选择 - </option>';
				for(var i=0;i<iCityLen;i++){
					html += '<option>'+data.regions[iProIndex].regions[i].name+'</option>';
				}
				$("#city").html(html);

			}
		});
	});
	//当市发生变化的时候，在获取相应市下面的区县，并填充到页面
	$("#city").change(function(){
		//获取市对应的索引值
		var iCityIndex = $("#city option:selected").index()-1;
		var iProIndex = $("#province option:selected").index()-1;
		$.ajax({
			type:"get",
			url:"../data/common/address.json",
			success: function(data){
			var iAreaLen = data.regions[iProIndex].regions[iCityIndex].regions.length;
			var html = '<option>- - 请选择 - </option>';
				for(var i=0;i<iAreaLen;i++){
					html += '<option>'+data.regions[iProIndex].regions[iCityIndex].regions[i].name+'</option>';
				}
				$("#area").html(html);

			}
		});
	});


});