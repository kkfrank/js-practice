/**
 * 传入两个时间，获得时间块的宽度
 * @param start 开始时间 格式 yyyy-MM-dd 24hh:mm 如果是2016-07-01,则当成2016-07-01 00:00
 * @param end   结束时间 格式 yyyy-MM-dd 24hh:mm
 */
function get_width(start, end) {
    if (!start || !end) return;//如果没有时间，返回undefined,则jsp中不渲染此甘特图
	//if(start>=end) return 0;//如果结束时间大于开始时间，返回0
    var max_end = get_date(globalObj.start_time, 3);
    max_end += " 04:00";
    var from = new Date(Date.parse(start.replace(/-/g, "/"))).getTime(),
        to = new Date(Date.parse(end.replace(/-/g, "/"))).getTime();

    var max_date = new Date(Date.parse(max_end.replace(/-/g, "/"))).getTime();
    if (to > max_date) {
    	//console.log(start,end,to,max_date)
        to = max_date;
    }
    //return globalObj.scale/2 * (to - from) / (1000 * 60);
    if(globalObj.scale===1){
    	return globalObj.scale * 2 *(to - from) / (1000 * 60 * 3);
    }
    return globalObj.scale * (to - from) / (1000 * 60 * 2);
}
/**
 * 传入开始时间，获得距离左边开始位置的距离
 * @param time yyyy-MM-dd 24hh:mm
 */
function get_left(time) {
    return get_width(globalObj.start_time, time);
}
/**
 * 将系统格式时间转化为 yyyy-MM-dd 24hh:mm
 * 传入flag，且为1，返回yyyy-MM-dd
 */
function convertTime(date, flag) {
    var month = (date.getMonth() + 1 < 10 ? "0" : "") + (date.getMonth() + 1),
        day = (date.getDate() < 10 ? "0" : "") + date.getDate(),
        hour = (date.getHours() < 10 ? "0" : "") + date.getHours(),
        minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    if (flag === 1) {
        return date.getFullYear() + "-" + month + "-" + day;
    } else {
        return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
    }

}
/**
 * 传入日期，步长，获取此日期+步长的那天，返回格式yyyy-MM-dd
 * @param date yyyy-MM-dd
 * @param step ………… -1, 0, 1 …………
 */
function get_date(date, step) {
    var arr = date.split("-"),
        newDay = new Date(arr[0], arr[1] - 1, arr[2]);
    newDay.setDate(newDay.getDate() + step);
    //return convertTime(newDay).substring(0, 10);
    return convertTime(newDay, 1);
}
/**
 * 画时间刻度，传入中间那天
 * @param date yyyy-MM-dd
 */
function timeScale(date) {
    var pattern = /^\d{4}[-]\d{2}[-]\d{2}/;
    if (!pattern.test(date)) return;

    var $timePoint = $(".timePoint");
    $timePoint.html("");//先清空时间轴

    var render_time = doT.template(document.getElementById("time_point_tmpl").innerHTML);
    $timePoint[0].innerHTML = render_time({date: date});
}
//显示提示框，并设置内容、位置
function showTips(tempId, data, event) {

    var $tips = $("#tips_info");
    if (tempId === "legtime") {
        $tips.addClass("small-padding").html(data);
    } else if (tempId === "acno_hover") {
        $tips.html(data);
    } else if (tempId === "plan_menu") {
        $tips = $("#plan_menu");
    } else if (tempId === "actual_menu") {
        $tips = $("#actual_menu");
    } else if (tempId === "importType") {
    	  $tips.addClass("importType").html(data);
    	  $tips.css("top", event.clientY - $tips.outerHeight()).css("left", event.clientX);
    } else {
        var tmplText = doT.template(document.getElementById(tempId).innerHTML);
        $tips.html(tmplText(data));
    }
    if (tempId !== "legtime") {
        $tips.removeClass("small-padding");
    }
    var info_w = $tips.outerWidth(),
        info_h = $tips.outerHeight();
    if ((event.clientX + info_w) > $(window).width() && (event.clientY + info_h) > $(window).height()) {
        $tips.css("left", event.clientX - info_w).css("top", event.clientY - info_h);
    } else if ((event.clientY + info_h) > $(window).height()) {
        $tips.css("top", event.clientY - info_h).css("left", event.clientX);
    } else if ((event.clientX + info_w) > $(window).width()) {
        $tips.css("left", event.clientX - info_w).css("top", event.clientY);
    } else {
        //$tips.css("left", event.clientX+5).css("top", event.clientY+5);
        $tips.css("left", event.clientX + 5).css("top", event.clientY);
    }
    $tips.show();
}
//隐藏提示框，并清空提示框内容
function hideTips() {
    $("#tips_info").hide().removeClass("small-padding").html("");
}
//设置页面内容box的宽高
function setBoxHW() {
    var $airCtNo = $('#aircraft_nos'),//左侧机号
        footerH = $('.footer').is(":visible") ? $('.footer').height() : 0,
        $box = $('.c_box');
    var topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom;
    $box.height($(window).height() - topbarsH - footerH);
    $box.width($(window).width() - $airCtNo.width());
    setRedLineH();

    //$(".c_box #mCSB_1_container").width($(".timePoint").width());
    $(".c_box .mCSB_container").width($(".timePoint").width());
    $box.mCustomScrollbar("update");
}
function setCanvasHW() {
    var w = $(".infos_details").width(),
        h = $(".infos_details").height();
    $("#drawing").attr("width", w);
    $("#drawing").attr("height", h);
}
function setLineCenter() {
    var width = $(window).width() / 2,
        $box = $(".c_box"),
        $line = $(".v_line"),
        left = parseInt($line.css("left")),
        scrollData = $box.data("scroll");
    var left1 = Math.abs(parseInt($(".c_box .mCSB_container").css("left")));
    var top = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));
    //$box.scrollLeft($box.scrollLeft()-(width-left));
    //$box.mCustomScrollbar("scrollTo", [top, left1 - (width - left)]);
    $box.mCustomScrollbar("scrollTo", [top, left1 - (left)]);
}
function initScroll() {
    var $scroll = $('.c_box'),//水平滚动
        topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
        $timePoint = $('.timePoint'),//顶部时刻表
        $airCtNo = $('#aircraft_nos'),//左侧机号
        $v_line = $('.v_line'),
        scroll_val;

    $scroll.on("scroll", function (event) {
        var data = $(this).data("scroll"),
            now_top = $(this).scrollTop(),
            now_left = $(this).scrollLeft();
        if (!data) {
            data = {top: 0, left: 0};
        }
        $airCtNo.css({'top': (topbarsH - $scroll.scrollTop())});
        $timePoint.css({'margin-left': (-$scroll.scrollLeft())});
        /*             if(data.top!==now_top){
         //          console.log("上下")
         $airCtNo.css({'top': (topbarsH - $scroll.scrollTop())});
         }
         if(data.left!==now_left){
         //          console.log("左右")
         $timePoint.css({'margin-left': (-$scroll.scrollLeft())});
         } */
        $(this).data("scroll", {top: now_top, left: now_left});
        /*     if(!globalObj.scroll_obj){
         globalObj.scroll_obj={
         top:0,
         left:0
         }
         } */
        //scroll_val=$scroll.scrollLeft()-globalObj.scroll_obj.left;
        scroll_val = $scroll.scrollLeft() - globalObj.scroll_prev;

        globalObj.scroll_prev = $scroll.scrollLeft();
        //globalObj.scroll_obj.left=$scroll.scrollLeft();
        //globalObj.scroll_obj.top=$scroll.scrollTop();

       // $v_line.css({left: $v_line.offset().left - scroll_val});
        //$v_line.css({left: $v_line.offset().left - $scroll.scrollLeft()});
    });

}
//设置当前时间线的高度
function setRedLineH() {
    var $v_line = $('.v_line'),
        topbarsH = $(".timePoint")[0].getBoundingClientRect().top,
        footerH = $('.footer').is(":visible") ? $('.footer').height() : 0;
   // $v_line.height(window.innerHeight - topbarsH - footerH - 17);
}
//清空甘特图
function clearContent() {
    $("#aircraft_nos").html("");//左边航班号
    $("#infos_details").html("");//右边甘特图内容,同时也清除了里面的画布
}

