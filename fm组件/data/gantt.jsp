    <%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
        <%@ include file="/WEB-INF/layouts/taglib.jsp"%>
        <!DOCTYPE html>
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=8">
        <title>新航班调配-运行监控</title>
        <%--<%@ include file="/WEB-INF/layouts/csslib.jsp"%>--%>
        <link rel="stylesheet" href="${ctx}/static/plugins/bui/css/bs3/bui-min.css">
        <link rel="stylesheet" href="${ctx}/static/plugins/bui/css/bs3/dpl-min.css">
        <link rel="stylesheet" href="${ctx}/static/fm/common/css/jquery.autocomplete.css"/>
        <link rel="stylesheet" href="${ctx}/static/system/css/system.css">
        <link rel="stylesheet" href="${ctx}/static/fm/common/css/jquery.mCustomScrollbar.css">
        <link rel="stylesheet" href="${ctx}/static/system/css/fonts-menu.css">
        <link rel="stylesheet" href="${ctx}/static/fm/common/css/fm.css">
        <link rel="stylesheet" href="${ctx}/static/fm/common/css/bootstrap-fm.css">
        <script type="text/javascript" src="${ctx}/static/plugins/websocket/sockjs-1.1.1.min.js"></script>
        <script type="text/javascript" src="${ctx}/static/plugins/websocket/stomp-2.3.4.min.js"></script>
        <style>
        .hide_important{
        display:none!important;
        }
        .custom-show{
        background-color: #555a69;
        color: #fff;

        }
        .msg_detail .mCSB_inside > .mCSB_container{
        margin-right:0;
        }
        </style>
        <!--[if lte IE 8]>
        <script src="${ctx}/static/fm/common/js/excanvas.js"></script>
        <![endif]-->
        </head>
        <body>
        <div class="loading" id="loading">
        <img src="${ctx}/static/fm/common/images/loading.gif">
        </div><%--
<div class="loading-data" style="display: none;z-index:9999;">
    <img src="${ctx}/static/fm/common/images/loading.gif">
