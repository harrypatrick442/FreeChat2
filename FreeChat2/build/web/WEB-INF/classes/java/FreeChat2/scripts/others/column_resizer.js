if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') {
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                       ? this
                       : oThis,
                       aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
function ColumnResizer(tableHeadings, table, callback)
{
    var tds = [];
    if(!callback)
    {
        callback = function () { };
    }
    if (tableHeadings.children.length > 0)
    {
        var tdHeadings = [];
        var tds = [];
        var div;
        var tablebodyHeadings = tableHeadings.children[0];
        var tablebody = table.children[0];
        if (tablebodyHeadings.children.length > 0) {
            var tdHeading;
            var td;
            var rowHeading = tablebodyHeadings.children[0];
            var row;
            if (tablebody != undefined)
            {
                row = tablebody.children[0];
            }
            for (var i = 0; i < rowHeading.children.length; i++) {
                tdHeading = rowHeading.children[i];
                if(row!=undefined) {
                    td = row.children[i];
                }
                if (tdHeading.children.length > 0) {
                    div = document.createElement('div');
                    div.className = 'div-column-resize';
                    div.style = 'position: absolute;width: 8px;top: 0px;right: -4px;float:right;cursor: e-resize;z-index: 100;';
                    tdHeading.children[0].appendChild(div);
                    tdHeadings.push(tdHeading);
                    if (row!=undefined) {
                        tds.push(td);
                    }
                    div.style.height = String(tdHeading.children[0].offsetHeight) + 'px';
                    (function () {
                        var oldOnMouseDown = div.onmousedown;
                        if (oldOnMouseDown == undefined) {
                            oldOnMouseDown = function () { };
                        }
                        var tableCell;
                        if(table.rows[0]!=undefined)
                        {
                            tableCell=table.rows[0].cells[i];
                        }
                        div.onmousedown = (function (tableHeadings, table, tdHeading, td, callback, e) {
                            if (!e) var e = window.event;
                            oldOnMouseDown.apply(this);
                            onMouseDown(e, tableHeadings, table, tdHeading, td, callback);
                        }
                        ).bind(null, tableHeadings, table, tableCell, tableHeadings.rows[0].cells[i], callback);
                    })();
                }

            }
        }
    }
    this.getTdSizes = function () {
        var array = [];
        for (var i = 0; i < tdHeadings.length; i++) {
            array.push(tdHeadings[i].offsetWidth);
        }
        return array;
    }
    ;
        this.setTdSizes = function (array) {
        var total = 0;
        for(var i=0; i<array.length; i++)
        {
            var width = array[i];
            tdHeadings[i].setAttribute("width", String(width) + 'px !important');
            if (tds[i] != undefined) {
                tds[i].setAttribute("width", String(width) + 'px !important');
            }
            total += width;
        }
        tableHeadings.setAttribute("width", String(total) + 'px !important');
        table.setAttribute("width", String(total) + 'px !important');
    }
    ;
}
ColumnResizer.td;
ColumnResizer.tdHeading;
ColumnResizer.table;
ColumnResizer.tableHeadings;
ColumnResizer.state = 'up';
ColumnResizer.instances = [];
ColumnResizer.start = [];
ColumnResizer.timer;
ColumnResizer.callback;
function onMouseDown(e, tableHeadings, table, td, tdHeading, callback) {
    if (!e) var e = window.event;
    ColumnResizer.state = 'down';
    ColumnResizer.td = td;
    ColumnResizer.tdHeading = tdHeading;
    ColumnResizer.tableHeadings = tableHeadings;
    ColumnResizer.table = table;
    ColumnResizer.callback = callback;
    if (td != undefined) {
        ColumnResizer.start[0] = td.offsetWidth - e.pageX;
    }
    ColumnResizer.start[1] = tableHeadings.offsetWidth - e.pageX;
    ColumnResizer.timer = new Timer(ColumnResizer.callback, 1000, 1);


}

document.documentElement.addEventListener("mouseup", function (e) {
        ColumnResizer.state = 'up';
    }
);
document.documentElement.addEventListener("mousemove", function (e) {
    if (ColumnResizer.state == 'down') {
        if (ColumnResizer.td != undefined) {
            ColumnResizer.td.setAttribute("width", String(ColumnResizer.start[0] + e.pageX) + 'px !important');
        }
        ColumnResizer.tdHeading.setAttribute("width", String(ColumnResizer.start[0] + e.pageX) + 'px !important');
        if (ColumnResizer.table != undefined) {
            ColumnResizer.table.setAttribute("width", String(ColumnResizer.start[1] + e.pageX) + 'px !important');
        }
        ColumnResizer.tableHeadings.setAttribute("width", String(ColumnResizer.start[1] + e.pageX) + 'px !important');
        ColumnResizer.timer.reset();
    }
});