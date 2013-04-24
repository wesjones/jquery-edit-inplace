/*global jQuery */
(function ($) {
    'use strict';

    $.editInPlaceDefaults = {
        focusValue: null, // what is was when we first went to edit mode.
        lastValue: null, // what it was before last value update.
        value: null, // current value.
        // returning false from any of these will prevent the value from being set
        beforeChange: null,
        afterChange: null,
        beforeCallback: null,
        callback: null
    };

    $.fn.editInPlace = function (options) {
        var defaults = $.editInPlaceDefaults,
            o = $.extend({}, defaults, options),
            tabindex = this.attr('tabindex') || 0,
            outputTemplate = '<span class="display"></span>',
            output = $(outputTemplate),
            inputTemplate = '<input type="text" class="edit">',
            input = $(inputTemplate),
            editMode = false,
            clickHandler,
            focusHandler,
            blurHandler,
            keyDownHandler,
            keyUpHandler,
            update,
            setValue,
            call;

        this.attr('tabindex', null);
        output.attr('tabindex', tabindex);
        input.attr('tabindex', tabindex);

        /**
         * @private
         * Set the old value with the current and update the current value.
         * @param value
         */
        setValue = function (value) {
            o.lastValue = o.value;
            o.value = value;
        };

        /**
         * @private
         * update the options value.
         */
        update = function () {
            setValue(input.val());
        };

        /**
         * @private
         * Call the callback functions.
         * Execute them on the options object so they have access to those options.
         * @param fn
         * @param args
         * @returns {*}
         */
        call = function (fn, args) {
            if (fn) {
                args.push(o);
                return fn.apply(this, args);
            }
            return true;
        }.bind(this);

        /**
         * @private
         * On click event put it in edit mode.
         * @param {Event=} event
         * @type {*}
         */
        clickHandler = function (event) {
            if (!editMode) {
                this.edit();
            }
        }.bind(this);

        /**
         * @private
         * On focus put it in edit mode.
         * @param {Event=} event
         * @type {*}
         */
        focusHandler = function (event) {
            if (!editMode) {
                this.edit();
            }
        }.bind(this);

        /**
         * @private
         * On blur put it in display mode.
         * @param {Event=} event
         * @type {*}
         */
        blurHandler = function (event) {
            update();
            if (call(o.beforeCallback, [event]) !== false) {
                this.display();
                call(o.callback, [event]);
            }
        }.bind(this);

        /**
         * @private
         * On key down fire events to allow filtering before keys are entered.
         * @param {Event=} event
         * @type {*}
         */
        keyDownHandler = function (event) {
            // with the vent being passed they can preventDefault() on the event to keep values from entering the input.
            call(o.beforeChange, [event]);
        }.bind(this);

        /**
         * @private
         * On key up fire event to allow cleanup after input.
         * @param {Event=} event
         */
        keyUpHandler = function (event) {
            update();
            call(o.afterChange, [event]);
        };

        /**
         * Change to display mode.
         */
        this.display = function () {
            editMode = false;
            if (input.parent()) {
                input.detach();
            }
            this.append(output);
            output.html(o.value);
        };

        /**
         * Change to edit mode.
         */
        this.edit = function () {
            editMode = true;
            o.focusValue = o.value;
            if (output.parent()) {
                output.detach();
            }
            this.append(input);
            input.val(o.value);
            input.select();
            input.focus();
        };

        /**
         * Override the jquery val so that it sets and returns the value of the options.
         * @param value
         * @returns {*|string|string|string|string|string|string|string|Number|string}
         */
        this.val = function (value) {
            if (value !== undefined) {
                setValue(value);
            }
            return o.value;
        };

        // hook up listeners
        output.click(clickHandler);
        output.focus(focusHandler);
        input.blur(blurHandler);
        input.keydown(keyDownHandler);
        input.keyup(keyUpHandler);

        // set initial state.
        this.display();
    };

}(jQuery));