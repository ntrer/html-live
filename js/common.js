// var API_ROOT = "http://192.168.0.55:48730";
// var live_val_Id = "38510810284a42f19b243153a6d71e83";
// var token_val_id= "testbbc001tokenid";

// var API_ROOT = location.origin;
// var API_ROOT = "http://hb.shushangsoft.com"
var API_ROOT = "http://47.114.181.11:48730"
var live_val_Id = getQueryString("liveId");
var token_val_id = getQueryString("token_id");
var TAB_MESSAGE = getQueryString("tab");
var latitude = "0";
var longitude = "0";
//分享人客户id
// var liveShareCustomerId = getQueryString("liveShareCustomerId");
//当前人客户id
// var currentCustomerId = getQueryString("currentCustomerId");

var liveShareCustomerOpenId = getQueryString("liveShareCustomerOpenId");
var currentCustomerOpenId = getQueryString("currentCustomerOpenId");
// var live_val_Id = "da11253a4f8c4835b7ebcb7e0290e17b";
// var token_val_id = "b7ee70f1d33048159320d1d425e2e015";

// var API_ROOT = "http://localhost:8080/redPackets";
// var live_val_Id = "da11253a4f8c4835b7ebcb7e0290e17b";
// var token_val_id= "14a41113ad7d4b1fa3054f1ff88c8ce6";


//目前来说通常以iPhone6的屏幕尺寸来设计，也就是宽度750px，这里除以15后，1rem = 50px；
var html = document.documentElement;
var width = html.getBoundingClientRect().width;
html.style.fontSize = width / 15 + 'px'; //至于除数15可自行设置
//1rem=50;

var PERSONAL_URL = "/live/html/my.html";
document.documentElement.addEventListener('touchstart', function (event) {
	if (event.touches.length > 1) {
		event.preventDefault();
	}
}, false);

var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
	var now = Date.now();
	if (now - lastTouchEnd <= 300) {
		event.preventDefault();
	}
	lastTouchEnd = now;
}, false);


function getQueryString(key) {
	var result = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]+)", "i"));
	if (result == null || result.length < 1) {
		return "";
	}
	return result[1];
}


function loadDefaultLiveShareSettings() {
	$.post(API_ROOT + '/client/live/share', {
		url: location.href.split('#')[0],
		liveId: live_val_Id,
		token_id: token_val_id
	}, function (result) {
		// alert("http://" + location.host + "/client/live/html/new/redirect?liveId=" + live_val_Id + "&currentCustomerId=" + currentCustomerId + "&liveShareCustomerOpenId=" + currentCustomerOpenId)
		console.log("http://" + location.host + "/client/live/html/new/redirect?liveId=" + live_val_Id +  "&liveShareCustomerOpenId=" + currentCustomerOpenId);
		console.log(liveShareCustomerOpenId);
		console.log(currentCustomerOpenId);
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: result.data.appId,
			timestamp: result.data.timestamp,
			nonceStr: result.data.noncestr,
			signature: result.data.signature,
			jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage", "hideAllNonBaseMenuItem", "showMenuItems"]
		});
		wx.ready(function () {
			wx.hideAllNonBaseMenuItem();
			if (result.data.sharingFriend == 1)
				wx.showMenuItems({
					menuList: ["menuItem:share:appMessage"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				});
			if (result.data.sharingCircl == 1)
				wx.showMenuItems({
					menuList: ["menuItem:share:timeline"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
				});
			// alert('http://" + location.host + "/client/live/html/new/redirect?liveId=" + live_val_Id + "&currentCustomerId=" + currentCustomerId')
			wx.onMenuShareTimeline({
				title: result.data.sharingTitle,
				link: "http://" + location.host + "/client/live/html/new/redirect?liveId=" + live_val_Id +  "&liveShareCustomerOpenId=" + currentCustomerOpenId,
				imgUrl: "http://" + location.host + "/image/show/?fileId=" + result.data
					.sharingImage,
				success: function () {
					sharesuccess();
				},
				cancel: function () {}
			});
			wx.onMenuShareAppMessage({
				title: result.data.sharingTitle,
				desc: result.data.sharingDescribe,
				link: "http://" + location.host + "/client/live/html/new/redirect?liveId=" + live_val_Id + "&liveShareCustomerOpenId=" + currentCustomerOpenId,
				imgUrl: "http://" + location.host + "/image/show/?loginOs=0&fileId=" + result.data
					.sharingImage,
				type: 'link',
				dataUrl: '',
				success: function () {
					sharesuccess()
				},
				cancel: function () {

				}
			});
			
			wx.getLocation({
				type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
				success: function(res) {
					latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					//var speed = res.speed; // 速度，以米/每秒计
					//var accuracy = res.accuracy; // 位置精度
				},
				fail: function(res) {},
				cancel: function(res) {}
			});
		});
	});
	wx.error(function (res) {
		// alert("出错了：" + res.errMsg);
	});
}

function sharesuccess() {
	$.post(API_ROOT + "/client/live/sharesuccess", {
		liveId: live_val_Id,
		token_id: token_val_id
	}, function (data) {
		if (data.ret == "200") {
			alert("分享成功")
		} else {
			alert(data.msg)
		}
	})
}


function openwindow(url, name, iWidth, iHeight) {
	var url; //转向网页的地址;
	var name; //网页名称，可为空;
	var iWidth; //弹出窗口的宽度;
	var iHeight; //弹出窗口的高度;
	//window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
	var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
	var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
	return window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}