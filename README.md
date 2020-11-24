 cx
# Requirements
- ES6
- Node (??? No testing)  

# Installation

# generate babel script for commonjs

`npm install -g --save-dev @babel/core @babel/cli @babel/preset-env`- global install;
`npm install --save-dev @babel/core @babel/cli @babel/preset-env`- project install;

# Documentation API


# Getting started

Target of the component:
 -  create interfaces for interaction between JS components;
 - create interfaces for writing API requests.
 - for streamlined and convenient interaction between developers.
 - code design.
 


## Interface declaration

Let's take as a rule that a class marked as an interface will be called an interface.
```js
// create an interface class
class TestInterface {
} 
// this the class is an interface
TestInterface.isInterface=true;

/**
Let's collect the interface rules.
Warn: when forming rules, interface rules for members are generated and interface members are removed.
Interface rules are created for each class in which interfaces are applied.

*/
let rules=InterfaceApi.extend(TestInterface); 
/*
InterfaceApi.extend is optional. Interface rules can be generated when an interface is inherited by a working class.
*/
```
## Interface members

```js
class TestInterface {
	/**
	warn:rules for the constructor method cannot be set. 
	since the class itself is a given constructor.
	do not declare a constructor in the interface.
	*/
	
	/**
	declare the "method" static method 
	*/  
    static method(){}  
   	
   	/**
	declare the "method" method   in the object instance
	*/  
    method(){}  
    
    /**
	declare the "react"(getter)  static reactive property 
	*/  
    static get react(){}  
    
    /**
	declare the "react"(setter)  static reactive property 
	*/ 
    static set react(v){}  

   	/**
	declare the "react"(getter)  reactive property in the object instance
	*/  
    get react(){}  

	/**
	declare the "react"(setter)  reactive property in the object instance
	*/ 
    set react(v){}  
}  
	/**
	declare the "prop" property in the prototype object instance.
	Warn: it is not possible to create rules for own property object.
	*/ 
TestInterface.prototype.prop={}; 
 
/**
	declare the "prop" static property 
*/  
TestInterface.prop={};  

TestInterface.isInterface=true;  
let rules=InterfaceApi.extend(TestInterface);
```

## Criteria

Each member of the interface must return criteria (objects with a data set) by which the data will be validated.
```js
	class TestInterface{
		method(){
			// return criteria template for method	
			return {
				arguments:[],
				return:{}
			}
		}
		method2(){
			// return criteria for method	
			return new CriteriaMethodType({
				arguments:[],
				return:{}
			})
		}
		prop(){
			// return criteria for property (alternative alternative instead of TestInterface.prototype.prop)
			return new CriteriaPropertyType({
				types:[],
				includes:[],
				excludes:[]
			});
		}
	}
```

There are three types of criteria (classes for criteria):
- **CriteriaPropertyType** - describes class properties, method / function arguments, method / function return value;
- **CriteriaMethodType** - describes the class methods, method / function arguments and the return value of the method / function if such data should be callable.
- **CriteriaReactType** - describes the reactive properties of the class.

You can also create your own class criteria. For example for JSON Schema or for OpenApi 2/3.
```js
import {CriteriaType} from './export.js';
export class MyCriteriaType extends CriteriaType {
	validate(){....}
	build(){....}
	compare(){...}
	...
}
```
The creation of alternative criteria will be described later.
Criteria objects are composition for the interface.
Criteria objects are interface composition, which means criteria should only be created within the interface members. 
It is forbidden to use the same criteria object in different places.
You can use criteria templates instead of criteria.

**The template for criteria** is a regular object that describes the structure of a criteria object of a particular class.