function launchFullscreen(element) {
    var requestMethod = element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;
    if (requestMethod) {
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
function exitFullscreen() {
    var exitMethod = document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullscreen ||
        document.msExitFullscreen;
    if (exitMethod) {
        exitMethod.call(document);
    } else if (typeof window.ActiveXObject !== "undefined") {
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function Point(x, y, start) {//甘特图要连线的点
    this.x = x;
    this.y = y;
    this.start = start;
}
function linkLine(points, type) {//连线函数,arr为Point的数组,type为flyer or crew
    var drawing = document.getElementById("drawing");
    if (typeof G_vmlCanvasManager !== "undefined") {
        G_vmlCanvasManager && (drawing = G_vmlCanvasManager.initElement(drawing));
    }
    if (drawing.getContext) {
        var context = drawing.getContext("2d"),
            color = "";
        if (type === "flyer") {
            color = "#ff0";
        } else {
            color = "#0f6";
        }
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.beginPath();
        for (var i = 0, len = points.length; i < len; i++) {
            if (points[i].start) {
                context.moveTo(points[i].x, points[i].y);
            } else {
                context.lineTo(points[i].x, points[i].y);
            }
        }
        context.stroke();
        $('.canvas-drawing').show();
    }
}
function linkGantt(flightIds, type) {
    if (!flightIds || !type || flightIds.length <= 1) {
        showAlert("无连线", "warn");
        return;
    }
    clearLine();//连线之前清除连线

    globalObj.flightIds = flightIds;//设置全局变量
    globalObj.type = type;//设置全局变量

    var points = [],//需要连线的点数组
        plans = [],//jquery对象数组
        x, y,
    //scrollTop=$(".c_box").scrollTop();
        scrollTop = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));
    topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom;

    for (var i = 0, n = flightIds.length; i < n; i++) {
        var $plan = $(".plan[data-dayFlightId='" + flightIds[i] + "']");
        if (!$plan.is(":visible")) {//有一个航班条是隐藏状态，就返回，不连线
            return;
        }
        plans.push($plan);
    }
    maskObj.maskElement(".infos_details>li");
    for (var i = 0, n = plans.length; i < n; i++) {
        var $ft_info = plans[i].find(".ft_info");
        plans[i].addClass('higher-index')
        $ft_info.addClass(type);//加边框
        if (i === 0) {//第一个，取甘特条右边的点
            x = plans[i].position().left + $ft_info.width();
            y = plans[i].offset().top + scrollTop - topbarsH + plans[i].height() / 2;
            points.push(new Point(x, y, true));
        } else {
            x = plans[i].position().left;
            y = plans[i].offset().top + scrollTop - topbarsH + plans[i].height() / 2;
            points.push(new Point(x, y, false));
            if (i !== n - 1) {//如果有下一个，取甘特条右边的点
                x = plans[i].position().left + $ft_info.width();
                y = plans[i].offset().top + scrollTop - topbarsH + plans[i].height() / 2;
                points.push(new Point(x, y, true));
            }
        }
    }
    linkLine(points, type);//连线
}

function clearLine() {//清除连线,同时清除缓存的全局变量
    $('.canvas-drawing').hide();
    globalObj.flightIds = null;//清空全局变量
    globalObj.type = null;//清空全局变量
    setCanvasHW();//重置宽或者高，清除画布
    $(".flyer").removeClass("flyer").parent('.higher-index').removeClass('higher-index');//清除边框
    $(".stew").removeClass("stew").parent('.higher-index').removeClass('higher-index');
    maskObj.unmaskElement(".infos_details>li");
}
function hideLine() {//隐藏连线,仅清除画布，不清除全部变量
    $('.canvas-drawing').hide();
    $(".flyer").removeClass("flyer").parent('.higher-index').removeClass('higher-index');//清除边框
    $(".stew").removeClass("stew").parent('.higher-index').removeClass('higher-index');
    //maskObj.unmaskElement(".infos_details>li");
    setCanvasHW();//重置宽或者高，清除画布
}
function showLine() {//根据保存的全局变量,显示连线
    if (globalObj.flightIds && globalObj.type) {
        linkGantt(globalObj.flightIds, globalObj.type);
    }
}

function chgGanttData(obj) {//局部刷新,修改缓存数据
    for (var i = 0, len = globalObj.ganttData.length; i < len; i++) {
        var item = globalObj.ganttData[i];
        if (obj.acType !== item.acType) {
            continue;
        }

        for (var j = 0, jLen = item.airList.length; j < jLen; j++) {
            var air = item.airList[j];
            if (obj.acno === air.acno) {
                item.airList.splice(j, 1, obj);
            }
        }
    }
}
function LocalObj(acType, obj) {
    this.localFresh = true;
    this.acType = acType;
    this.airList = [];
    this.airList = [].concat(obj);
}
function localFresh(arr) {
    var tempFn = doT.template(document.getElementById("gantt").innerHTML);
    for (var i = 0, len = arr.length; i < len; i++) {
        var acType = arr[i].acType,
            airList = arr[i].airList;
        for (var j = 0, jLen = airList.length; j < jLen; j++) {
            var acno = airList[j].acno;
            var $targetLi = $("#infos_details").children("[data-acno=" + acno + "][data-actype=" + acType + "]");
            if ($targetLi.length === 0) {//找不到机号，返回
                continue;
            }
            var obj = new LocalObj(acType, airList[j]);
            var newNode = tempFn([obj]);
            $targetLi.replaceWith(newNode);
            chgGanttData(airList[j]);//修改缓存数据
        }
    }
}

function clearAutoFresh() {//清除自动刷新
    clearInterval(globalObj.autoFreshId);
}
function drawTimeLine() {
    //globalObj.scroll_obj=null;
    globalObj.scroll_prev = 0;
    /* 	globalObj.scroll_obj.top=0;
     globalObj.scroll_obj.left=0; */
    var left = get_left(convertTime(new Date())),
        $hScroll = $('.c_box'),//水平滚动
        width = $('#aircraft_nos').width(),
        $v_line = $('.v_line'),
        w = $(".infos_details").width() - $hScroll.width();
    $v_line.show();
    setRedLineH();
    //$v_line.css({left: left + width});//红线
    console.log('left',left)
    $v_line.css({left: left});//红线
    clearInterval(globalObj.timeLineId);
    var $gantts = $('[data-moving]');

    globalObj.timeLineId = setInterval(function () {
        left = $v_line.css('left');
        console.log($v_line.offset().left,$v_line.css('left'))
        $v_line.css({left: left + (1 * globalObj.scale)});

        $gantts.each(function (index, item) {//甘特图随时间移动
            var $last = $(item).children().last();
            var w = $last.width();
            $last.width(w + (1 * globalObj.scale));
        });

    }, 1000 * 60);
}

function draw(data, type) {
    var $scroll = $('.c_box'),//水平滚动
        scrollData = $scroll.data("scroll");//上一次滚动条的位置，要在clearContent()之前
    //scrollData=globalObj.scroll_obj;
    if (type === 1) {//如果是调整刻度
        hideLine();
    } else {
        clearLine();
    }

    clearContent();

    globalObj.ganttData = data;
    timeScale($("#fltDate").val());

    // var len=Math.ceil(h/41), //首屏加载的个数,41为  h计划甘特条+h实际甘特条
    var aircrafts = document.getElementById("aircraft_nos"),//左边航班号
        details = document.getElementById("infos_details");//右边甘特图内容
    //航班号
    var render_acnos = doT.template(document.getElementById("acnos_tmpl").innerHTML),
        html_acnos = render_acnos(data);
    aircrafts.innerHTML = html_acnos;

    //甘特图
    var render_gantt = doT.template(document.getElementById("gantt").innerHTML);
//var html_render = render_gantt(data);
    //  $details.innerHTML+=html_render;
    var render_pre, render_aft;
    render_pre = render_gantt(data);
    details.innerHTML = render_pre;
    /*         if(data.length<=len){
     render_pre = render_gantt(data);
     details.innerHTML=render_pre;
     }else{
     var data1=data.slice(0,len),
     data2=data.slice(len,data.length);
     render_pre = render_gantt(data1);
     details.innerHTML+=render_pre;

     setTimeout(function () {
     render_aft = render_gantt(data2);
     details.innerHTML+=render_aft;
     },0);
     } */


    /*  var w=$(".infos_details").width(),
     h=$(".infos_details").height();
     $("#drawing").attr("width",w);
     $("#drawing").attr("height",h); */
    setBoxHW();
    setCanvasHW();
    setTimeout(function () {//刻度3切换到刻度1时候，连线有问题，要等到元素都渲染出来，再连线。很奇怪，明明是单线程的
        showLine();
    }, 12)

    /*  if(globalObj.flightIds && globalObj.type){
     linkGantt(globalObj.flightIds, globalObj.type);
     } */
    setTimeout(function () {
        console.log("总的甘特数目:" + ($(".plan").length + $(".actual").length))
    }, 100);
    drawTimeLine();
    if (!scrollData) {//第一次进来，定位到中间
        var w = $(".infos_details").width() - $scroll.width();
        $scroll.mCustomScrollbar("scrollTo", [0, w / 2])
    } else {

    	     var nowLeft=$('.zero-time-line').children(0)[0].getBoundingClientRect().left
    	//var nowLeft=$('.infos_details .plan').children(0)[0].getBoundingClientRect().left
    	//var nowLeft=$('.timePoint>li').children(37)[0].getBoundingClientRect().left
    	        var diffLeft=nowLeft-scrollData.prevLeft
    	        console.log(scrollData.prevLeft,nowLeft,diffLeft,scrollData.left)
    	        $scroll.mCustomScrollbar("scrollTo", [scrollData.top, scrollData.left+diffLeft]);
    	        $scroll.scrollLeft(scrollData.left+diffLeft);
    	        $scroll.scrollTop(scrollData.top);

   
    }
}

function searchByAcno(value, Mask) {//按机号查询
    if (value.length < 5) {
        showAlert("机号5位数", "warn");
    } else {
        value = value.toUpperCase();
        var $box = $(".c_box"),//水平滚动
            topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
            footerH = $('.footer').is(":visible") ? $('.footer').height() : 0,
            $findLeft = $(".aircraft_no [data-acno=" + value + "]"),
            $findRight = $(".infos_details  [data-acno=" + value + "]"),
            halfH = ($(window).height() - topbarsH - footerH) / 2;

        if ($findLeft.length < 1 || $findLeft.hasClass("hide_important")) {//未找到或者找到的是 无航班机号且未显示
            showAlert("未找到机号", "warn");
        } else {
            //如果收缩,先展开
            if ($("#shrink i").first().hasClass("arrow1-right")) {
                $("#shrink").click();
            }
            if (!$findLeft.is(":visible")) {
                $findLeft.parent().prev().children(".type").click();
            }

            Mask.maskElement(".aircraft_no");//左边
            Mask.maskElement(".infos_details");//右边
            Mask.maskElement(".divtype");//收缩机型号

            var oldZ = $findRight.css("z-index");
            newZ = parseInt($(".bui-ext-mask").css("z-index")) + 1;

            $findLeft.css("z-index", newZ);
            $findRight.css("z-index", newZ);

            var sTop = Math.abs(parseInt($(".c_box .mCSB_container").css("top"))),
                top = sTop - (halfH - $findRight[0].getBoundingClientRect().top);
            top = top < 0 ? 0 : top;
            $box.mCustomScrollbar("scrollTo", [top]);

            $("#infos_details").one("click", function (event) {
                Mask.unmaskElement(".aircraft_no");
                Mask.unmaskElement(".infos_details");
                Mask.unmaskElement(".divtype");

                $findRight.css("z-index", oldZ);
                $findLeft.css("z-index", "auto");
            });
            $("#aircraft_nos").one("click", function (event) {
                Mask.unmaskElement(".aircraft_no");
                Mask.unmaskElement(".infos_details");
                Mask.unmaskElement(".divtype");

                $findRight.css("z-index", oldZ);
                $findLeft.css("z-index", "auto");
            });
        }
    }
}
function searchByDate(value, Mask) {
    var number, date, i, pattern = /^\d{4}$/;
    var fun = searchByFlight;//默认按航班号查询
    i = value.indexOf("/");
    number = value.substring(0, i);
    date = value.substring(i + 1);

    if (!pattern.test(date)) {
        showAlert("查询格式错误", "warn");
        return;
    }
    if (number.substring(0, 1).toLowerCase() === "b") {//搜索机号
        var temp = number.substring(1);
        if (!pattern.test(temp)) {
            showAlert("查询格式错误", "warn");
            return;
        }
        fun = searchByAcno;
    }
    if (number.substring(0, 2).toLowerCase() === "9c") {//搜索航班号
        number = number.substring(2);
    }
    if (number.length < 4) {
        showAlert("查询格式错误", "warn");
        return;
    }
    var calendarDate = $("#fltDate").val();
    date = calendarDate.substr(0, 4) + "-" + date.substring(0, 2) + "-" + date.substring(2);
    if (date === calendarDate) {//查询今天
        fun(number, Mask);
    } else {
        $("#fltDate").val(date);
        query(fun, number, Mask);
    }
}
function searchByFlight(value, Mask) {//按航班号查询
    var $box = $(".c_box"),//水平滚动
        topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
        footerH = $('.footer').is(":visible") ? $('.footer').height() : 0,
        halfH = ($(window).height() - topbarsH - footerH) / 2;
    w = $(window).width() / 2,
        today = $("#fltDate").val(),
        hasPostion = false;

    if (value.substring(0, 2).toLowerCase() === "9c") {
        value = value.substring(2);
    }
    if (value.length >= 4) {
        var spans = $(".plan .ft_no>span").filter(function (index, ele) {//返回元素集合
            var flightNO = $(this).html();
            return flightNO.indexOf(value.toUpperCase()) > -1;
        });
        if (spans.length < 1) {
            showAlert("航班未找到", "warn");
        } else {
            var newZ = parseInt($(".bui-ext-mask").css("z-index")) + 1,
                plans = [];//jquery集合
            Mask.maskElement(".infos_details>li");
            for (var i = 0, n = spans.length; i < n; i++) {
                var $plan = $(spans[i]).closest(".plan");

                $plan.addClass("on");//加样式

                plans.push($plan);

                var $li = $(spans[i]).closest("li"),
                    acType = $li.attr("data-acType");
                if (!$li.is(":visible")) {//如果收缩,先展开
                    if (!hasPostion && $("#shrink i").first().hasClass("arrow1-right")) {//仅需第一次展开
                        $("#shrink").click();
                    }
                    $(".type[data-acType=" + acType + "]").click();
                }
                if (!hasPostion) {//有一个定位后就 不定了
                    var rect = $plan[0].getBoundingClientRect();
                    //$box.scrollTop($box.scrollTop()-(halfH-rect.top));
                    //$box.scrollLeft($box.scrollLeft()-(w-rect.left));
                    var sLeft = Math.abs(parseInt($(".c_box .mCSB_container").css("left"))),
                        sTop = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));
                    var top = sTop - (halfH - rect.top),
                        left = sLeft - (w - rect.left);
                    top = top < 0 ? 0 : top;
                    left = left < 0 ? 0 : left;
                    $box.mCustomScrollbar("scrollTo", [top, left]);
                }

                var dFlight = BUI.JSON.parse($plan.attr("data-flight"));
                if (dFlight.fltDate === today) {
                    hasPostion = true;
                }
            }
            //还原
            /* 			setTimeout(function(){
             Mask.unmaskElement(".infos_details>li");
             for(var i=0,n=plans.length;i<n;i++){
             plans[i].removeClass("on");
             }
             },2000); */
            $("#infos_details").one("click", function (event) {
                Mask.unmaskElement(".infos_details>li");
                for (var i = 0, n = plans.length; i < n; i++) {
                    plans[i].removeClass("on");
                }
            });
        }
    } else {
        showAlert("请输入正确的格式：不包括9C，至少4位数。", "warn");
    }
}

