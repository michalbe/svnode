#!/usr/bin/env node

'use strict';
;(function() {
  var inquirer = require('inquirer');
  var svnode = {
    status: require('../lib/status'),
    commit: require('../lib/commit')
  };

  var showMenu = function(){
    console.log('\n\n');
    inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'SVN actions',
      choices: [
        'Status',
        // 'Blame',
        // 'Log',
        'Commit',
        new inquirer.Separator(),
        'Quit'
      ]
    }], function( answers ) {
      switch (answers.action) {
        case 'Status':
          svnode.status(showMenu);
          break;
        case 'Commit':
          svnode.commit(showMenu);
          break;
        case 'Quit':
          // This thing clears the screen
          console.log('\u001b[2J\u001b[0;0H');
          process.exit();
          break;
      }
    });
  };

  console.log('\u001b[2J\u001b[0;0H');
  showMenu();
})();