</div> --%>
        <div class="fm_container">
        <span style="display:none" id="oldSifts" >${acTypeList}</span>
        <span style="display:none" id="newSifts" >${acTypeList}</span>
        <!--[if lte IE 10]>
        <div class="version-warn text-center" id="version"><strong>亲，您当前的浏览器版本过低，页面效果展示不佳，建议升级浏览器！</strong></div>
        <![endif]-->
        <div class="header no-select">
        <div class="calendar-box">
        <i class="icon-fm033" data-action="preDay"></i>
        <label>
        <input type="text" id="fltDate" value="" readonly class="no-select">
        <i class="icon-fm001"></i>
        </label>
        <i class="icon-fm034" data-action="nextDay"></i>
        </div>
        <span class="filters" data-action="sift">
        <i class="icon-fm014"></i>
        <i class="isShift"> </i>
        </span>
        <i class="icon-fm015" data-action="moveToday"></i>
        <i class="icon-fm016" data-action="query" id="query"></i>
        <div class="search-area">
        <input type="text" placeholder="航班或机号" id="acno_text" autocomplete="off">
        <i class="icon-fm011" data-action="searchNum"></i>
        </div>
        <div class="hour-split no-select">
        <div class="hour-line"></div>
        <div class="hour-lf">
        <i class="lf"></i>
        <i class="rf"></i>
        <span>1X</span>
        </div>
        <div class="hour-ct">
        <i class="lf"></i>
        <i class="rf"></i>
        <span>2X</span>
        </div>
        <div class="hour-rf">
        <i class="lf"></i>
        <i class="rf"></i>
        <span>3X</span>
        </div>
        <span class="probar scale1x"></span>
        </div>
        <ul class="pull-right">
        <c:if test="${monitorFlag!='1'}">
            <shiro:hasPermission name="XZHB">
                <li id="addFlight"><a class=""><i class="icon-fm017"></i><span>新增航班</span></a> </li>
            </shiro:hasPermission>
        </c:if>
        <shiro:hasPermission name="YXXX">
            <li data-action="runInfo"> <a class=""><i class="icon-fm012"></i><span>运行信息</span></a> </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="QXJK">
            <li data-action="weatherMonitor" class="bor-right"> <a class=""><i class="icon-fm013"></i><span>气象监控</span></a> </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JMGN">
            <li data-action="more_fun" class="bor-left"> <a class="no-sys"><i class="icon-fm020"></i><span>界面功能</span></a> </li>
        </shiro:hasPermission>
        <c:if test="${monitorFlag!='1'}">
            <shiro:hasPermission name="SIMULATION">
                <li id="fltDeploymentBtn" class="bor-right"> <a class=""><i class="icon-fm018"></i><span>模拟调配</span></a> </li>
            </shiro:hasPermission>
        </c:if>
        <shiro:hasPermission name="TPFA">
            <li class="myAdjustPlan bor-both"><a class=""><i class="icon-fm019"></i><span>调配方案</span></a> </li>
        </shiro:hasPermission>
        <li id="fullScreen" data-action="full_screen" data-screen="no" class="bor-left"> <a id="fullScreen" class="fullscreen"><i class="icon-fm021"></i></a> </li>
        </ul>
        </div>
        <ul class="timePoint scale1x no-select">
        </ul>
        <span class="shrink" id="shrink"><i class="arrows arrow1-left"></i><i class="arrows arrow2-left"></i></span>
        <div class="aircraft_nos no-select" id="aircraft_nos"></div>
        <div class="c_box no-select">
        <div class="zero-time-line scale1x">
        <div></div>
        <div></div>
        <div></div>
        </div>

        <div class="if-ie-seat"></div>
        <ul class="infos_details fl scale1x" id="infos_details"></ul>
        <div class="v_line" style="display:none;"></div>
        </div>
        </div>

        <div class="msg_box no-select">
        <ul class="message">
        <shiro:hasPermission name="ZHXX">
            <li id="liqListSize">
            <i class="icon-fm022 "></i>
            <i class="msg_badge qListSize" id="qListSize"></i>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="TZTZXX">
            <li id="liaListSize">
            <i class="icon-fm025"></i>
            <i class="msg_badge aListSize"></i>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JKQXXX">
            <li id="liwListSize">
            <i class="icon-fm023"></i>
            <i class="msg_badge wListSize"></i>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JKXTXX">
            <li id="lisListSize">
            <i class="icon-fm024"></i>
            <i class="msg_badge sListSize"></i>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JKXXJK">
            <li>
            <a class="icon-fm013" href="${ctx}/msgmonitor" target="your_name"></a>
            </li>
        </shiro:hasPermission>
        </ul>
        <div class="msg_detail"  style="display: none;">

        </div>

        </div>
        <dl class="footer hide">
        <dt>界面功能</dt>
        <dd class="lock-bar">
        <label class="checkbox-order"><input type="checkbox" data-action="flyLockList" id="lockbar" checked>锁定条<i class="icon-fm003"></i> </label>
        <label class="checkbox-order"><input type="checkbox" data-action="query" id="showCancle">取消航班 <i class="icon-fm003"></i></label>
        </dd>
        <dd>
        <label class="mleft checkbox-order"><input type="checkbox" data-action="query" id="showPre">显示前一<i class="icon-fm003"></i></label>
        <label  class="checkbox-order"><input type="checkbox" data-action="query" id="showNext" checked>显示后一<i class="icon-fm003"></i></label>
        </dd>
        <dd>
        <label  class="checkbox-order"><input type="checkbox" data-action="query" id="showCatII">显示CATII<i class="icon-fm003"></i></label>
        <label class="mleft checkbox-order"><input type="checkbox" data-action="showEmptyPlane" id="showEmptyPlane" checked>无航班机号<i class="icon-fm003"></i></label>
        </dd>
        <dd>
        <label  class="checkbox-order"><input type="checkbox" data-action="closeAirport" id="showCloseAirport" checked>机场关闭<i class="icon-fm003"></i></label>
        <label  class="checkbox-order"><input type="checkbox" data-action="profitLevel" id="profitLevel">收益等级<i class="icon-fm003"></i></label>
        </dd>
        <dd class="check-group-last">
        <label  class="checkbox-order"><input type="checkbox" data-action="legTime" id="legTime" checked>航段时间<i class="icon-fm003"></i></label>
        <label  class="checkbox-order"><input type="checkbox" data-action="show186" id="show186" checked>显示186<i class="icon-fm003"></i></label>
        </dd>
        <dd class="close" data-action="more_fun"><i class="icon-fm005"></i></dd>
        <dd class="sign-mark">
        <ul class="sign-color">
        <li class="conflict">
        <i class="c-box"></i>
        <span class="text">冲突</span>
        </li>
        <li class="delay">
        <i class="c-box"></i>
        <span class="text">延误</span>
        </li>
        <li class="back">
        <i class="c-box"></i>
        <span class="text">返航</span>
        </li>
        <li class="ready">
        <i class="c-box"></i>
        <span class="text">备降</span>
        </li>
        <li class="cancel">
        <i class="c-box"></i>
        <span class="text">取消</span>
        </li>
        <li class="normal">
        <i class="c-box"></i>
        <span class="text">正常</span>
        </li>
        <li class="flying">
        <i class="c-box"></i>
        <span class="text">在飞</span>
        </li>
        <li class="land">
        <i class="c-box"></i>
        <span class="text" >降落</span>
        </li>
        </ul>
        </dd>
        </dl>

        <script type="text/template" id="msg_tmpl1">
        <h3>
        消息<span id="qListSizeSpan">（{{=it.size}}）</span>
        </h3>
        <div class="msgBody" style="height: 200px;">
        <ul class="msg_body">
        {{ for(var i=0,len=it.length;i<len;i++){ }}
        {{ var item=it[i];}}
        <li>
        <dl class="clearfix">

        {{ if(item.messageId!=null && item.messageId!=''){ }}
        <dt><a href="#"style="color: #4287e6" data-dayflightid={{=item.messageId}} class="flightClass">{{=item.fltno}}</a></dt>
        <dd>
        <span>{{=item.flightDate}} {{=item.cName}}</span>
        <button type="button" class="qListClass" value="{{=item.id}}">确认</button>
        </dd>
        <dd><span class="msg_color" data-type="{{=item.type}}">{{=item.typeStr}}</span></dd>
        {{ } }}

        {{ else{ }}
        <dt><a href="#"style="color: #4287e6" class="flightClass">{{=item.fltno}}</a></dt>
        <dd>
        <span class="msg_color" data-type="{{=item.type}}">{{=item.typeStr}}</span>
        <button type="button" class="qListClass" value="{{=item.id}}">确认</button>
        </dd>
        {{ } }}

        <dd>{{=item.body}}</dd>
        <dd class="msg_color">
        <span>{{=item.enterDate}}</span>
        </dd>
        </dl>
        </li>
        {{ } }}
        </ul>

        </div>
        <a id="queryMessage">查看历史消息</a>
        </script>
        <script type="text/template" id="msg_tmpl2">
        <h3>
        调整通知<span id="aListSizeSpan">（{{=it.size}}）</span>
        </h3>
        <div class="msgBody" style="height: 200px;">
        <ul class="msg_body">
        {{ for(var i=0,len=it.length;i<len;i++){ }}
        {{ var item=it[i];}}
        <li>
        <dl class="clearfix">
        <dt><a href="#"style="color: #4287e6"  class="clearfixClass">{{=item.flightNo}}</a></dt>
        <dd>
        <span class="msg_color">{{=item.movementType}}</span>
        <span>{{=item.flightDate}} {{=item.cName}}</span>
        <button type="button" class="aListClass" value="{{=item.usid}}">确认</button>
        </dd>
        <dd>{{=item.content}}</dd>
        <dd class="msg_color">
        <span>{{=item.sendDate}}</span>
        </dd>
        </dl>
        </li>
        {{ } }}
        </ul>

        </div>
        <a id="adjustMessage">查看历史消息</a>
        </script>
        <script type="text/template" id="msg_tmpl3">
        <h3>
        气象消息<span id="wListSizeSpan">（{{=it.size}}）</span>
        </h3>
        <div class="msgBody" style="height: 200px;">
        <ul class="msg_body">
        {{ for(var i=0,len=it.length;i<len;i++){ }}
        {{ var item=it[i];}}
        <li>
        <dl class="clearfix">
        <dt>{{=item.fcode}}</dt>
        <dd>
        <span class="msg_color">{{=item.type}}</span>
        <button type="button" class="wListClass" value="{{=item.id}}">确认</button>
        </dd>
        <dd>{{=item.content}}</dd>
        <dd class="msg_color">
        <span>{{=item.revTime}}</span>
        </dd>
        </dl>
        </li>
        {{ } }}
        </ul>

        </div>
        <a id="queryWeather">查看历史消息</a>
        </script>
        <script type="text/template" id="msg_tmpl4">
        <h3>
        系统消息<span id="sListSizeSpan">（{{=it.size}}）</span>
        </h3>
        <div class="msgBody" style="height: 200px;">
        <ul class="msg_body">
        {{ for(var i=0,len=it.length;i<len;i++){ }}
        {{ var item=it[i];}}
        <li>
        <dl class="clearfix">
        <dt>{{=item.actionType}}</dt>
        <dd>
        {{ if(item.msgFrom==0){ }}
        <button type="button"  value="{{=item.usid}}"  onclick="initDraft({{=item.msgFromId}});">
        查看
        </button>
        {{ }else if(item.msgFrom==1){ }}
        <button type="button" class="" value="{{=item.usid}}" onclick="initHandleCheckList({{=item.msgFromId}},{{=item.flightId}});">
        查看
        </button>
        {{ }else if(item.msgFrom==2){}}
        {{ if(item.flightCheckType==1){}}
        <button type="button" class="" value="{{=item.usid}}" onclick="initPostCheckListPln('{{=item.msgFromId}}');">
        查看
        </button>
        {{ }else{}}
        <button type="button" class="" value="{{=item.usid}}" onclick="initPostCheckList('{{=item.posCode}}','{{=item.msgFromId}}');">
        查看
        </button>
        {{ }}}
        {{ }}}


        </dd>
        <dd>{{=item.content}}</dd>
        <dd class="msg_color">
        <span>{{=item.sendDate}}</span>
        </dd>
        </dl>
        </li>
        {{ } }}
        </ul>

        </div>
        <a id="systemMessage">查看历史消息</a>
        </script>
        <ul id="tips_info" class="tips_info" style="display: none">
        </ul>

        <ul id="plan_menu" class="right_menu no-select" style="display: none">
        <c:if test="${monitorFlag!='1'}">
            <shiro:hasPermission name="HBTP">
                <li data-url="tab"  class="first"><div>航班调整</div></li>
            </shiro:hasPermission>
            <shiro:hasPermission name="JHTZ">
                <li data-url="acnoAdjust"><div>机号调整</div></li>
            </shiro:hasPermission>
        </c:if>
        <shiro:hasPermission name="XGXZHB">
            <li class="" data-url="UpdateFlightCtrl" style="margin-bottom: 5px"><div>修改新增航班</div></li>
        </shiro:hasPermission>
        <shiro:hasPermission name="BZQK">
            <li class="hasoption"><div>保障情况<i class="triangle-right"></i></div></li>
            <li class="options">
            <ul>
            <shiro:hasPermission name="VIP">
                <li data-url="vip" class="first">要客信息</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="CABIN">
                <li data-url="cabin">登机状态</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="CDM">
                <li data-url="cdm" class="last">CDM</li>
            </shiro:hasPermission>
            </ul>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JCXX">
            <li class="hasoption"><div><i class="triangle-right"></i>基础信息</div></li>
            <li class="options">
            <ul>
            <shiro:hasPermission name="CREW">
                <li data-url="crew" class="first">机组信息</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="LIGATURE">
                <li data-url="ligature/fly">飞行机组连线</li>
                <li data-url="ligature/stew">乘务机组连线</li>
                <li data-action="clearLine">取消连线</li>
            </shiro:hasPermission>
            <shiro:hasPermission name="CONTACT">
                <li data-url="contact" class="last">机场通讯录</li>
            </shiro:hasPermission>
            </ul>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="TJFX">
            <li class="hasoption"><div>统计分析<i class="triangle-right"></i></div></li>
            <li class="options">
            <ul>
            <shiro:hasPermission name="NORMALRATE">
                <li data-url="normalRate" class="first last">正常率</li>
            </shiro:hasPermission>
            </ul>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="SIGN">
            <li class="hasoption"><div>机组签到监控<i class="triangle-right"></i></div></li>
            <li class="options">
            <ul>
            <li data-url="sign/fly" class="first">飞行员签到监控</li>
            <li data-url="sign/stew" class="last">乘务员签到监控</li>
            </ul>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="JZDXTZ">
            <li class="hasoption"><div>机组短信通知<i class="triangle-right"></i></div></li>
            <li class="options">
            <ul>
            <li data-url="sms/fly" class="first">飞行员短信通知</li>
            <li data-url="sms/stew" class="last">乘务员短信通知</li>
            </ul>
            </li>
        </shiro:hasPermission>
        <shiro:hasPermission name="XGTZYY">
            <li class="" data-url="adjust" style="margin-bottom: 5px"><div>修改调整原因</div></li>
        </shiro:hasPermission>
        <!--
        <shiro:hasPermission name="XGPFQK">
            <li class="noborder" data-app="toApproved" data-url="addFlight/toApproved" style="margin-bottom: 5px"><div>修改批复情况</div></li>
        </shiro:hasPermission>
        -->
        <shiro:hasPermission name="XGYWYY">
            <li class="" data-url="reason" style="margin-bottom: 5px"><div>修改延误原因</div></li>
        </shiro:hasPermission>
        </ul>
        <ul id="actual_menu" class="right_menu no-select" style="display: none">
        <shiro:hasPermission name="XGYDSJANDHHCL">
            <li data-url="eta"><div>修改预达时间</div></li>
            <li data-url="slideBack"><div>滑回处理</div></li>
        </shiro:hasPermission>
        </ul>

        <div id="right_dialog">
        </div>

        <script type="text/template" id="acnos_tmpl">
        {{ for(var i=0,len=it.length;i< len;i++){ }}
        {{ var item=it[i]; }}
        <div class="divtype"><span class="type" data-acType={{=item.acType}}>{{=item.acType}}<i class="arrows arrow1-bottom"></i></span></div>
        <ul class="aircraft_no pull-left">
        {{ for(var j=0,lenj=item.airList.length;j<lenj;j++){ }}
        {{var air=item.airList[j];}}
        {{? $.trim(air.limitMsg)===""}}
        <li data-acno={{=air.acno}} {{?air.showEmptyPlane==="1"}} data-empty="1" {{?}} {{?air.showEmptyPlane==="1" && !$("#showEmptyPlane").is(":checked")}}class="hide_important"{{?}}>
        {{??}}
        <li data-acno={{=air.acno}} class="acno_hover {{?air.showEmptyPlane==="1" && !$("#showEmptyPlane").is(":checked")}}hide_important{{?}}" data-msg={{=air.limitMsg}} {{?air.showEmptyPlane==="1"}} data-empty="1" {{?}}>
        {{?}}
        <span>{{=air.acno}}</span>
        <span>{{=air.workset+"/"+air.sharkWing}}</span>
        </li>
        {{ } }}
        </ul>
        {{ } }}
        </script>
        <!-- <canvas id="drawing" style="position: absolute;z-index: 7;top: 0;left: 0;">A drawing of somthing</canvas> -->
        <script type="text/template" id="gantt">
        {{?it[0] && it[0].localFresh!==true}}
        <canvas id="drawing" class="canvas-drawing" style="display:none;">A drawing of somthing</canvas>
        {{?}}
        {{ var plan_left,actual_left,plan_width;
        for(var i=0,len=it.length;i< len;i++){ }}
        {{?it[0] && it[0].localFresh!==true}}
        <li class="shrink-height"></li>
        {{?}}
        {{ var airList=it[i].airList;
        for(var m=0,mLen=it[i].airList.length;m<mLen;m++){
        var flightList=it[i].airList[m].fltInfoDtoList,flyLockList=it[i].airList[m].flyLockList;
        }}
        <li data-acType={{=it[i].airList[m].acType}} data-acno={{=it[i].airList[m].acno}} {{?it[i].airList[m].showEmptyPlane==="1"}} data-empty="1" {{?}} {{?it[i].airList[m].showEmptyPlane==="1" && !$("#showEmptyPlane").is(":checked")}}class="hide_important"{{?}} >

        {{?flyLockList.length>0}}
        {{ for(var h=0,hLen=flyLockList.length;h<hLen;h++) { }}
        {{var lockFlight=flyLockList[h],
        lock_left=(get_left(lockFlight.sDate))+"px",
        lock_width=(get_width(lockFlight.sDate,lockFlight.eDate))+"px";
        }}

        <div class="lockbar" style="left:{{=lock_left }};width:{{=lock_width}};{{?!$("#lockbar").is(":checked")}}display:none;{{?}}" data-flight="{{!BUI.JSON.stringify(lockFlight)}}">
        <span>{{=lockFlight.depart}}</span>
        </div>
        {{ } }}
        {{?}}

        {{ for(var j=0,jLen=flightList.length;j< jLen;j++){ }}
        {{
        var flight=flightList[j];
        plan_left=(get_left(flight.etd))+"px";
        plan_width=(get_width(flight.etd,flight.eta))+"px";
        }}
        <div class="plan" draggable={{=(flight.acarsClosed || flight.lStd ||flight.fStd)?false:true }} style="left:{{=plan_left }}" data-flight="{{!BUI.JSON.stringify(flight) }}" data-flightNo="{{=flight.flightNo}}" data-dayFlightId="{{=flight.dayFlightId}}" >
        {{ if(flight.red==="1" || flight.importType==="1" ||flight.importType==="2") { }}
        <div class="icon-wrap1" id="warn">
        {{ if(flight.red==="1") { }}
        <i class="icon-fm070 reform circle red "></i>
        {{ } }}
        {{ if(flight.importType==="1") { }}
        <i class="icon-fm089 warn importType" data-importType='{{=flight.remark}}'></i>
        {{ } }}
        {{ if(flight.importType==="2") { }}
        <i class="icon-fm089 reform importType" data-importType='{{=flight.remark}}'></i>
        {{ } }}
        </div>
        {{ } }}
        {{
        var startClose=false,endClose=false;
        if($("#showCloseAirport").is(":checked")&&flight.fltStatus!="2"){
        if(flight.oriAirportClose==="3"){
        startClose=true;
        }
        if(flight.airportClose==="3"){
        endClose=true;
        }
        }
        }}
        <div class="ft_info fl {{=flight.bgColor}}" style="width:{{=plan_width}};">
        <span class="fl {{?startClose}}close{{?}}" {{?startClose}}data-close=""{{?}} {{?flight.oriportNameColor==="1"}}style="color:#c00;" {{?}} >{{=flight.oriShortName}}</span>
        {{ if(flight.changeCrew) { }}
        <span class="fl">{{=flight.changeCrew}}</span>
        {{ } }}

        <span class="fr {{?endClose}}close{{?}}" {{?endClose}}data-close=""{{?}} {{?flight.arrportNameColor==="1"}}style="color:#c00;" {{?}} >{{=flight.arrShortName}}</span>

        {{ if(flight.isForeign==="F") { }}
        <span class="fl">F</span>
        {{ } }}

        {{ if(flight.isCatII) { }}
        <span class="fl">{{=flight.isCatII}}</span>
        {{ } }}

        {{ if(flight.profitLevel) { }}
        <span class="fl profitLevel" {{?!$("#profitLevel").is(":checked")}}style="display:none;"{{?}}>{{=flight.profitLevel}}</span>
        {{ } }}

        {{ if(flight.layoutCheck) {}}
        <span class="layout" style="display:{{$('#show186').is(':checked')?'display' :'none';}}"></span>
        {{ } }}

        <div class="ft_no">
        {{? flight.stopFlag==="1"}}
        <i class="stopFlag">联</i>
        {{?}}
        <span>{{=(flight.flightNo && flight.flightNo.substring(2)) }}</span>
        {{? flight.dispatchCheck}}
        <i class="t_star">{{=flight.dispatchCheck}}</i>
        {{?}}
        </div>
        {{? flight.vipType==="VVIP"}}
        <i class="icon-fm035"></i>
        {{?? flight.vipType}}
        <strong   class="vip-base {{=flight.vipType.toLowerCase()}}" ></strong>
        {{?}}
        </div>
        {{ if(flight.avgArr && flight.eta) { }}
        {{
        var w_plan=get_width(flight.etd,flight.eta),
        w_leg=get_width(flight.eta,flight.avgArr),
        w_span=0,l_span=0;
        if(w_leg>0){
        w_span=w_leg;
        l_span=w_plan;
        }else if(w_leg<0){
        w_span=3;
        l_span=get_left(flight.avgArr)-get_left(flight.etd);
        }else{
        w_span=3;
        l_span=w_plan-3;
        }
        }}
        <span class="legtime" data-legtime='{{=flight.avgArr}}' style="width:{{=w_span+'px'}};left:{{=l_span+'px'}};display:{{=$('#legTime').is(':checked')?'block':'none'}} "></span>
        {{ } }}


        {{ if(flight.yellow==="1") { }}
        <i class="icon-fm071 circle yellow"></i>
        {{ } }}

        </div>

        {{
        var actual_left=get_left(flight.acarsClosed || flight.lStd ||flight.fStd);
        if(actual_left==null){
        continue;
        }
        var isMoving=true;
        if(flight.fStd && flight.fSta){
        isMoving=false;
        }
        }}
        <div class="actual" {{?isMoving}}data-moving=""{{?}} style="left:{{=actual_left+'px'}}" data-flight="{{!BUI.JSON.stringify(flight)}}" data-dayFlightId="{{=flight.dayFlightId}}" data-fltStatus="{{=flight.fltStatus}}">
        {{
        var bg_color;
        var w;
        if(flight.acarsClosed){
        bg_color="#83aaf6";
        var nextTime = flight.lStd || flight.fStd;
        w = get_width(flight.acarsClosed, nextTime || convertTime(new Date()) )+'px';
        }}
        <span class="fl" style="width:{{=w}};background-color:{{=bg_color}};">
        {{= !nextTime ? flight.flightNo.substring(2) :"" }}
        </span>
        {{
        }
        }}
        {{
        if(flight.lStd){
        bg_color="#3c64b3";
        var nextTime = flight.fStd;
        w = get_width(flight.lStd, nextTime || convertTime(new Date()))+'px';
        }}
        <span class="fl" style="width:{{=w}};background-color:{{=bg_color }};">
        {{= !nextTime ? flight.flightNo.substring(2) :"" }}
        </span>
        {{
        }
        }}

        {{
        if(flight.fStd){
        var nextTime = flight.fSta;
        bg_color="#464b5c";
        if(!nextTime){
        bg_color="#3fa742";
        }
        w=get_width(flight.fStd,nextTime || convertTime(new Date()))+"px";
        }}
        <div class="ft_no fl" style="width:{{=w}};background-color:{{=bg_color}};">
        <span>{{=flight.flightNo.substring(2)}}</span>
        </div>
        {{
        }
        }}

        {{
        if(flight.fSta && flight.lSta || flight.acarsOpen){
        var nextTime = flight.lSta || flight.acarsOpen;
        bg_color="#3c64b3";
        if(!flight.lSta){
        bg_color="#83aaf6";
        }
        w=get_width(flight.fSta,nextTime)+"px";
        }}
        <span class="fl" style="width: {{=w}};background-color: {{=bg_color}};"></span>
        {{
        }
        }}
        {{
        if(flight.lSta && flight.acarsOpen){
        var nextTime = flight.acarsOpen;
        bg_color="#83aaf6";
        w=get_width(flight.lSta,nextTime)+"px";
        }}
        <span class="fl" style="width: {{=w}};background-color: {{=bg_color}};"></span>
        {{
        }
        }}
        </div>
        {{ } }}
        </li>
        {{ } }}
        {{ } }}
        {{?it[0] && it[0].localFresh!==true}}
        <div id="fm-mask"></div>
        {{?}}
        </script>
        <script type="text/template" id=plan_tips>
        <li class="clearfix"><h3>{{=it.flightNo}}</h3></li>
        <li class="clearfix">{{=it.oriAndStd}}</li>
        <li class="clearfix">{{=it.arrAndSta}}</li>
        {{? it.preBtaFlag==="1"}}
        <li class="clearfix"><span>前一航班降落桥位：</span> <div>{{=it.preBta}}</div></li>
        {{?}}
        <li class="clearfix"><span>起飞桥位：</span> <div>{{=it.btd}} </div></li>
        <li class="clearfix"><span>降落桥位：</span> <div>{{=it.bta}}</div></li>
        <li class="clearfix"><span>TOBT：</span> <div>{{=it.tobt}}</div></li>
        <li class="clearfix"><span>COBT：</span> <div>{{=it.cobt}}</div></li>
        <li class="clearfix"><span>CTOT：</span> <div>{{=it.ctot}}</div></li>
        <li class="clearfix"><span>乘客人数：</span> <div>{{=it.passNumber}}</div></li>
        <li class="clearfix"><span>飞行员：</span> <div>{{=it.flyers}}</div></li>
        <li class="clearfix"><span>乘务员：</span> <div>{{=it.stews}}</div></li>
        {{? it.dayAdjustFlag==="1"}}
        <li class="clearfix"><span>{{=it.dayAdjust}}:</span> <div>{{=it.why}}</div></li>
        {{?it.desc}}<li class="clearfix">{{=it.desc}}</li>{{?}}
        {{?}}
        </script>


        <script type="text/template" id=actual_tips>
        <li class="clearfix"><h3>{{=it.flightNo}}</h3></li>
        <li class="clearfix">{{=it.oriAndStd}}</li>
        <li class="clearfix">{{=it.arrAndSta}}</li>
        <li class="clearfix"><span>关门时间：</span> <div>{{=it.acarsClosed}}</div></li>
        <li class="clearfix"><span>推出时间：</span> <div>{{=it.lStd}}</div></li>
        <li class="clearfix"><span>实际起飞时间：</span> <div>{{=it.fStd}}</div></li>
        <li class="clearfix"><span>预计/实际落地时间：</span> <div>{{=it.fSta}}</div></li>
        <li class="clearfix"><span>开门时间：</span> <div>{{=it.acarsOpen}}</div></li>
        <li class="clearfix"><span>降落桥位：</span> <div>{{=it.bta}}</div></li>
        <li class="clearfix"><span>油量：</span> <div>{{=it.fob}}</div></li>
        <li class="clearfix"><span>高度：</span> <div>{{=it.altitude}}</div></li>
        <li class="clearfix"><span>乘客人数：</span> <div>{{=it.passNumber}}</div></li>
        <li class="clearfix"><span>飞行员：</span> <div>{{=it.flyers}}</div></li>
        <li class="clearfix"><span>乘务员：</span> <div>{{=it.stews}}</div></li>
        {{? it.dayAdjustFlag==="1"}}
        <li class="clearfix"><span>{{=it.dayAdjust}}:</span> <div>{{=it.why}}</div></li>
        {{?}}
        </script>

        <script type="text/template" id=ppc_tips>
        <li class="clearfix"><h3>{{=it.acno}}</h3></li>
        <li class="clearfix"><span>锁定地：</span> <div>{{=it.airportName}} </div></li>
        <li class="clearfix">{{=it.sDate}}</li>
        <li class="clearfix">{{=it.eDate}}</li>
        <li class="clearfix"><span>锁定部门：</span> <div>{{=it.depart}} </div></li>
        <li class="clearfix"><span>锁定原因：</span> <div>{{=it.mar}} </div></li>
        </script>

        <script type="text/template" id="acno_tips">
        <li class="clearfix"><span>机型：</span> <div>{{=it.acType}}</div></li>
        <li class="clearfix"><span>GPS：</span> <div>{{=it.gps}}</div></li>
        <li class="clearfix"><span>RNAV：</span> <div>{{=it.rnav}}</div></li>
        <li class="clearfix"><span>是否涉水：</span> <div>{{=it.isWade}}</div></li>
        <li class="clearfix"><span>是否鲨鳍小翼：</span> <div>{{=it.sycheck}}</div></li>

        <li class="clearfix"><span>负责人：</span> <div>{{=it.dutyUserName}}</div></li>
        <li class="clearfix"><span>岗位：</span> <div>{{=it.positionName}}</div></li>
        <li class="clearfix"><span>卫星电话：</span> <div>{{=it.satePhone}}</div></li>
        <li class="clearfix"><span>布局：</span> <div>{{=it.workset}}</div></li>
        </script>

        <script type="text/template" id="time_point_tmpl">
        {{var day,time="";}}
        {{ for(var i=0;i<4;i++){ }}
        {{
        if(i===0){
        day=get_date(it.date, -1);
        }else if(i===1){
        day=get_date(it.date, 0);
        }else if(i===2){
        day=get_date(it.date, 1);
        }else{
        day=get_date(it.date, 2);
        }
        }}
        {{for (var j = 0; j < 24; j++) { }}
        {{
        if(i===3 && j>3) break;
        if (j >=0 && j < 10) {
        time = '0' + j + ":00";
        } else if (j >= 10) {
        time = j + ":00";
        }
        }}
        <li>
        <div class="date">
        {{? j===0 && globalObj.scale===1}}
        {{day=day.substring(5,day.length);}}
        <i>{{=day}}</i>
        {{??}}
        <span>{{=day}}</span>
        <i>{{=time}}</i>
        {{?}}
        </div>
        <span class="condensed">0</span>
        <span>15</span>
        <span>30</span>
        <span>45</span>
        </li>
        {{ } }}
        {{ } }}
        </script>

        <jsp:include page="/WEB-INF/layouts/jslib.jsp"></jsp:include>
        <script src="${ctx}/static/fm/common/js/Drag.js"></script>
        <script src="${ctx}/static/fm/common/js/websocket.js"></script>
        <script src="${ctx}/static/monitor/gantt/gantt.js"></script>
        <script src="${ctx}/static/fm/common/js/drawGantt.js"></script>
        <script>
        var overlay;
        var posName='${sessionScope.posName}';
        var monitorFlag='${monitorFlag}'

        var globalObj={//全局变量
        flightIds:"",//需要连线的dayflightId,已经过滤到甘特图中不存在的id
        type:"",//连线的类型
        start_time:"",//查询日期前一天，格式yyyy-MM-dd
        scale:1,//刻度，默认是二,
        oldScale:1,//切换后，上一个刻度值
        ganttData:"",//每次查询出来的数据，切换刻度时 使用
        newSifts:"",//筛选值，格式为机号+航班日期+起飞机场+降落机场+机场复选框是否勾选标识+公司代码，用@隔开
        oldSifts:"",//筛选初始值
        //emptyPlane:"0",//界面功能中无航班机号,0没有勾选,1勾选
        timeLineId:"",
        //scroll_obj:null
        scroll_prev:0,
        autoFreshId:0,
        dragEl:null//正在拖动的甘特图
        };

        function addAutoFresh(){//添加自动刷新
        globalObj.autoFreshId=setInterval(function(){//5分钟刷新
        query(false);//不需要loading框
        },300000);
        }
        function autoFreshSP(){//自动刷新SP
        setInterval(function(){//1分钟刷新
        getWeatherInfo();
        },300000);
        }
        function checkList(){//自动刷新检查单若超时未完成
        setInterval(function(){//2分钟刷新
        if($(".getCheckList").length>0){
        overlay.close();
        }
        getCheckList();
        },120000);
        }

        function autoFreshAcars(){//位置报缺报定时提醒
        setInterval(function(){//1分钟刷新
        acarsPosMissAlert();
        },60000);
        }

        function messageNumber(){//消息数量定时提醒
        setInterval(function(){//1分钟刷新
        //initMessageNumber();
        },60000);
        }
        function autoFreshUsers(){//消息数量定时提醒
        setInterval(function(){//5秒钟刷新
        checkUsers();
        },5000);
        }

        /**
        * ajax请求获得返回json数据
        */
        function getDataByAjaxAsync(param,url,method,async) {
        var $data={};
        $.ajax({
        url : url,
        data : param,
        method : method,
        dataType : 'json',
        async : async,
        success : function(data) {
        $data.data = data;
        }
        });
        return $data.data;
        }

        function showAcarsFixed(obj){
        var cls=" k-fixed";
        var $child=$(".k-fixed").find("[data-dialogId="+obj.id+"]");
        if($child.length>0){
        $child.find(".mCSB_container").html(obj.msg1);
        }else{
        var msg="<div class='f-only' data-dialogId="+obj.id +">"+obj.msg1+"</div>";
        var overlay=alertShow({title:"位置报缺报",content:msg,btnId:".negative",cls:cls,width:"300",mask:false},function(flag){
        if(flag==1){
        $.ajax({
        url:"${ctx}/acarsPosMiss/confirmMsg",
        method:"post",
        data:{reqId:obj.reqId},
        dataType : 'json',
        async:true,
        success:function(){
        },
        error: function(data) {
        showAlert("获取位置报缺报数据失败！","warn");
        }
        });
        }
        });
        $child=$(".k-fixed").find("[data-dialogId="+obj.id+"]");
        $child.mCustomScrollbar({
        axis:"y",
        theme:"2d",
        autoHideScrollbar:false
        });
        var $dialog=$child.closest(".k-fixed");
        var x=$(window).width()-$dialog.width()-20,
        y=$(window).height()-$dialog.height()-20;
        overlay.set('xy',[x,y]);
        }
        }
        function showSP(obj){
        var msg="<div class='f-div'>"+obj.msg1+"</div>"+
        "<div class='s-div'>"+obj.msg2+"</div>";
        var cls=" k-dialog";

        var overlay=alertShow({title:"SP特选报",content:msg,btnId:".negative",cls:cls,width:"320",mask:false},function(flag){
        if(flag==1){
        $.ajax({
        url:"${ctx}/spInfo/insertUserWeather",
        method:"post",
        data:{id:obj.id},
        dataType : 'json',
        async:true,
        success:function(){
        },
        error: function(data) {
        showAlert("获取SP特选报失败！","warn");
        }
        });
        }
        });

        var dialogs=$("body>.k-dialog"),len=dialogs.length;

        var centerX=($(window).width()-dialogs.first().width())/2;
        var centerY=($(window).height()-dialogs.first().height())/2;

        var left=(len-1)%3,
        x=centerX+20*left,
        y=centerY+20*left;
        overlay.set('xy',[x,y]);

        var $dialog=$(".k-dialog");
        $dialog.find(".f-div").mCustomScrollbar({
        axis:"y",
        theme:"2d",
        autoHideScrollbar:false
        });
        $dialog.find(".s-div").mCustomScrollbar({
        axis:"y",
        theme:"2d",
        autoHideScrollbar:false
        });
        }

        var maskObj;
        BUI.use(["bui/calendar","bui/overlay","bui/mask"],function(Calendar,Overlay,Mask){
        maskObj=Mask;
        console.log(maskObj)
        var datepicker=new Calendar.DatePicker({
        trigger:"#fltDate",
        dateMask:"yyyy-mm-dd",
        elCls:"no-clear",
        autoRender:true
        });
        datepicker.on("selectedchange",function(ev){
        query();
        });
        $(function () {
        $('#fltDate').val(convertTime(new Date(),1));
        getSift();
        var topbarsH=$(".timePoint")[0].getBoundingClientRect().bottom,
        topH=$(".timePoint")[0].getBoundingClientRect().top;
        $("#shrink").css("top",topH);
        $("#aircraft_nos").css("top",topbarsH);
        initScroll();
        $(window).resize(function () {
        setBoxHW();
        });
        addAutoFresh();
        if("1"=="${spAuthority}"){//判断该席位是否具有特选报提醒的权限
        autoFreshSP();
        }
        autoFreshAcars();
        //initMessageNumber();
        selectSystemMessage();
        autoFreshUsers();
        messageNumber();
        checkList();

        query();
        timeScale(get_date(globalObj.start_time, 1));

        $(".filters").on("mouseenter mouseleave",function(event){
        var $el=$(".icon-fm014").next();
        if(event.type==="mouseenter"){
        if(!$el.hasClass("isShift")){
        return;
        }
        var arrStr=$('#newSifts').text().split("@");
        var oriAirport=arrStr[1];
        var	arrAirport=arrStr[2];
        var msg="";
        var re=new RegExp(",","g");
        if(!isValid(oriAirport) ){
        msg="<li><span>起飞机场:</span><span>"+oriAirport.replace(re,"、")+"</span></li>";
        }
        if(!isValid(arrAirport)){
        msg+="<li><span>降落机场:</span><span>"+arrAirport.replace(re,"、")+"</span></li>";
        }
        if(msg){
        showTips("acno_hover",msg,event);
        }
        }else{
        hideTips();
        }
        });

        $('#addFlight').on('click',function(){
        $.ajax({
        url:"addFlight",
        method:"post",
        data:{
        adjustPlanId :"",
        planType:"0"
        },
        dataType : "html",
        async:true,
        success:function(data){
        $('#right_dialog').html(data);
        },
        error:function(){
        showAlert("新增航班操作失败！","error");
        }
        });
        });

        $(".hasoption>div").on("mouseenter mouseleave",function(event){
        var $next=$(this).parent().next(),
        right=this.getBoundingClientRect().right;
        if(event.type==="mouseenter"){
        if($(window).width()<right+$next.width()){
        $next.addClass("options-left");
        }else{
        $next.removeClass("options-left");
        }
        var top=$(this).position().top;
        $next.css("top",top+'px').show();
        }else{
        $next.hide();
        }
        });
        $(".options").on("mouseenter mouseleave",function(event){
        var $pre=$(this).prev().children("div");
        if(event.type==="mouseenter"){
        $pre.addClass("divhover");
        $(this).show();
        }else{
        $pre.removeClass("divhover");
        $(this).hide();
        }
        });

        //消息提示
        $(".message li").click(function(){
        var $this = $(this);
        var $id=$this.attr('id');
        var $index = $this.index();
        initMessageQuery($id,$index);
        });
        $(".message li").hover(
        function(){},
        function(){$(this).attr("data_flag","0");$(".msg_detail").hide();}
        );
        function initMessageQuery(liid,index){
        $(".message>li").css("cursor","wait");
        var $details=$(".msg_detail");
        var urlStr="";
        if(liid=='liqListSize'){
        urlStr="${ctx}/queryMessage/selectQueryMessage";

        }else if(liid=='liaListSize'){
        urlStr="${ctx}/adjustMessage/selectAdjustMessage";

        }else if(liid=='liwListSize'){
        urlStr="${ctx}/queryWeather/selectQueryWeather";

        }else if(liid=='lisListSize'){
        urlStr="${ctx}/systemMessage/selectSystemMessage";

        }else{
        return false;
        }
        $details.removeClass().addClass("msg_detail itemhover"+index);
        $.ajax({
        url:urlStr,
        method:"post",
        dataType : 'json',
        data: {index:liid},
        async:true,
        success:function(data){
        initMessageNumber();
        date=data;
        $(".message>li").css("cursor","auto");
        var id="msg_tmpl1",size=0;
        var render_msg = "";
        if(liid=='liqListSize'){
        id="msg_tmpl1";
        var count = data[data.length-1].qCount;
        size=count;
        date=data.pop();
        }else if(liid=='liaListSize'){
        id="msg_tmpl2";
        var count = data[data.length-1].aCount;
        size=count;
        date=data.pop();
        }else if(liid=='liwListSize'){
        id="msg_tmpl3";
        var count = data[data.length-1].wCount;
        size=count;
        date=data.pop();
        }else if(liid=='lisListSize'){
        id="msg_tmpl4";
        var count = data[data.length-1].sCount;
        size=count;
        date=data.pop();
        }
        data.size=size;
        render_msg=doT.template(document.getElementById(id).innerHTML);
        html_msg = render_msg(data);
        $(".msg_detail").html(html_msg).show();

        ///消息修改时调用
        queryMessageUpdate();

        //调整通知修改时调用
        adjustMessageUpdate();

        //气象消息修改时调用
        queryWeatherUpdate();

        //系统消息修改时调用
        //systemMessageUpdate();

        //显示的DIV
        setMsgH($details);

        //调用查看历史记录 1：查看消息
        viewingHistory("queryMessage",1);
        //调用查看历史记录 2：查看调整通知
        viewingHistory("adjustMessage",2);
        //调用查看历史记录 3：查看气象消息
        viewingHistory("queryWeather",3);
        //调用查看历史记录 4：查看系统消息
        viewingHistory("systemMessage",4);
        },

        error:function(){
        $(".message>li").css("cursor","auto");
        }
        });
        };

        $(".msg_detail").on("mouseenter mouseleave",function(event){
        var cls=$(this).attr("class"),
        index=cls.substr(cls.indexOf("itemhover")+9,1),
        $children=$(".message").children();
        if(event.type==="mouseenter"){
        $(this).show();
        $children.eq(index).addClass("itemhover");
        }else{
        $(this).hide();
        $children.eq(index).removeClass("itemhover");
        }
        });

        //消息点击 确认点击事件获取当前的Id修改数据
        function queryMessageUpdate(){
        $(".qListClass").click(function(){
        $(".qListClass").css("cursor","wait");
        var value=$(this).attr('value');
        var type=$(this).siblings().attr('data-type');
        var date = {
        id : value,
        type:type
        };

        //点击确认调用修改
        clickUpdate(date,"${ctx}/queryMessage/update","qListSize","qListSizeSpan","msg_tmpl1","qListClass");
        });
        $(".flightClass").click(function(){
        var flightId=$(this).attr("data-dayflightid");
        searchDayFlightId(Mask,flightId);
        });

        $(".clearfixClass").click(function(){
        var flightno=$(this).text();
        var flight=flightno.substr(2,flightno.length);
        searchByFlight(flight,Mask);
        });

        };

        //调整通知 点击 确认点击事件获取当前的Id修改数据
        function adjustMessageUpdate(){
        $(".aListClass").click(function(){
        $(".aListClass").css("cursor","wait");
        var value=$(this).attr('value');
        var date = {
        usid : value
        };
        //点击确认调用修改
        clickUpdate(date,"${ctx}/adjustMessage/update","aListSize","aListSizeSpan","msg_tmpl2","aListClass");
        });
        };

        //气象消息 点击 确认点击事件获取当前的Id修改数据
        function queryWeatherUpdate(){
        $(".wListClass").click(function(){
        $(".wListClass").css("cursor","wait");
        var value=$(this).attr('value');
        var date = {
        id : value
        };
        //点击确认调用修改
        clickUpdate(date,"${ctx}/queryWeather/update","wListSize","wListSizeSpan","msg_tmpl3","wListClass");
        });
        };

        //系统消息 点击 确认点击事件获取当前的Id修改数据
        function systemMessageUpdate(){
        $(".sListClass").click(function(){
        $(".sListClass").css("cursor","wait");
        var value=$(this).attr('value');
        var date = {
        usid : value
        };
        //点击确认调用修改
        clickUpdate(date,"${ctx}/systemMessage/update","sListSize","sListSizeSpan","msg_tmpl4","sListClass");
        });
        };

        /*
        *点击确认调用修改
        */
        function clickUpdate(date,url,labClass,spanLabClass,msg_tmpl,listClass){
        $.ajax({
        url:url,
        method:"post",
        dataType : 'json',
        data: date,
        async:true,
        success:function(data){
        $("."+listClass).css("cursor","auto");
        if(data.success !=null && data.success =="success"){
        //initMessageNumber();
        var size=data.numberHide;
        $("."+labClass).html(size);

        if(size.aCount==0){
        $("."+labClass).hide();
        }else{
        $("."+labClass).show();
        }
        var render_msg=doT.template(document.getElementById(msg_tmpl).innerHTML);

        data.list.pop();
        var Date = data.list;
        html_msg = render_msg(Date);
        $(".msg_detail").html(html_msg);
        setMsgH($(".msg_detail"));
        $(".msg_detail").show();
        $("#"+spanLabClass).html("（"+data.number+"）");
        if(msg_tmpl=="msg_tmpl1"){
        //消息修改时调用
        queryMessageUpdate();
        //调用查看历史记录 1：查看消息
        viewingHistory("queryMessage",1);
        }else if(msg_tmpl=="msg_tmpl2"){
        //调整通知修改时调用
        adjustMessageUpdate();
        //调用查看历史记录 2：查看调整通知
        viewingHistory("adjustMessage",2);
        }else if(msg_tmpl=="msg_tmpl3"){
        //气象消息修改时调用
        queryWeatherUpdate();
        //调用查看历史记录 3：查看气象消息
        viewingHistory("queryWeather",3);
        }else if(msg_tmpl=="msg_tmpl4"){
        //系统消息修改时调用
        //	systemMessageUpdate();
        //调用查看历史记录 4：查看系统消息
        viewingHistory("systemMessage",4);
        }else{
        return false;
        }
        }else if(data.success !=null && data.success =="fail"){
        showAlert("确认消息操作失败！","error");
        }
        },
        error:function(){
        $("."+listClass).css("cursor","auto");
        }
        });
        }

        $(".dropdown").on("click",".button,li",function(event){
        var $ul=$(".dropdown-menu"),
        text=$(".dropdown .text");
        if($(this).hasClass("button")){
        if($ul.is(":visible")){
        $ul.slideUp();
        }else{
        $ul.slideDown("fast");
        }
        }else{
        text.html($(this).children("span").html());
        $ul.hide();
        }
        });


        //点击调配方案打开方式
        $('.myAdjustPlan').bind('click',function(){

        //新打开一个页面
        /*var iTop=(screen.availHeight-619)/2;
        var iLeft=(screen.availWidth-820)/2;
        window.open("${ctx}/fltDeployment/getMyAdjustPlan",'','width=820,height=619,top='+iTop+',left='+iLeft);
        */
        //dialog方式打开
        $.ajax({
        url:"${ctx}/fltDeployment/getMyAdjustPlan",
        method:"post",
        dataType : "html",
        async:true,
        success:function(data){
        $('#right_dialog').html(data);
        },
        error:function(){
        showAlert("右键菜单失败！","error");
        }
        });
        });

        });

        $('#fltDeploymentBtn').click(function(){
        window.open("${ctx}/fltDeployment?dealBs=2");
        });

        });

        //查询出全部消息的未读
        function selectQueryMessage(){
        var StrSize="";
        $.ajax({
        url:"${ctx}/queryMessage/selectQueryMessage",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        StrSize=data;
        }
        });
        return StrSize;
        };

        //查询出全部调整通知的未读
        function selectAdjustMessage(){
        var StrSize="";
        $.ajax({
        url:"${ctx}/adjustMessage/selectAdjustMessage",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        StrSize=data;
        }
        });
        return StrSize;
        }

        //查询出全部气象消息的未读
        function selectQueryWeather(){
        var StrSize="";
        $.ajax({
        url:"${ctx}/queryWeather/selectQueryWeather",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        StrSize=data;
        }
        });
        return StrSize;
        };

        //查询出全部系统消息的未读
        function selectSystemMessage(){
        var strSize="";
        $.ajax({
        url:"${ctx}/systemMessage/selectSystemMessage",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        strSize=data;
        }
        });
        return strSize;
        };

        //调用点击的查看历史记录
        function viewingHistory(id,index){
        $('#'+id).click(function(){
        if(index==1){
        //打开消息
        window.open("${ctx}/queryMessage",'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
        }else if(index==2){
        //打开调整通知消息
        window.open("${ctx}/adjustMessage",'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
        }else if(index==3){
        //打开气象消息
        window.open("${ctx}/queryWeather",'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
        }else if(index==4){
        //打开系统消息
        window.open("${ctx}/systemMessage",'toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
        }
        });
        }
        //获取未确认的sp气象报文
        function getWeatherInfo(){
        $.ajax({
        url:"${ctx}/spInfo/spAlert",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        insertReadsSysmonitor("spInfo_spAlert_"+1+"分钟","1");
        if(!isValid(data)&& data.length>0){
        for(var i=0;i<data.length;i++){
        var spInfo=data[i];
        showSP({msg1:spInfo.content,msg2:spInfo.flightnos,id:spInfo.id});
        }
        }
        },
        error: function(data) {
        insertReadsSysmonitor("spInfo_spAlert_"+1+"分钟","-1");
        showAlert("获取sp特选报失败！","warn");
        }
        });
        }

        /**
        *获取超时的检查单提醒
        */
        function getCheckList(){
        $.ajax({
        url: "${ctx}/handleCheckList/queryHandleCheckListOvertime",
        dataType : 'json',
        async : true,
        success : function(data){
        if(typeof($(".getCheckList").html())=="undefined"){
        if(data!=null && data.length!=0 && data!=''){
        var msg="";
        msg+="<table>";
        for(var i = 0;i<data.length;i++){
        msg+="<tr style='border-bottom:1px solid #999;'><td style='line-height:23px;width:80%;text-align:left;padding:5px 0;font-size: 12px;'>"+data[i].flightNo+" "+data[i].flightDate+" "+data[i].cName+"，已进行"+data[i].planName+"，检查单已超时，请尽快完成.</td><td style='width:20%;line-height:23px;padding:5px 0;font-size: 12px;'><a onclick='initHandleCheckList("+data[i].adjustPlanId+","+data[i].flightId+");'>详情</a></td></tr>";
        }
        msg+="</table>"
        var cls=" getCheckList";
        overlay=alertShow(
        {
        title:"检查单超时未完成",
        content:msg,
        dblclick:".negative",
        btnId2:".positive",
        cls:cls,width:"420",
        height:"280",
        mask:false
        }
        ,function(flag){

        });


        var $dialog=$(".getCheckList")
        var x=$(window).width()-$dialog.width()-20,
        y=$(window).height()-$dialog.height()-20;
        overlay.set('xy',[x,y]);
        $(".bui-stdmod-body").mCustomScrollbar({
        axis:"y",
        theme:"3d",
        scrollInertia:0,
        mouseWheel:{scrollAmount:32},
        autoHideScrollbar:true
        }).find(".mCSB_container").css("margin-right","8px");
        }
        }
        },
        error : function (){
        //showAlert();
        }
        });
        }

        //位置报缺报提醒
        function acarsPosMissAlert(){
        $.ajax({
        url:"${ctx}/acarsPosMiss/acarsPosMissAlert",
        method:"post",
        dataType : 'json',
        async:true,
        success:function(data){
        insertReadsSysmonitor("acarsPosMiss_acarsPosMissAlert_"+1+"分钟","1");
        if(!isValid(data)&& data.length>0){
        for(var i=0;i<data.length;i++){
        var acarsInfo=data[i];
        showAcarsFixed({
        msg1:acarsInfo.alertInfo,
        reqId:acarsInfo.reqId,
        id:acarsInfo.dayFlightId
        });
        }
        }
        },
        error: function(data) {
        insertReadsSysmonitor("acarsPosMiss_acarsPosMissAlert_"+1+"分钟","-1");
        showAlert("获取位置报缺报航班失败！","warn");
        }
        });
        }

        //查询出消息数量
        function initMessageNumber(){
        $.ajax({
        url:"${ctx}/systemMessage/selectAcountQcountWcountScountNumber",
        method:"post",
        dataType : 'text',
        async:true,
        success:function(data){
        insertReadsSysmonitor("systemMessage_selectAcountQcountWcountScountNumber_"+1+"分钟","1");
        var listSize=data.split(":");
        //加载消息数量
        if(listSize[0]==0){
        $(".qListSize").hide();
        }else{
        $(".qListSize").html(listSize[0]);
        $(".qListSize").show();
        }

        //加载调整通知数量
        if(listSize[1]==0){
        $(".aListSize").hide();
        }else{
        $(".aListSize").html(listSize[1]);
        $(".aListSize").show();
        }

        //加载气象消息数量
        if(listSize[2]==0){
        $(".wListSize").hide();
        }else{
        $(".wListSize").html(listSize[2]);
        $(".wListSize").show();
        }

        //加载系统消息数量
        if(listSize[3]==0){
        $(".sListSize").hide();
        }else{
        $(".sListSize").html(listSize[3]);
        $(".sListSize").show();
        }
        },
        error: function(){
        insertReadsSysmonitor("systemMessage_selectAcountQcountWcountScountNumber_"+1+"分钟","-1");
        showAlert("获取消息失败！","warn");
        }
        });
        }

        //初始化待审批的调配单详情
        function initDraft(msgFromId){
        openPostWindow("${ctx}/draft/queryDetailList2", {"adjustPlanId":msgFromId}, "approval"+msgFromId);
        }

        //初始化待处理的检查单详情
        function initHandleCheckList(msgFromId,flightId){
        openPostWindow("${ctx}/handleCheckList/toHandleDetailPage",{
        adjustPlanId : msgFromId,
        flightId : flightId
        },"_blank");
        }

        //初始化次日详情
        function initPostCheckList(posCode,msgFromId){
        openPostWindow("${ctx}/postCheckList/toPage",{"posCode":posCode,"plnCheckId":msgFromId},"_blank");
        }

        //初始化次日发送PLN报详情
        function initPostCheckListPln(msgFromId){
        openPostWindow(ctx+"/flightCheckList/toPLNPage",{"id":msgFromId},"_blank");
        }

        //监听页面是否超时
        function checkUsers(){
        $.ajax({
        url:"${ctx}/monitor/checkUsers",
        method:"post",
        dataType : 'text',
        async:true,
        success:function(data){
        insertReadsSysmonitor("monitor_checkUsers_"+0.05+"分钟","1");
        },
        error: function(jqXHR, textStatus, errorThrown){
        insertReadsSysmonitor("monitor_checkUsers_"+0.05+"分钟","-1");
        var _self=this;
        switch(jqXHR.status){
        case 500 :
        case 400 :
        var resText=jqXHR.responseText;
        var errorInfo=$.parseJSON(resText);
        showAlert(errorInfo.errorCode+':'+errorInfo.errorMsg,"error");
        break;
        case 0:
        showAlert("长时间未操作，自动重新登录","error");
        parent.window.location.reload();
        break;
        default:
        //showAlert("系统未知错误！错误码为【"+jqXHR.status+"】，错误 描述为：【"+textStatus+"】","error");

        }
        if(_self.fail){
        _self.fail(jqXHR, textStatus, errorThrown);
        }
        }
        });
        }

        document.addEventListener("mousedown",function(ev){
        if(ev.button===1){
        ev.preventDefault();
        }
        });

        //重新加载
        function btnSearchPS(){
        //initMessageNumber();
        }

        </script>
        </body>

        </html>