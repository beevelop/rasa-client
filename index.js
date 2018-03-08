'use strict'

const got = require('got')
const _ = require('lodash')

class RasaClient {
  /**
   * @constructor
   * @this {RasaClient}
   * @param {String} endpoint - The server url (Rasa core) to connect to (e.g. http://localhost:5005) without trailing slash
   * @param {String} token - The token used for authentication (optional)
   * @see {@link https://core.rasa.ai/0.8.3/http.html#security-considerations|Rasa Core documentation on Security Considerations}
   */
  constructor(endpoint, token) {
    this.endpoint = endpoint
    this.token = token
  }

  _request(url, opts) {
    opts = opts || {}

    // Optionally append the token to the query params
    if (this.token) {
      _.set(opts, 'query.token', this.token)
    }
    _.set(opts, 'json', true)
    return got(url, opts)
  }

  _get(urlEndpoint, query) {
    this._request(urlEndpoint, {query})
  }

  _post(urlEndpoint, body) {
    this._request(urlEndpoint, {method: 'POST', body})
  }

  _put(urlEndpoint, body) {
    this._request(urlEndpoint, {method: 'PUT', body})
  }

  /**
   * Notify the dialogue engine that the user posted a new message.
   *
   * @param {string} query
   * @param {string} senderId - conversation id (e.g. default if you just have one user, or the facebook user id or any other identifier)
   * @see {@link https://core.rasa.ai/0.8.3/http.html#post--conversations-(str-sender_id)-parse|Rasa Core documentation}
   */
  parse(query, senderId) {
    senderId = senderId || 'default'
    return this._post(`/conversations/${senderId}/parse`, {
      query
    })
  }

  /**
   * Continue the prediction loop for the conversation with id sender_id.
   * Should be called until the endpoint returns action_listen as the next action.
   * Between the calls to this endpoint, your code should execute the mentioned next action.
   * If you receive action_listen as the next action, you should wait for the next user input.
   *
   * @param {Object} payload
   * @param {string} senderId
   * @see {@link https://core.rasa.ai/0.8.3/http.html#post--conversations-(str-sender_id)-continue|Rasa Core documentation}
   */
  continue(payload, senderId) {
    senderId = senderId || 'default'
    payload = payload || {}
    return this._post(`/conversations/${senderId}/continue`, payload)
  }

  /**
   * Retrieves the current tracker state for the conversation with sender_id.
   * This includes the set slots as well as the latest message and all previous events
   *
   * @param {string} senderId
   * @see {@link https://core.rasa.ai/0.8.3/http.html#get--conversations-(str-sender_id)-tracker|Rasa Core documentation}
   */
  getTracker(senderId) {
    senderId = senderId || 'default'
    return this._get(`/conversations/${senderId}/tracker`)
  }

  /**
   * Replace the tracker state using events.
   * Any existing tracker for sender_id will be discarded.
   * A new tracker will be created and the passed events will be applied to create a new state.
   *
   * @param {string} payload - Passed event
   * @param {string} senderId - optional the sender_id (defaults to „default“)
   * @see {@link https://core.rasa.ai/0.8.3/http.html#put--conversations-(str-sender_id)-tracker|Rasa Core documentation}
   */
  putTracker(payload, senderId) {
    senderId = senderId || 'default'
    return this._put(`/conversations/${senderId}/tracker`, payload)
  }

  /**
   * Append the tracker state of the conversation with events.
   * Any existing events will be kept and the new events will be appended, updating the existing state.
   *
   * @param {array} events - array of events
   * @param {string} senderId - optional the sender_id (defaults to „default“)
   * @see {@link https://core.rasa.ai/0.8.3/http.html#post--conversations-(str-sender_id)-tracker-events|Rasa Core documentation}
   */
  postEvents(events, senderId) {
    senderId = senderId || 'default'
    return this._put(`/conversations/${senderId}/tracker/events`, events)
  }

  /**
   * Version of Rasa Core that is currently running.
   * @see {@link https://core.rasa.ai/0.8.3/http.html#get--version|Rasa Core documentation}
   */
  getVersion() {
    return this._get('/version')
  }
}

module.exports = RasaClient
