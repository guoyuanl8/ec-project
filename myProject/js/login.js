$(function(){
	//首先获取到COOKIE中用户的数据（这里用COOKEI模拟的后端数据库）
	var oRegInfo = null;
	if($.cookie("regInfo")){
		 oRegInfo = JSON.parse($.cookie("regInfo") );
	}

	console.log(oRegInfo);
	/*-------------用户名的校验------------*/
	var oUser = "";
	$("#username").on({
		"focus": function(){
			$(this).siblings('.tip2').hide();
			$(this).css("border","1px solid #5fc100");
		},
		"blur": function(){
			var value = $(this).val();
			var _this=this;

			if(value===""){
				$(this).css("border","1px solid red").siblings('.tip2').show().html("请输入您注册的手机号/邮箱/昵称");
			}else{
				//匹配输入的用户名与数据库中的用户名是否一致，如果不一致，则提示没有该用户
				var isReg = false;
				for(var obj in oRegInfo){
					if(oRegInfo[obj].userName==value){
						oUser = obj;
						$(this).addClass('right').css("border","1px solid #a2a2a2").siblings('.tip1').addClass('right');
						isReg = true;
					}
				}
				if(isReg === false){
					$(this).addClass('error').siblings('.tip2').show().html("你输入的用户名不正确，请核实后再输入");
					$(this).siblings('.tip1').removeClass('right');
				}
				//如果有该用户，那么判断COOKIE中有没有存过（以前是够勾选过保存密码）
				if($.cookie("pwd")){
					var oJson = JSON.parse($.cookie("pwd"));
					$("#pwd").val(oJson.password);
				}
				
			}
		}
	});

	/*------密码框的校验---------*/
	//密码框的焦点事件
	$("#pwd").on({
		"focus": function(){
			$(this).siblings('.tip2').hide();
			$(this).css("border","1px solid #5fc100");
		},
		"blur": function(){		
			$(this).css("border","1px solid #a2a2a2");
		}
	});
	//点击登录的时候校验密码，并判断是否创建COOKIE
	$("#login").click(function(){
		var oPwd = $("#pwd");
		var value = oPwd.val();
		if(oRegInfo[oUser].pwd!=value){
			oPwd.css("border","1px solid red");
			oPwd.addClass('error').siblings('.tip2').show().html("密码有误，请重新输入");	
		}else{
			//模拟登录后的后台数据
		/*	$.ajax({
				type:"get",
				url: "../oRegInfo/common/isLogin.json",
				success: function(dig){
					dig.status = 0;
					dig.userName = $("#username").val();
					
				}
			});*/
			//改为利用cookie模拟
			var name = {userName:$("#username").val(),password:value};
			$.cookie("hasLogin",JSON.stringify(name));
			console.log($.cookie("hasLogin"));
			if($("#checkbox")[0].checked){
				$.cookie("pwd",JSON.stringify(name),{expires:7,path:"/"});		
				window.open("index.html","_self");
			}else{
				window.open("index.html","_self");
			}
		}
	});
});