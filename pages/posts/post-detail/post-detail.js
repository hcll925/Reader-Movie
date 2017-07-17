var postsData = require('../../../data/posts-data.js')
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var globalData = app.globalData;
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        // this.data.postData = postData;
        this.setData({
            postData: postData
        });

        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {}
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }

        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
            this.setData({
                isPlayingMusic: true
            });
        }
        this.setMusicMonitor();

    },

    setMusicMonitor: function () {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId == that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: true
                    });
                }
            }
            app.globalData.g_isPlayingMusic = true;
        });
        wx.onBackgroundAudioPause(function () {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if(currentPage.data.currentPostId === that.data.currentPostId) {
                if(app.globalData.g_currentMusicPostId === that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: false
                    });
                }
            }
            app.globalData.g_isPlayingMusic = false;
        });
        wx.onBackgroundAudioStop(function() {
            var pages = getCurrentPages();
            var currentPage = pages[pages.length - 1];
            if (currentPage.data.currentPostId === that.data.currentPostId) {
                if (app.globalData.g_currentMusicPostId === that.data.currentPostId) {
                    that.setData({
                        isPlayingMusic: false
                    });
                }
            }
            app.globalData.g_isPlayingMusic = false;
        });
    },

    /**
     *  收藏按钮逻辑
     */
    onColletionTap: function (event) {
        this.getPostsCollectedSyc();
        // this.getPostsCollectedAsy();

    },

    /**
     *  异步收藏
     */
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: "posts_collected",
            success: function (res) {
                var postsCollected = wx.getStorageSync('posts_collected');
                var postCollected = postsCollected[that.data.currentPostId];
                // 收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;

                that.showToast(postsCollected, postCollected);
            }
        })
    },

    /**
     *  同步收藏
     */
    getPostsCollectedSyc: function () {
        var that = this;
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[that.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;

        that.showToast(postsCollected, postCollected);
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: '是否收藏',
            content: postCollected ? '收藏该文章?' : '取消收藏该文章?',
            showCancel: "true",
            success: function (res) {
                if (res.confirm) {
                    // 更新文章是否被收藏的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    that.setData({
                        collected: postCollected
                    });
                }
            }

        })
    },

    showToast: function (postsCollected, postCollected) {
        // 更新文章是否被收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success",
        });
    },

    /**
     *  分享按钮逻辑
     */
    onShareTap: function (event) {
        var itemList = [
            '分享给微信好友',
            '分享到朋友圈',
            '分享到QQ',
            '分享到微博'
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是否点击的取消按钮
                // res.tapIndex 数组元素的序号 从0 开始
                wx.showModal({
                    title: '用户分享到' + itemList[res.tapIndex],
                    content: '是否取消' + res.cancel + '现在不能分享',
                })
            }
        })
    },

    /**
     *  音乐按钮逻辑
     */
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true
            });
            
            app.globalData.g_currentMusicPostId = this.data.currentPostId;
            app.globalData.g_isPlayingMusic = true;
        }
    }
})