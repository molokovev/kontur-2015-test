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

    // "choose matrix" radio-button
    $('[name="matrix"]').change(function() {
        activeMatrix = $(this).val() === 'A' ? A : B;
        checkMatrixSize();
    });

    // matrix's elements while editing
    $(document).on('focus', '.element', function() {
        clearError();
        sidebar.addClass('edit');
        var _val = $(this).val();
        var _defVal = $(this).data('value');
        if (_val === _defVal) {
            $(this).val('');
        }
    }).on('blur', '.element', function() {
        sidebar.removeClass('edit');
        var _defVal = $(this).data('value');
        if ($(this).val() === '') {
            $(this).val(_defVal);
        }
    }).on('keypress', '.element', function(e) {
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
        clearError();
        switchMatrices();
    });

    //clear matrices
    $('#clear-button').click(function() {
        clearError();
        $('.element').each(function() {
            $(this).val($(this).data('value'));
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
            var _disabled = name === 'C' ? 'disabled' : '';
            this.height++;
            for (var i = 1; i <= this.width; i++) {
                var _val = name.toLowerCase() + this.height + ',' + i;
                var _elem = '<input type="text" class="element" value="' + _val + '" ' +
                            'data-value="' + _val + '"' +
                            'data-row="' + this.height + '"' +
                            'data-col="' + i + '"' +
                            _disabled + ' />';
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
        // check for sizes
        if (getFirstMatrix().width !== getSecondMatrix().height) {
            sidebar.addClass('error');
            error.html('Такие матрицы нельзя перемножить, так как количество столбцов матрицы ' +
                getFirstMatrix().name + ' не равно количеству строк матрицы ' + getSecondMatrix().name + '.');
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


    };

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