function searchDayFlightId(Mask, dayFlightId) {//按航班号查询
    if (dayFlightId == null || dayFlightId == '' || typeof(dayFlightId) == 'undefined') {
        showAlert("航班未找到", "warn");
        return;
    }
    var $box = $(".c_box"),//水平滚动
        topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
        footerH = $('.footer').is(":visible") ? $('.footer').height() : 0,
        halfH = ($(window).height() - topbarsH - footerH) / 2;
    w = $(window).width() / 2;

    var $plan = $(".plan[data-dayflightid=" + dayFlightId + "]");
    if ($plan.length < 1) {
        showAlert("航班未找到", "warn");
        return;
    }
    var newZ = parseInt($(".bui-ext-mask").css("z-index")) + 1;
    Mask.maskElement(".infos_details>li");
    $plan.addClass("on");//加样式
    var $li = $plan.closest("li"),
        acType = $li.attr("data-acType");
    if (!$li.is(":visible")) {//如果收缩,先展开
        if ($("#shrink i").first().hasClass("arrow1-right")) {//仅需第一次展开
            $("#shrink").click();
        }
        $(".type[data-acType=" + acType + "]").click();
    }
    var rect = $plan[0].getBoundingClientRect();
    var sLeft = Math.abs(parseInt($(".c_box .mCSB_container").css("left"))),
        sTop = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));
    var top = sTop - (halfH - rect.top),
        left = sLeft - (w - rect.left);
    top = top < 0 ? 0 : top;
    left = left < 0 ? 0 : left;
    $box.mCustomScrollbar("scrollTo", [top, left]);
    //var dFlight=BUI.JSON.parse($plan.attr("data-flight"));
    $("#infos_details").one("click", function (event) {
        Mask.unmaskElement(".infos_details>li");
        $plan.removeClass("on");
    });
}

