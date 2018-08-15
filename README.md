# Ref-parser

## install

```bash
npm i --save ref-parser
```

## Usage

```js
const refParser = require('ref-parser')();

var obj = {
    refA: "valueA",
    refB: "%refA%"
};

refParser.parse(obj);

expect(obj).to.deep.equals({
    refA: "valueA",
    refB: "valueA"
}); // === TRUE
```

## Options

```js
const refParser = require('ref-parser')({
    referenceCharKey: "=",  // Default is %
    recursive: true,       
    global: {
        env: process.env
    },                      // Merged with obj to parse, removed after if removeGlobal option is TRUE
    removeGlobal: true      
});

process.env.NODE_ENV = "development";

var obj = {
    ref: "=env.NODE_ENV="
};

refParser.parse(obj);

expect(obj).to.deep.equals({
    ref: "development"
}); // === TRUE
```

## API

__parse(obj: Object, key?: String)__

Parse all references inside `obj` parameter. 
If `key` is defined parse only references inside this key

__parseReferences(str: String, obj: Object): any__

Return the parsed references from `str` parameters, all references values come from `obj` parameters.

__getReferenceKeys(str: String, referenceChar?: String): Array\<String\>__

Return references keys from the `str` parameters. A reference key look like `<referenceChar><ref-path><referenceChar>` (for example `%refA%`)

__hasReferences(str: String, referenceChar?: String): Boolean__

Return trus if `str` parameter has one or more references.

## Full example

```js
var refParser = require('ref-parser')();

var obj = {
    refA: "valueA",
    // Simple reference
    refB: "%refA%",
    // Multi references
    refC: "%refA%-%refB%",
    refD: {
        refE: 0,
        refNull: null,
        refUndefined: undefined
    },
    refFalse: false,
    refTrue: true,
    // Multi references with object key and reference to a reference
    refF: "%refD.refE%-%refG%",
    refG: "%refD.refE%",
    // References inside array
    arrayA: [
        "value1",
        "%refD%",
        "%refTrue%"
    ],
    // Reference from array
    refH: "%arrayA.1.refE%",
    // Reference to null
    refI: "%refD.refNull%",
    // Reference to undefined
    refJ: "%refD.refUndefined%",
    refK: "%refD.refNull%-value",
    // Reference to false
    refL: "%refFalse%"
}

refParser.parse(obj);

expect(obj).to.deep.equals({
    refA: "valueA",
    refB: "valueA",
    refC: "valueA-valueA",
    refD: {
        refE: 0,
        refNull: null,
        refUndefined: undefined
    },
    refFalse: false,
    refTrue: true,
    refF: "0-0",
    refG: 0,
    arrayA: [
        "value1",
        {
            refE: 0,
            refNull: null,
            refUndefined: undefined
        },
        true
    ],
    refH: 0,
    refI: null,
    refJ: undefined,
    refK: "null-value",
    refL: false
}); // === TRUE
```

## Test

```bash
npm test
```