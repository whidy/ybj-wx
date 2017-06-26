//url参数获取
function queryParamVal(key) {
  var uri = window.location.search;
  var re = new RegExp("" + key + "=([^&?]*)", "ig");
  return ((uri.match(re)) ? (uri.match(re)[0].substr(key.length + 1)) : null);
}

(function () {
  //页面内容无法占满时显示背景色填充满屏
  var viewHeight = window.innerHeight;
  $('body').css('min-height', viewHeight);

  $('.weui-cells_form input').last().bind('keyup', function (e) {
    $(this).val() != '' ? $('.weui-btn_primary').addClass('active') : $('.weui-btn_primary').removeClass('active');
  });

  // if (!!$("#form").length) {
  //   var $form = $("#form");
  //   var verifyReg = {
  //     IDNUM: /(?:^\d{15}$)|(?:^\d{18}$)|^\d{17}[\dXx]$/, //身份证
  //     NICKNAME: /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/, //昵称
  //     EMAIL: /^\w+@\w+(\.\w+)+$/, //邮箱
  //     NAME: /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/, //姓名
  //     VCODE: /^\d{6}$/ //验证码
  //   }
  //   $('#formSubmitBtn').bind('click', function () {
  //     weui.form.validate('#form', function (error) {
  //       if (!error) {
  //         var phoneNumber = $('.weui-input[type=tel]').val(),
  //           verifyCode = $('.weui-cell_vcode').find('input').val();
  //         // var loading = weui.loading('提交中...');
  //         //是否ajax服务器再验证?
  //         // setTimeout(function () {
  //         //   loading.hide();
  //         //   weui.toast('提交成功', 3000);
  //         //   window
  //         // }, 1500);
  //         $.get($form.data('action') + '?mobile=' + phoneNumber + '&verifyCode=' + verifyCode, function (data) {
  //           // if (true) {
  //           if (data.flag) {
  //             window.location.href = SITE_PATH + '/weixin/userCenter/index?app=';
  //           } else {
  //             weui.topTips(data.msg, 1500);
  //           }
  //         });
  //       }
  //       // return true; // 当return true时，不会显示错误
  //     }, {
  //         regexp: verifyReg
  //       });
  //     // weui.alert('输入不正确，请重新输入', function () { console.log('ok') });
  //   });
  // }

  //获取验证码
  if ($('#getVcode').length != 0) {
    var $getVcode = $('#getVcode');
    function fn(el) {
      var count = 0;
      //倒计时是否与服务器时间对接?
      var defaultTips = el.html();
      el.html('<span>' + (60 - count++) + '</span>s后重新获取');
      var timerCountdown = setInterval(function () {
        el.html('<span>' + (60 - count) + '</span>s后重新获取');
        count++;
        if (count > 60) {
          clearInterval(timerCountdown);
          el.html(defaultTips);

          fireClick();
        }
      }, 1000)
    }
    function fireClick() {
      $getVcode.bind('click', function () {
        var phoneNumber = $('.weui-input[type=tel]').val();
        if (!/^\d{11}$/.test(phoneNumber)) {
          weui.topTips('请输入正确的手机号', 1500);
          return false;
        }
        weui.loading('loading', { className: 'loading-request' });
        var $this = $(this);
        $this.unbind('click');
        $.get($this.data('action') + '?mobile=' + phoneNumber + '&type=register', function (data) {
          $('.loading-request').hide();
          if (data.flag) {
            fn($this);
            $this.addClass('countdowning');
          } else {
            weui.topTips(data.msg, 1500);
            fireClick();
          }
        });
      })
    }
    fireClick();
  }
})();