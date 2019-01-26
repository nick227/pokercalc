'use strict'
class Users {
  constructor () {
    var username = 'nicholasj25'; var username2 = 'hzane'; var username3 = 'nitwit227'
    this.usernames = [username, username2]
  }
  check (str) {
    for (var i = 0, length1 = this.usernames.length; i < length1; i++) {
      var u = this.usernames[i]
      if (str.indexOf(u) > -1) {
        return true
      }
    }
    return false
  }
  get () {
    return this.usernames
  }
}

module.exports = Users
