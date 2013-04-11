
/*
 * GET craig page.
 */

exports.get = function(req, res){
  res.render('craig', { title: 'Craig\'s custom page' });
};