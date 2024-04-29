import delay from './delay'

// 模拟聊天数据
const mockData = [
    {
        userId: 1,
        name: 'ChatGPT3.5',
        avatar: '/images/mock/chat/chatgpt.png',
        messages: [
            {messageId: 8, from: 1, content: 'Hello! How can I assist you today?', time: Date.now(), illgal: true, read: true},
        ]
    },
    {
        userId: 2,
        name: 'llama2',
        avatar: '/images/mock/chat/llama2.png',
        messages: [
            {messageId: 9, from: 1, content: 'Hello! It\'s a pleasure to assist you. How can I help you today? Do you have a question, or is there a task you\'d like me to assist you with?', time: Date.now(), illgal: true, read: true},
        ]
    },
    {
        userId: 3,
        name: '通义千问',
        avatar: '/images/mock/chat/tong.png',
        messages: [
            {messageId: 8, from: 1, content: '你好，我是通义\n' +
                    '我能理解人类语言、生成内容，是你生活和工作的智能助手。', time: Date.now(), illgal: true, read: true},
        ]
    },
    {
        userId: 4,
        name: '防御模型',
        avatar: '/images/mock/chat/avatar-Kingdom.png',
        messages: [

        ]
    },
]

// 模拟新增一条消息
function addNewMessage(userId, from, content) {
    const index = mockData.map(item => item.userId).indexOf(userId)
    const user = mockData.splice(index, 1)[0]
    mockData.unshift(user)
    let messageId = 0
    mockData.forEach(item => {
        messageId += item.messages.length
    })
    const message = {messageId, from, content, time: Date.now(), read: from === 0}
    user.messages.push(message)

    return message
}

/** 模拟SocketTask */
class MockSocketTask {
    constructor(url) {
        this.url = url
        this.onopen = () => {
        }
        this.onmessage = () => {
        }
        this.onclose = () => {
        }
        delay(1000).then(() => {
            this.onopen()
        })
    }

    onOpen(callback) {
        if (typeof callback === 'function')
            this.onopen = callback
    }

    onMessage(callback) {
        if (typeof callback === 'function')
            this.onmessage = callback
    }

    send(data, resMsg) {
        data = JSON.parse(data)
        if (data.type === 'message') {
            const {userId, content} = data.data
            delay().then(() => {
                const message = addNewMessage(userId, 0, content)
                this.onmessage(JSON.stringify({type: 'message', data: {userId, message}}))
            })
            // 模拟3秒后对方回复消息
            delay(3000).then(() => {
                const message = addNewMessage(userId, 1, resMsg)
                this.onmessage(JSON.stringify({type: 'message', data: {userId, message}}))
            })
        }
    }
}

/** 连接WebSocket，返回SocketTask对象 */
export function connectSocket() {
    // return wx.connectSocket({ url: 'url' })
    return new MockSocketTask('ws://localhost:8080')
}

/** 获取未读消息数量 */
export function fetchUnreadNum() {
    let unreadNum = 0
    mockData.forEach(item => {
        unreadNum += item.messages.filter(message => !message.read).length
    })
    return delay().then(() => ({code: 200, data: unreadNum}))
}

/** 获取完整消息列表 */
export function fetchMessageList() {
    return delay().then(() => ({code: 200, data: JSON.parse(JSON.stringify(mockData))}))
}

/** 将某个用户的所有消息标记为已读 */
export function markMessagesRead(userId) {
    let index = 0
    while (index < mockData.length) {
        const user = mockData[index]
        if (user.userId === userId) {
            user.messages.forEach(message => {
                message.read = true
            })
            break
        }
        index += 1
    }
}
