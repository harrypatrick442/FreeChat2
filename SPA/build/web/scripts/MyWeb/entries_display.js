function EntriesDisplay(callbackGetIdentifier, callbackGetNewEntry, sortPropertyName)
{
    var self = this;
    this.div = document.createElement('div');
    this.div.style.height = 'calc(100% - 4px)';
    this.div.style.width = 'calc(100% - 2px)';
    this.div.style.overflowY = 'auto';
    var currentPropertyStrings = [];
    var currentEntries = [];
    var mapIdentToEntry = {};
    this.update = function (newEntries) {
        sort(mapIdentToEntry, newEntries, currentPropertyStrings, currentEntries, function (entry, j) {
            self.div.insertBefore(entry.div, self.div.children[j]);
        }, function (entry) {
            self.div.appendChild(entry.div);
        },
                function (entry) {
                    delete mapIdentToEntry[callbackGetIdentifier(entry)];
                    self.div.removeChild(entry.div);
                },
                function (r, identifier) {
                    callbackGetNewEntry(r);
                    mapIdentToEntry[identifier] = r;
                    return r;
                }, true);
    };
    function sort(mapIdentityToInfo, newEntries, currentPropertyStrings, currentEntries, callbackInsert, callbackPush, callbackRemove, callbackGetNewEntryFromInfo, doUpdate) {
        var wanted = [];
        var i = 0;
        var oldCurrentEntries = [];
        for (var i = 0; i < currentEntries.length; i++)
            oldCurrentEntries.push(currentEntries[i]);
        for (var i = newEntries.length - 1; i >= 0; i--)
        {
            var r = newEntries[i];
            var sortProperty = r[sortPropertyName];
            var identifier = callbackGetIdentifier(r);
            var entry = mapIdentToEntry[identifier];
            if (!entry)
            {
                var entry = callbackGetNewEntryFromInfo(r, identifier);
                var inserted = false;
                var entryProperty = entry[sortPropertyName];
                oldCurrentEntries.splice(oldCurrentEntries.indexOf(entry), 1);
                for (var j = 0; j < currentPropertyStrings.length; j++)
                {
                    if (currentPropertyStrings[j] > entryProperty)
                    {
                        callbackInsert(entry, j);
                        currentEntries.splice(j, 0, entry);
                        currentPropertyStrings.splice(j, 0, entryProperty);
                        inserted = true;
                        break;
                    }
                }
                if (!inserted)
                {
                    callbackPush(entry);
                    currentEntries.push(entry);
                    currentPropertyStrings.push(entryProperty);
                }
            } else
            {
                if (doUpdate)
                {
                    if (entry.update)
                    {
                        entry.update(r);
                    }
                }
            }
            wanted.push(entry);
        }
        i = 0;
        while (i < currentEntries.length)
        {
            var entry = currentEntries[i];
            if (wanted.indexOf(entry) < 0)
            {
                if (entry.close)
                {
                    try
                    {
                        entry.close();
                    } catch (ex)
                    {
                        console.log(ex);
                    }
                }
                callbackRemove(currentEntries[i]);
                currentEntries.splice(i, 1);
                currentPropertyStrings.splice(i, 1);
            } else
            {
                i++;
            }
        }
    }
    this.setSortPropertyName = function (newN) {
        sortPropertyName = newN;
    };
    this.sort = function ()
    {
        var newCurrentPropertyStrings = [];
        var newCurrentEntries = [];
        sort({}, currentEntries, newCurrentPropertyStrings, newCurrentEntries, function () {

        }, function () {
        },
                function () {
                },
                function (r) {
                    return r;
                });
        for (var i = 0; i < newCurrentEntries.length; i++)
        {
            var entry = newCurrentEntries[i];
            self.div.removeChild(entry.div);
            if (i < newCurrentEntries.length)
                self.div.insertBefore(entry.div, self.div.children[i]);
            else
                self.div.appendChild(entry.div);
        }
        currentPropertyStrings = newCurrentPropertyStrings;
        currentEntries = newCurrentEntries;
    };

}

