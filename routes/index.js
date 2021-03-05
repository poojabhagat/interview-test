
exports.index= function(req,res){
	res.render('index', { title: 'ejs' });
};
exports.tpl=function(req, res){
	var name=req.params.name;
	res.render('tpl/'+name);
};