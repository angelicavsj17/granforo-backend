const { google } = require("googleapis");
const key = require("../../connections_db/serviceAccount.json");
const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
let jwt;
let analytics;
let auth = () => {
    jwt = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        scopes
    );
    analytics = google.analytics({
        version: "v3",
        auth: jwt
    });
}
let verify = async (dimensions = ["ga:dimension1"], metrics = ['ga:metric1'], maxResults = 20, startDate = '30daysAgo', endDate = 'today', filters = '', sort = "-ga:metric1") => {
    let options = {
        accountId: 185636526,
        ids: `ga:234790101`,
        webPropertyId: "UA-185636526-1",
        profileId: "234790101",
        'start-date': startDate,
        metrics: metrics
    }
    // if (startDate) options['start-date'] = startDate
    if (endDate) options['end-date'] = endDate
    if (maxResults) options['max-results'] = maxResults
    if (dimensions.length > 0) options.dimensions = dimensions
    // if (metrics.length > 0) options.metrics = metrics
    if (sort) options.sort = sort
    if (filters) options.filters = filters;
    let data;
    try {
        data = await analytics.data.ga.get(options)
    } catch {
        auth();
        data = await analytics.data.ga.get(options)
    }
    return data.data.rows ? data.data.rows : []
}
module.exports = {
    verify,
    auth
};