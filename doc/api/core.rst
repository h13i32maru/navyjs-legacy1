Navy.Core
===================================

.. js:function:: Navy.Core.subclass(proto)

   :param object proto: メソッド、プロパティを定義したオブジェクト。CLASSプロパティが必須。
   :return: コンストラクタ
   :rtype: コンストラクタ関数

   サブクラスを作成するためのメソッドです。

   protoにはクラス名を表すCLASSプロパティが必須となります。サブクラスで実装する(もしくはオーバーライドする)メソッド、プロパティをprotoに定義してください。

   protoにinitialize関数を設定すると、new演算子によるインスタンス生成時に自動的に呼び出されます。つまりコンストラクタ関数として実行されます。インスタンスの初期化に必要な処理は
   initialize関数ので実行してください。

   protoで定義したメソッドの第1引数に$superという仮引数を設定すると、$superはそのメソッドがオーバーライドしているメソッドを格納されます。オーバーライドしたメソッド内で、元の
   メソッドを実行する時は$super()に引数を指定して実行してください。ただし、元のメソッドが存在しない場合はエラーとなります。

   :js:func:`~Navy.Core.subclass` によって生成されたコンストラクタ関数は :js:func:`~Navy.Core.subclass` と同じ処理を行う同名のメソッドを保持しています。つまり、多段継承を行うことができます。

   また、 :js:func:`~Navy.Core.instance` と同じ処理を行う同名のメソッドを保持しています。つまりサブクラスを継承したインスタンスを直接生成することができます。

.. warning::
   protoのプロパティに関数ではない値を設定する場合、基本型(number, boolean, string, null)のみを使用してください。
   
   arrayやobjectを指定すると、それらは全てのサブクラスで共通のオブジェクトを使用することになります。

   arrayやobjectを使用する場合はコンストラクタ内で初期化してください。

サンプルコード

.. code-block:: javascript

   var Animal = Navy.Core.subclass({
      CLASS: "Animal",
      _name: null,
      _age: null,
      //ここで配列を指定しない。コンストラクタ内で配列を設定する。
      _msgList: null,
      initialize: function($super, name, age)
         $super();
         this._name = name;
         this._age = age;
         this._msgList = [];
      },
      say: function(msg){
         this._msgList.push(msg);
         return msg + ": " + this._name + " (" + this._age + ")";
      }
   });

   var Dog = Animal.subclass({
      CLASS: "Dog",
      _weight: null,
      initialize: function($super, name, age, weight){
         $super(name, age);
         this._weight = weight;
      },
      say: function($super, msg){
         var str = $super(msg);
         return str + " [" + this._weight + " kg]";
      }
   });

   var dog = new Dog("max", 3, 10);
   console.log(dog.say("bow wow!!")); //"bow wow!!: max (3) [10 kg]"


.. js:function:: Navy.Core.instance(proto)

   :param object proto: メソッド、プロパティを定義したオブジェクト。CLASSプロパティが必須。
   :return: 未初期化状態のインスタンス。
   :rtype: オブジェクト。

   インスタンスを直接作成するメソッドです。

   protoにはクラス名を表すCLASSプロパティが必須となります。インスタンスで実装する(もしくはオーバーライドする)メソッド、プロパティをprotoに定義してください。

   protoにinitialize関数を設定すると、インスタンスのwakeup()関数実行時に自動的に呼び出されます。つまり未初期化状態のインスタンスを初期化するためのコンストラクタ関数として実行されます。
   インスタンスの初期化に必要な処理はinitialize関数ので実行してください。

   その他の動作は :js:func:`~Navy.Core.subclass` と同じになります。

サンプルコード

.. code-block:: javascript

   var Animal = Navy.Core.subclass({
     CLASS: "Animal",
     _name: null,
     _age: null,
     //ここで配列を指定しない。コンストラクタ内で配列を設定する。
     _msgList: null,
     initialize: function($super, name, age){
        $super();
        this._name = name;
        this._age = age;
        this._msgList = [];
     },
     say: function(msg){
        this._msgList.push(msg);
        return msg + ": " + this._name + " (" + this._age + ")";
     }
   });

   var Phoenix = Animal.instance({
       CLASS: "Phoenix",
       _color: null,
       initialize: function($super, color){
           $super(this.CLASS, 1000000);
           this._color = color;
       },
       fly: function(){
           return this._color + " Phoenix fly!!!";
       }
   });

   Phoenix.wakeup("Red");
   console.log(Phoenix.fly()); //"Red Phoenix fly!!!"
