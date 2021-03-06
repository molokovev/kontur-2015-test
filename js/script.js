/**
 * Created by eugene on 06.02.15.
 */
$(function () {
    var addRowButton = $('#add-row');
    var deleteRowButton = $('#delete-row');
    var addColumnButton = $('#add-column');
    var deleteColumnButton = $('#delete-column');
    var sidebar = $('#sidebar');
    var error = $('.error-message');
    var A = new Matrix('A');
    var B = new Matrix('B');
    var C = new Matrix('C');
    var activeMatrix = A;

    // pushed buttons styles
    // grey buttons
    $('button').not('.green').on('mousedown', function() {
        $(this).css({'background-color': '#d9d9d9',
                     'outline': 'none',
                     'border-width': '1px',
                     'top': '0',
                     'left': '1px',
                     'margin-right': '1px',
                     'border-top-color': 'rgba(131, 131, 131, .5)',
                     'border-left-color': 'rgba(160, 160, 160, .5)',
                     'border-right-color': 'rgba(160, 160, 160, .5)',
                     'border-bottom-color': 'rgba(160, 160, 160, .5)',
                     'box-shadow': 'inset 1px 4px 9px -2px rgba(0, 0, 0, .15)'});
    }).on('mouseup mouseleave', function() {
        $(this).css({'background-color': '',
                     'outline': '',
                     'border-width': '',
                     'top': '',
                     'left': '',
                     'margin-right': '',
                     'border-top-color': '',
                     'border-left-color': '',
                     'border-right-color': '',
                     'border-bottom-color': '',
                     'box-shadow': ''});
    });
    // green button
    $('button.green').on('mousedown', function() {
        $(this).css({'background-color': '#35840e',
            'outline': 'none',
            'border-width': '1px',
            'top': '0',
            'left': '1px',
            'border-top-color': 'rgba(55, 102, 43, .5)',
            'border-left-color': 'rgba(74, 128, 60, .5)',
            'border-right-color': 'rgba(74, 128, 60, .5)',
            'border-bottom-color': 'rgba(74, 128, 60, .5)',
            'box-shadow': 'inset 1px 4px 9px -2px rgba(0, 0, 0, .15)'});
    }).on('mouseup mouseleave', function() {
        $(this).css({'background-color': '',
            'outline': '',
            'border-width': '',
            'top': '',
            'left': '',
            'border-top-color': '',
            'border-left-color': '',
            'border-right-color': '',
            'border-bottom-color': '',
            'box-shadow': ''});
    });

    // "choose matrix" radio-button
    $('[name="matrix"]').change(function() {
        activeMatrix = $(this).val() === 'A' ? A : B;
        checkMatrixSize();
    });

    // matrix's elements while editing
    $(document).on('focus', '.element', function() {
        clearError();
        sidebar.addClass('edit');
        $(this).css({'color': 'black'});
        var _val = $(this).val();
        var _defVal = $(this).data('value');
        // clear new element
        if (_val === _defVal) {
            $(this).val('');
        }
    }).on('blur', '.element', function() {
        sidebar.removeClass('edit');
        var _defVal = $(this).data('value');
        // return default placeholder
        if ($(this).val() === '') {
            $(this).val(_defVal);
            $(this).css({'color': '#d4d4d4'});
        }
    }).on('keydown', '.element', function(e) {
        var _val = $(this).val();
        var _numVal = Number(_val);
        if (_val === '') {
            // on enter
            if (e.which === 13) {
                $(this).blur();
            }
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.which, [46, 8, 9, 27, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                (e.which == 65 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right, down, up
                (e.which >= 35 && e.which <= 40)) {
                // let it happen, don't do anything
                return;
            }
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.which < 48 || e.which > 57)) && (e.which < 96 || e.which > 105)) {
                e.preventDefault();
            }
        } else if (_numVal !== 1 || e.which !== 48) {
            // on enter
            if (e.which === 13) {
                $(this).blur();
            }
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.which, [46, 8, 9, 27, 110, 190]) !== -1 ||
                    // Allow: Ctrl+A
                (e.which == 65 && e.ctrlKey === true) ||
                    // Allow: home, end, left, right, down, up
                (e.which >= 35 && e.which <= 40)) {
                // let it happen, don't do anything
                return;
            }
            e.preventDefault();
        }
    });

    // switch matrices
    $('#switch-button').click(function() {
        clearError();
        switchMatrices();
    });

    //clear matrices
    $('#clear-button').click(function() {
        clearError();
        $('.element').each(function() {
            $(this).val($(this).data('value'));
            $(this).css('color', '#d4d4d4');
        })
    });

    $('#multiply-button').click(function() {
        multiplyMatrices();
    });

    // add/delete rows
    addRowButton.click(function() {
        clearError();
        activeMatrix.addRow();
        if (activeMatrix === getFirstMatrix()) {
            C.addRow();
        }
        checkMatrixSize();
    });
    deleteRowButton.click(function() {
        clearError();
        activeMatrix.deleteRow();
        if (activeMatrix === getFirstMatrix()) {
            C.deleteRow();
        }
        checkMatrixSize();
    });

    // add/delete columns
    addColumnButton.click(function() {
        clearError();
        activeMatrix.addColumn();
        if (activeMatrix === getSecondMatrix()) {
            C.addColumn();
        }
        checkMatrixSize();
    });
    deleteColumnButton.click(function() {
        clearError();
        activeMatrix.deleteColumn();
        if (activeMatrix === getSecondMatrix()) {
            C.deleteColumn();
        }
        checkMatrixSize();
    });


    // the Matrix
    function Matrix(name) {
        this.minWidth = 2;
        this.minHeight = 2;
        this.maxWidth = 10;
        this.maxHeight = 10;
        this.width = 2;
        this.height = 2;
        this.name = name;
        this.$el = $('#' + name);

        this.addRow = function() {
            var _row = $('<div class="row"></div>');
            // for C matrix
            var _disabled = name === 'C' ? 'disabled' : '';
            this.height++;
            for (var i = 1; i <= this.width; i++) {
                // a placeholder text
                var _val = name.toLowerCase() + this.height + ',' + i;
                // the element
                var _elem = '<input type="text" class="element" value="' + _val + '" ' +
                            'data-value="' + _val + '"' +
                            'data-row="' + this.height + '"' +
                            'data-col="' + i + '"' +
                            _disabled + ' />';
                _row.append(_elem);
            }
            this.$el.append(_row);
        };

        // removes last row
        this.deleteRow = function() {
            this.$el.find('.row').last().remove();
            this.height--;
        };

        this.addColumn = function() {
            var self = this;
            // for C matrix
            var _disabled = name === 'C' ? 'disabled' : '';
            this.width++;
            this.$el.find('.row').each(function(i) {
                // placeholder text
                var _val = name.toLowerCase() + (i + 1) + ',' + self.width;
                // the element
                var _elem = '<input type="text" class="element" value="' + _val + '" ' +
                            'data-value="' + _val + '"' +
                            'data-row="' + (i + 1) + '"' +
                            'data-col="' + self.width + '"' +
                            _disabled + ' />';
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

    // links to first or second multiplier
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

    // disables buttons
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


    var multiplyMatrices = function() {
        var _first = getFirstMatrix();
        var _second = getSecondMatrix();
        // check for sizes
        if (_first.width !== _second.height) {
            sidebar.addClass('error');
            error.html('Такие матрицы нельзя перемножить, так как количество столбцов матрицы ' +
            _first.name + ' не равно количеству строк матрицы ' + _second.name + '.');
            return;
        } else {
            clearError();
        }

        // check for values
        if (!isMatricesFilled()) {
            sidebar.addClass('error');
            error.html('Необходимо ввести все значения.');
            return;
        } else {
            clearError();
        }

        // calculate
        C.$el.find('.element').each(function() {
            var _value = 0;
            var _colVals = [];
            var _rowVals = [];
            var _row = $(this).data('row');
            var _col = $(this).data('col');

            _first.$el.find('[data-row="' + _row + '"]').each(function() {
                _colVals.push(Number($(this).val()));
            });
            _second.$el.find('[data-col="' + _col + '"]').each(function() {
                _rowVals.push(Number($(this).val()));
            });

            for (var i = 0; i < _rowVals.length; i++) {
                _value += _colVals[i] * _rowVals[i];
            }

            $(this).val(_value);
            $(this).css('color', 'black');
        });
    };

    // check matrices for numbers
    var isMatricesFilled = function() {
        var _result = true;
        $('#A, #B').find('.element').each(function() {
            if ( isNaN( Number( $(this).val() ) ) ) {
                _result = false;
                return false;
            }
        });
        return _result;
    };

    var clearError = function() {
        sidebar.removeClass('error');
        error.html('');
    };
});