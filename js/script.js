/**
 * Created by eugene on 06.02.15.
 */
$(function () {
    var multiplyButton = $('#multiply-button');
    var clearButton = $('#clear-button');
    var switchButton = $('#switch-button');
    var activeMatrix = $('[name="matrix"]').val();
    var A = new Matrix('A');
    var B = new Matrix('B');
    var C = new Matrix('C');

    switchButton.on('click', function() {
        switchMatrices();
    });

    function Matrix(name) {
        this.minWidth = 2;
        this.minHeight = 2;
        this.maxWidth = 10;
        this.maxHeight = 10;
        this.width = 2;
        this.height = 2;
        this.$el = $('#' + name);
        this.addRow = function() {

        };
        this.addColumn = function() {

        };
        this.render = function() {
            var _text = '';
        };
    }

    var switchMatrices = function() {
        A.$el.toggleClass('clear-left');
        B.$el.toggleClass('clear-left');
    };
});