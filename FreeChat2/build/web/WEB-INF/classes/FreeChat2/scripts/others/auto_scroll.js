function AutoScroll(scrollingElement, table)
{
    this.scroll=function(row)
    {
        var tableOffsets = getAbsolute(table);
        var trOffsets = getAbsolute(row);
        var upperPosition = scrollingElement.scrollTop;
        var lowerPosition = upperPosition + scrollingElement.clientHeight;
        var top = trOffsets.top - tableOffsets.top;
        if (top > upperPosition) {
            if (top <= lowerPosition - row.offsetHeight) {
            }
            else {
                goingDown(trOffsets.top, row.offsetHeight, tableOffsets.top);
            }
        }
        else {
            goingUp(trOffsets.top, row.offsetHeight, tableOffsets.top);
        }
    }
function goingDown(trTop, rowHeight, tableTop) {
    var scrollPosition = trTop + rowHeight - (tableTop + scrollingElement.clientHeight);
    scrollingElement.scrollTop = scrollPosition;
}
function goingUp(trTop, rowHeight, tableTop) {
    var scrollPosition = trTop - (tableTop);
    scrollingElement.scrollTop = scrollPosition;
}
}