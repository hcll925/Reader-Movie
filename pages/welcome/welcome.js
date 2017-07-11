Page({
    onTap:function() {
        wx.redirectTo({
            url: '../posts/post',
        })
    },

    onUnload:function() {
        console.log('onunload');
    },

    onHide:function() {
        console.log('onhide');
    }
})