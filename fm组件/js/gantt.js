var globalObj={
    start_time:"2017-09-05",//查询日期前一天，格式yyyy-MM-dd
    scale:2
}
/**
 * 传入两个时间，获得时间块的宽度
 * @param start 开始时间 格式 yyyy-MM-dd 24hh:mm 如果是2016-07-01,则当成2016-07-01 00:00
 * @param end   结束时间 格式 yyyy-MM-dd 24hh:mm
 */
/*function get_width(start, end) {
    if (!start || !end) return;//如果没有时间，返回undefined,则jsp中不渲染此甘特图
    //if(start>=end) return 0;//如果结束时间大于开始时间，返回0
    var max_end = get_date(globalObj.start_time, 3);
    max_end += " 04:00";
    var from = new Date(Date.parse(start.replace(/-/g, "/"))).getTime(),
        to = new Date(Date.parse(end.replace(/-/g, "/"))).getTime();

    var max_date = new Date(Date.parse(max_end.replace(/-/g, "/"))).getTime();
    if (to > max_date) {
        to = max_date;
    }
    //return globalObj.scale/2 * (to - from) / (1000 * 60);
/!*    if(globalObj.scale===1){
        return globalObj.scale * 2 *(to - from) / (1000 * 60 * 3);
    }*!/
    //return globalObj.scale * (to - from) / (1000 * 60 * 2);
    if(globalObj.scale<=2){
        return 1 * (to - from) / (1000 * 60);
    }else if(globalObj===3){
        return 1.5 * (to - from) / (1000 * 60);
    }else if(globalObj===4){
        return 2 * (to - from) / (1000 * 60);
    }
    //return (to - from)*3 / (1000 * 60 * 2);
}*/
/**
 * 传入开始时间，获得距离左边开始位置的距离
 * @param time yyyy-MM-dd 24hh:mm
 */
/*function get_left(time) {
    return get_width(globalObj.start_time, time);
}*/
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



