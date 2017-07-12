var postsData = require('../../../data/posts-data.js')

Page({
    onLoad: function(option) {
        var postId = option.id;
        var postData = postsData.postList[postId];
        // this.data.postData = postData;
        this.setData({
            postData:postData
        });
    }
})