/**
 * 星星个数函数
 */
function convertToStarsArray(stars) {
    var num = stars.toString().substring(0, 1);
    var array = [];
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        } else {
            array.push(0);
        }
    }
    return array;
}

/**
 * 发送请求
 */
function http(url, callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            'Content-Type': 'json'
        },
        success: function (res) {
            callBack(res.data);
        },
        fail: function (error) {
            console.log(error);
        }
    })
}

/**
 * 输出
 */
module.exports = {
    convertToStarsArray: convertToStarsArray,
    http: http
};