function searchNum(Mask, dayFlightId) {
    if (dayFlightId) {//dayflightId
        searchDayFlightId(Mask, dayFlightId);
        return;
    }
    var text = $.trim($("#acno_text").val());
    if ((text.indexOf("/")) > -1) {// 按照
        searchByDate(text, Mask);
    } else if (text.substring(0, 1).toLowerCase() === "b") {//搜索机号
        searchByAcno(text, Mask);
    } else {//搜索航班号
        searchByFlight(text, Mask);
    }
}

function dragPlan(ele, event) {
    dragPlanCallback(ele, event)
}
function moveFlight(source, newAcno) {
    var sourceInfo = BUI.JSON.parse(JSON.stringify(source));
    toAdjustAcno(sourceInfo.acno, sourceInfo.dayFlightId, newAcno, null, sourceInfo.fltDate);//原航班信息，交换的航班信息
}
function changeFlight(source, target) {
    var sourceInfo = BUI.JSON.parse(JSON.stringify(source));
    var targetInfo = BUI.JSON.parse(JSON.stringify(target));
    toAdjustAcno(sourceInfo.acno, sourceInfo.dayFlightId, targetInfo.acno, targetInfo.dayFlightId, sourceInfo.fltDate);//原航班信息，交换的航班信息
}
function toAdjustAcno(souceAcno, sourceId, targetAcno, targetId, fltDate) {
    $(".loading").show();
    var options = {
        adjustPlanId: '',
        planType: 0,
        fltDate: fltDate,
        sourceAcno: souceAcno,
        sourceId: sourceId,
        targetAcno: targetAcno,
        targetId: targetId
    };
    $.ajax({
        url: "acnoAdjust/canAdjust",
        method: "post",
        data: options,
        dataType: "json",
        success: function (data) {
            if (data != null && data.exceptionMsg != null) {
                $(".loading").hide();
                showAlert(data.exceptionMsg, "error");
            } else {
                $.ajax({
                    url: "acnoAdjust/dragAcno",
                    method: "post",
                    data: options,
                    dataType: "html",
                    async: true,
                    success: function (data) {
                        $(".loading").hide();
                        $('#right_dialog').html(data);
                    },
                    error: function () {
                        $(".loading").hide();
                        showAlert("拖拽机号失败！", "error");
                    }
                });
            }
        }
    });
}
function dropCallBack(flag) {//需要 addAutoFresh();flag:0 取消按钮  1：确定按钮
    if (flag === 1) {//确定
        console.log("确定")
    } else {
        console.log("取消")
    }
    addAutoFresh();
}
function getDropTarget($li, x, y) {
    var target = null;

    $li.children(".plan").each(function (index, ele) {
        var l = ele.getBoundingClientRect().left,
            r = ele.getBoundingClientRect().right,
            t = ele.getBoundingClientRect().top,
            b = ele.getBoundingClientRect().bottom;

        if ((x >= l && x <= r) && (y >= t && y <= b)) {//鼠标在此航班之间,
            target = ele;
            //return false;//不跳出循环，选择最后一个符合条件的元素
        }
    });

    if (target && $(target).next().hasClass("actual")) {//如果找到，但有实际航班
        return "invalid";
    }
    return target;
}

function query(hasMask) {
    var arrStr = "";
    var acNos = "";
    var oriAirports = "";
    var arrAirports = "";
    var airportCheck = "";
    var dayLineDate = $("#fltDate").val();
    var companyCode = "";

    var callback = arguments[0], value = arguments[1], Mask = arguments[2];//回调函数,搜索航班号或定位时间轴

    globalObj.newSifts = $('#newSifts').text();
    //筛选条件解析
    if (!isValid(globalObj.newSifts)) {
        arrStr = globalObj.newSifts.split("@");//机号+航班日期+起飞机场+降落机场+机场复选框是否勾选标识+公司代码
        //机号解析
        acNos = resolveAcnos(arrStr[0]);
        oriAirports = arrStr[1];
        arrAirports = arrStr[2];
        airportCheck = arrStr[3];
        companyCode = arrStr[4];
        if ($('#newSifts').text() == $('#oldSifts').text()) {
            globalObj.oldSifts = acNos + "@" + oriAirports + "@" + arrAirports + "@" + companyCode;
        }
        globalObj.newSifts = acNos + "@" + oriAirports + "@" + arrAirports + "@" + companyCode;
    }
    if (globalObj.oldSifts == globalObj.newSifts) {
        $(".icon-fm014").next().removeClass("isShift");
    } else {
        $(".icon-fm014").next().addClass("isShift");
    }
    hasMask !== false && $(".loading").show();
    /* 	if(hasMask!==false){
     hasMask!==false && $(".loading").show();
     } */

    globalObj.start_time = get_date($("#fltDate").val(), -1);
    var data = {
        fltDate: dayLineDate,
        acNos: acNos,
        companyCode: companyCode,
        oriAirports: oriAirports,
        arrAirports: arrAirports,
        airportCheck: airportCheck,

        showPre: $('#showPre').is(":checked") ? "1" : "0",
        showNext: $('#showNext').is(":checked") ? "1" : "0",
        showCatII: $('#showCatII').is(":checked") ? "1" : "0",
        showCancle: $('#showCancle').is(":checked") ? "1" : "0"
    };

    var date = new Date();
    var timeStamp = date.getTime();
    $.ajax({
        url: "monitor/search?timeStamp=" + timeStamp,
        method: "post",
        data: data,
        dataType: "json",
        async: true,
        cache: false,
        success: function (data) {
            insertReadsSysmonitor("monitor_search_" + 5 + "分钟", "1");
            $(".loading").hide();
            draw(data);
            setTimeout(function () {
                callback && $.isFunction(callback) && callback(value, Mask);
            }, 14);
        },
        error: function () {
            insertReadsSysmonitor("monitor_search_" + 5 + "分钟", "-1");
            $(".loading").hide();
            showAlert("查询航班失败！", "error");
        }

    });
}

//机号解析
function resolveAcnos(arrStr) {
    var acnos = "";
    arrStr = BUI.JSON.parse(arrStr);

    if (!isValid(arrStr) && arrStr.length > 0) {
        for (var i = 0; i < arrStr.length; i++) {
            var acnoList = arrStr[i].airList;
            if (!isValid(acnoList) && acnoList.length > 0) {
                for (var j = 0; j < acnoList.length; j++) {
                    if (acnoList[j].selectFlag == 1) {
                        acnos += acnoList[j].acno.substr(0, 5) + ",";
                    }
                }
            }
        }
    } else {
        return "";
    }
    return acnos = acnos == "" ? "" : acnos.substring(0, acnos.length - 1);
}

