$(function(){
	var regs = {
	phoneNumReg: /^1[34578]\d{9}$/,
	conCodeNumReg: /[a-zA-Z]/,
	pwdReg: /^[a-z0-9A-Z]{6,20}$/
	};

	/*--------手机验证------*/
	//首先获取到COOKIE中用户的数据（这里用COOKEI模拟的后端数据库）
	var data = null;
	if($.cookie("regInfo")){
		data = JSON.parse($.cookie("regInfo"));
	}
	
	var oPhoneNum = $("#phone-num");
	oPhoneNum.on({
		"focus": function(){
			$(this).addClass('focus');
			$(this).siblings('.tip2').show().removeClass('error').addClass('default').html("请输入常用手机号，避免忘记");
		},
		"blur": function(){
			$(this).removeClass('focus');
			
			$(this).siblings('.tip2').removeClass('default');
			if(oPhoneNum.val() ===""){
				$(this).siblings('.tip2').addClass('error').html("请输入手机号码");
			}else {
				var value = oPhoneNum.val();
				if(regs.phoneNumReg.test(value) ){
					//检查是否已经注册
					for(var key in data){
						if(data[key].userName==value){
							$(this).siblings('.tip2').addClass('error').html("该账号已经注册，请重新输入");
							$(this).siblings('.tip1').removeClass('right');
							return false;
						}
					}
					$(this).siblings('.tip1').addClass('right');
					$(this).siblings('.tip2').removeClass('error');
					$(this).siblings('.tip2').hide();
				}else{
					$(this).siblings('.tip2').addClass('error').html("手机格式不正确，请核对后在输入");
					$(this).siblings('.tip1').removeClass('right');
				}
			}	
		}
	});

	

	/*----生成验证码-----*/
	getCode("#code-pic-num");
	$("#code-pic-num").click(function(){
		getCode("#code-pic-num");

	});
	$("#switch-over").click(function(){
		getCode("#code-pic-num");
	});

	//验证码验证
	var oVerifyCode = $("#verify-code");
	oVerifyCode.on({
		"focus": function(){
			$(this).addClass('focus');
			$(this).siblings('.tip2').show().removeClass('error').addClass('default').html("请输入验证码");
		},
		"blur": function(){
			$(this).removeClass('focus');
			
			$(this).siblings('.tip2').removeClass('default');
			if(oVerifyCode.val() ===""){
				$(this).siblings('.tip2').addClass('error').html("请输入验证码");
			}else {
				var value = oVerifyCode.val();
				if(value.toLowerCase() === $("#code-pic-num").html().toLowerCase() ){
					$(this).siblings('.tip1').addClass('right');
					$(this).siblings('.tip2').removeClass('error');
					$(this).siblings('.tip2').hide();
				}else{
					$(this).siblings('.tip2').addClass('error').html("验证码不正确，请核对后在输入");
					$(this).siblings('.tip1').removeClass('right');
				}
			}	
		}
	});


	/*-----设置密码验证-----*/
	var oSetCode = $("#set-code");
	oSetCode.on({
		"focus": function(){
			$(this).addClass('focus');
			$(this).siblings('.tip2').show().removeClass('error').addClass('default').html("请输入密码");
		},
		"blur": function(){
			$(this).removeClass('focus');
			
			$(this).siblings('.tip2').removeClass('default');
			if(oSetCode.val() ===""){
				$(this).siblings('.tip2').addClass('error').html("请输入密码");
			}else {
				var value = oSetCode.val();
				if(regs.pwdReg.test(value) ){
					$(this).siblings('.tip1').addClass('right');
					$(this).siblings('.tip2').removeClass('error');
					$(this).siblings('.tip2').hide();
				}else{
					$(this).siblings('.tip2').addClass('error').html("密码格式不正确，请核对后在输入");
					$(this).siblings('.tip1').removeClass('right');
				}
			}	
		}
	});

	/*-----确认密码验证-----*/
	var oConCode = $("#confirm-code");
	oConCode.on({
		"focus": function(){
			$(this).addClass('focus');
			$(this).siblings('.tip2').show().removeClass('error').addClass('default').html("请再次输入密码");
		},
		"blur": function(){
			$(this).removeClass('focus');
			$(this).siblings('.tip2').removeClass('default');
			if(oConCode.val() ===""){
				$(this).siblings('.tip2').addClass('error').html("请再次输入密码");
			}else {
				var value = oConCode.val();
				if(value== oSetCode.val()){
					$(this).siblings('.tip1').addClass('right');
					$(this).siblings('.tip2').removeClass('error');
					$(this).siblings('.tip2').hide();
				}else{
					$(this).siblings('.tip2').addClass('error').html("两次输入的密码不一致，请核对后在输入");
					$(this).siblings('.tip1').removeClass('right');
				}
			}	
		}
	});

	/*------利用COOKIE模拟用户数据-----*/
	if(!$.cookie("regInfo")){
	//如果没有该COOKEI才可以执行这一步，要不然下次打开页面还会执行，这样就会把之前的数据覆盖掉	
		var oUserInfo = {
			"user0":{
				"userName":15882236764,
				"pwd":135
			},
			"user1":{
				"userName":15882236765,
				"pwd":"13540229583.."
			},
			"user2":{
				"userName":"2436151816@qq.com",
				"pwd":1354
			},
			"user3":{
				"userName":"freedom",
				"pwd":123
			},
			"userNum": 4
		};
		$.cookie("regInfo",JSON.stringify(oUserInfo),{expires:200,path:"/"});
	}
	/*----提交注册----*/
	$("#commit").click(function(){
		//首先判断是够签了协议
		if(! $("#agreement")[0].checked){
			$("#agreement").siblings('.tip2').addClass('error').show().html("请勾选协议");
			return false;
		}

		//在判断内容是否为空
		var len = $(".inp").length;
		var i;
		for(i=0;i<len;i++){
			var isWrite = $(".inp").eq(i).val();
			if(isWrite===""){
				alert("请输入一些东西吧！");
				return false;
			}
		}

		//如果签了协议并且内容都填写了就把用户信息添加到cookie中
		var oRegInfo = JSON.parse($.cookie("regInfo") );
		var iUserNum = oRegInfo.userNum;	//获取cookie
		console.log(iUserNum);
		/*
			因为，全局变量num会在页面关掉后自动销毁，等到下次打开页面的时候，num的值有会被重置为0，从而只可以注册一个用户（因而我们不可以使用全局变量），为了解决这个问题，我们可以用COOKIE把num值存起来
		*/
	/*	var num = 0;
		var oNumObj = {};
		if($.cookie("oNum")){
			var oNum = JSON.parse($.cookie("oNum")).num;
			console.log(oNum);
			num = oNum;
			//num = parseInt(oNum.num);
			console.log(typeof num,num);
			num++;
		}else{

			num = 0;
			for(var key in oRegInfo){
				num++;
			}
			oNumObj = {
				"num":num
			};
			$.cookie("oNum",JSON.stringify(oNumObj),{"expires":200,"path":"/"});
		}	

		
		oNumObj = {
			"num":num
		};*/
		//再次把num保存到cookie中，以保证页面关闭或num值不会被还原，从而可以使我们注册多个用户
		//$.cookie("oNum",JSON.stringify(oNumObj),{"expires":200,"path":"/"});
		oRegInfo["user"+iUserNum] = {};
		oRegInfo["user"+iUserNum].userName = oPhoneNum.val();
		oRegInfo["user"+iUserNum].pwd = oSetCode.val();
		iUserNum++;
		oRegInfo.userNum = iUserNum;
		//再次用户信息保存COOKIE
		$.cookie("regInfo",JSON.stringify(oRegInfo),{expires:200,path:"/"});
		console.log(oRegInfo);
	});
	

});



//封装的函数
/*------获取验证码-----*/
function getCode(selector){
	var str = "abcdefghigklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var arr = str.split("");
	var a1 = arr[parseInt(Math.random()*62)];
	var a2 = arr[parseInt(Math.random()*62)];
	var a3 = arr[parseInt(Math.random()*62)];
	var a4 = arr[parseInt(Math.random()*62)];
	var arr1 = [];
	arr1.push(a1,a2,a3,a4);
	var str1 = arr1.join("");
	$(selector).html(str1);
}