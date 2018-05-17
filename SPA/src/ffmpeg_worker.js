
function print(text) {
    postMessage({
        'type': 'stdout',
        'data': text
    });
}
var imported = false;
onmessage = function(event) {
    if (event.data.type=='setup')
    {
        if (event.data.ffmpegType == 'audio')
            importScripts('ffmpeg_audio.js');
        else
            importScripts('ffmpeg.js');
    }
    else
    {
        var module = {
            files: event.data.files || [],
            arguments: event.data.arguments || [],
            print: print,
            printErr: print
        };
        postMessage({
            'type': 'start',
            'data': module.arguments
        });
        var result = ffmpeg_run(module);
        postMessage({
            'type': 'done',
            'data': result
        });
    }
};

postMessage({
    'type': 'ready'
});