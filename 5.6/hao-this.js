//1.
console.log(this);

//2.
function test(){
  console.log(this);
}
test();

//3.
var name = 'jim';
var obj = {
  name : 'jack',
  getName : function(){
    console.log(this);
  }
};
obj.getName();

//4.
function test(){
  this.name = 'jack';
  this.age = '22';
}
var newObj = new test();
console.log(newObj);

//5.
function test(name, age){
  this.name = name;
  this.age = age;
}
var newObj = {};
test.call(newObj, 'jack', 22);
//or
test.apply(newObj, ['jack', 22]);
console.log(newObj);
