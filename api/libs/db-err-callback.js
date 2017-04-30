module.exports.find = function (err,x,type,res) {
  if(err) return res.status(500).json({err:err.errmsg});
  if(!x) return res.status(404).json({err:type+" not found!"});
  return 0;
}
