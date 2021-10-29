/// <reference path="../../assets/library/jquery/jquery-1.8.3.min.js"/*tpa=http://newstatic.icrp.xjtu.edu.cn/assets/library/jquery/jquery-1.8.3.min.js*/ />
/// <reference path="../../assets/plugins/forms_validator/jquery-validation/dist/jquery.validate.js"/*tpa=http://newstatic.icrp.xjtu.edu.cn/assets/plugins/forms_validator/jquery-validation/dist/jquery.validate.js*/ />
/* 这样引用 reference 书写js时候提示更丰富*/
$.ajaxSetup({
    cache: false
});

var utils = (function () {
    return {
        logout: function (gotoUrl) {
            var url = '';
            if (gotoUrl)
                url = gotoUrl;
            location.href = 'http://newstatic.icrp.xjtu.edu.cn/sso/Logout?returnURL=' + encodeURIComponent(url);
        },
        logOutThenRefresh: function () {
            this.logout(location.href);
        }
    }
})();

var util = (function () {
    var privateLoginDialogCallBack = null;
    //私有的方法
    window.NewFileDomain = window.NewFileDomain;
    window.FileDomain = window.FileDomain;
    window.SSODomain = window.SSODomain;
    window.WWWSite = window.WWWSite;
    window.StaticUrl = window.StaticUrl;
    window.UserDomain = window.UserDomain;
    var privateLoginDialogHtml = "";

    function privateLoginDialogSuccess() {
        $('#divlogin_31huiyi_com').remove();
        $('body').append(privateLoginDialogHtml);

        $("#divlogin_31huiyi_com").modal("show");
        $('#loginSuccessCallbackBtn').off("click");
        if (privateLoginDialogCallBack) {
            $('#loginSuccessCallbackBtn').off("click").on("click", function () {
                privateLoginDialogCallBack($('#loginSuccessUserID').val(), $('#loginName_UserName').val());
            });
        }
    }


    function GetURLEncode($form) {
        var s = "";
    }


    function PrivateAjaxPostData(type /* post /get */, url, data, callback, asyncFlag, btn/*可空*/, successAgain) {
        var btnText = "";
        if (btn) {
            var $btn = $(btn);
            if ($btn.is('.disabled,.btn-loading')) {
                //if ($btn.is('.btn-loading')) {
                //	util.alertError("表单正在提交中，请稍候");
                //}
                //if ($btn.data("action") === "send_goto") {
                //	util.alertError("已经提交成功，页面正在跳转中，请稍候")
                //}
                return false;
            }
            btnText = $btn.html();
            if (btnText !== "请稍候...") {
                $btn.data("btnText", btnText);
            }

            var lan = $("html").attr("lang");

            btnText && $btn.html(lan == "en" ? 'Please wait' : '请稍候...').addClass('disabled btn-loading');
            $('.alert_warning_my').removeClass('alert_warning_my');
        }

        var code = 0;
        return $.ajax({
            type: type,
            url: url,
            data: data,
            async: asyncFlag,
            success: function (json, status, req) {
                var success = json.code == 0;
                var action = json.action;
                var msg = json.msg;
                var data = json.data;
                $('.loading').hide();
                code = +json.code;
                if (btn) {
                    $(btn).data("action", action);
                }

                switch (action) {
                    case "eval":
                        eval(msg);
                        break;
                    case "alertok":
                        if (msg)
                            util.alertOK(msg);
                        break;
                    case "alerterror"://单独错误信息弹出
                        {
                            if (msg)
                                util.alertError(msg);
                            if (btn) {
                                $(btn).removeClass("disabled");
                            }
                            break;
                        }
                    //框需要用户点击后消失
                    case "notdisppearalert":
                        {
                            if (msg)
                                util.alertError(msg, { timeout: 0 });
                            break;
                        }
                    case "send_goto":
                        if (msg)
                            util.alertOK(msg);
                        if (btn && successAgain !== true) {
                            $(btn).addClass("disabled");
                        }
                        setTimeout(function () { location.href = data.url; }, 2000);
                        return;
                    case "send_goto_error":
                        if (msg)
                            util.alertError(msg);
                        if (btn && successAgain !== true) {
                            $(btn).addClass("disabled");
                        }
                        setTimeout(function () { location.href = data.url; }, 2000);
                        return;
                    case "reloadError":
                        if (msg)
                            util.alertError(msg);
                        setTimeout(function () {
                            location.reload(true);
                        }, 2000);
                        break;
                    case "reload":
                        if (msg)
                            util.alertOK(msg);
                        setTimeout(function () {
                            location.reload(true);
                        }, 2000);
                        break;
                    case "goto":
                        if (data) {
                            location.href = data;
                        }
                        break;
                    case "json":
                        //alert(json.data);
                        if (callback) {
                            callback(json.data);
                        }
                        return;
                    case "alerterrors":
                        var s = '';
                        for (var o in data) {
                            s += data[o];
                        }
                        util.alertError(s);
                        break;
                }

                //回调函数
                if (callback) {
                    try {
                        callback(json);
                    } catch (ex) {

                    }
                }
            }
        }).always(function () {
            if (btn) {
                var $btn = $(btn);
                $btn.removeClass('btn-loading');
                if ($btn.length && $btn.data("post") == 1 && code == 0) {

                } else {
                    var btnText = $btn.data("btnText");
                    var action = $btn.data("action");
                    if (action === "send_goto") {
                        //$btn.html(btnText);
                    } else {
                        btnText && $btn.html(btnText).removeClass('disabled');
                    }
                }
            }
        });
    }


    //共有的方法
    return {

        //http://newfile.31huiyi.com/
        getFullFileUploadDomain: function () {
            return "/ForwardHandler.ashx?_ForwardUrl=" + window.NewFileDomain;
        },

        //http://newfile.31huiyi.com/
        getFileDomain: function () {
            return window.NewFileDomain;
        },

        ///http://main.31huiyi.com/
        getMainDomain: function () {
            return "http://main.31huiyi.com/";
        },

        getSSODomain: function () {
            return window.SSODomain;
        },

        /// http://newstatic.31huiyi.com
        getNewStaticDomain: function () {
            return window.StaticUrl;
        },

        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        },
        // 字符串全部替换  originStr = Util.replaceAll(originStr,oldStr,newStr);  --类似C#  str = str.replace( oldStr,newStr);
        replaceAll: function (originStr, oldStr, newStr) {
            var reg = new RegExp("(" + oldStr + ")", "g");
            var newstr2 = originStr.replace(reg, newStr);
            return newstr2;
        },

        tableAdd: function (table, tableType, tableHtml, callback) {
            var target = $(tableHtml);
            table.append(target);
            if (callback) {
                callback(target);
            }
        },
        tableUpdate: function (table, tableType, tableTarget, tableHtml, callback) {
            var target = $(tableHtml);
            tableTarget.after(target);
            tableTarget.remove();
            if (callback) {
                callback(target);
            }
        },
        tableDel: function (table, tableTarget) {
            tableTarget.remove();
        },

        /// js 创建 form 表单提交；   参数传递类似: {html :prnhtml,cm1:'sdsddsd',cm2:'haha'}
        JSPost: function (URL, PARAMS) {
            if ($('#temp_JSPost_form').length == 0) {
                var temp = document.createElement("form");
                $(temp).attr('id', 'temp_JSPost_form');
            }
            $('#temp_JSPost_form').html('');
            temp.action = URL;

            temp.method = "post";
            temp.style.display = "none";
            for (var x in PARAMS) {
                var opt = document.createElement("textarea");
                opt.name = x;
                opt.value = PARAMS[x];
                // alert(opt.name)
                temp.appendChild(opt);
            }
            document.body.appendChild(temp);
            temp.submit();
            return temp;
        },
        /// js 创建 form 表单提交；   参数传递类似: {html :prnhtml,cm1:'sdsddsd',cm2:'haha'}
        JSPostForm: function (URL, Form) {
            Form.attr("action", URL);
            Form.attr("method", "post");
            Form.attr("action", URL);
            Form.submit();
            return Form;
        },
        ///把json时间转化为普通的时间 返回字符串
        JsonTimeToDateTime:
        function (time) {
            if (time != null) {
                var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                var ss = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm + ":" + ss;
            }
            return "";
        },

        //返回时间对象
        JsonTimeToDateTimeObj:
        function (time) {
            if (time != null) {
                var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                return date;
            }
            return "";
        },

        ///把json时间转化为普通的时间精确到分钟
        JsonTimeToDateAndMinutes:
        function (time) {
            if (time != null) {
                var date = new Date(parseInt(time.replace("/Date(", "").replace(")/", ""), 10));
                var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
                var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                //  var ss = date.getMilliseconds() < 10 ? "0" + date.getMilliseconds() : date.getMilliseconds();
                var ss22 = date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;//+ ":" + ss;

                return ss22;

            }
            return "";
        },

        ClearErrorMsg: function () {
            //$("div.div_tishi").each(function() { $(this).html(''); $(this).hide(); });
        },
        IsCheckedOne: function (frm, prefix) {
            return true;
            if (!prefix) {
                prefix = '';
            }
            var one = false;
            $("input[name='SelectID" + prefix + "']").each(function () { if ($(this).attr('checked')) one = true; });
            return one;
        },
        ShowLoadding: function () {
            var div = document.getElementById('divLoadding');
            if (div) {
            } else {
                var body = document.getElementsByTagName('body').item(0);
                div = document.createElement('div');
                div.id = "divLoadding";
                div.innerHTML = "正在执行，请稍候……";
                body.appendChild(div);
            }
            isMoveLoadding = true;
            moveLoadding();
        },
        alertOK: function (msg) {
            notyfy({
                text: msg,
                type: 'success',
                dismissQueue: true,
                layout: 'top',
                timeout: 3000,
                buttons: false
            });
        },
        alert: function (msg) {
            var modal = {
                show: function ($child, toShow) {
                    var $modal;
                    toShow = (typeof (toShow) == "undefined") ? true : !!toShow;
                    $modal = $child.closest(".modal");
                    $modal.modal(toShow ? "show" : "hide");
                },
                init: function (modalId, option) {
                    var id, strDom, $modal, data;
                    if (modalId) {
                        id = "modal-" + (modalId || "");
                        $modal = $("#" + id);
                    } else {
                        id = "";
                        $modal = $();
                    }
                    if (!$modal.length) {
                        option = $.extend({}, {
                            modalTitle: "提示",
                            modalBody: ""
                        }, option);
                        var strModalBody = typeof option.modalBody === "string" ? option.modalBody : "";
                        var objModalBody = typeof option.modalBody === "object" ? option.modalBody : null;
                        data = {
                            id: id,
                            title: option.modalTitle,
                            body: strModalBody
                        }
                        strDom = modal.dom(data);
                        $modal = $(strDom).appendTo("body");
                        objModalBody && objModalBody.appendTo($modal.find(".modal-body"));
                    } else {
                        var strModalBody = typeof option.modalBody === "string" ? option.modalBody : "";
                        var objModalBody = typeof option.modalBody === "object" ? option.modalBody : null;
                        strModalBody && $modal.find(".modal-body").html(strModalBody);
                        objModalBody && objModalBody.appendTo($modal.find(".modal-body"));
                    }
                    return $modal;
                },
                dom: function (data) {
                    var strDom;
                    strDom = '<div id="' + data.id + '" class="modal fade" style="">\
						<div class="modal-dialog modal-dialog-style-2">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>\
									<div class="modal-title">' + data.title + '</div>\
								</div>\
								<div class="modal-body center">\
								' + data.body + '\
								</div>\
								<div class="modal-footer">\
									<span class="btn btn-style-2" data-dismiss="modal">确定</span>\
								' + '' + '\
								</div>\
							</div>\
						</div>\
					</div>';
                    return strDom;
                }
            }
            modal.show(modal.init("modalAlert", {
                modalBody: msg
            }));

        },
        alertError: function (msg, opts) {
            opts = $.extend({}, {
                text: msg,
                type: 'error',
                dismissQueue: true,
                layout: 'top',
                timeout: 3000,
                buttons: false
            }, opts);
            var $notyfyEle = $(".notyfy_container li");
            var notyfyLen = $notyfyEle.length;
            var notyfFlag = true;
            if (notyfyLen <= 0) {
                notyfy(opts);
            }
            else {
                $notyfyEle.each(function () {
                    var notyfyText = $(this).text();
                    if (notyfyText == opts.text) {
                        notyfFlag = false;
                    }
                });
                if (notyfFlag) {
                    notyfy(opts);
                }
            }
        },
        confirm: function (msg, callbackOk, callbackCancel, isHtml) {
            var title = "";
            if (arguments.length > 1 && typeof arguments[1] == 'string')
            {
                title = arguments[0];
                msg = arguments[1];
                callbackOk = arguments[2];
                callbackCancel = arguments[3];
                isHtml = arguments[4];
            }
            var Cancel = '取消', Ok = '确定';
            if ($('html').attr('lang') == 'en') {
                Cancel = 'Cancel', Ok = 'Ok';
            };
            var template = '<div class="modal fade">\
			  <div class="modal-dialog modal-sm modal-style-confirm">\
				<div class="modal-content">\
				  <div class="modal-header">\
						<button type="button" class="close" style="margin-top:-11px;" data-dismiss="modal" aria-hidden="true">&times;</button>\
						<h3 class="modal-title" style="font-size:16px;line-height: initial;">' + title + '</h3>\
				  </div>\
				  <div class="modal-body center">\
					<p>One fine body&hellip;</p>\
				  </div>\
				  <div class="modal-footer">\
					<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">' + Cancel + '</button>\
					<button type="button" class="btn btn-primary btn-ok">'+Ok+'</button>\
				  </div>\
				</div>\
			  </div>\
			</div>';
            var modal = $(template);
            modal = modal.appendTo("body");
            //如果允许HTML
            if (isHtml === true) {
                modal.find(".modal-body p").html(msg);
            } else {
                modal.find(".modal-body p").text(msg);
            }

            modal.modal("show");
            modal.on("click", ".btn-ok", function () {
                callbackOk && callbackOk();
                modal.modal("hide");
            }).on("click", ".btn-cancel", function () {
                callbackCancel && callbackCancel();
                modal.modal("hide");
            });

            modal.on('hidden.bs.modal', function (e) {
                modal.remove();
            });

            //notyfy({
            //	text: msg,
            //	type: 'confirm',
            //	dismissQueue: true,
            //	layout: 'center',
            //	timeout: 1000,
            //	buttons: [{
            //		addClass: 'btn btn-danger btn-sm',
            //		text: '取消',
            //		onClick: function ($notyfy) {
            //			$notyfy.close();
            //			callbackCancel();
            //		}
            //	}, {
            //		addClass: 'btn btn-success btn-sm',
            //		text: '确定',
            //		onClick: function ($notyfy) {
            //			$notyfy.close();
            //			callbackOk();
            //		}
            //	}]
            //});
        },
        confirm2: function (msg, callbackOk, callbackCancel, isHtml) {
            var Cancel = '取消', Ok = '确定';
            if ($('html').attr('lang') == 'en') {
                Cancel = 'Cancel', Ok = 'Ok';
            };
            var template = '<div class="modal fade modal-filter--attendee">\
			  <div class="modal-dialog modal-sm modal-style-confirm">\
				<div class="modal-content">\
				  <div class="modal-body center">\
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
					<p style="text-align:left;padding-top: 30px;">One fine body&hellip;</p>\
				  </div>\
				  <div class="modal-footer">\
					<button type="button" class="btn btn-primary btn-ok">' + Ok + '</button>\
					<button type="button" class="btn btn-default btn-cancel" data-dismiss="modal">' + Cancel + '</button>\
				  </div>\
				</div>\
			  </div>\
			</div>';
            var modal = $(template);
            modal = modal.appendTo("body");
            //如果允许HTML
            if (isHtml === true) {
                modal.find(".modal-body p").html(msg);
            } else {
                modal.find(".modal-body p").text(msg);
            }

            modal.modal("show");
            modal.on("click", ".btn-ok", function () {
                callbackOk && callbackOk();
                modal.modal("hide");
            }).on("click", ".btn-cancel", function () {
                callbackCancel && callbackCancel();
                modal.modal("hide");
            });

            modal.on('hidden.bs.modal', function (e) {
                modal.remove();
            });

            //notyfy({
            //	text: msg,
            //	type: 'confirm',
            //	dismissQueue: true,
            //	layout: 'center',
            //	timeout: 1000,
            //	buttons: [{
            //		addClass: 'btn btn-danger btn-sm',
            //		text: '取消',
            //		onClick: function ($notyfy) {
            //			$notyfy.close();
            //			callbackCancel();
            //		}
            //	}, {
            //		addClass: 'btn btn-success btn-sm',
            //		text: '确定',
            //		onClick: function ($notyfy) {
            //			$notyfy.close();
            //			callbackOk();
            //		}
            //	}]
            //});
        },

        // 表单验证
        ValidateForm: function ($form) {
            if (!$form) {
                return true;
            }

            try {
                if (!$form.validate().form()) {
                    $form.validate().focusInvalid();
                    return false;
                }
            } catch (ex) {

            }

            return true;
        },
        // 提交按钮不可点击
        submitDisabled: function ($btn) {
            var btnText = "";
            if ($btn.is('.disabled,.btn-loading')) {
                return false;
            }
            btnText = $btn.html();
            if (btnText !== "请稍候...") {
                $btn.data("btnText", btnText);
            }
            btnText && $btn.html('请稍候...').addClass('disabled btn-loading');
        },
        submitEnabled: function ($btn) {
            var btnText = "";
            if ($btn.is('.disabled,.btn-loading')) {
                btnText = $btn.data("btnText");
                btnText && $btn.html(btnText).removeClass('disabled btn-loading');
            } else {
                return false;
            }
        },
        //异步post form提交
        AjaxPost: function (url, $form, $btn, callback, successAgain) {
            if (!util.ValidateForm($form)) {
                return false;
            }

            return PrivateAjaxPostData("post", url, $form.serialize(), callback, true, $btn, successAgain);
        },
        //异步post数据
        AjaxPostData: function (url, data, callback, btn/*可空*/, successAgain) {
            return PrivateAjaxPostData('post', url, data, callback, true, btn);
        },
        //同步post数据
        AjaxPostData_Synchronous: function (url, data, callback, btn/*可空*/, successAgain) {
            return PrivateAjaxPostData('post', url, data, callback, false, btn);
        },
        AjaxGet: function (url, data, callback, btn/*可空*/, successAgain) {

            return PrivateAjaxPostData('get', url, data, callback, false, btn, successAgain);
        },
        //返回是否登录
        isLogin: function () {
            return util.loginUserID() > 0;
        },

        //大于0表示登录
        loginUserID: function () {
            var loginUserIDTEmp = 0;
            $.ajax({
                type: 'post',
                url: '/BaseRedirectLogin/GetLoginName',
                data: null,
                async: false,
                success: function (json, status, req) {

                    loginUserIDTEmp = json.data.UserID;
                }
            });

            return loginUserIDTEmp;
        },
        //注销登录 (gotoUrl可空） 注销回调的地址
        logOut: function (gotoUrl) {

            var url = "";
            if (gotoUrl)
                url = gotoUrl;
            window.location.href = 'http://newstatic.icrp.xjtu.edu.cn/sso/Logout?returnURL=' + encodeURIComponent(url);

        },

        logOutThenRefresh: function () {
            util.logOut(window.location.href);
        },

        ///登录成功的jsonp 回调
        loginSuccess: function (json)//登录成功的jsonp 回调
        {
            privateLoginDialogHtml = json.loginDialogHtml;
            privateLoginDialogSuccess();
        },
        //弹出登录框
        loginDialog: function (callback) {
            privateLoginDialogCallBack = callback;
            if (!privateLoginDialogHtml) {
                $.ajax({
                    type: 'get',
                    url: window.SSODomain + "/passport/GetLoginDialogHtml",
                    data: null,
                    dataType: 'jsonp'
                    //async: false, --jsonp 不支持同步
                });
            }
            else {
                privateLoginDialogSuccess();
            }
        },

        //  util.dialog(url, $modelDialog, undefined, remotePostObject);  remotePostObject 是对象,譬如 {OrderIds:"1,2,3"}
        dialog: function (url, $dialogId, callback, remotePostObject) {
            var loadingAnimate = function () {
                var modalContent = $dialogId.find(".modal-content");
                var modalBody = modalContent.find(".modal-body");
                if (!modalBody.length) {
                    $dialogId.find(".modal-content").html('<div class="modal-header">&emsp;<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3 class="modal-title"></h3></div>\
	<div class="modal-body modal-body-loading"></div>');
                }
                // $dialogId.find(".modal-body").html("").addClass("modal-body-loading").append('<div class="modal-body-mask"><i class="fa fa-2x fa-spinner fa-spinner-animate"></i></div>');
                $dialogId.find(".modal-body").html("").addClass("modal-body-loading").append('<div class="modal-body-mask"><i class="fa fa-2x fa-spinner fa-spin"></i></div>');
            }

            $dialogId.appendTo('body');

            loadingAnimate();

            $dialogId.modal({
                keyboard: true,
                remote: url,
                remotePostObject: remotePostObject
            }).off("shown.bs.modal").on("shown.bs.modal", function () {
                $("body").addClass("modal-open");
            }).off("hidden.bs.modal").on("hidden.bs.modal", function () {
                $(this).removeData("bs.modal");
                //关闭时需要清除数据，不然下次再打开的时候不能重新load remote的数据
            }).off("loaded.bs.modal").on("loaded.bs.modal", function () {
                window.pluploadpicker_manage && window.pluploadpicker_manage.init();
                window.validdate_manage && window.validdate_manage.init();//初始化验证
                window.select_manage && window.select_manage.init();//初始化select
                window.timepicker_manage && window.timepicker_manage.init();//初始化时间
                window.checkradio_manage && window.checkradio_manage.init();
                $dialogId.find(".btn-o-cancel").click(function () {
                    $dialogId.modal("hide");
                });
                callback && callback();
            });

        },
        remoteHtml: function (remote, selector, data, callback, isget) {
            if (remote) {
                if (isget) {
                    $.ajax({
                        type: "get",
                        url: remote,
                        data: {},
                        success: function (data) {
                            //$(selector).html(data);
                            $(selector).get(0).innerHTML = data;
                            window.pluploadpicker_manage && window.pluploadpicker_manage.init();
                            window.validdate_manage && window.validdate_manage.init();//鍒濆§嬪寲楠岃瘉
                            window.select_manage && window.select_manage.init();//鍒濆§嬪寲select
                            window.timepicker_manage && window.timepicker_manage.init();//鍒濆§嬪寲鏃堕棿
                            window.checkradio_manage && window.checkradio_manage.init();
                            window.sanjiliandong_manage && window.sanjiliandong_manage.init();
                            callback && callback();
                        }
                    });
                } else {
                    $(selector).load(remote, data, function () {
                        window.pluploadpicker_manage && window.pluploadpicker_manage.init();
                        window.validdate_manage && window.validdate_manage.init();//初始化验证
                        window.select_manage && window.select_manage.init();//初始化select
                        window.timepicker_manage && window.timepicker_manage.init();//初始化时间
                        window.checkradio_manage && window.checkradio_manage.init();
                        window.sanjiliandong_manage && window.sanjiliandong_manage.init();
                        callback && callback();
                    });
                }
            }
        },
        remoteHtml2: function (remote, selector, data, callback, isget) {
            if (remote) {
                if (isget) {
                    $.ajax({
                        type: "get",
                        url: remote,
                        data: {},
                        success: function (data) {
                            //$(selector).html(data);
                            $(selector).get(0).innerHTML = data;
                            callback && callback();
                        }
                    });
                } else {
                    $(selector).load(remote, data, function () {
                        callback && callback();
                    });
                }
            }
        },

        loadingQueue: function (opts) {
            var $modalLoadingQueue, $txt;
            var delay, stop, event, setTimeoutId,
                setTxt, getTxt, setBtn, ajax, init, create, setTime;

            $modalLoadingQueue = $(".modal-o-loadingQueue");
            $txt = $modalLoadingQueue.find("http://newstatic.icrp.xjtu.edu.cn/app/public/.modal-body .txt");

            delaySecond = opts.delaySecond || 10;
            delay = 1000;

            create = function () {
                var html = '\
						<div class="modal fade modal-o-loadingQueue" >\
							<div class="modal-dialog modal-style-1 modal-lg">\
								<div class="modal-content" style="background: none;box-shadow: none;border: none;">\
									<div class="modal-body">\
										<div style="display:block;width:770px;height:330px;margin:0 auto;margin-top:150px;background:url('+ window.StaticUrl + '/img/audience/queue/loading.png) no-repeat 50% 50%;">' +
                    //<span class="txt" style="display:block;margin:0 auto;width:100px;height:100px;line-height:100px;background-color:#0db208;text-align:center;font-size:60px;border-radius:50%;color:#fff;">3</span>\
                    '<span class="txt" style="float:left;display:block;text-align:center;font-size: 50px;border-radius:50%;color:#fff;padding-top: 50px;padding-left: 166px;width: 216px;height: 124px;">3</span>\
											<div style="display: block;color: #fff; margin-left:310px;padding-top: 50px;font-size: 16px;">\
												<div class="tit" style="display: block;color: #fff;font-size: 40px;">排队中…</div>\
												<div class="txt-2" style="padding-bottom: 6px;">当前抢票下单人数较多</div>\
												<div class="txt-2" style="padding-bottom: 6px;">请您稍安勿躁，在倒计时结束后重新提交</div>\
										</div>\
									</div>\
									</div>\
									<div class="modal-footer" style="border-top:none;">\
										<span class="btn btn-default btn-o-1">退出排队</span>\
										<span class="btn btn-default btn-o-3 is-hide">请稍候...</span>\
										<span class="btn btn-style-2 btn-o-2 is-hide">重新提交</span>\
									</div>\
								</div>\
							</div>\
						</div>\
						';
                $("body").append(html);
                $modalLoadingQueue = $(".modal-o-loadingQueue");
            }

            hide = function () {
                $(".modal-backdrop").remove();
                $modalLoadingQueue.removeClass("in");
                $modalLoadingQueue.hide();
            }

            show = function () {
                $("body").append('<div class="modal-backdrop fade in" style="filter: alpha(opacity=80);opacity: .8;"></div>');
                $modalLoadingQueue.addClass("in");
                $modalLoadingQueue.css({
                    display: "block"
                });
            }

            stop = function () {
                hide();
            }

            setTime = function () {
                setTimeoutId = setTimeout(function () {
                    setTxt(getTxt() - 1);
                    if (getTxt() !== 0) {
                        setTime();
                    } else {
                        hide();
                        opts.f();
                    }
                }, delay);
            }

            stopSetTime = function () {
                window.clearTimeout(setTimeoutId);
            }

            init = function () {
                if ($modalLoadingQueue.length) {

                } else {
                    create();
                }

                show();
                setTxt(delaySecond);
                setTime();
                event();
            }

            event = function () {
                $(".modal-o-loadingQueue").on("click", ".btn-o-1", function () {
                    stop();
                    stopSetTime();
                    $(".modal-o-loadingQueue").remove();
                });
            }

            setTxt = function (txt) {
                $(".modal-o-loadingQueue").find(".txt").html(txt);
            }

            getTxt = function () {
                return +$(".modal-o-loadingQueue").find(".txt").html();
            }

            setBtn = function (type) {
                var $btn1 = $modalLoadingQueue.find(".modal-body .btn-o-1");
                var $btn2 = $modalLoadingQueue.find(".modal-body .btn-o-2");
                if (type === 1) {
                    $btn1.addClass('is-hide');
                    $btn2.removeClass('is-hide');
                } else if (type === 2) {
                    $btn1.addClass('is-hide');
                    $btn2.removeClass('is-hide');
                }
            }

            init();
        },

        show: function ($this) {
            $this.removeClass("is-hide");

            return $this;
        },
        hide: function ($this) {
            $this.addClass("is-hide");
            return $this;
        },
        toggleShow: function ($this, isBool) {
            $this.toggleClass("is-hide", !isBool);
            return $this;
        },
        form: {
            inputOneLoad: function ($this, data) {
                var itemName = $this.data("name");
                if (itemName) {
                    $this.val(data[itemName].txt || data[itemName].val);
                }
            },
            selectOneLoad: function ($this, data) {
                var itemName = $this.data("name");
                if (itemName) {
                    var val = data[itemName].val;
                    $this.val(val).selectpicker('refresh');;
                }
            },
            checkboxOneLoad: function ($this, data) {
                var itemName = $this.data("name");
                if (itemName) {
                    var val = data[itemName].val;
                    //TODO　单个和多个

                    $this.val(val).checkbox(val ? 'check' : 'uncheck');
                    // $this.val(val).selectpicker('refresh');
                    //TODO 赋值
                }
            },
            radioOneLoad: function ($this, data) {
                var itemName = $this.data("name");
                if (itemName) {
                    var val = data[itemName].val;
                    // $this.val(val).selectpicker('refresh');;
                    //TODO 赋值
                }
            },
            tableAdd: function ($this, data) {
                var eleId;
                var itemName = $this.data("name");
                var dataTable = data[itemName];
                util.table.add($this, dataTable, eleId);
            },
            load: function ($form, data) {
                $form.find("input.ele-id").val(data.id);
                $form.find("input").filter(":not([type=checkbox]),:not([type=radio])").each(function () {
                    var $this = $(this);
                    util.form.inputOneLoad($this, data);
                });
                $form.find("textarea").each(function () {
                    var $this = $(this);
                    util.form.inputOneLoad($this, data);
                });
                $form.find("select").each(function () {
                    var $this = $(this);
                    util.form.selectOneLoad($this, data);
                });

                $form.find("input").filter("[type=checkbox]").each(function () {
                    var $this = $(this);
                    util.form.checkboxOneLoad($this, data);
                });

                $form.find("input").filter("[type=radio]").each(function () {
                    var $this = $(this);
                    util.form.checkboxOneLoad($this, data);
                });

                $form.find("table.table-form-data").each(function () {
                    var $this = $(this);
                    util.form.tableAdd($this, data);
                });

            },
            reset: function ($form) {
                $form.find(".form-control").val("");
                //TODO 后一句有待商榷
                $form.find("input[type=hidden]").val("");
                // $form.find("input[type=checkbox]").removeAttr("checked");
                $form.find("input[type=radio]").radio('uncheck');
                $form.find("input[type=checkbox]").checkbox('uncheck');
                $form.find(".selectpicker").find("option:eq(0)").prop("selected", true).end().selectpicker('refresh');
                //util.table.reset($form.find("table.table-form-data"));
            },
            boxTit: function ($formbox, val, type, selectorTit) {
                if (type === 1) {
                    val = "新建" + val;
                }
                if (type === 2) {
                    val = "编辑" + val;
                }
                selectorTit = selectorTit || ".widget-head .heading";
                $formbox.find(selectorTit).text(val);
            },
            getId: function ($form) {
                var id;
                var idTrue = $form.find("input.ele-id").val();
                if (idTrue) {
                    id = idTrue;
                }
                return id;
            },
            loadAjax: function (objType) {
                fnDemoGetAjaxData(objType);
            },
            required: function () {
                var $forms = $(".form-horizontal");
                $forms.each(function (e, i) {
                    $(this).find("input,textarea,select").filter("[required]").each(function () {
                        $(this).closest(".form-group").addClass("form-group-required");
                    });
                });

                var $formGroupSwitchNext = $(".form-horizontal").find(".form-group-switch-next").not(".form-group-switch-next-1");
                $formGroupSwitchNext.each(function () {
                    var $formGroup = $(this);
                    var $items = $formGroup.find("input:radio,input:checkbox,select option");
                    var itemsLength = $items.length;

                    var $itemFormGroups = $formGroup.nextAll(".form-group").filter(":lt(" + itemsLength + ")");
                    var isMutilFormGroup = !!$formGroup.next(".form-group-switch-item").length;
                    var is$Select = $items.filter("option").length;

                    var hideItemFormGroups = function ($obj) {
                        $itemFormGroups = $obj || $itemFormGroups;
                        $itemFormGroups.addClass("is-hide");
                    }

                    var checkedItem = (is$Select ? $items.filter(":selected") : $items.filter(":checked")).eq(0);
                    var nowIndex = checkedItem.length && $items.index(checkedItem) || 0;

                    $itemFormGroups = isMutilFormGroup && $formGroup.nextUntil(":not(.form-group-switch-item)") || $itemFormGroups;
                    hideItemFormGroups();

                    if (isMutilFormGroup) {
                        if (!is$Select) {
                            $formGroup.find(".btn").removeClass("btn-primary").addClass("btn-default");

                            $itemFormGroups.filter(".form-group-switch-item-" + (nowIndex + 1)).removeClass("is-hide");
                            $items.eq(nowIndex).parent(".btn").addClass("btn-primary").removeClass("btn-default");

                            // var type = $items.eq(0).attr("type");
                            // if(type==="radio"){
                            // 	$items.eq(0).radio("check");
                            // } else {
                            // 	$items.eq(0).checkbox("check");
                            // }
                        } else {
                            $itemFormGroups.filter(".form-group-switch-item-" + (nowIndex + 1)).removeClass("is-hide");
                        }
                    } else {

                        $itemFormGroups.eq(nowIndex).removeClass("is-hide");

                        var type = $items.eq(nowIndex).attr("type");


                        if (type === "radio") {
                            $items.eq(nowIndex).radio && $items.eq(nowIndex).radio("check");
                        } else {
                            $items.eq(nowIndex).checkbox && $items.eq(nowIndex).checkbox("check");
                        }
                    }
                });
                $formGroupSwitchNext.on("change", ":radio,:checkbox,select", function () {
                    var $this = $(this);
                    var name = $this.attr("name");
                    var is$Select = !!$(this).filter("select").length;

                    var $formGroup = $this.closest(".form-group");
                    var $items = $formGroup.find("input[name='" + name + "']");

                    $items = is$Select && $this.find("option") || $items;
                    var isMutilFormGroup = !!$formGroup.next(".form-group-switch-item").length;

                    var hideItemFormGroups = function ($obj) {
                        $itemFormGroups = $obj || $itemFormGroups;
                        $itemFormGroups.addClass("is-hide").find("input").prop("disabled", true);
                    }

                    // var val = $items.filter(":checked").map(function(){
                    // 	return $(this).val();
                    // });
                    var length = $items.length;


                    var $itemFormGroups = $formGroup.nextAll(".form-group").filter(":lt(" + length + ")");
                    $itemFormGroups = isMutilFormGroup && $formGroup.nextUntil(":not(.form-group-switch-item)") || $itemFormGroups;


                    var changeClass = function () {
                        $items.each(function (i, e) {
                            var $this = $(this);
                            var isChecked = $this.prop("checked");
                            if (isChecked) {
                                $itemFormGroups.eq(i).removeClass("is-hide").find("input").prop("disabled", false);
                            }
                        });
                    }

                    var changeClass2 = function () {
                        if (is$Select) {
                            $items.each(function (i, e) {
                                var $this = $(this);
                                var isChecked = $this.prop("selected");
                                if (isChecked) {
                                    $this.parent(".btn").addClass("btn-primary").removeClass("btn-default");
                                    $itemFormGroups.filter(".form-group-switch-item-" + (i + 1)).removeClass("is-hide").find("input").prop("disabled", false);
                                }
                            });
                        } else {
                            $items.each(function (i, e) {
                                var $this = $(this);
                                var isChecked = $this.prop("checked");
                                if (isChecked) {
                                    $this.parent(".btn").addClass("btn-primary").removeClass("btn-default");
                                    $itemFormGroups.filter(".form-group-switch-item-" + (i + 1)).removeClass("is-hide").find("input").prop("disabled", false);
                                }
                            });
                        }
                    }

                    hideItemFormGroups();
                    if (isMutilFormGroup) {
                        $formGroup.find(".btn").removeClass("btn-primary").addClass("btn-default");
                        changeClass2();
                    } else {
                        changeClass();
                    }

                    // var $form = $this.closest(".form-horizontal");

                    // var changeClass = function (val,$form) {
                    // 	if(val.length) {
                    // 		$form.removeClass("");
                    // 		$.each(val,function (i,e) {
                    // 			var strclass = "";
                    // 			if(e==="0") {
                    // 				strclass = "has-userall";
                    // 			} else if(e==="1") {
                    // 				strclass = "has-usergroup";
                    // 			} else if(e==="2") {
                    // 				strclass = "has-usercustom";
                    // 			}
                    // 			$form.addClass(strclass);
                    // 		});
                    // 	} else {
                    // 		$items.eq(0).radio("check").trigger("change");
                    // 	}
                    // }
                    // changeClass(val,$form);
                    // $this.radio("check");
                }).eq(0).trigger("change");
            }

        },
        modal: {
            show: function ($this, callback) {
                var $modal = $this.closest(".modal");
                if (!$modal.parent().is("body")) {
                    $("body").append($modal);
                }
                if (callback) {
                    $modal.on('shown.bs.modal', function () {
                        callback();
                        $modal.off('shown.bs.modal');
                    });
                }
                $modal.modal("show");
                $("body").addClass("modal-open");
                if ($modal.find(".modal-footer").length) {
                    $modal.find(".modal-body").css({
                        "max-height": $(window).height() - 200,
                        "overflow": "auto"
                    });
                }
                return $this;
            },
            hide: function ($this, callback) {
                var $modal = $this.closest(".modal");
                if (callback) {
                    $modal.on('hidden.bs.modal', function () {
                        callback();
                        $modal.off('hidden.bs.modal');
                    });
                }
                $modal.modal("hide");
                return $this;
            },
            toggleShow: function ($this, isBool) {
                $this.closest(".modal").modal(isBool ? "show" : "hide");
                return $this;
            }
        },
        //待删除 Larry 2015-01-27
        imageCrop: function ($img, valWidth, valHeight, aspectRatio, imageCropName) {
            var fun = function () {
                var imageCropObj = {
                    $preview: null,
                    $pcnt: null,
                    $pimg: null,
                    $img: $img,
                    xsize: null,
                    ysize: null,
                    valWidth: +valWidth || 175,
                    valHeight: +valHeight || 260,
                    aspectRatio: ((+aspectRatio || aspectRatio === 0) ? aspectRatio : (valWidth && valHeight ? valWidth / valHeight : 175 / 260)),
                    init: function ($img) {
                        var $imgcropBox = $img.closest(".form-group-imgupload").find(".imgcrop-box");

                        $imgcropBox.find(".img-croping-clone").remove();
                        $imgcropBox.find(".img-croping").after($imgcropBox.find(".img-croping").clone().removeClass("img-croping").addClass("img-croping-clone"));

                        this.handleTarget($img);
                        $imgcropBox.find(".img-croping-clone").remove();

                    },
                    handleTarget: function ($img) {
                        var that = this;
                        $img.Jcrop(
                            {
                                onChange: that.updatePreview,
                                onSelect: that.updatePreview,
                                aspectRatio: that.aspectRatio || (that.xsize / that.ysize),
                                //minSize: [175, 260],
                                //maxSize: [0, 0],
                                allowSelect: false
                            },
                            function () {
                                // Use the API to get the real image size
                                var bounds = this.getBounds();
                                that.boundx = bounds[0];
                                that.boundy = bounds[1];

                                // Store the API in the jcrop_api variable
                                that.jcrop_api = this;

                                that.jcrop_api.setSelect([0, 0, that.valWidth, that.valHeight]);
                                that.jcrop_api.setOptions({ bgFade: true });
                                that.jcrop_api.ui.selection.addClass('jcrop-selection');

                                // Move the preview into the jcrop container for css positioning
                                //that.$preview.appendTo(that.jcrop_api.ui.holder);

                                //if (!window.jcrop_api) {
                                //	window.jcrop_api = [];
                                //}
                                //window.jcrop_api[window.jcrop_api.length] = this;

                                if (!window.jcrop_api) {
                                    window.jcrop_api = {};
                                }
                                window.jcrop_api[imageCropName] = this;
                            });
                    },
                    updatePreview: function (c) {
                        if (parseInt(c.w) > 0) {
                            var rx = imageCropObj.xsize / c.w;
                            var ry = imageCropObj.ysize / c.h;
                            imageCropObj.$img.data({
                                x: c.x,
                                y: c.y,
                                x2: c.x2,
                                y2: c.y2,
                                w: c.w,
                                h: c.h,
                                img_width: imageCropObj.boundx,
                                img_height: imageCropObj.boundy
                            });
                        }
                    }
                };
                imageCropObj.init($img, valWidth, valHeight);
                return imageCropObj;
            }
            return (new fun());
        },
        fileupload: function ($inputFile, url, opts) {
            // TODO 没对各事件提供接口
            opts.url = opts.url || url;

            var fun = function () {

                opts = opts || {
                    url: url,
                    dataType: 'json',
                    autoUpload: true,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFileSize: 5000000, // 5 MB
                    disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                    previewMaxWidth: 100,
                    previewMaxHeight: 100,
                    previewCrop: true,

                    done: function (e, data) {

                    },
                    progressall: function (e, data) {

                    }
                };




                return $inputFile.fileupload(opts);
            }
            return new fun();
        },
        timeFormat: function (strNetDateTime) {
            var strDate = "/Date(1360803600000)/".match(/\d+/);
            strDate = strDate && +strDate[0];
            return $.formatDateTime('yy-mm-dd gg:ii:ss', new Date(strDate));
        },
        validate: function () {
            if (arguments.length) {
                util.validate();

                for (var i = 0; i < arguments.length; i++) {
                    var opts = arguments[i];

                    opts.form.find("input[id],select[id],textarea[id]").each(function () {
                        var $this = $(this);
                        var id = $this.attr("id");
                        var data = $this.data();
                        opts.messages = opts.messages || {};
                        var messages = opts.messages;
                        for (j in data) {
                            if (/^rulemsg/.test(j)) {
                                var name = j.match(/rulemsg(\w*)/)[1].toLowerCase();
                                messages[id] = messages[id] || {};
                                messages[id][name] = data[j];
                            }
                        }
                    });

                    opts.form.find("input[name],select[name],textarea[name]").each(function () {
                        var $this = $(this);
                        if ($this.prop("required")) {
                            var lbl = $this.closest(".form-group").find(".control-label").eq(0);
                            if (!lbl.find("span.text-danger").length) {
                                lbl.html("<span class='text-danger'>*</span>" + lbl.html());
                            }
                        }
                    });

                    var validator = {};

                    if (opts.form.attr("novalidate")) {
                        validator = opts.form.validate();
                        // validator.settings.rules = opts.rules;
                        // validator.settings.messages = opts.messages;

                        var newMessages = $.extend({}, validator.settings.messages, opts.messages);
                        var newRules = $.extend({}, validator.settings.rules, opts.rules);


                        var newOpts = $.extend({}, validator.settings, opts);
                        newOpts.messages = newMessages;
                        newOpts.rules = newRules;
                        //validator = opts.form.validate(newOpts);
                        //opts.form.validate(newOpts);
                        opts.form.validate().settings = newOpts;
                    } else {
                        validator = opts.form.validate(opts);
                    }
                    return validator;

                    //return opts.form.validate(opts);
                }
            } else {
                $.validator.setDefaults(
                    {
                        highlight: function (element, errorClass, validClass, conClass, conErrorClass, conValidClass) {
                            var $element = $(element);
                            var settings = this.settings;
                            var $feedback = settings.cusAddClassFeedback($element);
                            if (element.type === "radio") {
                                this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                                // this.findByName(element.name).closest('.form-group').addClass('has-error').removeClass('has-success');
                                // this.findByName(element.name).closest("." + conClass).addClass(conErrorClass).removeClass(conValidClass);
                            } else {
                                $element.addClass(errorClass).removeClass(validClass);
                                // $(element).closest('.form-group').addClass('has-error').removeClass('has-success');
                            }
                            $feedback.addClass(conErrorClass).removeClass(conValidClass);
                        },
                        unhighlight: function (element, errorClass, validClass, conClass, conErrorClass, conValidClass) {
                            var $element = $(element);
                            var settings = this.settings;
                            var $feedback = settings.cusAddClassFeedback($element);
                            if (element.type === "radio") {
                                this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                                // this.findByName(element.name).closest('.form-group').removeClass('has-error');
                                // this.findByName(element.name).closest(".has-feedback").removeClass('has-error');
                            } else {
                                $element.removeClass(errorClass).addClass(validClass);
                                // $(element).closest('.form-group').removeClass('has-error');
                                // $element.closest(".has-feedback").removeClass('has-error');
                            }
                            $feedback.removeClass(conErrorClass);
                        },
                        success: function (label, element) {
                            // $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
                            $(element).closest('.has-feedback').removeClass('has-error').addClass('has-success');
                        },
                        showErrors: function () {
                            var i, elements, error;
                            for (i = 0; this.errorList[i]; i++) {
                                error = this.errorList[i];
                                if (this.settings.highlight) {
                                    this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass, this.settings.cusConClass, this.settings.cusConErrorClass, this.settings.cusConValidClass);
                                }
                                this.showLabel(error.element, error.message);
                            }
                            if (this.errorList.length) {
                                this.toShow = this.toShow.add(this.containers);
                            }
                            if (this.settings.success) {
                                for (i = 0; this.successList[i]; i++) {
                                    this.showLabel(this.successList[i]);
                                }
                            }
                            if (this.settings.unhighlight) {
                                for (i = 0, elements = this.validElements(); elements[i]; i++) {
                                    this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass, this.settings.cusConClass, this.settings.cusConErrorClass, this.settings.cusConValidClass);
                                }
                            }
                            this.toHide = this.toHide.not(this.toShow);
                            this.hideErrors();
                            this.addWrapper(this.toShow).show();
                        },
                        ignore: ":disabled,.bootstrap-timepicker-hour,.bootstrap-timepicker-minute",
                        focusInvalid: true,
                        errorElement: 'small',
                        errorClass: 'has-error',
                        //errorLabelContainer: $(".form-group", this),
                        onfocusout: function (element) {
                            if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element) || (!!$(element).attr("required") || (this.settings.rules[$(element).attr("id")] && this.settings.rules[$(element).attr("id")].required === true)))) {
                                this.element(element);
                            }
                        },
                        errorPlacement: function (error, element) {
                            // element.closest(".form-group").addClass("has-feedback");
                            var eleParent = element.parent();
                            var settings = this;
                            settings.cusAddClassFeedback(element);
                            if (eleParent.hasClass("input-group")) {
                                error.addClass("help-block").insertAfter(eleParent).before('<i class="form-control-feedback glyphicon"></i>');
                            } else if (eleParent.hasClass("checkbox-custom") || eleParent.hasClass("radio-custom") || eleParent.hasClass("checkbox-inline") || eleParent.hasClass("radio-inline")) {
                                error.addClass("help-block").appendTo(eleParent.closest(".checkbox,.radio").parent()).before('<i class="form-control-feedback glyphicon"></i>');
                            } else {
                                error.addClass("help-block").appendTo(eleParent).before('<i class="form-control-feedback glyphicon"></i>');
                            }
                        },
                        cusAddClassFeedback: function ($element) {
                            var eleParent = $element.parent();
                            if (eleParent.hasClass("input-group")) {
                                eleParent = eleParent.parent();
                            } else if (eleParent.hasClass("checkbox-custom") || eleParent.hasClass("radio-custom") || eleParent.hasClass("checkbox-inline") || eleParent.hasClass("radio-inline")) {
                                eleParent = eleParent.closest(".checkbox,.radio").parent();
                            }
                            return eleParent.addClass("has-feedback");
                        },
                        cusConClass: "has-feedback",
                        cusConErrorClass: "has-error",
                        cusConValidClass: "has-success"
                    });
                $.fn.resetForm = function () {
                    var $this = $(this);
                    var $area = $this;
                    if ($this.eq(0).is("form")) {
                        $area = $this;
                    } else {
                        $area = $this.closest(".has-feedback");
                        $area.removeClass("has-error has-success");
                    }
                    $area.find(".has-error.help-block").remove();
                    $area.find(".form-control-feedback").remove();
                    $area.find(".has-error,.has-success").removeClass("has-error has-success");
                }
            }
        },
        colorpicker: function ($this) {
            window.colorpick_manage.apply($this);
        },
        //待删除 Larry 2015-01-27
        imgcropShow: function (options) {
            var $this = options.$this = options.$this;
            var src = options.src = options.src;
            var type = options.type = options.type;
            var imageCropName = options.imageCropName = options.imageCropName;

            type = type || 0;
            var $imgcropBox = $this.closest(".form-group-imgupload").find(".imgcrop-box");
            var $imgCroping = $imgcropBox.find(".img-croping");
            var $imgCroped = $imgcropBox.find(".img-croped");

            var hide = function ($obj) {
                $obj.addClass("is-hide");
            }
            var show = function ($obj) {
                $obj.removeClass("is-hide");
            }
            var changeStatus = function (statusId) {
                if (typeof statusId === "number") {
                    if (statusId === 1) {
                        $imgcropBox.addClass("imgcrop-box-ing").removeClass("imgcrop-box-ed");
                        $imgcropBox.next(".col-upload").addClass("is-hide");
                    } else {
                        $imgcropBox.removeClass("imgcrop-box-ing").addClass("imgcrop-box-ed");
                        $imgcropBox.next(".col-upload").removeClass("is-hide");
                    }
                } else {
                    $imgcropBox.toggleClass("imgcrop-box-ing imgcrop-box-ed");
                }
            }

            $imgcropBox.addClass("is-show");

            if (type === 1) { //调用裁剪
                changeStatus(1);

                var isSame = $imgCroping.attr("src") == src;
                $imgCroping.attr("src", src);

                show($imgCroping);
                hide($imgCroped);

                window.jcrop_api && window.jcrop_api[imageCropName] && window.jcrop_api[imageCropName].destroy();
                if (isSame) {
                    util.imageCrop($imgcropBox.children('.img-croping'), options.cropWidth || null, options.cropHeight || null, ((options.cropRatio || options.cropRatio === 0) ? options.cropRatio : null), imageCropName);
                } else {
                    $imgcropBox.children('.img-croping').off("load").on("load", options, function (e) {
                        var options = e.data;
                        util.imageCrop($imgcropBox.children('.img-croping'), options.cropWidth || null, options.cropHeight || null, ((options.cropRatio || options.cropRatio === 0) ? options.cropRatio : null), imageCropName);
                    });
                }

                show($imgcropBox.find(".btn-img-croped"));
                show($imgcropBox.find(".jcrop-holder"));
            } else { //调用显示图片
                changeStatus(0);
                $imgCroped.attr("src", src);

                show($imgCroped);
                hide($imgCroping);
                $imgcropBox.find(".btn-img-croped").addClass("is-hide");
                $imgcropBox.find(".jcrop-holder").addClass("is-hide");
            }
        },
        //待删除 Larry 2015-01-27
        plUpload: function (plUploadConfig) {
            if (!window.plUpload) {
                return false;
            }
            var newplUploadConfig = {};
            var defaultConfig = {};
            if (plUploadConfig.$id) {
                // 纯裁剪简化版
                defaultConfig = {
                    $id: $(),// required
                    btntxt: '自定义封面',
                    container: 'imgUpload',
                    btn: 'btnimgUpload',
                    containerMsg: "imgUploadMSG",
                    func: function (path) {
                        var data = JSON.parse(path);
                        alert("无处理");
                        if (data.code == 0) { // if (data.code == 1) { //  // Larry tmp


                        } else {

                        }
                    },
                    url: "/ForwardHandler.ashx?_ForwardUrl=" + util.getFileDomain() + "/FileUpload",
                    extensions: "jpg,jpeg,gif,png",
                    extensionsTitle: "图片文件",
                    multi:
                    true
                };

                plUploadConfig.btntxt = plUploadConfig.btntxt || plUploadConfig.$id.data("btntxt");
                plUploadConfig.extensions = plUploadConfig.extensions || plUploadConfig.$id.data("extensions");
                //plUploadConfig.url = plUploadConfig.url || (util.getFileDomain() + (plUploadConfig.$id.data("url") || "FileUpload"));


                newplUploadConfig = $.extend({}, defaultConfig, plUploadConfig);

                var $id = newplUploadConfig.$id;

                var id = $id.attr("id") || new Date().getTime();

                newplUploadConfig.container = newplUploadConfig.container + id;
                newplUploadConfig.btn = newplUploadConfig.btn + id;
                newplUploadConfig.containerMsg = newplUploadConfig.containerMsg + id;


                var html = '';

                var $idParent = $id.parent();
                var $upload = $idParent.siblings(".col-upload");
                if (!$upload.length) {
                    $upload = $idParent.find(".col-upload");
                }

                $upload.append('\
					<span class="btn btn-style-6 btn-img-select" style="display:none;">&ensp;选择封面&ensp;</span>\
					<div class="separator bottom" style="display:none;"></div>\
					<span class="btn btn-default btn-file" id="'+ newplUploadConfig.container + '">\
						<span id="' + newplUploadConfig.btn + '">' + newplUploadConfig.btntxt + '</span>\
					</span>\
					<div id="'+ newplUploadConfig.containerMsg + '"></div>\
					<div class="separator bottom"></div>\
				');

                if (plUploadConfig.func) {

                } else {
                    newplUploadConfig.func = function (path) {
                        var data = JSON.parse(path);
                        if (data.code == 0) {
                            $idParent.find(".img-croped").attr("src", data.url);
                            $idParent.find(".file-croped").attr("href", data.url).css("display", "block");
                            $id.val(data.url);

                            $id.siblings(".file-list").html('<div><a class="btn btn-link" href="' + data.url + '" target="_blank">查看文件</a></div>');

                            $id.valid();
                        } else {
                            $id.valid();
                        }
                    };
                }
            } else {
                newplUploadConfig = plUploadConfig;
            }

            window.plUpload.config(newplUploadConfig);
            window.plUpload.init();
        },
        //待删除 Larry 2015-01-27
        imgUploadAndCrop: function (opts) {
            opts.$imagebox = opts.$imagebox;
            opts.plUploadConfig = opts.plUploadConfig;
            opts.imgCropName = opts.imgCropName;
            opts.urlCutting = opts.urlCutting;
            opts.dataCover = opts.dataCover;

            var fun = function () {
                var urlCutting = opts.urlCutting || util.getFileDomain() + "/Cutting";
                //var urlCutting = opts.urlCutting || encodeURIComponent("/ForwardHandler.ashx?_ForwardUrl=" + util.getFileDomain() + "Cutting");
                var plUploadConfig = opts.plUploadConfig;
                var imgCropName = opts.imgCropName;
                var $imagebox = opts.$imagebox;

                var $formGroup = $imagebox.closest(".form-group-imgupload");

                //选择图片的弹框
                var $modal = $("." + $imagebox.data("target-modal"));

                //选择图片的加载图片
                var loadCover = function ($modal, dataCover) {
                    var module = '<div class="item">\
									<div class="thumbnail widget-thumbnail">\
										<img src="' + window.FileDomain + '">\
										<div class="caption">\
											<i class="fa fa-circle-o"></i>\
											<span class="txt"></span>\
										</div>\
									</div>\
								</div>';
                    var getHtml = function (img, txt) {
                        return '<div class="item">\
									<div class="thumbnail widget-thumbnail">\
										<img src="' + window.FileDomain + img + '">\
										<div class="caption">\
											<i class="fa fa-circle-o"></i>\
											<span class="txt">' + txt + '</span>\
										</div>\
									</div>\
								</div>';
                    };

                    var htmls = "";
                    for (var i = 0; i < dataCover.length; i++) {
                        htmls += '<div class="form-group form-group-cover is-hide"><div class="col-sm-12 list list-cover">';
                        var dataCoverItem = dataCover[i];
                        for (var j = 0; j < dataCoverItem.length; j++) {
                            var _this = dataCoverItem[j];
                            var img = _this.img;
                            var txt = _this.txt;
                            htmls += getHtml(img, txt);
                        };
                        htmls += '</div></div>';
                    };

                    var $form = $modal.find(".modal-body .form-horizontal");
                    $(htmls).appendTo($form);

                    $form.find("http://newstatic.icrp.xjtu.edu.cn/app/public/.form-group-style .btn").eq(0).addClass("btn-style-4").removeClass("btn-link");
                    $form.find(".form-group-cover").eq(0).removeClass("is-hide");
                    $form.find("http://newstatic.icrp.xjtu.edu.cn/app/public/.form-group-cover .item").eq(0).addClass("active");

                }
                //选择图片的选中图片
                var getSelect = function ($modal) {
                    var $form = $modal.find(".modal-body .form-horizontal");
                    var $items = $form.find("http://newstatic.icrp.xjtu.edu.cn/app/public/.form-group-cover .item");
                    var $active = $items.filter(".active");
                    if (!$active) {
                        $active = $items.eq(0);
                    }
                    return $active.attr("src");
                }

                if (opts.dataCover) {
                    // 选择图片的弹框 的打开弹框按钮
                    $imagebox.on("click", ".btn-img-select", function () {
                        if (!$modal.find(".form-group-cover .active").length) {
                            loadCover($modal, opts.dataCover);
                        }
                        util.modal.show($modal);
                    });

                    // 选择图片的弹框中的确认选中图片按钮
                    $modal.on("click", ".modal-footer .btn-o-save", function () {
                        var $this = $(this);
                        util.imgcropShow({
                            $this: $formGroup.find(".btn-img-select"),
                            src: $modal.find(".form-group-cover .active").find("img").attr("src")
                        });
                    });

                    // 选择图片的弹框中的切换类型按钮
                    $modal.on("click", "http://newstatic.icrp.xjtu.edu.cn/app/public/.form-group-style .btn", function () {
                        var $this = $(this);
                        var $btnArr = $this.parent().find(".btn");
                        var index = $btnArr.index($this);
                        var $listCoverArr = $modal.find(".form-group-cover");
                        $btnArr.addClass("btn-link").removeClass("btn-style-4").eq(index).removeClass("btn-link").addClass("btn-style-4");
                        $listCoverArr.addClass("is-hide").eq(index).removeClass("is-hide");
                    });

                    // 选择图片的弹框中的选中当前图片
                    $modal.on("click", "http://newstatic.icrp.xjtu.edu.cn/app/public/.list-cover .item", function () {
                        var $this = $(this);
                        var $modal = $this.closest(".modal");
                        $modal.find("http://newstatic.icrp.xjtu.edu.cn/app/public/.list-cover .item").filter(".active").removeClass("active");
                        $this.addClass("active");

                        return getSelect($modal);
                    });
                }


                // 裁剪确认按钮
                $imagebox.on("click", ".btn-img-croped", function () {
                    var $img = $imagebox.find(".img-croping");
                    var data = $img.data();
                    var src = $imagebox.find(".imgcrop-box").find(".img-croping").attr("src");
                    var strData = {
                        //_ForwardUrl: util.getFileDomain() + "Cutting",
                        h: data.h,
                        w: data.w,
                        x: data.x,
                        y: data.y,
                        x2: data.x2,
                        y2: data.y2,
                        f: src,
                        img_width: data.img_width,
                        img_height: data.img_height
                    };

                    var urlCuttingNow = urlCutting + "?_ForwardUrl=" + encodeURIComponent(util.getFileDomain() + "/Cutting?" + $.param(strData));

                    $.ajax({
                        type: "get",
                        url: urlCuttingNow,
                        //data: "h=" + data.h + "&w=" + data.w + "&x=" + data.x + "&y=" + data.y + "&x2=" + data.x2 + "&y2=" + data.y2 + "&f=" + src + "&img_width=" + data.img_width + "&img_height=" + data.img_height,
                        // data: $.param(strData),
                        success: function (data) {
                            if (data != "") {
                                $imagebox.find(".imgcrop-box").removeClass("imgcrop-box-ing").addClass("imgcrop-box-ed");
                                window.jcrop_api[opts.imgCropName].destroy();
                                $imagebox.find(".img-croped").attr("src", data).removeClass("is-hide");
                                $imagebox.find(".img-croping").addClass("is-hide").removeAttr("style");
                                //$imagebox.find(".jcrop-holder").addClass("is-hide");
                                //$imagebox.find(".btn-img-croped").addClass("is-hide");
                                $imagebox.find(".imgcrop-box").find("input[type=hidden]").val(data);
                                $imagebox.find(".col-upload").removeClass("is-hide");
                            } else {
                                alert("失败！");
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            alert("失败！");
                        }
                    });
                });

                util.plUpload(plUploadConfig);
                // return event;
            }

            var newfun = new fun();
            return newfun;
        },
        headerBtnHover: function () {
            var $headerUserMenu = $("#headerUserMenu");
            $headerUserMenu.on("mouseenter mouseleave", function (e) {
                var $this = $(this);
                var $dropdown = $this.find(".dropdown-toggle");
                if (e.type === "mouseenter") {
                    $dropdown.dropdown("toggle");
                } else if (e.type === "mouseleave") {
                    if ($this.hasClass("open")) {
                        $dropdown.dropdown("toggle");
                    }
                }
            });

            var $inputSearch31Site = $("#inputSearch31Site");
            var $btnSearchType = $inputSearch31Site.find(".input-group-btn");
            var $input = $inputSearch31Site.find("input");
            var $btn = $inputSearch31Site.find("#inputSearch31SiteBtn");
            var searchInfo = function () {
                var type = 'Keyword';
                var key = encodeURIComponent($input.val().replace("/", "").replace(":", "").replace("(", "").replace(")", ""));
                var searchType = +$input.data("type") || 0;
                switch (searchType) {
                    case 1:
                        searchhref = key == "" ? "news/search/" : "news/search/" + key;
                        break;
                    case 2:
                        searchhref = key == "" ? "company/suppliersearch/" : "company/suppliersearch/?keyword=" + key;
                        break;
                    case 3:
                        searchhref = key == "" ? "cd/searchlist/" : "cd/searchlist/?keyword=" + key;
                        break;
                    case 4:
                        searchhref = key == "" ? "http://newstatic.icrp.xjtu.edu.cn/app/public/2014/companylist.aspx" : "2014/companylist.aspx?searchtag=" + key;
                        break;
                    case 0:
                        searchhref = key == "" ? "http://newstatic.icrp.xjtu.edu.cn/app/public/2015/Ajax/SearchEventHandler.ashx" : "2015/Ajax/SearchEventHandler.ashx?value=" + key + "&type=Keyword";


                        break;
                    default:
                        searchhref = key == "" ? "http://newstatic.icrp.xjtu.edu.cn/app/public/2015/Ajax/SearchEventHandler.ashx" : "2015/Ajax/SearchEventHandler.ashx?value=" + key + "&type=Keyword";
                        break;
                }
                window.location.href = wwwDomain + searchhref;
            }

            $btnSearchType.on("mouseenter mouseleave", function (e) {
                var $this = $(this);
                if (e.type === "mouseenter") {
                    $this.find(".dropdown-toggle").dropdown("toggle");
                }
                if (e.type === "mouseleave") {
                    if ($this.hasClass("open")) {
                        $(this).find(".dropdown-toggle").dropdown("toggle");
                    }
                }
            });

            $btnSearchType.find(".dropdown-menu").on("click", "li", function () {
                var $this = $(this);
                var type = $this.data("type");
                $this.addClass("is-hide");
                $this.siblings("li").removeClass("is-hide");
                $inputSearch31Site.find("http://newstatic.icrp.xjtu.edu.cn/app/public/button .txt").text($this.find("a").text());
                $input.data("type", type);
            });

            $btn.on("click", function (e) {
                searchInfo();
            });

        },
        loadingImgShow: function () {
            if ($(".modal-attendee-loading").length) {

            } else {
                $('<div class="modal-attendee-loading"><i class="ico ico-050"></i></div>').appendTo("body")
                $('<div class="modal-backdrop modal-backdrop-loading fade in"></div>').appendTo("body")
            }
        },
        loadingImgHide: function () {
            $(".modal-attendee-loading,.modal-backdrop-loading").remove()
        },
        getCurrentURL: function () {
            return document.URL;
        },
        // 表单的序列化和字符串编码功能
        formSerialize: function (form) {
            var formJson = $(form).serialize();
            if (formJson != null && formJson != undefined && formJson.length > 0) {
                var html = '';
                var formJsonArr = formJson.split('&');
                if (formJsonArr.length > 0) {
                    $(formJsonArr).each(function () {
                        var valStrs = this.split('=');
                        html += valStrs[0] + '=' + encodeURIComponent(valStrs[1]) + '&';
                    });
                }
                return html;
            }
        },
        //翻译(把中文翻译成当前通道语言)
        translate: function (content) {
            if (!content) {
                return content;
            }
            var langType = $('html').attr('lang');
            if (!util.languageList) {
                util.languageList = JSON.parse(window.TranslateList || '[]');
            }
            var language = util.languageList.find(function(n){
                return n.key === content;
            });
            if (!language) {
                return content;
            }
            if (langType == 'en') {
                return language.en;
            }
            return language.ch || content;
        }
    }       
})();



$.fn.clearVal = function () {
    var $this = $(this)
    var isGroup = $this.hasClass("form-group");
    if (isGroup) {
        var $group = $this;
        var $inputs = $group.find("input,select,textarea");
        var $input = $inputs.eq(0);
        if ($input.filter(":radio").length) {
            $inputs.filter(":checked").radio("uncheck")
        } else if ($input.filter(":checkbox").length) {
            $inputs.filter(":checked").radio("uncheck")
        } else if ($input.filter("select").length) {
            $inputs.val("").selectpicker("refresh");
        } else if ($input.filter("textarea").length) {
            $inputs.val("");
        } else if ($input.filter(":hidden").length) {
            $inputs.val("");
            $group.find(".file-list").remove();
        } else {
            $inputs.val("");
        }
    }
}