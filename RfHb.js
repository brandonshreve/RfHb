var prompt = require('prompt');
var find = require('find');
var execSync = require('child_process').execSync;

var promptSchema = {
    properties: {
        'preset': {
            message: 'Specify a Handbrake preset. Leave blank to use "Fast 1080p30"'
        },
        'source directory': {
            message: 'Specify a source directory for your video files. Leave blank to use current directory'
        },
        'output directory': {
            message: 'Specify an output directory for the transcoded files. Leave blank to use source directory'
        }
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
    (result['output directory'] === '') ? handbrakeData['output directory'] = handbrakeData['source directory'] : handbrakeData['output directory'] = result['output directory'];

    find.file(handbrakeData['source directory'], function(files) {
        console.log(JSON.stringify(files.length) + " files found in directory");

        for(var i = 0; i < files.length; i++) {
            var sourceFilePath = files[i];
            var destFilePath = undefined;

            if (handbrakeData['source directory'] === handbrakeData['output directory']) {
                destFilePath = sourceFilePath.substring(0, sourceFilePath.lastIndexOf('.')) + '.mp4';
            }
            else {
                var parseString = sourceFilePath.replace(handbrakeData['source directory'], handbrakeData['output directory']); 
                destFilePath = parseString.substring(0, parseString.lastIndexOf('.')) + '.mp4';
            }
            // Sanitize input
            // sourceFilePath = sourceFilePath.replace(' ', '^ ');
            // destFilePath = destFilePath.replace(' ', '^ ');

            var handBrakeCmd = 'HandBrakeCLI -i ' + sourceFilePath + ' -o ' + destFilePath + ' --preset="' + handbrakeData['preset'] + '"';

            console.log(handBrakeCmd);

            execSync(handBrakeCmd, function(error, stdout, stderr) {
                if(error) {
                    console.error(`exec error: ${error}`);
                    return 1;
                }
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        }

    })
});

function onErr(err) {
    console.log(err);
    return 1;
}