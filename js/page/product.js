require('../../sass/page/product.scss');
require('../lib/rootFontSizeAdjust.js');
require('swiper');
var weui = require('../lib/weui.js');
var $ = require('../lib/jquery-3.2.1.min.js');
var isLogin = require('../common/isLogin.js'); //理论上是布尔值
var queryParamVal = require('../common/queryParamVal.js');

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
  var insuranceFilterSwipeHtml =
    '<div class="insurance-filter-swipe" id="JinsuranceFilterSwipe">' +
    '<div class="overlay"></div>' +
    '<div class="insurance-filter-wrap">' +
    '<div class="insurance-filter" id="insuranceFilter">' +
    '<div class="box box-filter">' +
    '<div class="hd"><i class="icon iconfont-prod icon-fenlei"></i>保险分类</div>' +
    '<div class="bd">' +
    '<ul class="catigory-list list-col-3">' +
    '<li class="on"><a href="javascript:;">全部</a></li>' +
    '<li><a href="javascript:;">重疾险</a></li>' +
    '<li><a href="javascript:;">健康医疗</a></li>' +
    '<li><a href="javascript:;">寿险</a></li>' +
    '<li><a href="javascript:;">少儿教育金</a></li>' +
    '<li><a href="javascript:;">养老保险</a></li>' +
    '<li><a href="javascript:;">其他保险</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '<div class="box box-filter">' +
    '<div class="hd"><i class="icon iconfont-prod icon-people"></i>保障对象</div>' +
    '<div class="bd">' +
    '<ul class="catigory-list list-col-3">' +
    '<li class="on"><a href="javascript:;">全部</a></li>' +
    '<li><a href="javascript:;">少儿</a></li>' +
    '<li><a href="javascript:;">老人</a></li>' +
    '<li><a href="javascript:;">成年</a></li>' +
    '</ul>' +
    '</div>' +
    '</div>' +
    '<div class="btn-wrap">' +
    '<a href="javascript:;" class="btn btn-cancel">取消</a>' +
    '<a href="javascript:;" class="btn btn-okay">确定</a>' +
    '</div>' +
    '</div>' +
    '<div class="asking">' +
    '<span>请专业顾问帮忙<i class="icon iconfont-prod icon-help"></i></span>' +
    '</div>' +
    '</div>' +
    '</div>';

  //有帮你选的情况下才出现以下内容(保险列表页特殊)
  if ($('#Jhelper').length) {
    !$('#JinsuranceFilterSwipe').length ? $('#container').append(insuranceFilterSwipeHtml) : '';
    $('#Jhelper').bind('click', function () {
      swipeLayerShow(this);
    })
  }
  //保险列表页用到
  $('.jswipelayershow').bind('click', function () {
    swipeLayerShow(this);
  })

  function swipeLayerShow(ele) {
    // console.log(ele);
    $('#JinsuranceFilterSwipe').addClass('insurance-filter-swipe-show');
    $('body').css({
      'height': $(window).height(),
      'overflow': 'hidden'
    })
    $('.insurance-filter .btn-cancel').bind('click', function () {
      $('.insurance-filter-swipe').removeClass('insurance-filter-swipe-show');
      $('body').removeAttr('style');
    })
    if (!$(ele).data('help')) {
      $('#JinsuranceFilterSwipe').find('.insurance-filter').height('auto');
      $('#JinsuranceFilterSwipe').find('.asking').hide();
    } else {
      $('#JinsuranceFilterSwipe').find('.insurance-filter').removeAttr('style');
      $('#JinsuranceFilterSwipe').find('.asking').show();
    }
  }

  // 选择功能
  $('.catigory-list').each(function (listIndex, listElem) {
    $(listElem).find('li').each(function (itemIndex, itemElem) {
      $(itemElem).on('click', function () {
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
      })
    })
  });
  //提交
  $('#insuranceFilter .btn-okay').on('click', function () {
    console.log('提交');
  })











  // 滚动事件
  
  if ($('.weui-navbar').length) {
    var navFixedHeight = $('.weui-navbar').offset().top;
  }
  $(window).scroll(function () {
    var docHeight = document.body.scrollHeight,
      scrollHeight = document.body.scrollTop + document.documentElement.scrollTop,
      viewHeight = window.innerHeight;
    // 导航跟随
    if (scrollHeight >= navFixedHeight) {
      $('.weui-navbar').addClass('weui-navbar-fixed');
    } else {
      $('.weui-navbar').removeClass('weui-navbar-fixed');      
    }
  });

});