### Template for CriteriaPropertyType
```js
{
	/**
	setting types to test a value
	*/
	types:[// optional
			'null',// or null 
			'undefined', // or undefined
			'object', //typeof
			'boolean',//typeof 
			'number', //typeof
			'string', //typeof
			'symbol', //typeof
			'function', //typeof
			'mixed', // any types
			
// for check  object instanceof A or A.isPrototypeOf(function)
			class A{}, 
			
// for check   protoObject.isPrototypeOf(object)
			{protoObject}, 

/*
Expands the current criteria with these criteria.It is used as a detached type.
Use only in cases of complex interface implementation.
*/
			new CriteriaPropertyType({}) 
			
/*
If the value is a function, then it sets the rules for it.
*/
			new CriteriaMethodType({}) 
			
/*
any object will be checked against the specified interface.
Designed to check the properties of an object for data correctness
@deprecated
*/
			class extends MirrorInterface{}

/*
 checks if an object or function implements a given interface
 */
			Object.assign(class Interface{},{isInterface:true})
		],
		
/**
indicates which value the data should match.
Any primitives  and the rules of relationship to classes and interfaces apply.
Must match types.
*/
	includes:[ // optional
		//any values ​​are strict comparison
		1,
		'hello',
		
// for check  object instanceof A or A.isPrototypeOf(function)
		class A{}, 
		
// for check   protoObject.isPrototypeOf(object)
		{protoObject}, 

//checks if an object or function implements a given interface
		Object.assign(class Interface{},{isInterface:true})
		
	], 
	
/**
indicates which value the data should not match
*/
	excludes:[// optional
		//any values ​​are strict comparison
		1,
		'hello',
		
// for check  object instanceof A or A.isPrototypeOf(function)
		class A{}, 

// for check   protoObject.isPrototypeOf(object)
		{protoObject}, 
		
//checks if an object or function implements a given interface
		Object.assign(class Interface{},{isInterface:true})
	] 
}
```

Example
```js
class A{
}
A.prop={
	types:['number'],
	excludes:[20,21]
};
A.isInterface=true;
```
### template for CriteriaMethodType

```js
	{
		/*
			 - optional
			set of objects from
			CriteriaPropertyType(or its template), 
			CriteriaMethodType(or its template),
			`class extends CriteriaType{}` 
		*/
		arguments:[
			{},   
			{} 
			...
		],
		
		/*
			- optional 
			 CriteriaPropertyType(or its template) or 
			 CriteriaMethodType(or its template) or 
			 `class extends CriteriaType{}`
		 */ 
		return:{} 
		/*
		 - optional
		 - default -  true or your settings. 
		Denotes to run method / function in sandbox . 
		*/
		isBuildSandbox:true, 
	}
	
/*
CriteriaPropertyType template -describes  a value
CriteriaMethodType template - describes  callable function
*/
```

Example
```js
class A{
	method(){
		return {
			arguments:[
				// name event
				{
					types:['string']
				},
				//callback
				{
					arguments:[
						types:['object']
					]
				}
			]
		}
	};
}
A.isInterface=true;
```
### template for CriteriaReactType
```js
	{
		get:{ 
			//  template CriteriaMethodType 
			retrun:{
					types:[],
					includes:[],
					excludes:[]
				}  
		}
		set:{ 
			//  template CriteriaMethodType 
			arguments:[{
					types:[],
					includes:[],
					excludes:[]
				}]  
		} 
	}
```
or
```js
	{
		//  template CriteriaPropertyType 
		get:{
			types:[],
			includes:[],
			excludes:[]
		}
		//  template CriteriaPropertyType 
		set:{
			types:[],
			includes:[],
			excludes:[]
		}
	}
```
A class must not implement a "getter" or "setter" that is not declared in the interface.

Example
```js
class A{
/* 
Using a reactive property must take a number and will return a number.
*/
	get react(){
		return {
			types :['number']
		}
	};
	set react(v){
		return{
			types:['number']
		}
	}
	
/* 
Using a reactive property, a callable function should be 
"set" that takes an object as an argument  */
	set react2(){
		return {
			arguments:[{
				arguments:[
					{
						types:['object']
					},
				]
			}]
		}
	}
/*
if "get react2" is not declared, then when you try to declare it in the class, it will cause an error.
 */
}
A.isInterface=true;

```
##  Inherit interface

