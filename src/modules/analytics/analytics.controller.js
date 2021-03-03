const { verify } = require("../../utils/google/auth")
const jwt = require('jsonwebtoken');
const { tableName, getAllDocuments } = require("../../utils/connections_db/firebase-models");

let getDailyEvents = async (req, res) => {
    let daily = await verify("", 'ga:metric4', 0, '30daysAgo', 'today', '', '');
    let count = await verify("", 'ga:metric4', 0, '2005-01-01', 'today', '', '');
    res.json({ daily: daily, count })
}
let getMaxSpectators = async (req, res) => {
    let spectators = await verify("ga:date", 'ga:metric2', 1, '365daysAgo', 'today', '', '-ga:metric2');
    res.json({ spectators: spectators })
}
let getEventsSpectators = async (req, res) => {
    let frequence = req.params.frequence;
    let year = req.params.year;
    if (frequence === "months") {
        let events = await verify(['ga:month'], 'ga:metric4,ga:metric2', 0, `${year}-01-01`, 'today', `ga:year==${year}`, '');
        let typeEvent = await verify(['ga:dimension5'], ['ga:metric4'], 0, `${year}-01-01`, 'today', `ga:year==${year}`, '')
        res.json({ events, typeEvent })
    }
    else if (frequence === "years") {
        let events = await verify(['ga:year'], 'ga:metric4,ga:metric2', 0, `${year * 365}daysAgo`, 'today', ``, '');
        let typeEvent = await verify(['ga:dimension5'], ['ga:metric4'], 0, `${year * 365}daysAgo`, 'today', ``, '')
        res.json({ events, typeEvent })
    }
    else if (frequence === "weeks") {
        year = Number(year) + 1
        if (year < 10) {
            year = '0' + String(year)
        }
        let events = await verify(['ga:week'], 'ga:metric4,ga:metric2', 0, `30daysAgo`, 'today', `ga:month==${year}`, '');
        let typeEvent = await verify(['ga:dimension5'], ['ga:metric4'], 0, `30daysAgo`, 'today', `ga:month==${year}`, '')
        res.json({ events, typeEvent })
    }
}
let getEventAnalytics = async (req, res) => {
    let id = req.params.id;
    let spectators = await verify(['ga:dimension1'], ['ga:metric2'], 1, '2005-01-01', 'today', `ga:dimension1==${id}`, '')
    let chats = await verify(['ga:dimension1'], ['ga:metric5'], 1, '2005-01-01', 'today', `ga:dimension1==${id}`, '')
    let interactions = await verify(['ga:dimension1'], ['ga:metric3'], 1, '2005-01-01', 'today', `ga:dimension1==${id}`, '')
    return res.json({
        spectators,
        chats,
        interactions
    })
}
let getMyEventsAnalytics = async (req, res) => {
    let token = req.get('Authorization');
    jwt.verify(
        token.substring(6),
        'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        (err, decoded) => {
            if (err) {
                res.status(401)
                    .json({
                        'Error': [
                            'Invalid Token'
                        ]
                    })
            } else {
                let route = tableName('events');
                getAllDocuments(route, [['userId', '==', decoded.user.id]]).then(async (events) => {
                    let ids = []
                    events.map((event) => {
                        ids.push(`ga:dimension1==${event.id}`)
                    })
                    let spectators = await verify('', 'ga:metric2', 1, '2005-01-01', 'today', ids, '')
                    let chats = await verify('', 'ga:metric5', 1, '2005-01-01', 'today', ids, '')
                    let interactions = await verify('', 'ga:metric3', 1, '2005-01-01', 'today', ids, '')
                    let shares = await verify(['ga:dimension7'], 'ga:metric6', 1, '2005-01-01', 'today', ids, '')
                    res.json({ spectators, chats, interactions, shares })
                }).catch((e) => console.log(e))
            }
        }
    )
}

let getSuscribers = (req, res) => {
    let route = tableName('users')
    getAllDocuments(route).then((data) => {
        res.json({ count: data.length })
    })
}
module.exports = {
    getDailyEvents,
    getMaxSpectators,
    getEventsSpectators,
    getEventAnalytics,
    getMyEventsAnalytics,
    getSuscribers
}