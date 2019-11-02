const fs = require('fs');
const youtubedl = require('youtube-dl');

downloadYoutubeVideo = (url, start, end, directory) => {
  const video = youtubedl('https://www.youtube.com/watch?v=' + url,
  ['--format=18'],
  { cwd: __dirname });
  const name = Math.random().toString(36).substring(9);
 
  video.on('info', function(info) {
    console.log('Download started');
    console.log('filename: ' + info._filename);
    console.log('size: ' + info.size);
  });

  video.on('end', function() {
    console.log('Converting video to mp3...');
    cutVideo(name, start, end, directory);
  });

  video.pipe(fs.createWriteStream(`/tmp/${name}.mp4`));

  return name;
}

cutVideo = (name, start, end, directory) => {
  const { spawn } = require( 'child_process' );
  const ls = spawn('ffmpeg', [ '-y', '-i', `/tmp/${name}.mp4`, '-ss', start, '-t', end, directory + name + '.mp3' ] );

  ls.stdout.on( 'data', data => {
      console.log( `stdout: ${data}` );
  });
}

main = () => {
  try {
    const args = process.argv.slice(2);
    const url = args[0];
    const start = args[1];
    const end = args[2];
    let directory = "";

    if(args[3] != null)
      directory = args[3] + "/";

    downloadYoutubeVideo(url, start, end, directory);
  } catch(e) {
    console.log(e);
  }
}

main();