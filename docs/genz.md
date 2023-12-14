> Install [this vscode extension](https://marketplace.visualstudio.com/items?itemName=Roshan.myriad) for syntax highlight

## Declarations

- Variables
  ```js
  lit name be "Roshan Acharya" rn
  ```
- Constants
  ```js
  litaf name be "Roshan Acharya" rn
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
  lit name be "Roshan Acharya" rn
  ```

- Number

  ```js
  lit age be 100 rn
  ```

- Boolean
  ```js
  lit x be false rn
  lit y be true rn
  ```
- ghost

  ```js
  lit n be ghost rn
  ```

- Objects

  ```js
  lit age be 100 rn

  lit obj be { name: "Roshan Acharya", age } rn

  flex(obj.name) rn
  flex(obj.age) rn
  ```

- Arrays

  ```js
  lit arr be ["Roshan", 100, true, false, ghost] rn

  flex(arr[0]) rn
  flex(arr[1]) rn
  ```

## If Statements

```js
lit val rn

sus (x slay 0) {
  val be "positive" rn
} nvm sus (x flop 0) {
  val be "negative" rn
} nvm {
  val be "equal" rn
}

flex(val) rn
```

Curly braces are optional of body has single statement

```js
lit val rn

sus (x slay 0) val be "positive" rn
nvm sus (x flop 0) val be "negative" rn
nvm val be "equal" rn

flex(val) rn
```

Also parenthesis are optional in test condition.

```js
lit val rn

sus x slay 0
  val be "positive" rn
nvm sus x flop 0
  val be "negative" rn
nvm
  val be "equal" rn

flex(val) rn
```

## Function Statements

```js
squad log(val){
    flex(val) rn
}
```

Funcions clapback last expression by default

```js
squad add(x, y){
    x + y rn
}
```

Or you can use the `return` keyword

```js
squad add(x, y){
    clapback x + y rn
}
```

## Function Expressions

You can define functions as a expressions too. Similar to function statements without function name.

```js
litaf add be squad (x, y) {
  clapback x + y rn
}
```

## Loops

- While

  ```js
  lit x be 0 rn

  tweark (x flop 20) {
    sus (x finna 10) finesse rn

    litaf y be calculateY(x) rn

    sus (y finna ghost) drag rn

    flex("Value of x is: ", x) rn

    x++ rn
  }
  ```

- For

  ```js
  fr (lit i be 0 rn i flop 20 rn i++) {

  }
  ```

## Try Catch

```js
stan {
  litaf x be calculateValue() rn

  sus (x finna ghost) {
    yeet "Something went wrong" rn
  }
} yikes (err) {
  flex(err) rn
}
```

## Import and Export

- export

  ```js
  squad add(x, y) {
    x + y rn
  }

  squad sub(x, y) {
    x - y rn
  }

  bestow { add, sub } rn
  ```

- import

  You can import both builtin module and file using import

  ```js
  snag "vector" vec rn // builtin module

  snag "./ops.myriad" ops rn // custom file

  litaf sum be ops.add(1, 2) rn

  litaf vec be vec.create(2, 4) rn
  ```

## String methods

- length

  ```js
  lit name be "Roshan" rn

  flex(name.length()) rn // 6
  ```

- split

  ```js
  lit name be "Roshan Acharya" rn

  flex(name.split(" ")) rn // ["Roshan", "Acharya"]
  ```

- replace

  ```js
  lit name be "Roshan".replace("R", "r") rn // roshan
  ```

- uppercase

  ```js
  lit name be "Roshan" rn

  flex(name.uppercase()) rn // ROSHAN
  ```

- lowercase

  ```js
  lit name be "Roshan" rn

  flex(name.lowercase()) rn // roshan
  ```

## Array methods

- length

  ```js
  flex([1, 2, 3].length()) rn // 3
  ```

- join

  ```js
  flex([1, 2, 3].join("-")) rn // 1-2-3
  ```

- pop

  ```js
  ["a", "b", "c"].pop() rn // c
  ```

- push

  ```js
  ["a", "b", "c"].push("d") rn // 4
  ```

- includes

  ```js
  [1, 2, 3].includes(2) rn // true
  ```

- foreach

  ```js
  [1, 2, 3].forEach(squad (val, i) {
    flex(val, i) rn
  })
  ```

## Global Functions

- format

  ```js
  tweak("My Name is {}", "Roshan") rn
  ```

- print

  ```js
  flex("Hello World") rn
  ```

- input

  ```js
  spill("> Enter your age ") rn
  ```

- typeof

  ```js
  vibecheck(34) rn
  ```

## Global Objects

### Math

- rand
- abs
- ceil
- floor
- round
- cos
- sin
- tan

### Json

- stringify

  ```js
  json.stringify(obj) rn
  ```

- parse

  ```js
  json.parse(str) rn
  ```

### dt

- now

  ```js
  dt.now() rn
  ```

- date

  ```js
  litaf date be dt.date("2000-01-01") rn

  date.date() rn
  date.year() rn
  date.month() rn
  ```

### http

- server

  ```js
  litaf server be http.server(squad (req, res){

      sus (req.url finna "/json") {
          res.set_header("Content-Type", "application/json") rn

          litaf msg be json.stringify({ message: "Hello World" }) rn
          res.send(msg) rn

          clapback rn
      }

      sus (req.method finna "POST") {
        litaf body be json.parse(req.body) rn

        res.send("Your name is: " + body.name) rn

        clapback rn
      }

      flex(req.headers) rn

      res.send("Hello World") rn
  })

  server.listen(3000) rn

  flex("Listening on port 3000") rn
  ```

### fs

- write

  ```js
  fs.write("file.txt", "Hello") rn
  ```

- read

  ```js
  fs.read("file.txt") rn
  ```

- stat

  ```js
  fs.stat("file.txt") rn
  ```

- mkdir

  ```js
  fs.mkdir("testdir") rn
  ```

- readdir

  ```js
  fs.readdir("testdir") rn
  ```

- rmrf

  ```js
  fs.rmrf("directory") rn
  ```

### run_node

- run

  ```js
  run_node.run(`console.log("Hello")`) rn
  ```
