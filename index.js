'use strict';
var svnode = function() {
  var svn = require('svn-interface');

  svn.status('', {}, function(err, res){
    console.log(res.status.target.entry.map(function(entry){
      return entry['wc-status']._attribute.item + ' - ' + entry._attribute.path;
    }));
  });
};

module.export = svnode;
