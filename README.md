# jquery-edit-inplace

Edit text in place.

## Why do we need this additional API.

It is a UI component.

## How to use it.
```bash
$('.editInPlace').editInPlace({value: 'test', callback: function(event, options) { console.log('value changed to ' + this.val() +' from ' + options.focusValue});
```

See index.html for an example of it's usage.