function getSift() {//获取筛选器的值
    globalObj.oldSifts = $('#oldSifts').text() + "@" + "@" + "@" + "1" + "@" + "9C" + "@";//筛选值，格式为机号+起飞机场+降落机场+机场复选框是否勾选标识+公司代码+关联，用@隔开
    $('#oldSifts').text(globalObj.oldSifts);
    $('#newSifts').text(globalObj.oldSifts);
}


function changeScale(el) {
    // globalObj.scroll_prev=0;
    var $scroll = $('.c_box'), scrollData = $scroll.data("scroll");
    globalObj.oldScale = globalObj.scale;
    var left=$('.zero-time-line').children(0)[0].getBoundingClientRect().left
	//var left=$('.infos_details .plan').children(0)[0].getBoundingClientRect().left
   // var left=$('.timePoint>li').children(37)[0].getBoundingClientRect().left
    console.log('left----:',left)
    scrollData.prevLeft=left
    //$scroll.data("scroll", scrollData);
    $scroll.data("scroll", scrollData);
    var prevScaleCls=$(".timePoint")[0].className.match(/scale\w+/)[0]
    console.log()
    if ($(el).hasClass("scale1x")) {//1X
        globalObj.scale = 1;
        $(".timePoint").removeClass(prevScaleCls).addClass("scale1x");
        $(".infos_details").removeClass().addClass("infos_details fl scale1x");
        $(".zero-time-line").removeClass().addClass("zero-time-line scale1x");
    } else if ($(el).hasClass("scale2x")) {//2X
        globalObj.scale = 2;
        $(".timePoint").removeClass(prevScaleCls).addClass("scale2x");
        $(".infos_details").removeClass().addClass("infos_details fl scale2x");
        $(".zero-time-line").removeClass().addClass("zero-time-line scale2x");
    } else if ($(el).hasClass("scale3x")){//3X
        globalObj.scale = 3;
        $(".timePoint").removeClass(prevScaleCls).addClass("scale3x");
        $(".infos_details").removeClass().addClass("infos_details fl scale3x");
        $(".zero-time-line").removeClass().addClass("zero-time-line scale3x");
    }else{
    	globalObj.scale = 4;
        $(".timePoint").removeClass(prevScaleCls).addClass("scale4x");
        $(".infos_details").removeClass().addClass("infos_details fl scale4x");
        $(".zero-time-line").removeClass().addClass("zero-time-line scale4x");
    }

    //scrollData.left=scrollData.left*(globalObj.scale/globalObj.oldScale);
    if (globalObj.scale > globalObj.oldScale) {//放大
/*    	if(globalObj.oldScale===1 && globalObj.scale===4){//1->4
    		scrollData.left = scrollData.left * 4 //+ 810;
    	}else if(globalObj.oldScale===1 && globalObj.scale===3){//1->3
    		scrollData.left = scrollData.left * 3 //+ 810;
    	}else if(globalObj.oldScale===1 && globalObj.scale===2){//1->2
    		scrollData.left = scrollData.left * 2 //+ 810;
    	}else if(globalObj.oldScale===2 && globalObj.scale===4){//2->4
    		scrollData.left = scrollData.left * 2 //+ 810;
    	}else if(globalObj.oldScale===2 && globalObj.scale===3){//2->3
    		scrollData.left = scrollData.left * 1.5 //+ 810;
    	}else if(globalObj.oldScale===3 && globalObj.scale===4){//3->4
    		scrollData.left = scrollData.left *1.33  //+ 810;
    	}*/
   /*     if (globalObj.scale / globalObj.oldScale == 3) {//1->3
            scrollData.left = scrollData.left * 3 + 810;
        } else if (globalObj.scale / globalObj.oldScale == 2) {//1->2
            scrollData.left = scrollData.left * 2 + 410;
        } else {//2->3
            scrollData.left = (scrollData.left - 410) * 1.5 + 810;
        }*/
    } else {
    	/*if(globalObj.oldScale===4 && globalObj.scale===1){//4->1
    		scrollData.left = scrollData.left / 4 //+ 810;
    	}else if(globalObj.oldScale===3 && globalObj.scale===1){//3->1
    		scrollData.left = scrollData.left / 3 //+ 810;
    	}else if(globalObj.oldScale===2 && globalObj.scale===1){//2->1
    		scrollData.left = scrollData.left / 2 //+ 810;
    	}else if(globalObj.oldScale===4 && globalObj.scale===2){//4->2
    		scrollData.left = scrollData.left / 2 //+ 810;
    	}else if(globalObj.oldScale===3 && globalObj.scale===2){//3->2
    		scrollData.left = scrollData.left / 1.5 //+ 810;
    	}else if(globalObj.oldScale===4 && globalObj.scale===3){//4->3
    		scrollData.left = scrollData.left / 1.33  //+ 810;
    	}*/
/*        if (globalObj.oldScale / globalObj.scale == 3) {//3->1
            scrollData.left = (scrollData.left - 810) / 3;
        } else if (globalObj.oldScale / globalObj.scale == 2) {//2->1
            scrollData.left = (scrollData.left - 410) / 2;
        } else {//3->2
            scrollData.left = (scrollData.left - 810) / 1.5 + 410;
        }*/
    }
 /*   var left=$('.zero-time-line').children(0)[0].getBoundingClientRect().left
    console.log('left----:',left)
    scrollData.prevLeft=left
    //$scroll.data("scroll", scrollData);
    $scroll.data("scroll", scrollData);*/
    draw(globalObj.ganttData, 1);
}

function enterCircle(event) {
    var $target = $(event.target),
        circle,
        data = BUI.JSON.parse($(this).closest(".plan").attr('data-flight'));
    url_tip = "limit/getLimitInfo";
    if ($target.hasClass("red")) {
        circle = "1";
    } else {
        circle = "2";
    }
    data_tip = {
        dayFlightId: data.dayFlightId,
        acno: data.acno,
        oriAirport: data.oriAirport,
        arrAirport: data.arrAirport,
        fltDate: data.fltDate,
        flightNo: data.flightNo,
        limitFlag: circle
    }
    $("#infos_details").off("mouseenter", ".plan .circle", enterCircle);//添加点击事件
    //this.style.cursor="wait";
    var that = this;
    $.ajax({
        url: url_tip,
        method: "post",
        data: data_tip,
        dataType: "json",
        /* cache:false, */
        async: true,
        success: function (data) {
            that.style.cursor = "point";
            circle = circle === "1" ? "error" : "warn";
            showTips("acno_hover", data.limit, event);
            //showAlert(data.limit,circle);
            $("#infos_details").on("mouseenter", ".plan .circle", enterCircle);//添加点击事件
        },
        error: function () {
            $("#infos_details").on("mouseenter", ".plan .circle", enterCircle);//添加点击事件
            that.style.cursor = "point";
            showAlert("获取限制信息失败！", "error");
        }
    });

}

function clickGantt(event) {
    var $box = $(".c_box"),
        $info = $("#tips_info"),
        tempId;//提示模板的id
    $target = $(event.target),
        that = this;
    var data = BUI.JSON.parse($(this).attr('data-flight')),
        url_tip,
        data_tip = {dayFlightId: data.dayFlightId};
    var start = new Date();

    var date = new Date();
    var timeStamp = date.getTime();
    $("#infos_details").off("click", ".plan,.actual", clickGantt);//取消点击事件
    if ($(this).hasClass("plan")) {//点击计划
        url_tip = "tips/getPlanTips";
        tempId = "plan_tips";

    } else {//点击实际
        url_tip = "tips/getActualTips";
        tempId = "actual_tips";
    }
    this.style.cursor = "wait";
    $.ajax({
        url: url_tip + "?timeStamp" + timeStamp,
        method: "post",
        data: data_tip,
        dataType: "json",
        /* cache:false, */
        async: true,
        success: function (data) {
            that.style.cursor = "auto";
            showTips(tempId, data, event);
            $("#infos_details").on("click", ".plan,.actual", clickGantt);//添加点击事件
        },
        error: function () {
            $("#infos_details").on("click", ".plan,.actual", clickGantt);//添加点击事件
            that.style.cursor = "auto";
            showAlert("点击航班条获取航班信息失败！", "error");
        }
    });
}