```js
class TestInterface {  
    method(){}  
}  
TestInterface.isInterface=true;  
class Test extends TestInterface{  
    method(){}  
}  
InterfaceApi.extend(Test);
```
or
```js
class TestInterface {  
    method(){}  
}  
TestInterface.isInterface=true;  
class TestInterface2 {  
    method2(){}  
}  
TestInterface2.isInterface=true;  

class Test{  // create abstract class
    method(){}  
}  
InterfaceApi.extend(Test,TestInterface,TestInterface2);
```
or
```js
class TestInterface {  
    method(){}  
}  
TestInterface.isInterface=true;  
class TestInterface2 {  
    method2(){}  
} 
TestInterface.isInterface=true;  
class Test{  // create abstract class
    method(){}  
} 

InterfaceApi.extend(Test,TestInterface,TestInterface2); 
class Test2 extends Test{  // create finaly class
    method2(){}  
}
/* 
All interface rules for classes will be formed, and 
for the current class it will validate the compliance
 of the members with the established criteria.
*/
InterfaceApi.implement(Test2);
```
## inherit interface  to interface

Rules:

See [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)

- Each subsequent interface replaces the criteria of the previous interfaces if the members match;
- The criteria must be compatible(compared criteria must be created by the same class).
- for CriteriaPropertyType criteria, the 'types' set must match, the 'includes' sets must match, the "excludes" sets must match.
- for CriteriaMethodType criteria, criteria for the arguments and  criteria for  the return value must match. Also, the set of arguments must match. Adding criteria for the remaining arguments is allowed if such criteria in the set "types" are of type undefined or mixed.

Examples for CriteriaPropertyType
```js
//core criteria
{
	types:['string','number'],
}
// replaces- good criteria
{
	types:['string','number']
}
// replaces- bad criteria
{
	types:['string','object']
}
// replaces- bad criteria
{
	types:['string']
}
// replaces- bad criteria
{
	types:['string','number','object']
}

class A{}
//core criteria
{
	types:[A],
}
// replaces- good criteria
{
	types:[A],
}
// replaces- bad criteria
{
	types:[class extends A {}]
}

//core criteria
{
	types:['number'],
	includes:[1,2,3,4,5],
}
// replaces- good criteria
{
	types:['number'],
	includes:[1,2,3,4,5],
}
// replaces- bad criteria
{
	types:['number'],
	includes:[1,2,3],
}
// replaces - bad criteria
{
	types:['number'],
	includes:[1,2,3,4,5,6],
}

//core criteria
{
	types:['number'],
	excludes:[1,2,3,4,5],
}
// replaces - good criteria
{
	types:['number'],
	excludes:[1,2,3,4,5],
}

// replaces - bad criteria
{
	types:['number'],
	excludes:[1,2,3],
}
// replaces - bad criteria
{
	types:['number'],
	excludes:[1,2,3,4,5,6],
}
```
Examples for CriteriaMethodType
```js
//core criteria
{
	arguments:[
		{
			types:['number']
		}
	],
	return:{
		types:['mixed']
	}
}
// replaces - good criteria
{
	arguments:[
		{
			types:['number']
		}
	],
	return:{
		types:['mixed']
	}
}
// replaces - good criteria
{
	arguments:[
		{
			types:['number']
		},
		{
			types:['mixed']
		},
				{
			types:['undefined','number']
		},
		{
			types:['undefined'] //This approach helps reserve the  place .
		}
	]
}
// replaces - bad criteria
{
	arguments:[
		{
			types:['number']
		},
		{
			types:['number']
		},
	]
}
// replaces - bad criteria
{
	arguments:[
		{
			types:['number']
		}
	],
	return:{
		types:['number']
	}
}
```

```js
class TestInterface {  
    method(){}  
    method_replace(){}  
      
}  
TestInterface.isInterface=true;  
class TestInterface2 extends TestInterface{  
    method2(){}  
    method_replace(){}  
}  
TestInterface2.isInterface=true;  
InterfaceApi.extend(TestInterface2);
```
or

