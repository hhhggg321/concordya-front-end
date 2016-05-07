数组去重
==================================

JavaScript 数组去重经常出现在前端招聘的笔试题里，比如：

 `有数组 var arr = ['a', 'b', 'c', '1', 0, 'c', 1, '', 1, 0]，请用 JavaScript 实现去重函数 unqiue，使得 arr.unique() 返回 ['a', 'b', 'c', '1', 0, 1, '']
作为笔试题，考点有二：`

1. 正确。别小看这个考点，考虑到 JavaScript 经常要在浏览器上运行，在千姿百态的各种浏览器环境下要保障一个函数的正确性可不是一件简单的事。

2. 性能。虽然大部分情况下 JavaScript 语言本身（狭义范畴，不包含 DOM 等延拓）不会导致性能问题，但很不幸这是一道考题，因此面试官们还是会把性能作为一个考点。

Array类型并没有提供去重复的方法，如果要把数组的重复元素干掉，那得自己想办法：

直觉方案
---------
``` html
<script>
function unique() {
  var ret = []
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    if (ret.indexOf(item) === -1) {
      ret.push(item)
    }
  }
  return ret
}
</script>
```
直觉往往很靠谱，在现代浏览器下，上面这个函数很正确，性能也不错。但前端最大的悲哀也是挑战之处在于，要支持各种运行环境。在 IE6-8 下，数组的 indexOf 方法还不存在。


方法1
---------
第一种是比较常规的方法
思路：
1.构建一个新的数组存放结果
2.for循环中每次从原数组中取出一个元素，用这个元素循环与结果数组对比
3.若结果数组中没有该元素，则存到结果数组中

``` html
<script>
Array.prototype.unique1 = function(){
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  var repeat = false;
  for(var j = 0; j < res.length; j++){
   if(this[i] == res[j]){
    repeat = true;
    break;
   }
  }
  if(!repeat){
   res.push(this[i]);
  }
 }
 return res;
}
var arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0]
alert(arr.unique1());
</script>
```

方法2
---------
第二种方法比上面的方法效率要高
思路：
1.先将原数组进行排序
2.检查原数组中的第i个元素 与 结果数组中的最后一个元素是否相同，因为已经排序，所以重复元素会在相邻位置
3.如果不相同，则将该元素存入结果数组中

``` html
<script>
Array.prototype.unique2 = function(){
 this.sort(); //先排序
 var res = [this[0]];
 for(var i = 1; i < this.length; i++){
  if(this[i] !== res[res.length - 1]){
   res.push(this[i]);
  }
 }
 return res;
}
var arr = [1, 'a', 'a', 'b', 'd', 'e', 'e', 1, 0]
alert(arr.unique2());
</script>
```

第二种方法也会有一定的局限性，因为在去重前进行了排序，所以最后返回的去重结果也是排序后的。如果要求不改变数组的顺序去重，那这种方法便不可取了。


方法3
---------
第三种方法（推荐使用）
思路：
1.创建一个新的数组存放结果
2.创建一个空对象
3.for循环时，每次取出一个元素与对象进行对比，如果这个元素不重复，则把它存放到结果数组中，同时把这个元素的内容作为对象的一个属性，并赋值为1，存入到第2步建立的对象中。
说明：至于如何对比，就是每次从原数组中取出一个元素，然后到对象中去访问这个属性，如果能访问到值，则说明重复。

``` html
<script>
Array.prototype.unique3 = function(){
 var res = [];
 var json = {};
 for(var i = 0; i < this.length; i++){
  if(!json[this[i]]){
   res.push(this[i]);
   json[this[i]] = 1;
  }
 }
 return res;
}
var arr = [112,112,34,'你好',112,112,34,'你好','str','str1'];
alert(arr.unique3());
</script>
```

检测Array类型
==================================

1.typeof操作符
---------

