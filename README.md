# eslint-plugin-indent-class-properties

A rule for indentation of class properties.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-indent-class-properties`:

```
$ npm install eslint-plugin-indent-class-properties --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-indent-class-properties` globally.

## Usage

Add `indent-class-properties` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "indent-class-properties"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "indent-class-properties/indent": 4
    }
}
```