function getNewFlightInfo(param) {
    var flight = null;
    $.ajax({
        url: "tab/getNewFlightInfo",
        method: "post",
        data: param,
        dataType: "json",
        async: false,
        success: function (data) {
            flight = data;
        }
    });
    return flight;
}

//显示的DIV
function setMsgH($details) {
    var topH = $details.children('h3')[0].getBoundingClientRect().bottom,
        footerH = $(".footer").is(":visible") ? $(".footer").height() : 0,
        h = $(window).height() - topH - $details.children("a").height() - footerH - 25;

    var $childMsgBody = $details.find(".msg_body");
    var $parentMsgBody = $details.children(".msgBody");

    $childMsgBody.css("height", "auto");
    if ($childMsgBody.height() > h) {
        $parentMsgBody.css("height", h);
    } else {
        $parentMsgBody.css("height", $childMsgBody.height());
    }
    if ($parentMsgBody.height() < $childMsgBody.height()) {
        $parentMsgBody.mCustomScrollbar({
            axis: "y",
            theme: "3d",
            scrollInertia: 0,
            autoHideScrollbar: true
        });
    } else {
        //$parentMsgBody.children(".mCustomScrollBox").css("display","none");
    }
}

//点击事件
var actionList = {
    "query": query,//查询
    "preDay":function(){//查询前一天的航班
    	var dayFlightDate=get_date($("#fltDate").val(),-1);
    	$('#fltDate').val(dayFlightDate);
    	query();
    },
    "nextDay":function(){//查询后一天的航班
    	var dayFlightDate=get_date($("#fltDate").val(),1);
    	$('#fltDate').val(dayFlightDate);
    	query();
    },
    "moveToday":function(){//定位到今天
    	var today=convertTime(new Date(),1);
    	if(today===$("#fltDate").val()){//今天，直接定位时间轴
    		setLineCenter();
    	}else{//查询后在再定位
    	 	$('#fltDate').val(convertTime(new Date(),1));
    		query(setLineCenter);
    	}
    },
    "showEmptyPlane":function(){//无航班机号
    	var $emptyPlane=$("#showEmptyPlane"),
    		$liEmpty=$("[data-empty=1]");
		if($("#shrink i").first().hasClass("arrow1-right")){
				$("#shrink").click();
			}
    	if($emptyPlane.is(":checked")){
    		$liEmpty.removeClass("hide_important").show();
			//5.emptyPlane="1";
    	}else{
    		$liEmpty.addClass("hide_important").hide();
    		//globalObj.emptyPlane="0";
    	}
    	showLine();
    },
    "profitLevel":function(){
     	if($('#profitLevel').attr('checked')=="checked"){
    		$('.profitLevel').show();
    	}else{
    		$('.profitLevel').hide();
    	}
    },
    //筛选
     "sift":function(){
    	$.ajax({
            url:'aircraft',
            method:"post",
            dataType : "html",
          
            success:function(data){
            	$('#right_dialog').html(data);
            },
            error:function(){
	            showAlert("筛选失败！","error");
            }
        });
    },
    "runInfo":function(){//运行信息
    	$.ajax({
            url:'runInfo',
            method:"post",
            dataType : "html",
            success:function(data){
            	$('#right_dialog').html(data);
            },
            error:function(){
	            showAlert("获取运行信息失败！","error");
            }
        });
    },
    "weatherMonitor":function(){
        window.open('weather','toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no')
    },
    "clearLine":function(){//清除连线
   	    clearLine();
    },
    "more_fun":function(){
    	$("li[data-action=more_fun]").find("a").toggleClass("on");
    	$(".footer").toggleClass("hide");
    	setBoxHW();
    },
    "full_screen":function(){
    	//$("li[data-action=data-screen]").find("a").toggleClass("on");
    	var $screen=$("#fullScreen");
    	var flag=$screen.attr("data-screen");
    	if(flag==="no"){//全屏
    		launchFullscreen(document.documentElement);
    		$screen.attr("data-screen","yes");
    	}else{
    		exitFullscreen();
    		$screen.attr("data-screen","no");
    	}
	    setBoxHW();
    },
    "searchNum":function(){
    	searchNum(maskObj);
    },
    "flyLockList":function(){//锁定条
    	var $lockbar=$('.lockbar');
    	if($("[data-action=flyLockList]").is(":checked")){
    		$lockbar.show();
    	}else{
    		$lockbar.hide();
    	}
    },
    "closeAirport":function(){//机场关闭
    	var $close=$("#showCloseAirport"),
    		$airports=$("[data-close]");
    	if($close.is(":checked")){
    		$airports.addClass("close");
    	}else{
    		$airports.removeClass("close");
    	}
    },
    "legTime":function(){//航段时间
    	var $legtime=$(".legtime");
    	if($("#legTime").is(":checked")){
    		$legtime.show();
    	}else{
    		$legtime.hide();
    	}
    },
    "show186":function(){//显示186
     	var $layout=$(".layout");
    	if($("#show186").is(":checked")){
    		$layout.show();
    	}else{
    		$layout.hide();
    	} 
    }
};

