// pages/chat/index.js
import Message from "../../miniprogram_npm/tdesign-miniprogram/message/index";

const app = getApp()
const {socket} = app.globalData     // 获取已连接的socketTask

Page({
    /** 页面的初始数据 */
    data: {
        myAvatar: '/images/mock/chat/lxy.jpg',   // 自己的头像
        userId: null,         // 对方userId
        avatar: '',           // 对方头像
        name: '',             // 对方昵称
        messages: [],         // 消息列表 { messageId, from, content, time, read }
        input: '',            // 输入框内容
        anchor: '',           // 消息列表滚动到 id 与之相同的元素的位置
        keyboardHeight: 0,     // 键盘当前高度(px)
        style: 'height: 248rpx'
    },

    showHorizontalText() {
        this.onClose();
        setTimeout(() => {
            Message.success({
                context: this,
                offset: ['180rpx', '32rpx'],
                selector: "#tt-toast",
                duration: 3000,
                content: '反馈提交成功！',
            });
        }, 2000);
    },

    handlePopup(e) {
        const {item} = e.currentTarget.dataset;

        this.setData(
            {
                cur: item,
            },
            () => {
                this.setData({visible: true});
            },
        );
    },
    onVisibleChange(e) {
        this.setData({
            visible: e.detail.visible,
        });
    },
    onClose() {
        this.setData({
            visible: false,
        });
    },


    /** 生命周期函数--监听页面加载 */
    onLoad(options) {
        this.getOpenerEventChannel().on('update', this.update)
    },

    /** 生命周期函数--监听页面初次渲染完成 */
    onReady() {
    },

    /** 生命周期函数--监听页面显示 */
    onShow() {
    },

    /** 生命周期函数--监听页面隐藏 */
    onHide() {
    },

    /** 生命周期函数--监听页面卸载 */
    onUnload() {
        app.eventBus.off('update', this.update)
    },

    /** 页面相关事件处理函数--监听用户下拉动作 */
    onPullDownRefresh() {
    },

    /** 页面上拉触底事件的处理函数 */
    onReachBottom() {
    },

    /** 用户点击右上角分享 */
    onShareAppMessage() {
    },

    /** 更新数据 */
    update({userId, avatar, name, messages}) {
        this.setData({userId, avatar, name, messages: [...messages]})
        wx.nextTick(this.scrollToBottom)
    },

    /** 处理唤起键盘事件 */
    handleKeyboardHeightChange(event) {
        const {height} = event.detail
        if (!height)
            return
        this.setData({keyboardHeight: height})
        wx.nextTick(this.scrollToBottom)
    },

    /** 处理收起键盘事件 */
    handleBlur() {
        this.setData({keyboardHeight: 0})
    },

    /** 处理输入事件 */
    handleInput(event) {
        this.setData({input: event.detail.value})
    },

    /** 发送消息 */
    sendMessage() {
        const {userId, messages, input: content} = this.data
        if (!content)
            return
        const message = {messageId: null, from: 0, content, time: Date.now(), read: true, illgal: false}
        messages.push(message)
        this.setData({input: '', messages})
        wx.request({
            url: "http://47.120.32.75:8080/model/process_msg",
            method: "POST",
            header: {
                'Content-Type': 'application/json',
            },
            data: {
                id: userId,
                msg: content,
            },
            success: (res) => {
                socket.send(JSON.stringify({
                    type: 'message',
                    data: {userId, content, illgal: res.data.data.illgal}
                }), res.data.data.content)
            },
            fail: (error) => {
                console.log(error);
            }
        })
        wx.nextTick(this.scrollToBottom)
    },

    /** 消息列表滚动到底部 */
    scrollToBottom() {
        this.setData({anchor: 'bottom'})
    }
})
