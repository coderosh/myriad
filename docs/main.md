## Declarations

- Variables
  ```
  let name  = "Roshan Acharya";
  ```
- Constants
  ```
  const name = "Roshan Acharya";
  ```

## Comments

- Singleline

  ```
  // This is a single line comment
  ```

- Multiline

  ```
  /*
      This is a multi line comment
  */
  ```

## Data Types

- String

  ```
  let name = "Roshan Acharya";
  ```

- Number

  ```
  let age = 100;
  ```

- Boolean
  ```
  let x = false;
  let y = true;
  ```
- Null

  ```
  let n = null;
  ```

- Objects

  ```
  let age = 100;

  let obj = { name: "Roshan Acharya", age }

  print(obj.name);
  print(obj.age);
  ```

- Arrays

  ```
  let arr = ["Roshan", 100, true, false, null]

  print(arr[0]);
  print(arr[1]);
  ```

## If Statements

```
let val;

if(x > 0) {
    val = "positive";
} else if (x < 0) {
    val = "negative";
}else {
    val = "equal";
}

print(val);
```

## Functions

```
func log(val){
    print(val);
}
```

Funcions return last expression by default

```
func add(x, y){
    x + y;
}
```

Or you can use the `return` keyword

```
func add(x, y){
    return x + y;
}
```

## Loops

- While

  ```
  let x = 0;

  while(x < 20) {
    if(x == 10) continue;

    const y = calculateY(x);

    if(y == null) break;

    print("Value of x is: ", x);

    x++;
  }
  ```

- For

  ```
  for(let i = 0; i < 20; i++) {}
  ```

## Try Catch

```
try {
    const x = calculateValue();

    if(x == null) {
        throw "Something went wrong";
    }
} catch (err) {
    print(err);
}
```

## Import and Export

- export

  ```
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

  ```
  import "vector" vec; // builtin module

  import "./ops.mainl" ops; // custom file

  const sum = ops.add(1, 2);

  const vec = vec.create(2, 4);
  ```