这种方法对于一些常用的类型来说那算是毫无压力，比如Function、String、Number、Undefined等，但是要是检测Array的对象就不起作用了。

``` html
<script>
alert(typeof null); // "object"
alert(typeof function () {
return 1;
}); // "function"
alert(typeof '梦龙小站'); // "string"
alert(typeof 1); // "number"
alert(typeof a); // "undefined"
alert(typeof undefined); // "undefined"
alert(typeof []); // "object"
</script>
```

2.instanceof操作符
---------

这个操作符和JavaScript中面向对象有点关系，了解这个就先得了解JavaScript中的面向对象。因为这个操作符是检测对象的原型链是否指向构造函数的prototype对象的。
var arr = [1,2,3,1];
alert(arr instanceof Array); // true


3.对象的constructor属性
---------

除了instanceof，每个对象还有constructor的属性，利用它似乎也能进行Array的判断。
``` html
<script>
var arr = [1,2,3,1];
alert(arr.constructor === Array); // true
</script>
```

第2种和第3种方法貌似无懈可击，但是实际上还是有些漏洞的，当你在多个frame中来回穿梭的时候，这两种方法就亚历山大了。由于每个iframe都有一套自己的执行环境，跨frame实例化的对象彼此是不共享原型链的，因此导致上述检测代码失效!


``` html
<script>
var iframe = document.createElement('iframe'); //创建iframe
document.body.appendChild(iframe); //添加到body中
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // 声明数组[1,2,3]
alert(arr instanceof Array); // false
alert(arr.constructor === Array); // false
</script>
```

以上那些方法看上去无懈可击，但是终究会有些问题，接下来向大家提供一些比较不错的方法，可以说是无懈可击了。

无懈可击的方法
---------
* 1.Object.prototype.toString

Object.prototype.toString的行为：首先，取得对象的一个内部属性[[Class]]，然后依据这个属性，返回一个类似于"[object Array]"的字符串作为结果(看过ECMA标准的应该都知道，[[]]用来表示语言内部用到的、外部不可直接访问的属性，称为“内部属性”)。利用这 个方法，再配合call，我们可以取得任何对象的内部属性[[Class]]，然后把类型检测转化为字符串比较，以达到我们的目的。

``` html
<script>
function isArrayFn(o){
return Object.prototype.toString.call(o) === '[object Array]';
}
var arr = [1,2,3,1];
alert(isArrayFn(arr));// true
</script>
```

call改变toString的this引用为待检测的对象，返回此对象的字符串表示，然后对比此字符串是否是'[object Array]'，以判断其是否是Array的实例。为什么不直接o.toString()?嗯，虽然Array继承自Object，也会有 toString方法，但是这个方法有可能会被改写而达不到我们的要求，而Object.prototype则是老虎的屁股，很少有人敢去碰它的，所以能一定程度保证其“纯洁性”：)

JavaScript 标准文档中定义: [[Class]] 的值只可能是下面字符串中的一个： Arguments, Array, Boolean, Date, Error, Function, JSON, Math, Number, Object, RegExp, String.
这种方法在识别内置对象时往往十分有用，但对于自定义对象请不要使用这种方法。


* 2.Array.isArray()

ECMAScript5将Array.isArray()正式引入JavaScript，目的就是准确地检测一个值是否为数组。IE9+、 Firefox 4+、Safari 5+、Opera 10.5+和Chrome都实现了这个方法。但是在IE8之前的版本是不支持的。

* 3.较好参考
综合上面的几种方法，有一个当前的判断数组的最佳写法：

``` html
<script>
var arr = [1,2,3,1];
var arr2 = [{ abac : 1, abc : 2 }];
function isArrayFn(value){
if (typeof Array.isArray === "function") {
return Array.isArray(value);
}else{
return Object.prototype.toString.call(value) === "[object Array]";
}
}
alert(isArrayFn(arr));// true
alert(isArrayFn(arr2));// true
</script>
```
