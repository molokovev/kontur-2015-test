/**
 * Created by eugene on 06.02.15.
 */
$(function () {
    var multiplyButton = $('#multiply-button');
    var addRowButton = $('#add-row');
    var deleteRowButton = $('#delete-row');
    var addColumnButton = $('#add-column');
    var deleteColumnButton = $('#delete-column');
    var sidebar = $('#sidebar');
    var A = new Matrix('A');
    var B = new Matrix('B');
    var C = new Matrix('C');
    var activeMatrix = A;

    // "choose matrix" radio-button
    $('[name="matrix"]').change(function() {
        activeMatrix = $(this).val() === 'A' ? A : B;
        checkMatrixSize();
    });

    // matrix's elements while editing
    $('.element').on('focus', function() {
        sidebar.addClass('edit');
        var _val = $(this).val();
        var _defVal = $(this).data('value');
        if (_val === _defVal) {
            $(this).val('');
        }
    }).on('blur', function() {
        sidebar.removeClass('edit');
        var _defVal = $(this).data('value');
        if ($(this).val() === '') {
            $(this).val(_defVal);
        }
    }).on('keypress', function(e) {
        var _val = $(this).val();
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
        if (_val !== '') {
            if (_val != 1) {
                return false;
            } else if (e.which != 48) {
                return false;
            }
        }
    });

    // switch matrices
    $('#switch-button').click(function() {
        switchMatrices();
    });

    //clear matrices
    $('#clear-button').click(function() {
        $('.element').each(function() {
            $(this).val($(this).data('value'));
        })
    });

    // add/delete rows
    addRowButton.click(function() {
        activeMatrix.addRow();
        if (activeMatrix === getFirstMatrix()) {
            C.addRow();
        }
        checkMatrixSize();
    });
    deleteRowButton.click(function() {
        activeMatrix.deleteRow();
        if (activeMatrix === getFirstMatrix()) {
            C.deleteRow();
        }
        checkMatrixSize();
    });

    // add/delete columns
    addColumnButton.click(function() {
        activeMatrix.addColumn();
        if (activeMatrix === getSecondMatrix()) {
            C.addColumn();
        }
        checkMatrixSize();
    });
    deleteColumnButton.click(function() {
        activeMatrix.deleteColumn();
        if (activeMatrix === getSecondMatrix()) {
            C.deleteColumn();
        }
        checkMatrixSize();
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
            var _row = $('<div class="row"></div>');
            var _disabled = name === 'C' ? 'disabled' : '';
            this.height++;
            for (var i = 1; i <= this.width; i++) {
                var _val = name.toLowerCase() + this.height + ',' + i;
                var _elem = '<input type="text" class="element" value="' + _val + '" ' +
                            'data-value="' + _val + '"' + _disabled + ' />';
                _row.append(_elem);
            }
            this.$el.append(_row);
        };
        this.deleteRow = function() {
            this.$el.find('.row').last().remove();
            this.height--;
        };
        this.addColumn = function() {
            var self = this;
            var _disabled = name === 'C' ? 'disabled' : '';
            this.width++;
            this.$el.find('.row').each(function(i) {
                var _val = name.toLowerCase() + (i + 1) + ',' + self.width;
                var _elem = '<input type="text" class="element" value="' + _val + '" ' +
                            'data-value="' + _val + '"' + _disabled + ' />';
                $(this).append(_elem);
            });
        };
        this.deleteColumn = function() {
            this.$el.find('.row').each(function() {
                $(this).find('.element').last().remove();
            });
            this.width--;
        };
    }

    var getFirstMatrix = function() {
        return A.$el.hasClass('first') ? A : B;
    };
    var getSecondMatrix = function() {
        return A.$el.hasClass('first') ? B : A;
    };

    // used on matrix switching
    C.update = function() {
        this.$el.empty();
        this.width = 0;
        this.height = getFirstMatrix().height;
        for (var j = 1; j <= getSecondMatrix().width; j++) {
            this.addColumn();
        }
        this.height = 0;
        this.width = getSecondMatrix().width;
        for (var i = 1; i <= getFirstMatrix().height; i++) {
            this.addRow();
        }

    };

    var switchMatrices = function() {
        A.$el.toggleClass('clear-left first second');
        B.$el.toggleClass('clear-left first second');

        if (A.$el.next().attr('id') === 'B') {
            B.$el.insertBefore(A.$el);
        } else {
            A.$el.insertBefore(B.$el);
        }

        C.update();
    };

    var checkMatrixSize = function() {
        if (activeMatrix.width === activeMatrix.maxWidth) {
            addColumnButton.prop('disabled', true);
        } else {
            addColumnButton.prop('disabled', false);
        }
        if (activeMatrix.width === activeMatrix.minWidth) {
            deleteColumnButton.prop('disabled', true);
        } else {
            deleteColumnButton.prop('disabled', false);
        }

        if (activeMatrix.height === activeMatrix.maxHeight) {
            addRowButton.prop('disabled', true);
        } else {
            addRowButton.prop('disabled', false);
        }
        if (activeMatrix.height === activeMatrix.minHeight) {
            deleteRowButton.prop('disabled', true);
        } else {
            deleteRowButton.prop('disabled', false);
        }
    };
    checkMatrixSize();
});