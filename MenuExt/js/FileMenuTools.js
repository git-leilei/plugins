    
/** 创建右键菜单构造函数
 * elementId: string 容器的id(在这个区域内实现自定义右键菜单功能)
 * menuItem：Array 订制菜单选项
 *      menuItemName：string 内容
 *      menuItemStyle：Object 样式(可选)
 *      menuItemClick：function 功能
 * menuStyle：Object 订制菜单样式(可选)
 */
function FileMenuTools(elementId, menuItem, menuStyle) {
    this.element = document.getElementById(elementId);
    this.menuItem = menuItem;
    this.menuStyle = menuStyle;
}

// 初始化(功能入口)
FileMenuTools.prototype.init = function () {

    // 获取菜单和菜单项的样式
    var getStyle = this.getStyle();

    // 动态创建菜单结构并设置样式
    this.createElements(getStyle.menuStyle, getStyle.menuItemStyle);
};

//evtTools工具箱封装
FileMenuTools.prototype.evtTools = function () {
        
    return evtTools = {
        //获取事件参数对象
        evt: function (e) {
            return e ? e : window.event;
        },
        //获取元素向上卷曲出去的距离
        top: function () {
            return window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0;
        },
        //获取元素向左卷曲出去的距离
        left: function () {
            return window.pageXOffset || document.body.scrollLeft || document.documentElement.scrollLeft || 0;
        },
        //获取鼠标在可视区域纵坐标
        clientY: function (e) {
            return this.evt(e).clientY;
        },
        //获取鼠标在可视区域横坐标
        clientX: function (e) {
            return this.evt(e).clientX;
        },
        //获取鼠标在任意位置的纵坐标
        Y: function (e) {
            return this.evt(e).pageY ? this.evt(e).pageY : this.top() + this.clientY(e);
        },
        //获取鼠标在任意位置的横坐标
        X: function (e) {
            return this.evt(e).pageX ? this.evt(e).pageX : this.left() + this.clientX(e);
        }
    };
}

// 初始化默认样式、接收用户自定义样式并覆盖默认样式
FileMenuTools.prototype.getStyle = function () {

    // 设置菜单默认样式
    var menuStyle = {
        border: '1px solid rgb(186,186,186)',
        backgroundColor: '#fff',
        position: 'absolute',
        padding: '2px 0',
        margin: 0,
        display: 'none'
    };
    // 用户传入的菜单样式覆盖默认的菜单样式
    if(this.menuStyle != undefined) {
        for(var key in this.menuStyle) {
            menuStyle[key] = this.menuStyle[key];
        }
    }

    // 设置菜单项默认样式
    var menuItemStyle = {
        color: 'black',
        listStyle: 'none',
        padding: '3px 25px 3px 25px',
        fontSize: '12px',
        cursor: 'pointer',
        backgroundColor: 'rgb(235,235,235)'
    };

    // 最终将样式返回
    return {
        menuStyle:menuStyle,
        menuItemStyle:menuItemStyle
    };
};

// 动态创建菜单结构并设置样式
FileMenuTools.prototype.createElements = function (menuStyle, menuItemStyle) {

    // 缓存元素
    var boxObj = this.element;
    // 动态创建ul
    var ulObj = document.createElement('ul');
    // 设置ul样式
    for(key in menuStyle) {
        ulObj.style[key] = menuStyle[key];
    }
    // 将ul添加到容器(boxObj)中
    boxObj.appendChild(ulObj);

    // 根据根据数据动态创建li
    for(key in this.menuItem) {
        var liObj = document.createElement('li');
        liObj.innerHTML = this.menuItem[key].menuItemName;
        // 用户传入的菜单项样式覆盖默认的菜单项样式
        if(this.menuItem[key].menuItemStyle != undefined) {
            for(var newKey in this.menuItem[key].menuItemStyle) {
                menuItemStyle[newKey] = this.menuItem[key].menuItemStyle[newKey];
            }
        }
        // 设置表单项样式
        for(newKey in menuItemStyle) {
            if(newKey == 'backgroundColor') {
                var bgColor = menuItemStyle[newKey];
                continue;
            }
            liObj.style[newKey] = menuItemStyle[newKey];
        }
        // 给li元素注册点击事件
        liObj.onclick = this.menuItem[key].menuItemClick;
        // 将li标签添加到ul中
        ulObj.appendChild(liObj);

        // 设置菜单项移入移出效果
        this.listChange(ulObj, bgColor);
        
        // 设置菜单的显示和隐藏
        this.showMenu(boxObj, ulObj);
    }
}

// 设置li标签移入和移出效果
FileMenuTools.prototype.listChange = function (ulObj, bgColor) {
    // 获取所有的li元素
    var list = ulObj.getElementsByTagName("li");
    for(var i = 0; i < list.length; i++) {
        // 给li元素注册鼠标移入事件
        list[i].onmouseover = function () {
            this.style.backgroundColor = bgColor;
        };
        // 给li元素注册鼠标移出事件
        list[i].onmouseout = function () {
            this.style.backgroundColor = '';
        };
    }
};

// 显示和隐藏右键菜单
FileMenuTools.prototype.showMenu = function (boxObj, ulObj) {

    // 获取evtTools工具箱
    var evtTools = this.evtTools();

    // 取消指定区域默认的右键菜单事件
    boxObj.oncontextmenu = function (e) {
        // 取消默认事件
        window.event ? window.event.returnValue = false : e.preventDefault();
    };

    // 注册指定区域按键抬起事件
    boxObj.onmouseup = function (e) {
        // 取消冒泡
        window.event?window.event.cancelBubble=true:e.stopPropagation();
        // 设置只有鼠标右键点击才会显示菜单
        if(e.button != 2) {
            // 隐藏菜单
            ulObj.style.display = 'none';
            return;
        }
        // 显示菜单
        ulObj.style.display = 'block';
        // 设置菜单出现是的位置
        ulObj.style.left = evtTools.X(e) + 'px';
        ulObj.style.top = evtTools.Y(e) + 'px';
    };

    // 点击任意地方隐藏菜单
    document.onmouseup = function (e) {
        ulObj.style.display = 'none';
    };
};