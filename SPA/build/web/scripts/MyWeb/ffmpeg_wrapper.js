function FfmpegWrapper(includeAudio)
{
    var self = this;
    var worker;
    this.running = false;
    try
    {
        worker = new Worker('scripts/ffmpeg_worker.js');
    } catch (ex) {
        worker = new Worker(URL.createObjectURL(new Blob(["(" + TimerWorker.toString() + ")()"], {type: 'text/javascript'})));
    }
    worker.postMessage({type: 'setup', 'ffmpegType': includeAudio ? 'audio' : 'standard'});
    function isReady() {
        return !self.running;
    }
    function parseArguments(text) {
        text = text.replace(/\s+/g, ' ');
        var args = [];
        // Allow double quotes to not split args.
        text.split('"').forEach(function(t, i) {
            t = t.trim();
            if ((i % 2) === 1) {
                args.push(t);
            } else {
                args = args.concat(t.split(" "));
            }
        });
        return args;
    }


    this.runCommand = function(inputs, arguments) {
        if (isReady()) {
            var args = parseArguments(arguments);
            var files = [];
            for (var i = 0; i < inputs.length; i++)
            {
                var input = inputs[i];
                files.push(includeAudio ? {"name": input.name, "buffer": input.data} :
                        {"name": input.name, "data": input.data});
            }
            worker.postMessage({
                type: "command",
                arguments: args,
                files: files
            });
        }
    };
    worker.onmessage = function(e) {
        var data = e.data;
        switch (data.type)
        {
            case "start":
                self.running = true;
                console.log('start');
                if (self.onstart)
                    self.onstart();
                break;
            case "done":
                self.running = false;
                alert('done');
                var results;
                if (includeAudio)
                {
                    results = [];
                    for (var i in data.data.outputFiles)
                    {
                        results.push({name: i, data: data.data.outputFiles[i]});
                    }
                }
                else
                    results = data.data;
                if (self.ondone)
                    self.ondone(results);
                break;
            case "ready":
                console.log('ready');
                if (self.onready)
                    self.onready();
                break;
            case "stdout":
                console.log('ffmpeg: ' + data.data);
                break;
        }
    };
}