'use strict';
;(function() {
  var inquirer = require('inquirer');
  var svnode = {
    status: require('./lib/status')
  };

  // Clear screen
  console.log('\u001b[2J\u001b[0;0H');

  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'SVN actions',
    choices: [
      'Status',
      'Blame',
      'Log',
      'Commit',
      new inquirer.Separator(),
      'Quit'
    ]
  }], function( answers ) {
    switch (answers.action) {
      case 'Status':
        svnode.status();
        break;
      case 'Quit':
        break;
    }
  });
})();
