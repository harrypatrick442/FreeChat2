function YoutubeDownloader(callbackListVideos, callbackProgress, callbackFailed) {
    var mySocket = new MySocket('video_downloader');
    mySocket.addEventListener("message", interpret
            );
    var Formats = {mp3: 'mp3', wav: 'wav', avi: 'avi', mp4: 'mp4', flv: 'flv'};
    var VideosAvailableAllowedFormats = {mp4: 'mp4', webm: 'webm', '3gpp': '3gpp'};
    var qualitiesSubStrings = ['hd', 'high', 'medium', 'low'];
    var currentFfmpegWrappers = [];
    this.getVideosAvailable = function(url) {
        if (url)
        {
            var jObject = {url: url, type: 'download'};
            console.log('sending now');
            mySocket.send(jObject);
            console.log("sent");
        }
        else
            callbackFailed('URL can not be empty!');
    };
    function interpret(event) {
        var message = event.message;
        switch (message.type)
        {
            case 'done':
                var i = new Iterator(message.cookies);
                while (i.hasNext())
                {
                    var cookie = i.next();
                    console.log(cookie);
                    document.cookie = cookie;
                }
                callbackListVideos(message.links_videos, message.links_audios, message.title, message.icon);
                break;
            case 'progress':
                callbackProgress(message.message);
                break;
            case 'failed':
                callbackFailed(message.message);
                break;
        }
    }
    function getVideoId(url)
    {
        console.log('getVideoId');
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
            return match[2];
        }
    }
    this.getDownloadLink = function(url, fileName, text)
    {
        var link = document.createElement('a');
        link.href = url;
        //link.type=type;
        link.download = fileName;
        link.textContent = text;
    };
    function convert(input, toFormat, callback, callbackFailed)
    {
        console.log('convert');
        var outputFileName;
        var toAudio = false;
        switch (toFormat)
        {
            case 'mp4':
                callback({format: toFormat, data: input.data});
                return;
            case 'mp3':
                console.log('is mp3');
                outputFileName = 'output.mp3';
                toAudio = true;
                break;
            case 'wav':
                outputFileName = 'output.wav';
                break;
        }
        var ffmpegWrapper = new FfmpegWrapper(toAudio);
        ffmpegWrapper.ondone = function(results)
        {
            if (results.length > 0)
            {
                var result = results[0];
                if (result.name)
                {
                    currentFfmpegWrappers.splice(currentFfmpegWrappers.indexOf(ffmpegWrapper), 1);
                    callback({format: toFormat, data: new Uint8Array(result.data)});
                    return;
                }
            }
            callbackFailed();
        };
        currentFfmpegWrappers.push(ffmpegWrapper);
        var inputFileName = 'input.' + input.format;
        ffmpegWrapper.runCommand([{name: inputFileName, data: input.data}], '-i ' + inputFileName + ' ' + outputFileName);
    }
    //ffmpegWrapper.runCommand('input.mp4', uint8Array, '-i input.mp4 output.wav');
    //ffmpegWrapper.runCommand('input.wav', uint8Array, '-i input.wav -codec:a libmp3lame -qscale:a 2 output.mp3');
    //ffmpegWrapper.runCommand('input.mp4', uint8Array, '-i input.mp4 -vf showinfo -strict -2 output.webm');
    // ffmpegWrapper.runCommand('input.wav', new Uint8Array(result.data), '-i input.wav  output.mp3');

}
/*
 function getVideoId(url)
 {
 var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
/*var match = url.match(regExp);
 if (match && match[2].length == 11) {
 return match[2];
 }
 }
 const videoUrls = ytplayer.config.args.url_encoded_fmt_stream_map
 .split(',')
 .map(item => item
 .split('&')
 .reduce((prev, curr) => (curr = curr.split('='),
 Object.assign(prev, {[curr[0]]: decodeURIComponent(curr[1])})
 ), {})
 )
 .reduce((prev, curr) => Object.assign(prev, {
 [curr.quality + ':' + curr.type.split(';')[0]]: curr
 }), {});
 
 //console.log(videoUrls);
 
 // ES5 version
 var videoUrls = ytplayer.config.args.url_encoded_fmt_stream_map
 .split(',')
 .map(function (item) {
 return item
 .split('&')
 .reduce(function (prev, curr) {
 curr = curr.split('=');
 return Object.assign(prev, {[curr[0]]: decodeURIComponent(curr[1])});
 }, {});
 })
 .reduce(function (prev, curr) {
 return Object.assign(prev, {
 [curr.quality + ':' + curr.type.split(';')[0]]: curr
 });
 }, {});
 console.log(videoUrls);Youtu
 */


/*
 * 
 if (videoId)
 {
 alternative();
 return;
 getRawVideoInformation(videoId, function(rawVideoInformation) {
 console.log(rawVideoInformation);
 var failedMessage = 'found no suitable video sources :(!';
 if (rawVideoInformation) {
 var videoInformations = PrepareVideoInformation(rawVideoInformation);
 console.log(videoInformations);
 if (videoInformations) {
 if (videoInformations.length > 0)
 {
 callback(filterVideoInformations(videoInformations));
 return;
 }
 }
 //do other way
 
 //end do other way
 return;
 }
 callbackFailed(failedMessage);
 }, alternative);
 }*/