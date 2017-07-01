require('../../sass/page/loan.scss');
require('../lib/rootFontSizeAdjust.js');
require('swiper');
var weui = require('../lib/weui.js');
var $ = require('../lib/jquery-3.2.1.js');
var isLogin = require('../common/isLogin.js'); //理论上是布尔值
var queryParamVal = require('../common/queryParamVal.js');

//验证码交互
function fireClick() {
  weui.loading('loading', { className: 'loading-request' });
  var phoneNumber = $('.weui-input[type=tel]').val();
  var $this = $(this);
  $this.unbind('click');
  $.get($this.data('action') + '?mobile=' + phoneNumber + '&type=loan', function (data) {
    $('.loading-request').hide();
    if (data.flag) {
      fn($this);
      $this.addClass('countdowning');
    } else {
      weui.topTips(data.msg, 1500);
      fireClick();
    }
  });
}

//咨询提交
function resultPage(config) {
  var $resultDiv = $('<div class="result-page"></div>');
  $resultDiv.append('<i class="icon iconfont-prod ' + config.iconClassName + '"></i><p class="txts">' + config.txts + '</p>');

  //判断来自保险还是贷款
  var isInsurance = config.type,
    jumpToUrl = './insurance-list.html';
  isInsurance == 'insurance' ? jumpToUrl = './insurance-list.html' : jumpToUrl = './loan-index.html';
  $resultDiv.append('<a href="' + jumpToUrl + '" class="btn btn-okay btn-medium">查看更多产品</a>');

  if (config.isProd == 'noprod') {
    $('body').css({ 'background-color': '#fff', 'padding-top': '82px' });
    $('#container').html($resultDiv);
  } else {
    $('#Jform .form-ft').hide();
    $('#Jform .form-bd').html($resultDiv);
  }
}

$(document).ready(function () {
  //顶部焦点图
  var hasPagination = $('.swiper-container .swiper-slide').length > 1 ? '.swiper-pagination' : '';
  var swiper = new Swiper('.swiper-container', {
    pagination: hasPagination,
    paginationClickable: true
  });

  //产品详情页相关 
  //切换
  var loanContTab = weui.tab('#loanContTab', {
    defaultIndex: 0,
    onChange: function (index) {
      replceSrc($('#loanContTab .weui-tab__content')[index], 'src2');
      $('html, body').animate({
        scrollTop: $('#loanContTab').offset().top
      }, 300);
      // console.log($('#loanContTab'));

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


  // 预约保险咨询表单相关
  /* form */
  if ($('#Jform').length) {
    // 约定正则
    var regexp = {
      regexp: {
        NICKNAME: /^([\u4e00-\u9fa5\·]{2,10})$/,
        MOBILE: /^\d{11}$/,
        SQJE: /^\d{1,8}$/,
        VCODE: /^\d{6}$/ //验证码
      }
    };
    // 表单提交
    document.querySelector('#JsubmitForm').addEventListener('click', function (e) {
      //贷款所有可能用到的表单数据
      var nickname = document.querySelector('input[name=nickname]'),
        money = document.querySelector('select[name=money]'),
        mobile = document.querySelector('select[name=mobile]'),
        vcode = document.querySelector('select[name=vcode]'),
        tarea = $('#Jform .form-group-tarea')[0];

      var ajaxUrl = $('#Jform').data('action');
      var formType = $('#Jform').data('type');
      var inputStatus = true;
      if ($('#Jform .form-group-tarea').length > 0) {
        $('#Jform .form-group-tarea').each(function (index, el) {
          if ($(el).find('.total').hasClass('overflow')) {
            weui.topTips('输入字数过多哦~', 3000);
            inputStatus = false;
          }
        })
        if (!inputStatus) return false;
      }

      weui.form.validate('#Jform', function (error) {
        // console.log(error);
        if (!error) {
          var loading = weui.loading('提交中...');
          //先判断是咨询(consult)还是申请(create)
          if (formType == 'consult') {
            ajaxUrl = ajaxUrl + '?prodId=' + prodId + '&question=' + tarea.value;
          } else {
            ajaxUrl = ajaxUrl + '?nickname=' + prodId + '&mobile=' + mobile.value + '&money=' + money.value + '&verifyCode=' + vcode.value + '&fromChannel=0';
          }
          $.get(ajaxUrl, function (data) {
            if (data.flag) {
              fn($this);
              $this.addClass('countdowning');
            } else {
              weui.topTips(data.msg, 1500);
              fireClick();
            }
          });
          //判断来自产品咨询还是
          var isProd = (prodId == '' ? 'noprod' : 'isProd');
          //ajax请求接口
          setTimeout(function () {
            loading.hide();
            // weui.toast('提交成功', 3000);
            //成功后的修改
            // 贷款申请,咨询预约
            resultPage({
              'iconClassName': 'icon-zhengque',
              'txts': '你的贷款申请已成功提交</br>专业顾问将很快与你联系，请保持手机通话顺畅！',
              'isProd': isProd,
              'type': 'loan'
            });
          }, 1500);
        }
      }, regexp);
    });

    //验证码验证
    $('.getVcode').bind('click', function () {
      fireClick();
    })
  }


  //text字数限制
  $('.textarea').bind('keyup', function () {
    var $this = $(this);
    var $countEl = $this.next().find('.total');
    var total = 0;
    var str = $this.val();
    total = str.replace(/[^\x00-\xff]/g, "**").length / 2;
    if (total > $this.data('limit')) {
      $countEl.addClass('overflow');
    } else {
      $countEl.removeClass('overflow');
    }
    $countEl.html(total);
  });


})