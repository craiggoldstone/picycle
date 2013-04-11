
/*
 * GET craig page.
 */

exports.get = function(req, res){
  res.render('map', { title: 'Map' });
};