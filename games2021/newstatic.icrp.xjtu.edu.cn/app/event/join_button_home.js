//只能加载完了执行 '我要报名'按钮
$(function () {

    var temp = $("#a_Join").text().replace(/(^\s*)|(\s*$)/g, "");

    if (temp) {
        if ($(".hotel_submit").length == 0)
        {
            $(".btn-submit").text(temp);
        }
        
    }
    if ($(".btn-submit").length > 0) {
        $("#a_Join").hide();
    }
    else {
        $('#a_Join').show();
    }
    //banner的hover效果
    $('#HeadDesign').hover(function() {
        $('.c-body-bg .con-ctrl-bg3').show();
        $('.c-body-bg .con-ctrl-btn3').show();
    }, function () {
        $('.c-body-bg .con-ctrl-bg3').hide();
        $('.c-body-bg .con-ctrl-btn3').hide();
    });
    $('.con-ctrl-bg3').parents('.con-ctrl').hover(function () {
        $('.c-body-bg .con-ctrl-bg3').show();
        $('.c-body-bg .con-ctrl-btn3').show();
    }, function () {
        $('.c-body-bg .con-ctrl-bg3').hide();
        $('.c-body-bg .con-ctrl-btn3').hide();
    })
});