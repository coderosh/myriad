## Declarations

- Variables
  ```js
  let name = "Roshan Acharya";
  ```
- Constants
  ```js
  const name = "Roshan Acharya";
  ```

## Comments

- Singleline

  ```js
  // This is a single line comment
  ```

- Multiline

  ```js
  /*
      This is a multi line comment
  */
  ```

## Data Types

- String

  ```js
  let name = "Roshan Acharya";
  ```

- Number

  ```js
  let age = 100;
  ```

- Boolean
  ```js
  let x = false;
  let y = true;
  ```
- Null

  ```js
  let n = null;
  ```

- Objects

  ```js
  let age = 100;

  let obj = { name: "Roshan Acharya", age };

  print(obj.name);
  print(obj.age);
  ```

- Arrays

  ```js
  let arr = ["Roshan", 100, true, false, null];

  print(arr[0]);
  print(arr[1]);
  ```

## If Statements

```js
let val;

if (x > 0) {
  val = "positive";
 else if (x < 0) {
  val = "negative";
} else {
  val = "equal";
}

print(val);
```

Curly braces are optional of body has single statement

```js
let val;

if (x > 0) val = "positive";
else if (x < 0) val = "negative";
else val = "equal";

print(val);
```

Also parenthesis are optional in test condition.

```js
let val;

if x > 0
  val = "positive";
else if x < 0
  val = "negative";
else
  val = "equal";

print(val);
```

## Function Statements

```js
func log(val){
    print(val);
}
```

Funcions return last expression by default

```js
func add(x, y){
    x + y;
}
```

Or you can use the `return` keyword

```js
func add(x, y){
    return x + y;
}
```

## Function Expressions

You can define functions as a expressions too. Similar to function statements without function name.

```js
const add = func (x, y) {
  return x + y;
}
```

## Loops

- While

  ```js
  let x = 0;

  while (x < 20) {
    if (x == 10) continue;

    const y = calculateY(x);

    if (y == null) break;

    print("Value of x is: ", x);

    x++;
  }
  ```

- For

  ```js
  for (let i = 0; i < 20; i++) {}
  ```

## Try Catch

```js
try {
  const x = calculateValue();

  if (x == null) {
    throw "Something went wrong";
  }
} catch (err) {
  print(err);
}
```

## Import and Export

- export

  ```js
  func add(x, y) {
    x + y;
  }

  func sub(x, y) {
    x - y;
  }

  export { add, sub };
  ```

- import

  You can import both builtin module and file using import

  ```js
  import "vector" vec; // builtin module

  import "./ops.myriad" ops; // custom file

  const sum = ops.add(1, 2);

  const vec = vec.create(2, 4);
  ```