```js
class TestInterface {  
    method(){}  
    method_replace(){}  
  
}  
TestInterface.isInterface=true;  
class TestInterface2{  
    method2(){}  
    method_replace(){}  
}  
TestInterface2.isInterface=true;  
InterfaceApi.extend(TestInterface2,TestInterface);
```
or hybrid

```js
class TestInterface {  
    method(){}  
    method_replace(){}  
    method5(){}  
}  
TestInterface.isInterface=true;  
class TestInterface2 extends TestInterface{  
    method2(){}  
    method_replace(){}  
}  
TestInterface2.isInterface=true;  
class TestInterface3{  
    method3(){}  
    method_replace2(){}  
}  
TestInterface3.isInterface=true;  
  
class TestInterface4 extends TestInterface3{  
    method_replace(){}  
    method_replace2(){}  
}  
TestInterface4.isInterface=true;  
InterfaceApi.extend(TestInterface4,TestInterface2);
```

## методы для сборки интерфейсов
```js
/*
Осуществляет генирацию правил  интерфейсов.
Cначала формирует правила интерфейсов из стека интерфейсов RestInterface, после  обьеденяет их с правилами интерфейса текущего класса/интерфейса CurrentClass.
*/
InterfaceApi.extendBefore(CurrentClass,...RestInterface);

// example
class iClass1{}
iClass.isInterface=true;

class iClass2 extends iClass1{}
iClass2.isInterface=true;

class iClass3{}
iClass.isInterface=true;

class iClass4 {}
iClass.isInterface=true;

InterfaceApi.extendBefore(iClass4 ,iClass2,iClass3);
// chain  =>iClass1=>iClass2=>iClass3=>iClass4=>(last rules)  
//each subsequent interface will replace the preceding interface


```js
/*
Осуществляет генирацию правил  интерфейсов.
Cначала формирует правила интерфейсов для текущего класса/интерфейса CurrentClass после их переопределяет правилами  из стека интерфейсов RestInterface.
*/
InterfaceApi.extendAfter(CurrentClass,...RestInterface);

// example
class iClass1{}
iClass.isInterface=true;

class iClass2 extends iClass1{}
iClass2.isInterface=true;

class iClass3{}
iClass.isInterface=true;

class iClass4 {}
iClass.isInterface=true;

InterfaceApi.extendAfter(iClass4 ,iClass2,iClass3);
// chain  =>iClass4=>iClass1=>iClass2=>iClass3=>(last rules)  
//each subsequent interface will override the preceding interface
```
```js
/**
syntactic sugar.
 For interfaces, applies extendBefore method. For final / abstract classes apply extendAfter method.
*/
InterfaceApi.extend(CurrentClass,...RestInterface);
```

```js
/*
Applicable only for final classes
In addition to generating rules, it performs final class validation.
*/
InterfaceApi.implement(CurrentClass,...RestInterface);

```
## Настройки

## Правила создания интерфейсов


##  Другое

## Варианты подключения отключения интерфейсов в продакшене.

 
## Альтернативный синтаксис

## Примеры
# заметки

```js
let object={
    /**
    *  может ссылаться на текущий обьект через this, и метод не имеет свойства prototype
    */
    method(){ 
        return this;
    },
    /**
    *  не может ссылаться на текущий обьект через this, и метод не имеет свойства prototype
    */
    method2:()=>{
        return this;
    },
    /**
    * может ссылаться на текущий обьект через this, и метод  имеет свойство prototype
    */
    method3:function(){
        return this
    }
};
// метод объекта
console.log('object.method',object.method.prototype===undefined,object===object.method());
// независимая функция
console.log('object.method2',object.method2.prototype===undefined,object===object.method2());
// конструктор (класс)
console.log('object.method3',object.method3.prototype===undefined,object===object.method3());
console.log(object);
```

```js
class A{

    // будут созданы критерии для метода
    static method(){} 
    
    // будут созданы критерии для метода, 
    static method2 =()=>{}
    
    // будут созданы критерии для свойства
    // так как передана функция конструктор, то конструктор установится в качестве типа в критериях
    static method3=function A(){};
};
A.isInterface=true;
```
