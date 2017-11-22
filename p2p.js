//basic message passing system
const topology = require('fully-connected-topology')
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')

let me = process.argv[2]
let friends = process.argv.slice(3)

let streams = streamSet()
let swarm = topology(me, friends)

swarm.on('connection', (friend) => {
  friend = jsonStream(friend)
  streams.add(friend)
  friend.on('data', (data) => {
    console.log(data.username + ': ' + data.message)
  })
  console.log('[a friend connected]')
})

process.stdin.on('data', (data) => {
  streams.forEach((friend) => {
    friend.write({
      username: me,
      message: data.toString().trim()
    })
  })
})
