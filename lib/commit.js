'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var inquirer = require('inquirer');

  var color;
  var statusFiles = [];
  var parseEntryLine = function(entry) {
    var status = entry['wc-status']._attribute.item;
    var path = entry._attribute.path;
    switch (status) {
      case 'unversioned':
        color = clc.xterm(236);
        break;
      case 'modified':
        color = clc.xterm(227);
        break;
      default:
      console.log('dupa', status);
        color = clc.white;
        break;
    }
    return {
      value: {
        status: status,
        path: path
      },
      name: color(status + ' ' + path)
    };
  };

  console.log('\u001b[2J\u001b[0;0H');
  console.log(clc.xterm(200)('Locally modified items:'));

  svn.status('', {}, function(err, res) {
    if (res.status.target.entry.length) {
      res.status.target.entry.forEach(function(entry) {
        statusFiles.push(parseEntryLine(entry));
      });
    } else {
      statusFiles.push(parseEntryLine(res.status.target.entry));
    }

    console.log('\n\n');
    inquirer.prompt([{
      type: 'checkbox',
      name: 'files',
      pageSize: 30,
      message: 'Select files to commit/add. ' +
                clc.xterm(236)('Press ENTER for the next step'),
      choices: statusFiles,
    }], function(answers) {
      console.log('\u001b[2J\u001b[0;0H');
      var filesToAdd = answers.files.filter(function(file) {
        return file.status === 'unversioned';
      });

      var filesToCommit = answers.files.filter(function(file){
        return file.status === 'modified';
      });


      if (filesToAdd.length) {
        console.log('FILES/DIRECTORIES TO ADD: ');
        filesToAdd.forEach(function(file) {
          console.log('  - ' + clc.xterm(227)(file.path));
        });
        console.log('\n');
      }

      if (filesToCommit.length) {
        console.log('FILES TO COMMIT: ');
        filesToCommit.forEach(function(file){
          console.log('  - ' + clc.xterm(227)(file.path));
        });
      }

    });
    //cb();
  });

};
