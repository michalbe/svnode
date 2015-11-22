'use strict';
;(function() {
  var inquirer = require('inquirer');
  var svnode = {
    status: require('./lib/status')
  };

  var showMenu = function(){
    console.log('\n\n');
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
          svnode.status(showMenu);
          break;
        case 'Quit':
          process.exit();
          break;
      }
    });
  };

  // Clear screen
  console.log('\u001b[2J\u001b[0;0H');
  showMenu();

})();
