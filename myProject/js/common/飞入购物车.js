$(function(){
	//飞入购物车效果
	        var offset = $("#end").offset();//end 为在结束元素加一个ID ，将结束元素设置为fixed；
	        var addcar = $(this); 
	        var img = addcar.parent().parent().find('img').attr('src'); //定义图片地址
	        //将图片地址赋值给飞入效果的图片
	        var flyer = $('<img class="u-flyer" style="width:100px;height:100px;z-index:1000000;border-radius:50px" src="'+img+'">'); 
	        flyer.fly({ 
	            start: { 
	                left: event.pageX, //开始位置（必填）#fly元素会被设置成position: fixed 
	                top: event.pageY-$(document).scrollTop() //开始位置（必填） 可视窗口的距离
	            }, 
	            end: { 
	                left: offset.left+100, //结束位置（必填） 
	                top: offset.top-$(document).scrollTop()+10, //结束位置（必填） 
	                width: 0, //结束时宽度 
	                height: 0 //结束时高度 
	            }, 
	            onEnd: function(){ //结束回调 
	            	contCarNum();//数量++回调函数
	//              $("#msg").show().animate({width: '250px'}, 200).fadeOut(1000); //提示信息                
	//              addcar.css("cursor","default").removeClass('orange').unbind('click'); 
	                this.destory(); //移除dom 
	            } 
	        }); 

});