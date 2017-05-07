var prompt = require('prompt');
var find = require('find');
var exec = require('child_process').exec;

var promptSchema = {
    properties: {
        'preset': {
            message: 'Specify a Handbrake preset. Leave blank to use "Fast 1080p30"'
        },
        'source directory': {
            message: 'Specify a source directory for your video files. Leave blank to use current directory'
        },

    }
};
var handbrakeData = {};

prompt.start();

prompt.get(promptSchema, function (err, result) {
    if (err) {
        return;
    }
    (result['preset'] === '') ? handbrakeData['preset'] = 'Fast 1080p30' : handbrakeData['preset'] = result['preset'];
    (result['source directory'] === '') ? handbrakeData['source directory'] = __dirname : handbrakeData['source directory'] = result['source directory'];

    find.file(handbrakeData['source directory'], function(files) {
        console.log(JSON.stringify(files.length) + " files found in directory");

        for(var i = 0; i < files.length; i++) {
            var sourceFilePath = files[i];
            var destFilePath = sourceFilePath.substring(0, sourceFilePath.indexOf('.mkv')) + '.mp4';
            var handBrakeCmd = 'HandBrakeCLI -i ' + sourceFilePath + ' -o ' + destFilePath + ' --preset="' + handbrakeData['preset'] + '"';
            
            exec(handBrakeCmd, function(error, stdout, stderr) {
                // command output is in stdout
                console.log("Did something happen?", error);
            });
        }

    })
});

function onErr(err) {
    console.log(err);
    return 1;
}