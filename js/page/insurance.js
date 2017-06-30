require('../../sass/page/insurance.scss');
require('../lib/rootFontSizeAdjust.js');
require('swiper');
// var LazyLoad = require('vanilla-lazyload');
var Lazy = require('../lib/lazyimg.js');
var weui = require('../lib/weui.js');
var $ = require('../lib/jquery-3.2.1.js');
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
  weui.tab('#insurListTab', {
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
    '<a href="./insurance-consult-b.html" class="fs-16">请专业顾问帮忙<i class="icon iconfont-prod icon-help"></i></span>' +
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

  //产品详情页相关 
  //切换
  var insurContTab = weui.tab('#insurContTab', {
    defaultIndex: 0,
    onChange: function (index) {
      replceSrc(this, '#src');
    }
  });

  //lazyload
  function replceSrc(target, type) {
    var imgs = target.getElementsByTagName("img");
    if (!imgs)
      return;
    for (var i = 0, len = imgs.length; i < len; i++) {
      var img = imgs[i];
      if (img.getAttribute(type) && !img.getAttribute('loaded')) {
        img.src = img.getAttribute(type);
        img.setAttribute('loaded', 'true')
      }
    }
  }
  var pclazy = Lazy.create({
    lazyId: 'container',
    trueSrc: "src2",
    offset: 100,
    delay: 100,
    delay_tot: 1000
  });
  Lazy.init(pclazy);
  // var myLazyLoad = new LazyLoad({
  //   container: document.getElementById('insurContTab')
  // });



  // 预约保险咨询表单相关
  /* form */
  if ($('#Jform').length) {
    // 约定正则
    var regexp = {
      regexp: {
        NAME: /^([\u4e00-\u9fa5\·]{2,10})$/,
        MOBILE: /^\d{11}$/
      }
    };
    // 表单提交
    document.querySelector('#JsubmitConsult').addEventListener('click', function () {
      weui.form.validate('#Jform', function (error) {
        // console.log(error);
        if (!error) {
          var loading = weui.loading('提交中...');
          //判断来自产品咨询还是
          var isProd = (prodId == '' ? 'noprod' : 'isProd');
          //ajax请求接口
          setTimeout(function () {
            loading.hide();
            // weui.toast('提交成功', 3000);
            //成功后的修改
            result('icon-zhengque', '你的咨询预约已成功提交</br>专业顾问将很快与你联系，请保持手机通话顺畅！', isProd);
          }, 1500);
        }
      }, regexp);
    });


    function result(iconClassName, txts, type) {
      var $resultDiv = $('<div class="result-page"></div>');
      $resultDiv.append('<i class="icon iconfont-prod ' + iconClassName + '"></i><p class="txts">' + txts + '</p>');

      //判断来自保险还是贷款
      var isInsurance = true,
        jumpToUrl = '保险列表页';
      isInsurance ? jumpToUrl = '保险列表页' : jumpToUrl = '贷款列表页';
      $resultDiv.append('<a href="' + jumpToUrl + '" class="btn btn-okay btn-medium">查看更多产品</a>');

      if (type == 'noprod') {
        $('body').css({ 'background-color': '#fff', 'padding-top': '82px' });
        $('#container').html($resultDiv);
      } else {
        $('#Jform .form-ft').hide();
        $('#Jform .form-bd').html($resultDiv);
      }
    }

  }

  // 保险分类导航跟随屏幕滚动
  if ($('.weui-navbar').length) {
    var navFixedHeight = $('.weui-navbar').offset().top;
    $(window).bind('scroll', function () {
      var docHeight = document.body.scrollHeight,
        scrollHeight = document.body.scrollTop + document.documentElement.scrollTop,
        viewHeight = window.innerHeight;
      if (scrollHeight >= navFixedHeight) {
        $('.weui-navbar').addClass('weui-navbar-fixed');
      } else {
        $('.weui-navbar').removeClass('weui-navbar-fixed');
      }
    })
  }
});



