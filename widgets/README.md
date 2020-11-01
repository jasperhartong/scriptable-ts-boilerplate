# Scriptable

# Development in TypeScript

Make a symlink `output` to the iCloud Directory of Scriptable.

```
ln -fs /Users/jasperhartong/Library/Mobile\ Documents/iCloud~dk~simonbs~Scriptable/Documents ./output
```

Develop scripts in `/code`.

Run `yarn build` or `yarn watch` to build the TS files to js in `output`.


## Multiple widgets still seem to fail

Somehow having multiple active widgets from this codebase interfere with each other. Having 2 of them somehow often shows one of them with an error: `"Call script.setwidget"`.

I tried to make sure to not interfere with global namespace in multiple ways, but none of them worked:

* Rollup output format of `format: 'iife'`  (instead of `cjs`)
* Make the main body of the scripts IIFE `(()=> getDataWithSecret(...)))`
* Never call `Script.complete();`

None worked though..