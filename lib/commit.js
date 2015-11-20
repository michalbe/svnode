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

  var commitFiles = function(filesToCommit, message){
    svn.commit(filesToCommit.map(function(file){
      return file.path;
    }), {
      m: message
    }, function(err) {
      if (err) {
        console.log('Error. Try again.', err);
        return;
      }

      console.log(
        clc.xterm(200)('Success. ' +
          filesToCommit.length +
          ' files commited to the repo.'
        )
      );
      cb();
    });
  };

  console.log('\u001b[2J\u001b[0;0H');

  svn.status('', {}, function(err, res) {
    if (res.status.target.entry) {
      if (res.status.target.entry.length) {
        res.status.target.entry.forEach(function(entry) {
          statusFiles.push(parseEntryLine(entry));
        });
      } else {
        statusFiles.push(parseEntryLine(res.status.target.entry));
      }
    } else {
      console.log('\n\n');
      console.log(clc.xterm(200)('Nothing to commit...'));
      cb();
      return;
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

      var filesToCommit = answers.files.filter(function(file) {
        // cannot leave it as 'modified' because there is 'added'
        // status as well etc...
        return file.status !== 'unversioned';
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

      inquirer.prompt([
      {
        type: 'expand',
        message: 'Is that correct?',
        name: 'continue',
        choices: [
          {
            key: 'y',
            name: 'Yes, continue',
            value: 1
          },
          {
            key: 'n',
            name: 'No, return to main menu.',
            value: 0
          }
        ]
      }], function( answers ) {
        if (answers.continue) {
          inquirer.prompt({
            type: 'input',
            name: 'commitMessage',
            message: 'Enter commit\'s message: '
          }, function(inputAnswers) {

            if (filesToAdd.length) {
              svn.add(filesToAdd.map(function(file){
                return file.path;
              }), {}, function(err, result) {
                if (err) {
                  console.log('Error. Try again.', err);
                  return;
                }
                commitFiles(
                  filesToCommit.concat(filesToAdd),
                  inputAnswers.commitMessage
                );
              });
            } else if (filesToCommit.length) {
              commitFiles(filesToCommit, inputAnswers.commitMessage);
            }
          });
        } else {
          cb();
        }
      });
    });
    //cb();
  });

};
