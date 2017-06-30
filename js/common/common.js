

// 滚动事件
if ($('.weui-navbar').length) {
  var navFixedHeight = $('.weui-navbar').offset().top;
}
$(window).scroll(function () {
  var docHeight = document.body.scrollHeight,
    scrollHeight = document.body.scrollTop + document.documentElement.scrollTop,
    viewHeight = window.innerHeight;
  // 导航跟随
  if ($('.weui-navbar').length) {
    if (scrollHeight >= navFixedHeight) {
      $('.weui-navbar').addClass('weui-navbar-fixed');
    } else {
      $('.weui-navbar').removeClass('weui-navbar-fixed');
    }
  }
});