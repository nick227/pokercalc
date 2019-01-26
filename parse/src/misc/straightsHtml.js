var hands = [['A2345'], ['23456'], ['34567'], ['45678'], ['56789'], ['6789T'], ['789TJ'], ['89TJQ'], ['9TJQK'], ['TJQKA']]
var hand = null; var html = ''

for (var i = 0, length1 = hands.length; i < length1; i++) {
  hand = hands[i]
  html += '<div class="straight">'
  html += hand
  html += '</div>'
}

module.exports = html