function Events(){
    this.map={}
}
Events.prototype={
    constructor:Events,
    listen:function(type,fn){
        if(!this.map[type]){
            this.map[type]=[]
        }
        this.map.push(fn)
    },
    fire:function(){
        var type=[].shift.call(arguments)
        var arr=this.map[type]
        if(!arr || arr.length===0){
            return
        }
        for(var i= -1,fn;fn=arr[++i];){
            fn.apply(null,arguments)
        }
    }
}
function setBoxHW(x=1) {
    x=1.0/x
    console.log(x)
    var $airCtNo = $('#aircraft_nos'),//左侧机号
        footerH = $('.footer').is(":visible") ? $('.footer').height() : 0,
        $box = $('.c_box');
    var topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom;
   // $box.height(($(window).height() - topbarsH - footerH)*x);
    //$box.width(($(window).width()*x - $airCtNo.width()));
    //setRedLineH();

    //$(".c_box #mCSB_1_container").width($(".timePoint").width());
   // $(".c_box .mCSB_container").width($(".timePoint").width());
   // $box.mCustomScrollbar("update");
}
function Gantt(option){
    this.el=option.el
    this.data=option.data
    this.searchDate=option.searchDate
    this.start_time=get_date(this.searchDate, -1)
    this.scale=option.scale || 2

    this.timeEl=null//上面刻度容器元素
    this.acnoEl=null//左边机号容器元素
    this.init()
}
Gantt.prototype= {
    constructor: Gantt,
    init: function () {
        this.draw()
        this.addListener()
        setBoxHW()
    },
    getDataByDayFlightId(id){
        for(var i=-1,item;item=this.data[++i];){
            var airList=item[i].airList;
        }
    },
    addListener:function(){
        this.addScrollListener()
        this.addChangeScaleListener()
        this.addRightClick()
    },
    changeScale:function(el){
        // transform: scale(.8);
        var that=this
        var left=$('.zero-time-line').children(0)[0].getBoundingClientRect().left
        var prevScaleCls=$(".timePoint")[0].className.match(/scale\w+/)[0]
        if ($(el).hasClass("scale1x")) {//1X
            that.scale = 1;
            $(".timePoint").removeClass(prevScaleCls).addClass("scale1x");
            $(".infos_details").removeClass().addClass("infos_details fl scale1x");
            $(".zero-time-line").removeClass().addClass("zero-time-line scale1x");
    /*        $('.gantt-body').css('transform','scale(.8)')
            $('.gantt-body').css({
                width:(100/0.8)+"%",
                height:(100/0.8)+"%",
            })*/
            setBoxHW(0.8)
        } else if ($(el).hasClass("scale2x")) {//2X
            that.scale = 2;
            $('.gantt-body').css({
                width:"100%",
                height:"100%",
            })
            $(".timePoint").removeClass(prevScaleCls).addClass("scale2x");
           $(".infos_details").removeClass().addClass("infos_details fl scale2x");
            $(".zero-time-line").removeClass().addClass("zero-time-line scale2x");
            //$('.gantt-body').css('transform','scale(1)')
            setBoxHW(1)
        } else if ($(el).hasClass("scale3x")){//3X
            that.scale = 3;
            $(".timePoint").removeClass(prevScaleCls).addClass("scale3x");
            $(".infos_details").removeClass().addClass("infos_details fl scale3x");
            $(".zero-time-line").removeClass().addClass("zero-time-line scale3x");
            //$('.gantt-body').css('transform','scaleX(1.2)')
            //setBoxHW(1)
            //this.drawGantt()
        }else{
            that.scale = 4;
            $(".timePoint").removeClass(prevScaleCls).addClass("scale4x");
            $(".infos_details").removeClass().addClass("infos_details fl scale4x");
            $(".zero-time-line").removeClass().addClass("zero-time-line scale4x");
            //$('.gantt-body').css('transform','scaleX(1.4)')
           // setBoxHW(1)
           // this.drawGantt()
        }
        this.drawGantt()
    },
    addChangeScaleListener:function(){
        var that=this
        $(".probar").on("mousedown", function (event) {//切换精度
            timeDrag(this,event,that,changeScale);
        });
        $(".hour-split").on("click",".hour-scale",function(event){//切换坐标点击事件
            var $span=$(this).siblings(".probar");
            var scale=this.className.split(" ")[1].replace("-","")//className:hour-scale     scale:scale2x
            if($span[0].className.indexOf(scale)>=0){
                return
            }
            $span[0].className="probar "+scale;
            that.changeScale($span[0]);
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
    },
    addScrollListener:function(){
        var $scroll = $('.c_box'),//水平滚动
            //topbarsH = $(".timePoint")[0].getBoundingClientRect().bottom,
            topbarsH = $(".timePoint").outerHeight(),
            $timePoint = $('.timePoint'),//顶部时刻表
            $airCtNo = $('#aircraft_nos'),//左侧机号
            $v_line = $('.v_line'),
            scroll_val;
        $(this.el).find('.c_box').scroll(function(ev){
            console.log('scroll........')
            var data = $(this).data("scroll"),
                now_top = $(this).scrollTop(),
                now_left = $(this).scrollLeft();
            if (!data) {
                data = {top: 0, left: 0};
            }
            $airCtNo.css({'top': (topbarsH - $scroll.scrollTop())});
           // $airCtNo.css({'top': (- $scroll.scrollTop())});
            $timePoint.css({'margin-left': (-$scroll.scrollLeft())});
             if(data.top!==now_top){
                console.log("上下")
                $airCtNo.css({'top': (topbarsH - $scroll.scrollTop())});
                 //$airCtNo.css({'top': (- $scroll.scrollTop())});
             }
             if(data.left!==now_left){
                      console.log("左右")
             $timePoint.css({'margin-left': (-$scroll.scrollLeft())});
             }
            $(this).data("scroll", {top: now_top, left: now_left});
        })
    },
    addRightClick:function(){
        $(this.el).on('contextmenu','.plan,.actual',function(ev){
            ev.preventDefault()
        })
    },
    draw: function () {
        this.drawTimeScale('2017-09-04')
        this.drawAcnos()
        this.drawGantt()
    },
    drawTimeScale: function (date) {//绘制上面的刻度线,传入中间那天 yyyy-MM-dd
        var pattern = /^\d{4}[-]\d{2}[-]\d{2}/;
        if (!pattern.test(date)) {
            console.error('时期格式错误')
            return;
        }
        var day = "", time = "", html = "";
        for (var i = 0; i < 4; i++) {
            day = get_date(date, (i - 1))
            for (var j = 0; j < 24; j++) {
                if (i === 3 && j > 3) break;
                if (j >= 0 && j < 10) {
                    time = '0' + j + ":00";
                } else if (j >= 10) {
                    time = j + ":00";
                }
                var str = ""
                if (j === 0 && this.scale <= 3) {
                    day = day.substring(5, day.length)
                    if (this.scale === 3) {//3x特殊处理
                        str = '<span>' + day + '</span><i>' + time + '</i>'
                    } else {
                        str = '<i>' + day + '</i>'
                    }
                } else {
                    str = '<span>' + day + '</span><i>' + time + '</i>'
                }
                html += '<li>' +
                    '<div class="date">' +
                    str +
                    '</div>' +
                    '<span class="condensed">0</span>' +
                    '<span>15</span>' +
                    '<span>30</span>' +
                    '<span>45</span>' +
                    '</li>'
            }
        }
        var arr = ['scale1x', 'scale2x', 'scale3x', 'scale4x']
        var scale = arr[this.scale - 1]
        var clsName = 'timePoint ' + scale
        var $timePoint = $('<ul class="' + clsName + '"></ul>');
        $timePoint.html(html);//先清空时间轴
        $(this.el).children('.gantt-body').append($timePoint)

        //添加收缩按钮
        var $shrink = `<span class="shrink" id="shrink">
                        <i class="arrows arrow1-left"></i>
                        <i class="arrows arrow2-left"></i>
                    </span>`
        $(this.el).children('.gantt-body').append($shrink)
    },
    drawAcnos: function () {//绘制左边的机号
        var data = this.data
        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            var html = ""
            html += `<div class="divtype">
                        <span class="type" data-acType=${item.acType}>
                            ${item.acType}
                            <i class="arrows arrow1-bottom"></i>
                        </span>
                    </div>`
            html += '<ul class="aircraft_no pull-left">'
            for (var j = 0, lenj = item.airList.length; j < lenj; j++) {
                var air = item.airList[j];
                var dataEmpty = "", clsName = ""
                if (air.showEmptyPlane === "1") {
                    dataEmpty = 'data-empty="1"'
                    if (!$("#showEmptyPlane").is(":checked")) {
                        clsName = "hide_important"
                    }
                }
                if ($.trim(air.limitMsg) === "") {
                    html += `<li data-acno=${air.acno} class=${clsName} ${dataEmpty}>`
                } else {
                    clsName += " acno_hover"
                    html += `<li data-acno=${air.acno} class=${clsName} data-msg=${air.limitMsg} ${dataEmpty}>`
                }
                html += `<span>${air.acno}</span>
						<span>${air.workset + "/" + air.sharkWing}</span>
    				</li>`
            }
            html += "</ul>"
        }
        var $div = $('<div class="aircraft_nos" id="aircraft_nos"></div>')
        $div.append(html)
        $(this.el).children('.gantt-body').append($div)
    },
    drawGantt: function () {
        var data = this.data
        var html = ""
        var planLeft, actualLeft, planWidth, lockLeft, lockWidth

        var that=this
        function get_width(start, end) {//start_time:查询日期前一天，格式yyyy-MM-dd
            if (!start || !end) return;//如果没有时间，返回undefined,则jsp中不渲染此甘特图
            //if(start>=end) return 0;//如果结束时间大于开始时间，返回0
            var max_end = get_date(that.start_time, 3);
            max_end += " 04:00";
            var from = new Date(Date.parse(start.replace(/-/g, "/"))).getTime(),
                to = new Date(Date.parse(end.replace(/-/g, "/"))).getTime();

            var max_date = new Date(Date.parse(max_end.replace(/-/g, "/"))).getTime();
            if (to > max_date) {
                to = max_date;
            }
            //return globalObj.scale/2 * (to - from) / (1000 * 60);
            /*    if(globalObj.scale===1){
             return globalObj.scale * 2 *(to - from) / (1000 * 60 * 3);
             }*/
            //return globalObj.scale * (to - from) / (1000 * 60 * 2);
            if(that.scale===1){
                return that.scale * 2 *(to - from) / (1000 * 60 * 3);
            }
            if(that.scale===2){
                return 1 * (to - from) / (1000 * 60);
            }else if(that.scale===3){
                return 1.5 * (to - from) / (1000 * 60);
            }else if(that.scale===4){
                return 2 * (to - from) / (1000 * 60);
            }
            //return (to - from)*3 / (1000 * 60 * 2);
        }
        function get_left(time) {
            return get_width(that.start_time, time);
        }

        if (data[0] && data[0].localFresh !== true) {
            html += `<canvas id="drawing" class="canvas-drawing" style="display:none;"></canvas>`
        }
       // var airList
        for(var i=0,len=data.length;i<len;i++){
            if (data[0] && data[0].localFresh !== true) {//不是本地刷新
                html += `<li class="shrink-height"></li>`
            }
            var airList=data[i].airList
  /*      }
        for (var i = -1, airList; airList = data[++i].airList;) {*/
            for (var m = -1, air; air = airList[++m];) {
                var flightList = air.fltInfoDtoList, flyLockList = air.flyLockList

                var dataEmpty = "", clsName = ""
                if (air.showEmptyPlane === "1") {
                    dataEmpty = 'data-empty=1'
                    if (!$("#showEmptyPlane").is(":checked")) {//没有选择空航班号，则隐藏
                        clsName = 'hide_important'
                    }
                }
                html += `<li data-acType=${air.acType} data-acno=${air.acno}
                        ${dataEmpty}
                        class=${clsName}>`

                if (flyLockList.length > 0) {//渲染锁定条
                    var display = ""
                    if (!$("#lockbar").is(":checked")) {
                        display = "dispaly:none;"
                    }
                    for (var h = -1, lockFlight; lockFlight=flyLockList[++h];) {
                        lockLeft = (get_left(lockFlight.sDate)) + "px",
                            lockWidth = (get_width(lockFlight.sDate, lockFlight.eDate)) + "px";
                        <!--data-flight="{{!BUI.JSON.stringify(lockFlight)}}-->
                        html += `<div class="lockbar" style="left:${lockLeft };width:${lockWidth};${display}">
                            <span>${lockFlight.depart}</span>
                        </div>`
                    }
                }

                for (var j = -1, flight; flight = flightList[++j];) {
                    planLeft = (get_left(flight.etd)) + "px";
                    planWidth = (get_width(flight.etd, flight.eta)) + "px";

                    html += `<div class="plan" draggable=${(flight.acarsClosed || flight.lStd || flight.fStd) ? false : true }
                                style="left:${planLeft}"
                                data-flightNo="${flight.flightNo}"
                                data-dayFlightId="${flight.dayFlightId}"
                                title="${flight.etd}"
                          >`
                    if (flight.red === "1" || flight.importType === "1" || flight.importType === "2") {
                        var icon1 = "", icon2 = ""
                        if (flight.red === "1") {
                            icon1 = `<i class="icon-fm070 reform circle red"></i>`
                        }
                        if (flight.importType === "1") {
                            icon2 = `<i class="icon-fm068 warn importType" data-importType="${flight.remark}"></i>`
                        } else if (flight.importType === "2") {
                            icon2 = `<i class="icon-fm068 reform importType" data-importType="${flight.remark}"></i>`
                        }
                        html += `<div class="icon-wrap1">${icon1} ${icon2}</div>`
                    }

                    var startCloseCls = "fl", endCloseCls = "fr"
                        , dataCloseStart = "", dataCloseEnd = "", style = ""
                    if ($("#showCloseAirport").is(":checked") && flight.fltStatus != "2") {
                        if (flight.oriAirportClose === "3") {
                            startCloseCls += " close"
                            dataCloseStart = "data-close"
                        }
                        if (flight.airportClose === "3") {
                            endCloseCls += " close"
                            dataCloseEnd = "data-close"
                        }
                        if (flight.oriportNameColor === "1") {
                            style = 'style="color:#c00'
                        }
                    }

                    html += ` <div class="ft_info fl ${flight.bgColor}" style="width:${planWidth};">`
                    html += ` <span class="${startCloseCls}" ${dataCloseStart} ${style} >
                                ${flight.oriShortName}
                             </span>`
                    if (flight.changeCrew) {
                        html += `<span class="fl">${flight.changeCrew}</span>`
                    }
                    html += `<span class="${endCloseCls}" ${dataCloseEnd} ${style}>
                                ${flight.arrShortName}
                            </span>`

                    if (flight.isForeign === "F") {
                        html += `<span class="fl">F</span>`
                    }
                    if (flight.isCatII) {
                        html += `<span class="fl">${flight.isCatII}</span>`
                    }
                    if (flight.profitLevel) {
                        var profitDisplay = ""
                        if (!$("#profitLevel").is(":checked")) {
                            profitDisplay = 'style="display:none;"'
                        }
                        html += `<span class="fl profitLevel" ${profitDisplay}>
                                 ${flight.profitLevel}
                                </span>`
                    }

                    if (flight.layoutCheck) {
                        var layoutDisplay = ""
                        if (!$('#show186').is(':checked')) {
                            layoutDisplay = 'style="dispaly:none"'
                        }
                        html += `<span class="layout" ${layoutDisplay}></span>`
                    }
                    var stopFlag = "", dispatchCheck = ""
                    if (flight.stopFlag === "1") {
                        stopFlag = ` <i class="stopFlag">联</i>`
                    }
                    if (flight.dispatchCheck) {
                        dispatchCheck = `<i class="t_star">${flight.dispatchCheck}</i>`
                    }
                    html += `<div class="ft_no">
                            ${stopFlag}
                            <span>${(flight.flightNo && flight.flightNo.substring(2)) }</span>
                            ${dispatchCheck}
                    </div>`

                    if (flight.vipType === "VVIP") {
                        html += '<i class="icon-fm035"></i>'
                    }
                    if (flight.vipType) {
                        html += `<strong class="vip-base ${flight.vipType.toLowerCase()}" ></strong>`
                    }
                    html += "</div>"

                    if (flight.avgArr && flight.eta) {
                        var w_plan = get_width(flight.etd, flight.eta),
                            w_leg = get_width(flight.eta, flight.avgArr),
                            w_span = 0, l_span = 0;
                        if (w_leg > 0) {
                            w_span = w_leg;
                            l_span = w_plan;
                        } else if (w_leg < 0) {
                            w_span = 3;
                            l_span = get_left(flight.avgArr) - get_left(flight.etd);
                        } else {
                            w_span = 3;
                            l_span = w_plan - 3;
                        }
                        var legStyle = ""
                        if ($('#legTime').is(':checked')) {
                            legStyle = 'display:"none"'
                        }
                        html += `<span class="legtime" data-legtime='${flight.avgArr}'
                                 style="width:${w_span}px;left:${l_span}px;
                                 ${legStyle}">
                             </span>`
                    }
                    if (flight.yellow === "1") {
                        html += '<i class="icon-fm071 circle yellow"></i>'
                    }
                    html += "</div>"

                    //实际航班条
                    var actual_left = get_left(flight.acarsClosed || flight.lStd || flight.fStd);
                    if (actual_left == null) {
                        continue;
                    }
                    var dataMoving = ""
                    if (flight.fStd && flight.fSta) {
                        dataMoving = 'data-moving=""'
                    }
                    html += `<div class="actual" ${dataMoving}  style="left:${actual_left}px"
                            data-dayFlightId="${flight.dayFlightId}"  data-fltStatus="${flight.fltStatus}">`

                    var bg_color, w, nextTime
                    if (flight.acarsClosed) {
                        bg_color = "#83aaf6";
                        nextTime = flight.lStd || flight.fStd;
                        w = get_width(flight.acarsClosed, nextTime || convertTime(new Date())) + 'px';

                        html += `<span class="fl" style="width:${w};background-color:${bg_color};">
                                ${!nextTime ? flight.flightNo.substring(2) : "" }
                            </span>`
                    }

                    if (flight.lStd) {
                        bg_color = "#3c64b3";
                        nextTime = flight.fStd;
                        w = get_width(flight.lStd, nextTime || convertTime(new Date())) + 'px';

                        html += `<span class="fl" style="width:${w};background-color:${bg_color};">
                                     ${!nextTime ? flight.flightNo.substring(2) : "" }
                                </span>`
                    }

                    if (flight.fStd) {
                        nextTime = flight.fSta;
                        bg_color = "#464b5c";
                        if (!nextTime) {
                            bg_color = "#3fa742";
                        }
                        w = get_width(flight.fStd, nextTime || convertTime(new Date())) + "px";
                        html += `<div class="ft_no fl" style="width:${w};background-color:${bg_color};">
                                <span>${flight.flightNo.substring(2)}</span>
                            </div>`
                    }

                    if (flight.fSta && flight.lSta || flight.acarsOpen) {
                        nextTime = flight.lSta || flight.acarsOpen;
                        bg_color = "#3c64b3";
                        if (!flight.lSta) {
                            bg_color = "#83aaf6";
                        }
                        w = get_width(flight.fSta, nextTime) + "px";
                        html += `<span class="fl" style="width: ${w};background-color:${bg_color};"></span>`
                    }

                    if (flight.lSta && flight.acarsOpen) {
                        nextTime = flight.acarsOpen;
                        bg_color = "#83aaf6";
                        w = get_width(flight.lSta, nextTime) + "px";

                        html += `<span class="fl" style="width:${w};background-color:${bg_color};"></span>`
                    }
                    html += "</div>"
                }
                html += "</li>"
            }
        }
        if (data[0] && data[0].localFresh !== true) {
            html += `<div id="fm-mask"></div>`
        }
        var $ul=$(this.el).find('.infos_details')
        if($ul.length>0){
            $ul.html('').append(html)
        }else{
            $ul = $(`<ul class="infos_details fl scale${this.scale}x" id="infos_details"></ul>`)
            $ul.append(html)
            var boxstr = `<div class="c_box ">
                         <div class="zero-time-line scale${this.scale}x">
                                <div></div><div></div><div></div>
                        </div>
                        <div class="if-ie-seat"></div>
                    </div>`
            var $box = $(boxstr)
            $box.append($ul)
            $(this.el).children('.gantt-body').append($box)
        }



    },
    getLeft:function(){

    },
    getWidth:function(){

    }
}


















