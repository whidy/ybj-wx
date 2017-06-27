require('../../sass/page/product.scss');
require('../lib/rootFontSizeAdjust.js');
require('swiper');
var weui = require('../lib/weui.js');
var $ = require('../lib/jquery-3.2.1.min.js');

$(document).ready(function () {
  //顶部焦点图
  var hasPagination = $('.swiper-container .swiper-slide').length > 1 ? '.swiper-pagination' : '';
  var swiper = new Swiper('.swiper-container', {
    pagination: hasPagination,
    paginationClickable: true
  });

  //保险类型切换
  weui.tab('#tab', {
    defaultIndex: 0,
    onChange: function (index) {
      // console.log(index);
    }
  });

  //帮你选功能
  if ($('#Jhelper').length) {
    $('#Jhelper').bind('click',function() {
      $('.swipe-layer').addClass('swipe-layer-show');
      $('body').css({
        'height': $(window).height(),
        'overflow': 'hidden'
      })
      $('.insurance-filter .btn-cancel').bind('click',function() {
        $('.swipe-layer').removeClass('swipe-layer-show');
        $('body').removeAttr('style');
      })
    })
  }

  if ($('#insuranceFilter').length) {
    // 选择功能
    $('.catigory-list').each(function (listIndex, listElem) {
      $(listElem).find('li').each(function (itemIndex, itemElem) {
        $(itemElem).bind('click', function () {
          $(this).addClass('on');
          $(this).siblings().removeClass('on');
        })
      })
    });
    // 提交
    

  }
});
