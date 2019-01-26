
function clearBlanks (obj) {
  var res = []
  for (var i = 0, length1 = obj.length; i < length1; i++) {
    var o = obj[i]
    if (o.length) {
      res.push(o)
    }
  }
  return res
}
module.exports = { clearBlanks: clearBlanks }
