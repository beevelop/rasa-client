import test from 'ava'
import RasaClient from './index'

const ENDPOINT = 'http://localhost:5005'
const SENDER_ID = 'bee'
const AUTH_TOKEN = 'neolution'

test('init without token', async t => {
  let rc = new RasaClient(ENDPOINT)
  t.true(rc instanceof RasaClient)
  t.log(await rc.getVersion())
})

test.failing('init without endpoint', async t => {
  let rc = new RasaClient()
  t.true(rc instanceof RasaClient)
  t.truthy(await rc.getVersion())
})

test('init with token', async t => {
  let rc = new RasaClient(ENDPOINT, AUTH_TOKEN)
  t.true(rc instanceof RasaClient)
  t.truthy(await rc.getVersion())
})

test('getVersion', async t => {
  let rc = new RasaClient(ENDPOINT)
  t.deepEqual(await rc.getVersion(), {
    'version': '0.8.3'
  })
})

test('parse without senderId', async t => {
  let rc = new RasaClient(ENDPOINT)
  const msg = 'hello'
  let reply = await rc.parse(msg)
  t.is(reply.next_action, 'greet')
  t.is(reply.tracker.latest_message.text, msg)
})

test('parse with senderId', async t => {
  let rc = new RasaClient(ENDPOINT)
  const msg = 'Whats the next event'
  let reply = await rc.parse(msg, SENDER_ID)
  t.is(reply.next_action, 'search_concerts')
  t.is(reply.tracker.latest_message.text, msg)
  t.is(reply.tracker.sender_id, SENDER_ID)
})

test('continue with senderId', async t => {
  let rc = new RasaClient(ENDPOINT)
  const msg1 = 'hello'
  let reply

  // Greet the bot
  reply = await rc.parse(msg1, SENDER_ID)
  t.is(reply.next_action, 'greet')

  // Executed Action: greet
  let continue1 = await rc.continue({
    executed_action: 'greet'
  }, SENDER_ID)
  t.is(continue1.next_action, 'action_listen')

  // Send venues request
  const msg2 = 'Whats the next event'
  reply = await rc.parse(msg2, SENDER_ID)
  t.is(reply.next_action, 'search_concerts')

  // Execute search_concerts action
  let continue2 = await rc.continue({
    executed_action: 'search_concerts',
    events: [{ event: 'slot', name: 'venues', value: [
      {name: "Big Arena", reviews: 4.5},
      {name: "Small Arena", reviews: 4.2}
    ]}]
  }, SENDER_ID)

  t.true(Array.isArray(continue2.tracker.slots.venues))
})

test('getTracker', async t => {
  let rc = new RasaClient(ENDPOINT)
  let tracker = await rc.getTracker()
  t.true(Array.isArray(tracker.events))
})

test('putTracker', async t => {
  let rc = new RasaClient(ENDPOINT)
  let tracker = await rc.putTracker({})

  t.true(Array.isArray(tracker.events))
  t.true(tracker.events.length === 0)
  t.true(tracker.latest_event_time === null)
})

test('postEvents', async t => {
  let rc = new RasaClient(ENDPOINT)
  
  // reset tracker first
  let tracker = await rc.putTracker({})
  t.true(Array.isArray(tracker.events))
  t.true(tracker.events.length === 0)

  let postEvent = await rc.postEvents([{ event: 'slot', name: 'venues', value: [
    {name: "Big Arena", reviews: 4.5},
    {name: "Small Arena", reviews: 4.2}
  ]}])

  t.true(Array.isArray(postEvent.slots.venues))
  t.true(postEvent.slots.venues.length === 2)
})
