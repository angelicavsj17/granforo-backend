let AWS = require('aws-sdk')

const IVS = new AWS.IVS({
    accessKeyId: 'AKIAV3Q7J7ITOATMJODZ',
    secretAccessKey: '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',
    apiVersion: '2020-07-14',
    region: 'us-east-1',
})

const createChannel = ({ name }) => {
    return new Promise((resolve, reject) => {
        IVS.createChannel({ name }, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                let rtmp = 'rtmps://' + data.channel.ingestEndpoint + ':443/app/'
                let key = data.streamKey.value
                let videoUrl = data.channel.playbackUrl
                let channelArn = data.channel.arn
                resolve({ ...data, streamingUtils: { rtmp, key, videoUrl, channelArn } })
            }
        })
    })
}
let deleteChannel = ({ arn }) => {
    return new Promise((resolve, reject) => {
        IVS.deleteChannel({ arn }, (err, data) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(data)
            }
        })
    })
}
const getChannel = ({ arn }) => {
    return new Promise((resolve, reject) => {
        IVS.getChannel({ arn }, (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data)
        })
    })
}
const getStream = ({ channelArn }) => {
    return new Promise((resolve, reject) => [
        IVS.getStream({ channelArn: channelArn }, (err, data) => {
            if (err)
                reject(err)
            else
                resolve(data)
        })
    ])
}
// createChannel({ name: 'name' }).then((data) => {
//     console.log(data)
//     setTimeout(() => {
//         deleteChannel({ arn: data.streamingUtils.channelArn })
//     }, 10000)
// })
module.exports = {
    createChannel,
    deleteChannel,
    getChannel,
    getStream
}