'use strict';
module.exports = function(cb) {
  var svn = require('svn-interface');
  var clc = require('cli-color');
  var inquirer = require('inquirer');

  var color;
  var statusFiles = [];

  // Whats happening in here is basically adding different colors to different
  // types of files - unversioned will be gray, modified yellow, etc.
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

    // Create `inquirer` prompt option object. `value` is an object that will
    // be passed to the callback when the answer will be choosen, name is the
    // one that will be displayed
    return {
      value: {
        status: status,
        path: path
      },
      name: color(status + ' ' + path)
    };
  };

  var commitFiles = function(filesToCommit, message) {
    // Commit files to the repo. Whats basicaly happening in here is just
    // `svn commit` + expanded filesToCommit array + ' -m ' + message run
    // in background
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

  // Clear the screen
  console.log('\u001b[2J\u001b[0;0H');

  // Then ask svn for the modified files (`svn status`)
  svn.status('', {}, function(err, res) {
    // This part is simmilar to what happend in lib/status.js, LOC 29
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

    // Then display the prompt with every single file returned by `svn status`
    // as a checkbox, so user can choose any number of them.
    console.log('\n\n');
    inquirer.prompt([{
      type: 'checkbox',
      name: 'files',
      pageSize: 30,
      message: 'Select files to commit/add. ' +
                clc.xterm(236)('Press ENTER for the next step'),
      choices: statusFiles,
    }], function(answers) {
      // Clear the screen when files will be choosen.
      console.log('\u001b[2J\u001b[0;0H');

      // This array will contain only files that are not versioned, so they
      // need to be added to the repository before the commit
      var filesToAdd = answers.files.filter(function(file) {
        return file.status === 'unversioned';
      });

      // Rest of the files come here...
      var filesToCommit = answers.files.filter(function(file) {
        // ... I cannot leave it as 'modified' because there is 'added'
        // status as well etc...
        return file.status !== 'unversioned';
      });

      // If there are any files to add before the commit, display them here.
      if (filesToAdd.length) {
        console.log('FILES/DIRECTORIES TO ADD: ');
        filesToAdd.forEach(function(file) {
          console.log('  - ' + clc.xterm(227)(file.path));
        });
        console.log('\n');
      }

      // If there are any files that are already in the repo, but were modified,
      // display them here
      if (filesToCommit.length) {
        console.log('FILES TO COMMIT: ');
        filesToCommit.forEach(function(file){
          console.log('  - ' + clc.xterm(227)(file.path));
        });
      }

      // Ask if the list above is exactly what user want.
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
        // If so...
        if (answers.continue) {
          // ...display the input for the commit message.
          inquirer.prompt({
            type: 'input',
            name: 'commitMessage',
            message: 'Enter commit\'s message: '
          }, function(inputAnswers) {
            // If there are files to add before the commit, add them here
            // (run `svn add` on them)
            if (filesToAdd.length) {
              // Since filesToAdd is an array of answer objects like this:
              // {
              //   path: ...,
              //   status: ...,
              // }
              // and we need only path to file to commit it, map the whole
              // array to the new one
              svn.add(filesToAdd.map(function(file) {
                return file.path;
              }), {}, function(err, result) {
                if (err) {
                  console.log('Error. Try again.', err);
                  return;
                }
                // Concatenate files that were in the repo already with those
                // recently added and commit them ALL
                commitFiles(
                  filesToCommit.concat(filesToAdd),
                  inputAnswers.commitMessage
                );
              });
            } else if (filesToCommit.length) {
              // if there were only changes (no new files), commit them
              commitFiles(filesToCommit, inputAnswers.commitMessage);
            }
          });
        } else {
          // Display the menu if user doesn't confirm the commit
          cb();
        }
      });
    });
  });

};