$(function(){
    $(document.body).on("click", '[data-action]', function () {
        var actionName = $(this).attr("data-action");
        var action = actionList[actionName];
        if ($.isFunction(action)) action();
    });
    
  	$("#shrink").on("click",function(){
        var $container=$(".fm_container"),
        	$i1=$(this).children("i").eq(0),
        	$i2=$(this).children("i").eq(1);
    	hideLine();
        if($container.hasClass("shrink-close")){//展开
        	$container.removeClass("shrink-close");
    		$('.timePoint').removeClass("havehrink");
        	$("#shrink,#aircraft_nos").animate({width:'90px'},300,function(){
            	$i1.removeClass("arrow1-right").addClass("arrow1-left");
            	$i2.removeClass("arrow2-right").addClass("arrow2-left");
    	        setBoxHW();
   	            showLine();
        	});
        }else{//关闭
        	$("#shrink,#aircraft_nos").animate({width:'50px'},300,function(){
        		$container.addClass("shrink-close");
        		$('.timePoint').addClass("havehrink");
        		 
                $i1.removeClass("arrow1-left").addClass("arrow1-right");
            	$i2.removeClass("arrow2-left").addClass("arrow2-right");
        	    setBoxHW();
    	        showLine();
        	});
        }
    });
    $(".hour-split").on("click",".hour-scale",function(event){//切换坐标点击事件
    	var $span=$(this).siblings(".probar");
    	var scale=this.className.split(" ")[1].replace("-","")//className:hour-scale     scale:scale2x
    	if($span[0].className.indexOf(scale)>=0){
    		return
    	}
    	$span[0].className="probar "+scale;
    	changeScale($span[0]);
/*    	if($(this).hasClass("hour-1x")){//1X
    		if($span.hasClass("probar scale1x")){
    			return;
    		}else{
    			$span[0].className="probar scale1x";
    		}
    	}else if($(this).hasClass("hour-2x")){//2X
    	   if($span.hasClass("probar scale2x")){
    			return;
    		}else{
    			$span[0].className="probar scale2x";
    		}
    	}else{//3X
    		if($span.hasClass("probar scale3x")){
    			return;
    		}else{
    			$span[0].className="probar scale3x";
    		}
    	}
    	changeScale($span[0]);*/
    });
    $(".probar").on("mousedown", function (event) {//切换精度
        timeDrag(this,event,changeScale);
    });
    
	$("#acno_text").keypress(function(event){
		if(event.keyCode===13){//回车
			actionList["searchNum"](maskObj);
			$(this).blur();
		}
	});
    //机号tips事件
    $("#aircraft_nos").on("mouseenter mouseleave", "li", function (event) {
    	if(event.type==="mouseenter"){
		 	var $li=$(this);
        	if(!$li.hasClass("acno_hover")){
        		return;
        	}
        	var msg=$li.attr("data-msg");
         	showTips("acno_hover",msg,event);
    	}else{
    		hideTips();
    	}
   
    });
/*     $("#aircraft_nos").on("mouseleave","li",function(){
    	hideTips();
    }); */
/* 	         $("#aircraft_nos>span").on("click",function(){
     		alert($(this).next().length);
     		var $next=$(this).next();
     		if($next.is(":visible")){
     			$next.slideUp();
     		}else{
     			$next.slideDown();
     		}
     }); */
    $("#aircraft_nos").on("click","li,.type",function(event){
    	var  $info=$("#tips_info"),
    		 data_acno=$(this).find("span").html(),
    		 acType=$(this).text();
    		 that=this;
		 if($(this).hasClass("type")){
		 	  var $next=$(this).parent().next();
		 	  
     		  if($next.is(":visible")){//收缩 机型
     		  		hideLine();//隐藏连线
     		      	$next.children("li").slideUp(300,function(){//收左侧机型
         		  		//$next.slideUp(300); 
         		  		$(that).find("i").removeClass().addClass("arrows arrow1-top");
     		  		}); 
     		  		var $liTypes=$("li[data-acType="+ acType+"]");
	  		   	 		$liTypes.each(function(index,ele){
     					if(index!==$liTypes.length-1){
     						$(this).slideUp(300);
     					}else{
     					 	$(this).slideUp(300); 
 						 	setTimeout(function(){
     					 	 	showLine();
     					 	},400);
     					}
     				}); 
     		 }else{//展开机型
     		 	hideLine();
     			$next.show().children("li").slideDown(300);
     			var $liTypes=$("li[data-acType="+ acType+"]");
 				$liTypes.each(function(index,ele){
 					if(index!==$liTypes.length-1){
 						$(this).slideDown(300);
 					}else{
 						$(this).slideDown(300,function(){
 							showLine();
 							/*  	setTimeout(function(){
         					 		showLine();
         					 	},300); */
 						/* 	if(globalObj.flightIds && globalObj.type){
	         					linkGantt(globalObj.flightIds, globalObj.type);
	         				} */
 						}); 
 					}
 				});
			 		$(this).find("i").removeClass().addClass("arrows arrow1-bottom");
     		 }
		 }else{//
	    	this.style.cursor="wait";
  	     	$.ajax({
	            url:"tips/getAircraftTips",
	            method:"post",
	            data:{acno:data_acno},
	            dataType : "json",
	            /* cache:false, */
	            async:true,
	            success:function(data){
	            	that.style.cursor="auto";
            		showTips("acno_tips",data,event);
	            },
	            error:function(){
	            	that.style.cursor="auto";
		            showAlert("获取飞机信息失败！","error");
	            }
	        });
		 }

    });
    
    $("#infos_details").on("mouseenter mouseleave", ".legtime", function (event) {//航段时间
    	var time=$.trim($(this).attr("data-legtime"));
    	if(!time){
    		return;
   		}
   		time=time.substring(11,13)+time.substring(14,16);
   		var msg="平均到港时间:"+time;
    	if(event.type==="mouseenter"){
    		showTips("legtime",msg,event);
    	}else{
    		hideTips();
    	}
    });
    
    $("#infos_details").on("mouseenter mouseleave",".importType", function (event) {//保障航班
    	
    	var importType=$.trim($(this).attr("data-importtype"));
    	if(!importType){
    		return;
   		}
    	
    	if(event.type==="mouseenter"){
    		
    		showTips("importType",importType,event);
    		
    	}else{
    		hideTips();
    	}
     });
   $("#infos_details").on("mouseenter",".plan,.lockbar", function (event) {
    	var left=this.getBoundingClientRect().left,
    		right=this.getBoundingClientRect().right;
   		var $plans= $(this).prevAll(".plan"),
   			$lockbar= $(this).siblings(".lockbar");
   			
   		var arr=[].slice.call($plans).concat([].slice.call($lockbar));//合并数组
   		for(var i=0,len=arr.length;i<len;i++){
				var rect=arr[i].getBoundingClientRect();
   			if(rect.left<=left &&rect.right>left){
   				$(arr[i]).addClass("movedown");
   			}
   		}
    });
    $("#infos_details").on("mouseleave", ".plan,.actual,.lockbar", function (event) {
    	$(this).removeClass("movedown");
        var $info=$("#tips_info");
        if($info.is(":visible") && !$(event.relatedTarget).hasClass("tips_info")){
           hideTips();
        }
    });
    $("#tips_info").on("mouseleave", function (event) {
       	hideTips();
    });
    $("#infos_details").on("click",".lockbar",function(event){//甘特条点击
    	var data=BUI.JSON.parse($(this).attr("data-flight"));
    	showTips("ppc_tips",data,event);
    });
    $("#infos_details").on("mouseleave",".lockbar",function(event){
      var $info=$("#tips_info");
        if($info.is(":visible")){
           hideTips();
        }
    });
    
    $("#infos_details").on("dblclick", ".plan", function (event) {
			var dataFlight=BUI.JSON.parse($(this).attr('data-flight'));
			var date = new Date();
			var timeStamp = date.getTime();
			var data={
				"dayFlightId":dataFlight.dayFlightId,
			    "planType":"0",
				"planId":''
			};
 		if($('.right_menu').find("li[data-url=tab]").length > 0){
 			var planSts = $.trim($("#planSts").val());
        	if(planSts != null && planSts != '' && planSts == 1 && (url == "tab" || url == "acnoAdjust")){
        		showAlert("确认中方案在预览页面中无法修改，操作失败！","error");
        	}else{
		     	$.ajax({
		            url:"tab?timeStamp="+timeStamp,
		            method:"post",
		            data : data,
		            dataType : "html",
		            async:true,
		            success:function(data){
		            	$('#right_dialog').html(data);
		            },
		            error:function(){
			            showAlert("右键菜单失败！","error");
		            }
		        });
        	}
			}
    });
    
    $("#infos_details").on("dragover dragleave drop","li[data-acno]",function(event){//接收事件
   	    if($(this).closest("li")[0]===globalObj.dragEl || globalObj.dragEl==null){//没有元素拖动，返回。因为文字也可以随意拖动,是拖动元素本身的li，也返回
        	 return;
        }
        if($('.right_menu').find("li[data-url=acnoAdjust]").length > 0){
          	if(event.type==="dragover"){
                event.preventDefault();
        		$(this).addClass("candrop");
		     		if(!$(this).hasClass("cantdrop")){
            		var top=this.getBoundingClientRect().top,bottom=this.getBoundingClientRect().bottom;
            		var bottomH=$(window).height(),
            			topH=$(".timePoint")[0].getBoundingClientRect().bottom,
            			$box=$(".c_box");
       			 	var prevTop = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));
            		if(bottom>=bottomH-70){
	 						$box.mCustomScrollbar("scrollTo",[prevTop+=50]);
            		}else if(top<=topH+40){
            			var nowTop=(prevTop-70)<0 ?0 :prevTop-70;
            			$box.mCustomScrollbar("scrollTo",[nowTop]);
            		}
            		//console.log(top,bottom,$(window).height(),topH)
        		}
        	}else if(event.type==="dragleave"){
        		$(this).removeClass("candrop");
        	}else{//放下
        		if(!$(this).hasClass("cantdrop")){//可以放置,不是移动元素所在行
        		  	var objStr=event.originalEvent.dataTransfer.getData("Text"),
           	 	 		acno=$(this).attr("data-acno"),//放下时，所在行的机号
            	  		data = BUI.JSON.parse(objStr),//被拖动元素的数据
        			 	target=getDropTarget($(this),event.originalEvent.clientX,event.originalEvent.clientY);
        			
        			if(target!=="invalid"){
        				if(target){//替换航班
            				var targetObj=BUI.JSON.parse($(target).attr("data-flight"));
           					changeFlight(data,targetObj);
            			}else{//移动航班
            				moveFlight(data,acno);
            			}
        			}
        		}
       			event.preventDefault();
        		$(this).removeClass("candrop");
        	}              
        }
    	
    });
    $(document.body).on("dragstart",".bui-calendar a",function(event){//组织日历拖动
    	return false;
    });
    $("#infos_details").on("dragstart dragend", ".plan", function (event) {//拖动
    	if($('.right_menu').find("li[data-url=acnoAdjust]").length > 0){
    	
        	console.log($(this).next().hasClass("actual"),monitorFlag,'dragstart')
			if($(this).next().hasClass("actual")){//有实际航班,不能拖动
        		return;
        	}
        	if(monitorFlag=="1"){
        		return;
        	}
    
    		var $parent=$(this).closest("li");
    		if(event.type=="dragstart"){//
    			clearAutoFresh();//清除自动刷新
    			clearLine();
    			$parent.addClass("cantdrop");//自己不能放
    			//$(this).hide();
    			event.originalEvent.dataTransfer.setData("Text",$(this).attr("data-flight"));
    			var dataFlightInfo=BUI.JSON.parse($(this).attr("data-flight"));
       			if(dataFlightInfo.dayFlightId){
       				var flightParam={
     		 				"dayFlightId":dataFlightInfo.dayFlightId,
     		 			    "planType":"0",
     		 				"planId":''
     		 			};
       			}
             	var dayFlightInfo = getNewFlightInfo(flightParam);
    			if(dayFlightInfo != null && ((dayFlightInfo.fStd!= null && dayFlightInfo.fStd!='') || dayFlightInfo.dayAdjust == 7)){
    				$parent.removeClass("cantdrop");
    				//globalObj.isDrag=false;
    				globalObj.dragEl=null;
    				showAlert("航班已起飞或已降落或已取消，无法进行机号拖拽,操作失败！","error");
    				return;
    			}else{
			 		//globalObj.isDrag=true;
			 		globalObj.dragEl=$parent[0];
			 		$("#drawing").css("zIndex",-1);//fix ie10无法拖动
    			}
    		}else{
				$parent.removeClass("cantdrop");
				//globalObj.isDrag=false;
				globalObj.dragEl=null;
				$("#drawing").css("zIndex",0);
    		}           	
    	}
     });
     
    $("#infos_details").on("mouseenter", ".plan .circle",enterCircle);//添加点击事件
    $("#infos_details").on("click", ".plan,.actual",clickGantt);
     
      $("#infos_details").on("contextmenu", ".plan,.actual", function (event) {
  			$("#actual_menu li").show();
       		var $this=$(this),
      		 	$planMenu=$("#plan_menu"),
      		 	$actualMenu=$("#actual_menu"),
      			data=$this.attr("data-flight");
      			
      		$planMenu.hide();
            $actualMenu.hide();
            $planMenu.find("li[data-url=reason]").hide();
          	event.preventDefault();
      		var dataFlightInfo=BUI.JSON.parse(data);

      		if($this.hasClass("plan")){//计划航班右键菜单
      			if(dataFlightInfo.dayAdjust == 7 || (dataFlightInfo.fStd != null && dataFlightInfo.fStd != '') || (dataFlightInfo.fSta != null && dataFlightInfo.fSta != '')){
          			$planMenu.find("li[data-url=acnoAdjust]").hide();
          		}else{
          			$planMenu.find("li[data-url=acnoAdjust]").show();
          		}
          		
      			if(dataFlightInfo.dayAdjust == 5 || dataFlightInfo.dayAdjust == 10){
      				if(dataFlightInfo.fStd != null && dataFlightInfo.fStd != ''){
      					if((dataFlightInfo.acarsOpen == null || dataFlightInfo.acarsOpen == '')|| posName=='值班经理'){
		          			$planMenu.find("li").removeClass("noborder");
		          			$planMenu.find("li:last").addClass("noborder");
		          			$planMenu.find("li[data-url=reason]").show();
      					}
	          		}
      			}
					//右键修改航班的显示
       			if(dataFlightInfo.fSta=='' && dataFlightInfo.fStd=='' && dataFlightInfo.lSta=='' && dataFlightInfo.lStd=='' && dataFlightInfo.acarsClosed=='' && dataFlightInfo.acarsOpen=='' && dataFlightInfo.isNew=='1')
       			{
	          		$planMenu.find("li[data-url=UpdateFlightCtrl]").show();	
       			}else
       			{
       				$planMenu.find("li[data-url=UpdateFlightCtrl]").hide();
       			}
      			
          		$planMenu.data("data-flight",data);
          		showTips("plan_menu",null,event);
      		}else{
      			if($(this).attr("data-fltStatus")!="1" && !(dataFlightInfo.lStd && !dataFlightInfo.fStd )){
      				return;
      			}
      			$actualMenu.data("data-flight",data);
      			showTips("actual_menu",null,event);
      			var $first=$("#actual_menu li").first();
      			var $last=$("#actual_menu li").last();
      			if(dataFlightInfo.lStd && !dataFlightInfo.fStd){//显示滑回处理
      				$first.hide();
      			}else{//隐藏滑回处理
      				$last.hide();
      			} 
      		}
      });
    
      
      $(document).on("click",function(){
          $("#plan_menu").hide();
          $("#actual_menu").hide();
      });
      $(".infos_details").click(function(ev){//点击空白区域，取消连线
      	var $el=null;
      	if($(ev.target).hasClass("plan")){
      		 $el=$(ev.target).children(".ft_info");
  		}else if($(ev.target).closest("div.ft_info").length>0){
  			$el=$(ev.target).closest("div.ft_info");
  		}else if($(ev.target).hasClass("circle")){
  			$el=$(ev.target).parent().children("div.ft_info");
  		}
  		if($el && ( $el.hasClass("flyer")||$el.hasClass("stew") )){

  		}else{
  			clearLine();
  		}
      });
 /*     $(document).on('contextmenu','.canvas-drawing',function(){//右键canvas，清除连线
      		clearLine();
      });*/
      
      $(".right_menu").on("click","li",function(){
      	dataFlight=BUI.JSON.parse($(this).closest(".right_menu").data("data-flight"));
      	var url=$(this).attr("data-url"),
	 			dataFlight=BUI.JSON.parse($(this).closest(".right_menu").data("data-flight")),
	 			data={
	 				"dayFlightId":dataFlight.dayFlightId,
	 			    "planType":"0",
	 				"planId":'',
	 				"dayAdjust":dataFlight.dayAdjust,
	 			};
			if(!url){
				return;
			}
			if(url == "acnoAdjust"){
  			$.ajax({
		            url:"acnoAdjust/canAdjust",
		            method:"post",
		            data:{
		            	fltDate:dataFlight.fltDate
		            },
		            dataType : "json",
		            success:function(dataMsg){
		            	if(dataMsg != null && dataMsg.exceptionMsg != null){
		            		showAlert(dataMsg.exceptionMsg,"error");
		            	}else{
					     	$.ajax({
					            url:url,
					            method:"post",
					            data:data,
					            dataType : "html",
					            async:true,
					            success:function(data){
					            	$('#right_dialog').html(data);
					            },
					            error:function(){
						            showAlert("右键菜单失败！","error");
					            }
					        });
		            	}
		            }
  			});
			}else{
				$.ajax({
		            url:url,
		            method:"post",
		            data:data,
		            dataType : "html",
		            async:true,
		            success:function(data){
		            	$('#right_dialog').html(data);
		            },
		            error:function(){
			            showAlert("右键菜单失败！","error");
		            }
		        });
			}
      });
});
(function ($) {
    $(window).on("load", function () {
        var $scroll = $('.c_box'),//水平滚动
            topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
            $timePoint = $('.timePoint'),//顶部时刻表
            $airCtNo = $('#aircraft_nos'),//左侧机号
            $v_line = $('.v_line'),
            scroll_val;

        $(".c_box").mCustomScrollbar({
            axis: "yx",
            theme: "3d-thick",
            scrollInertia: 0,
            autoHideScrollbar: false,
            mouseWheel: {scrollAmount: 32},
            advanced: {
                updateOnBrowserResize: true,
                updateOnContenteResize: true
            },
            // autoDraggerLength:false,
            callbacks: {
                whileScrolling: function (ev) {
                    var left = Math.abs(parseInt($(".c_box .mCSB_container").css("left")));
                    var top = Math.abs(parseInt($(".c_box .mCSB_container").css("top")));

                    $timePoint.css({'margin-left': -left});
                    $airCtNo.css({'top': (topbarsH - top)});

                    var data = $scroll.data("scroll");
                    if (!data) {
                        data = {top: 0, left: 0};
                    }
                    $scroll.data("scroll", {top: top, left: left});
                    scroll_val = left - globalObj.scroll_prev;

                    globalObj.scroll_prev = left;

                    //$v_line.css({left: $v_line.offset().left - scroll_val});
                }
            }
        });
    });
})(jQuery);