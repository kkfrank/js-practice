(function(global){
    var Events=function(){
        this.clientLit={}
    };
    Events.prototype={
        constructor:Events,
        on:function(type,fn){
            if(!this[type]){
                this[type]=[]
            }
            this[type].push(fn)
        },
        fire:function(){
            var type=[].shift.call(arguments)
            // console.log(type,arguments)
            var fns=this[type];
            if(!fns || fns.length===0){
                return false;
            }
            for(var i= 0,fn;fn=fns[i++];){
                fn.apply(null,arguments)
            }
        }
    }
    function TreeLoading(el){
        this.el=el
        this.init()
    }
    TreeLoading.prototype={
        init:function(){
            var html=' <div class="tree-loading" style="display: none;">'
                            +'<p>加载中...</p>'
                    '</div>'
            $(this.el).append(html)
        },
        show:function(){
            $(this.el).find('.tree-loading').show()
        },
        hide:function(){
            $(this.el).find('.tree-loading').hide()
        }
    }
    function fetch(options){
      //  var callback=options.callback || function(){}
        var loading=options.loading
        loading.show()
        $.ajax({
            type:options.type || "GET",
            url:options.url,
            data:options.data,
        /*    beforeSend:function(){
                console.log('12')
                return options.validator()
            },*/
            success:function(data){
                loading.hide()
                if(data.code!=200){
                    console.error(data.msg)
                    return
                }
               // console.log("success")
                options.success(data)
                //callback(data)
            },
            error:function(error){
                loading.hide()
                console.log(error)
               // options.error(error)
               // callback(data)
            }
        })
    }
    var Tree=function(options){
        var defaultOps={
            checkType:"none"
        }
        for(var i in defaultOps){
            if(!options[i]){
                options[i]=defaultOps[i]
            }
        }
        this.options=options
        this.el=$(options.render)[0]
        this.data=options.data
        this.checkType=options.checkType

        this.events=new Events()

        this.loading=new TreeLoading(this.el)//loading框

        this.rightClickId=null//此时右键点击元素的id
        this.rightClickType=null//点击了那个右键功能
        this.init()
    }
    function _getRecordById(data,id){
        for(var i= 0,len=data.length;i<len;i++){
            if(data[i].ppId===id){
                return data[i]
            }
            if(data[i].children && data[i].children.length>0){
                var record= _getRecordById(data[i].children,id)
                if(record){
                    return record
                }
            }
        }
    }
    function _sortByNum(data){
        data.sort(function(a,b){
            return a.sortNum- b.sortNum
        })
        for(var i= 0,len=data.length;i<len;i++){
            if(data[i].children && data[i].children.length>0){
                _sortByNum(data[i].children)
            }
        }
    }
    Tree.prototype={
        constructor:Tree,
        init:function(){
            this.sortByNum()
            this.renderTree()
        },
        sortByNum:function(){
            if(this.data[0].sortNum==null){//不排序
                return
            }
            _sortByNum(this.data)
        },
        renderTree:function(){
            // function _render(data,checkType,level,isexpanded,isroot){
           // var html=_render(this.data,this.checkType,1,false,true)
            this.asyncLoadFn(0)//第一次传0
    /*        var html=_render({
                data:this.data,
                checkType:this.checkType
            })
            $(this.el).append(html)*/
            this.addEvent()
        },
        updateTree:function(id,data){

        },
        expandNode:function(node){
            console.log(node)
            if($(node).children('ul').length>0){
                $(node).addClass('tree-item-expanded')
            }
        },
        getRecordById:function(id){//通过id，查找这条数据的所有信息
            var data=this.data
            return _getRecordById(data,id)
        },
        asyncLoadFn:function(id){
          //function _render(data,checkType,level,isexpanded,isroot){
            var that=this
            fetch({
                url:that.options.load.url,
                type:that.options.load.type,
                loading:that.loading,
                data:{
                    ppId:id//record.ppId,//id
                },
                success:function(data){//后台返回成功后的回调
                    var html=_render({
                        data:data
                    })
                    if(id===0){//首次加载
                        $(that.el).append(html)
                    }else{
                        var $clickEl=$('[data-id='+id+']')//右键点击哪个元素
                        $clickEl.append(html)
                    }
                    //that.options.rename.callback && that.options.rename.callback()
                }
            })
        },
        renameFn:function(val,inputEl){
            var that=this
            inputEl.onblur=null
            $(inputEl).siblings("a").show().end().remove()
            if(val===""){
                console.error('不能为空')
                return
            }
            //var record=that.getRecordById(that.rightClickId)
           /* if(record.ppName===val){
                console.error('未修改')
                return
            }*/
            fetch({
                url:that.options.rename.url,
                type:that.options.rename.type,
                loading:that.loading,
                data:{
                    ppId:this.rightClickId,//record.ppId,//id
                    processName:val
                },
                success:function(data){//后台返回成功后的回调
                    _partRender('rename',val,that.rightClickId)
                    that.options.rename.callback && that.options.rename.callback()
                }
            })
        },
        disableFn:function(notDisable,$el){//1是可用  0是禁用
            var that=this
           // var record=this.getRecordById(this.rightClickId)

            fetch({
                url:this.options.disable.url,
                type:this.options.disable.type,
                loading:this.loading,
                data:{
                    ppId:this.rightClickId,//id
                    ppEnable:notDisable
                },
                success:function(data){//后台返回成功后的回调
                    if(notDisable===1){//可用
                        $el.removeClass('disable')
                        $el.find('li').removeClass('disable')
                    }else{
                        $el.addClass('disable')
                        $el.find('li').addClass('disable')
                    }
                    //_partRender(data)
                    that.options.rename.callback && that.options.rename.callback()
                }
            })
        },
        insertFn:function(val,inputEl){
            inputEl.onblur=null
            $(inputEl).parent().remove()

            var that=this
           // var record=this.getRecordById(this.rightClickId)
            var $clickEl=$('[data-id='+that.rightClickId+']')//右键点击哪个元素
            if(!$.trim(val)){//为空
                return
            }
            var flag;// 1上方 0下方  -1:子节点
            if(that.rightClickType==="add-top"){
                flag=1
            }else if(that.rightClickType==="add-bottom"){
                flag=0
            }else if(that.rightClickType==="add-folder"){
                flag=-1
            }
            fetch({
                url:that.options.insert.url,
                type:that.options.insert.type,
                loading:that.loading,
                data:{
                    //ppId:record.ppId,//id
                    ppId:that.rightClickId,
                    ppName:val,
                    nodePath:_levelDeep($clickEl),
                    flag:flag
                },
                //data:that.options.insert.data,
                success:function(data){
                    //_partRender('add',data,that.rightClickId,which,that.checkType)
                    _partRender('add',data.node,that.rightClickId,flag,that.checkType)
                    that.options.insert.callback()
                }
            })
        },
        dragFn:function(){
          fetch({

          })
        },
        addRightClick:function(){//添加右键事件
            var that=this
            var html='<div class="tree-right-menu" style="display: none;">'
                        +'<ul>'
                            +'<li>增加'
                            +'<ul class="second-menu" style="display: none;">'
                                +'<li  data-type="add-top">在上方添加</li>'
                                +'<li  data-type="add-bottom">在下方添加</li>'
                                +'<li  data-type="add-folder">子文件夹</li>'
                            +'</ul>'
                            +'</li>'
                            +'<li data-type="export">导出</li>'
                            +'<li data-type="disable">禁用</li>'
                            +'<li>复制'
                                +'<ul class="second-menu" style="display: none;">'
                                    +'<li data-type="copy-only">页面</li>'
                                    +'<li data-type="copy-all">包括子文件夹</li>'
                                +'</ul>'
                            +'</li>'
                            +'<li data-type="paste" class="disable">粘贴</li>'
                            +'<li data-type="rename">重命名</li>'
                        +'</ul>'
                    +'</div>'
            if($(".tree-right-menu").length===0){
                $(document.body).append(html)
            }
            $(".tree-right-menu>ul>li").on('mouseenter mouseleave',function(ev){
                if(ev.type==='mouseenter'){
                    $(this).children('ul').show()
                }else{
                    $(this).children('ul').hide()
                }
            })
            $(".tree-right-menu").on("click","[data-type]",function(ev){
              /*  $('.tree-right-menu .second-menu').hide()
                $(this).children('ul').show()*/
                var type=ev.target.getAttribute('data-type')
                that.rightClickType=type
                var $clickEl=$('[data-id='+that.rightClickId+']')//右键点击哪个元素

              /*  if(type!=="disable" && ($clickEl.hasClass('disable') || $clickEl.closest('.disable').length>0)){//禁用
                    console.log('禁用')
                    return
                }*/
               // console.log($clickEl.closest('.disable'))
            /*    if($clickEl.parent().closest('.disable').length>0){//禁用
                    $('.tree-right-menu').hide()
                    console.log('父节点被禁用')
                    return
                }*/
                //如果父节点被禁用，则不可以所有操作，或者如果本节点被禁用，除了disable，其他都不可操作
                if($clickEl.parent().closest('.disable').length>0 || $clickEl.hasClass('disable') && type!=="disable" ){//禁用
                     console.log('节点禁用')
                     return
                 }
                //alert(type)
                if(type==='disable'){
                    $('.tree-right-menu').hide()
                    if($clickEl.hasClass('disable')){//取消禁用
                        that.disableFn(1,$clickEl)
                    }else{//禁用
                        that.disableFn(0,$clickEl)
                    }

                   // $clickEl.toggleClass('disable')
                   // $clickEl.find('li').toggleClass('disable')
                }else if(type==='rename'){
                    $('.tree-right-menu').hide()
                    var record=that.getRecordById(that.rightClickId)
                    var input=document.createElement('input')
                    input.type='text'
                    input.className="tree-input-rename"
                    input.value=$clickEl.children('a').text()
                    //input.value=record.ppName
                    input.onblur=function(){
                        that.renameFn(this.value,this)
                    }
                    $('[data-id='+that.rightClickId+']').children('a').hide().after(input)//.focus()
                    $(input).focus()
                }else if(type.indexOf('add-')>=0){
                    $('.tree-right-menu').hide()
                    var $li=$('[data-id='+that.rightClickId+']')
                    that.expandNode($li)
                    //'add-top'   'add-bottom'  'add-folder'

                    var $newLi=$('<li></li>')
                    $newLi[0].className=$li[0].className
                    $newLi.append('<input type="text" class="tree-input-add"/>')
                    var which=type.split('add-')[1]
                    if(which==="top"){
                        $($li).before($newLi)
                    }else if(which==="bottom"){
                        $($li).after($newLi)
                    }else if(which==="folder"){
                        $($li).children('ul').append($newLi)
                    }
                    $newLi.children('input')[0].focus()
                    $newLi.children('input')[0].onblur=function(){
                        that.insertFn(this.value,this)
                    }
/*
                    var data={id:"7777777",text:"newwwwwww",level:3}
                    setTimeout(function(){
                        _partRender(that.rightClickId,'add',data,which,that.checkType)
                    },1000)*/
                }else if(type.indexOf('copy-')>=0){
                    $('.tree-right-menu').hide()
                    $('.tree-right-menu .disable').removeClass('disable')
                    var which=type.split('copy-')[1]
                    if(which==='only'){

                    }else if(which==='all'){

                    }
                }
            })


            $(document).on("keypress",".tree-input-rename",function(ev){
                if(ev.keyCode===13){//回车
                    that.renameFn(this.value,this)
                }
            })
            $(document).on("keypress",".tree-input-add",function(ev){
                if(ev.keyCode===13){//回车
                    that.insertFn(this.value,this)
                }
            })
            $(that.el).on("contextmenu",".tree-input-rename,.tree-input-add,",function(ev){
                return false
            })

            $(document).on('click',function(ev){
                if($(ev.target).closest('.tree-right-menu').length===0){
                    $(".tree-right-menu").hide()
                   // $('.second-menu').hide()
                }
            })
            $(this.el).on('contextmenu',"li",function(ev){
                ev.preventDefault()
                ev.stopPropagation()
                var x=ev.clientX
                var y=ev.clientY

                var $rightDis=$('.tree-right-menu [data-type=disable]')
                if($(this).hasClass('disable')){
                    $rightDis.html('可用')
                }else{
                    $rightDis.html('禁用')
                }
                $(".tree-right-menu").css({left:x,top:y}).show()
                that.rightClickId=this.getAttribute('data-id')

            })
            var dragElArr
            $(this.el).on('dragstart',"li",function(ev){//ev.preventDefault()时，不可以拖动
                var $liNodes=$('.sui-tree').find('a.on').parent('li')
                if($liNodes.length<=1){//单选或者没有选择，只拖动了一个，
                    dragElArr=[this]
                }else{//多选
                    if($(this).children('a.on').length===0){//多选了，但是被拖动的元素并没有被选中,不执行拖动
                        console.log('请拖动所选择的的元素')
                        ev.preventDefault()
                    }else{
                        dragElArr=$liNodes
                    }
                }
           /*     if($liNodes.length>=2 && $(this).children('a.on').length===0){//多选了，但是被拖动的元素并没有被选中
                    ev.preventDefault()
                }*/
                ev.stopPropagation()
            })
            $(this.el).on('dragover',"li",function(ev){//设置li可以放置
                ev.preventDefault()
            })
            $(this.el).on('drop',"li",function(ev){
              //  var $liNodes=$('.sui-tree').find('a.on').parent('li')
           /*     console.log(dragElArr)
                if($liNodes.length<=1){//只拖动了一个元素
                    console.log('没有选择拖动元素')
                    return;
                }
                if($liNodes.length===0){//没选择拖动元素
                    console.log('没有选择拖动元素')
                    return;
                }*/
                var dropDeep=_levelDeep(this)
                for(var i= 0,len=dragElArr.length;i<len;i++){
                    if(dropDeep!==_levelDeep(dragElArr[i])){
                        console.error('拖动的元素和被放置的元素必须是同一层级')
                        ev.preventDefault()
                        return false
                    }
                }
                console.log('放置的元素',this)
                console.log('拖动的元素',dragElArr)
                ev.stopPropagation()
            })
        },
        addEvent:function(){
            var that=this
            this.addRightClick();
            $(this.el).on('click',".tree-icon-expander,.tree-icon-checkbox,a",function(ev){
                if($(this).hasClass("tree-icon-expander")){//收缩展开
                    if($(this).siblings('ul').length===0){//如果没有子节点 ，则异步加载子节点
                        var id=$(this).parent('li').attr('data-id')
                        that.asyncLoadFn(id)
                    }
                    $(this).parent().toggleClass("tree-item-expanded")
                }else if($(this).hasClass("tree-icon-checkbox")){//勾选框
                    //$(this).toggleClass("on")
                    if($(this).hasClass("on")){//取消选择,自己和他的上下级元素都取消
                        $(this).removeClass("on")
                        $(this).siblings("ul").find(".tree-icon-checkbox").removeClass("on")//下级元素
                        $(this).closest('ul').parents("li").children(".tree-icon-checkbox").removeClass("on")//上级元素
                    }else{//选择 自己选择，子孙节点选择，如果本一级的所有元素都选择了，则勾选上一级的选择，递归到最上面
                        $(this).addClass("on")
                        $(this).siblings("ul").find(".tree-icon-checkbox").addClass("on")//子孙节点选择

                        var nowNode=this
                        while(_isLevelAllChecked(nowNode)){
                            nowNode= _checkParent(nowNode)
                            if(!nowNode){//没有父节点
                                return
                            }
                        }
                    }
                }else if(this.tagName==="A"){
                    $(this).toggleClass("on")
                    var thatA=this
                    if(ev.ctrlKey){//多选

                    }else{
                        $('.sui-tree').find('a.on').each(function(i,el){
                            if(el!==thatA){
                                $(el).removeClass("on")
                            }
                        })
                    }
                }
            })
        }
    }
    //获取节点的深度 最小为1
    function _levelDeep(node){
        var level=0
        while($(node).length>0){
            level++
            node=$(node).parent('ul').parent('li')
        }
        return level
    }
    //本级节点是否都全选
    function _isLevelAllChecked(node){
        var isAllChecked=true
        $(node).parent().siblings("li").children('.tree-icon-checkbox').each(function(index,ele){
            if(!$(ele).hasClass("on")){
                isAllChecked=false
                return false
            }
        })
        return isAllChecked
    }
    //勾选父节点,返回父节点的checkbox
    function _checkParent(node){
        var $checkbox=$(node).closest('ul').siblings('.tree-icon-checkbox').addClass('on')
        if($checkbox.length==0){
            return false
        }
        return $checkbox
    }

    /**
     * id:右键操作的是哪个li的id
     * type add：新增,rename:重命名
     * dir:1上方 0下方  -1:子节点
     */

    function _partRender(type,data,id,dir,checkType){
        var $li=$('[data-id='+id+']')
        var html="",clsName=""
        if(type==="add"){//新增
            if(checkType==="all"){
                clsName+=" show-check"
            }
            if(data.ppLevel===3){//第三级是叶子节点
                clsName+=' last-item'
                html+='<li class="'+clsName+'" data-id='+data.ppId+'>'+
                    '<span class="tree-icon-checkbox"></span>'+
                    '<a>'+data.ppName+'</a>'
            }else{
                var expanderCls="tree-icon-expander"
                if(!data.children || data.children.length===0){
                    expanderCls='tree-icon-expander-empty'
                }
                html+='<li class="'+clsName+'" data-id='+data.ppId+'>'+
                    '<span class='+expanderCls+'></span>'+
                    '<span class="tree-icon-checkbox"></span>'+
                    '<span class="tree-icon-folder"></span>'+
                    '<a>'+data.ppName+'</a>'
            }
            if(dir=="1"){//在上方添加
              $li.before(html)
            }else if(dir=="0"){//在下方添加
                $li.after(html)
            }else if(dir=="-1"){//在添加子节点
                $li.children('ul').append(html)
            }
          //
        }else if(type==="drag"){//拖动

        }else if(type==="rename"){//重命名
            $li.children('a').html(data)
        }
    }
    function _render(options){
        var data=options.data,
            checkType=options.checkType,
            level=options.level,
            isexpanded=options.isexpanded,
            isroot=options.isroot;

           //data,checkType,level,isexpanded,isroot
        if(!data || level>3){return ""}
        var html='<ul>'

        for(var i= 0,len=data.length;i<len;i++){
            var clsName=""
            if(data[i].expended===true){
                clsName+="tree-item-expanded"
            }
            if(data[i].ppEnable=='0'){//禁用
                clsName+=" disable"
            }
            if(checkType==="all"){
                clsName+=" show-check"
            }
            //if(!data[i].children || data[i].children.length===0){//没有子节点了，说明是叶子节点
              if(data[i].ppLevel==3){//第三级是叶子节点
                    clsName+=' last-item'
                    html+='<li draggable="true" class="'+clsName+'" data-id='+data[i].ppId+'>'+
                          '<span class="tree-icon-checkbox"></span>'+
                          '<a>'+data[i].ppName+'</a>'
            }else{
                  var expanderCls="tree-icon-expander"
                  //if(!data[i].children || data[i].children.length===0){
                  if(data[i].isLeaf==1){
                      expanderCls='tree-icon-expander-empty'
                  }
                html+='<li draggable="true" class="'+clsName+'" data-id='+data[i].ppId+'>'+
                      '<span class='+expanderCls+'></span>'+
                         '<span class="tree-icon-checkbox"></span>'+
                         '<span class="tree-icon-folder"></span>'+
                         '<a>'+data[i].ppName+'</a>'
            }

           // html+=_render(data[i].children,checkType,level+1,false,false)//递归子节点的ul
            html+= '</li>'
        }
        html+= '</ul>'
        return html
    }
    global.Tree=Tree
})(window)