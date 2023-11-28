import gulp from 'gulp';
import zip from 'gulp-zip';
import path from 'path';
import fs from 'fs';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import { v4 as uuidv4 } from 'uuid';
import jsonEditor from 'gulp-json-editor';

gulp.task('create-customwidget', (done) => {
	const currentDir = process.cwd();
	const tempFilePath = path.join(currentDir, 'templatefiles');
	const widgetName = process.argv[4].replace(/"/g, '').trim();
	
	const srcFilePath = path.join(currentDir,'templatefiles/src/sourcefile.js');
	const configFilePath = path.join(currentDir,'templatefiles/widgetconfig.json');
	const randomGuid = uuidv4();

	gulp.src(`${tempFilePath}/**/*`)
		.pipe(rename((file) => {
			file.dirname = file.dirname.replace('templatefiles', widgetName);
		}))
		.pipe(gulp.dest(path.join(currentDir, widgetName,'src')))
		.on('end', function () {
			gulp.src(srcFilePath)
				.pipe(replace(/guid: ([\"]).*([\"])/g, 'guid: "' + randomGuid + '"'))
				.pipe(replace(/widgetName: ([\"]).*([\"])/g, 'widgetName: "' + widgetName + '"'))
				.pipe(gulp.dest(path.join(currentDir, widgetName,'src/src')))
				.on('end', function () {
					const keyValuePairs = {
						guid: randomGuid,
						widgetName: widgetName,
						displayName: widgetName
					};
					gulp.src(configFilePath)
						.pipe(jsonEditor(keyValuePairs))
						.pipe(gulp.dest(path.join(currentDir,widgetName,'src')))
						.on('end', function(){
							fs.mkdirSync(path.join(currentDir, widgetName,'doc'), { recursive: true });
							done();
						});
				});
		});
});

gulp.task('pack-all-customwidgets', (done) => {
  const currentDir = process.cwd();

  const subdirectories = fs.readdirSync(currentDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name != '.git' && entry.name != 'node_modules' && entry.name != 'dist' && entry.name != 'templatefiles')
    .map(entry => ({
      path: path.join(currentDir, entry.name),
      name: entry.name
    }));

  subdirectories.forEach(({ path: subdirectoryPath, name: subdirectoryName }) => {
    const directoryToCheck = path.join(subdirectoryPath, 'src');

    fs.stat(directoryToCheck, (err, stat) => {
      if (!err && stat.isDirectory()) {
        gulp.src([`${directoryToCheck}/icon/**/*`,`${directoryToCheck}/src/**/*`,`${directoryToCheck}/style/**/*`,`${directoryToCheck}/widgetconfig.json`], { base: directoryToCheck })
          .pipe(zip(`${subdirectoryName}.bicw`))
          .pipe(gulp.dest('dist'));
      } else {
        console.log('Directory does not exist:', directoryToCheck);
      }
    });
  });
  done();
});

gulp.task('pack-customwidget', (done) => {
	const widgetName = process.argv[4].replace(/"/g, '').trim();
	const subdirectories = [{path: path.join(process.cwd(),widgetName), name:widgetName}];

	subdirectories.forEach(({ path: subdirectoryPath, name: subdirectoryName }) => {
		const directoryToCheck = path.join(subdirectoryPath, 'src');

		fs.stat(directoryToCheck, (err, stat) => {
		  if (!err && stat.isDirectory()) {
			gulp.src([`${directoryToCheck}/icon/**/*`,`${directoryToCheck}/src/**/*`,`${directoryToCheck}/style/**/*`,`${directoryToCheck}/widgetconfig.json`], { base: directoryToCheck })
			  .pipe(zip(`${subdirectoryName}.bicw`))
			  .pipe(gulp.dest(path.join(subdirectoryPath, 'dist')));
		  } else {
			console.log('Directory does not exist:', directoryToCheck);
		  }
		});
	});
	done();
});

gulp.task('run-tasks', gulp.series('pack-all-customwidgets','pack-customwidget','create-customwidget'));  

