$(function(){
	$.ajax({
		type: "get",
		url:"../data/common/new.json",
		success: function(data){
			var oMenu1 = data.menu1;
			var oMenu11 = data.menu11;
			// console.log(oMenu1);
			for(var key in oMenu1){
				console.log(key);
				for(var obj in oMenu1[key]){
					console.log(oMenu1[key][obj]);
				}
			}
		}
	});
});