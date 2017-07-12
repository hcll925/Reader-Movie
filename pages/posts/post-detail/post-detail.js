var postsData = require('../../../data/posts-data.js')

Page({
    data:{

    },
    onLoad: function(option) {
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        // this.data.postData = postData;
        this.setData({
            postData:postData
        });
        
        var postsCollected = wx.getStorageSync('posts_collected')
        if(postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }else {
            var postsCollected = {}
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
    },

    onColletionTap: function(event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        // 收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        // 更新文章是否被收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected:postCollected
        })
    }

})