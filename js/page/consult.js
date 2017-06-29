require('../../sass/page/consult.scss');
require('../lib/rootFontSizeAdjust.js');
var weui = require('../lib/weui.js');
var $ = require('../lib/jquery-3.2.1.js');
var isLogin = require('../common/isLogin.js'); //理论上是布尔值
var queryParamVal = require('../common/queryParamVal.js');

/* form */
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

