// The following needs to be entered as such in JSON:
// ObjectId: { "$oid": "<object Id string, 24 hex digits" }
// Date: { "$date": "ISO date string" }

/**
 * @typedef {object} DBMovie
 * @property {string} title
 * @property {string[]} genres
 * @property {number} year
 * @property {string[]} cast
 * @property {number} runtime
 * @property {string|undefined} trailer
 * @property {string|undefined} poster
 */

/**
 * @typedef {object} DBTheater
 * @property {string} name
 * @property {object} address
 * @property {string} address.street
 * @property {string} address.city
 * @property {string} address.state
 * @property {string} address.zipcode
 * @property {object[]} rooms
 * @property {string} rooms.name
 * @property {number} rooms.seat_count
 * @property {Map<string, string[]>} rooms.seats
 */

/**
 * @typedef {object} DBUser
 * @property {string} name
 * @property {string} email
 * @property {string} phone_number
 * @property {string} password_hashed
 * @property {object} member
 * @property {boolean} member.is_premium
 * @property {number} member.reward
 * @property {DBPaymentInfo} member.payment_info
 * @property {string[]} roles
 */

/**
 * @typedef {object} DBPaymentInfo
 * @property {string} account
 * @property {string} security_code_hashed
 */

/**
 * @typedef {object} Schedule
 * @property {import('mongodb').ObjectId} theater
 * @property {string} room
 * @property {import('mongodb').ObjectId} movie
 * @property {Date} dateTime
 * @property {number} duration
 * @property {number} price
 */

/**
 * @typedef {object} Booking
 * @property {import('mongodb').ObjectId|undefined} buyerId 
 * @property {Date} purchaseDateTime
 * @property {object} moviePass
 * @property {import('mongodb').ObjectId} moviePass.movieScreening
 * @property {object[]} moviePass.tickets
 * @property {string} moviePass.tickets.assignedSeat
 * @property {number} moviePass.tickets.price
 * @property {object[]} snackPass
 * @property {string} snackPass.item
 * @property {number} snackPass.price
 * @property {number} snackPass.tax
 * @property {number} snackPass.count
 * @property {number} discount
 * @property {DBPaymentInfo} payment_info
 */
