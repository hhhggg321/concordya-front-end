# 一、冒泡与捕获
1.如果冒泡与捕获事件同时存在，冒泡事件与捕获事件哪个先触发？
例子：
``` html
<div id="one">
    <div id="two">
        <div id="three">
            <div id="four"></div>
        </div>
    </div>
</div>
<script type='text/javascript'>
    var one=document.getElementById('one');
    var two=document.getElementById('two');
    var three=document.getElementById('three');
    var four=document.getElementById('four');
    one.addEventListener('click',function(){
        console.log('one bubble');
    },false);
    two.addEventListener('click',function(){
        console.log('two bubble');
    },true);
    three.addEventListener('click',function(e){
        console.log('three bubble');
        if (e.stopPropagation) e.stopPropagation();
    },true);
    four.addEventListener('click',function(){
        console.log('four bubble');
    },false);
</script>
```
结论:
-------
任何发生在     "w3c事件模型"              中的事件，首是进入捕获阶段，直到达到目标元素，再进入冒泡阶段
<br>
2.阻止冒泡
``` html
e.stopPropagation();
```
捕获事件不能阻止，需要通过捕获来到达目标元素
# 二、inline-boloc产生的间隙
1.什么情况下会产生间隙<br>
2.如何解决
[参考链接](http://www.zhangxinxu.com/wordpress/2012/04/inline-block-space-remove-%E5%8E%BB%E9%99%A4%E9%97%B4%E8%B7%9D/)
