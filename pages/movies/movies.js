var app = getApp();
Page({
    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl);
        // this.getMovieListData(comingSoonUrl);
        // this.getMovieListData(top250Url);
    },

    getMovieListData: function (url) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            header: {
                'Content-Type': 'json'
            },
            success: function (res) {
                console.log(res);
                that.processDoubanData(res.data);
            }
        })
    },

    processDoubanData: function (moviesDouban) {
        var movies = [];
        for (var idx in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[idx];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + '...';
            }
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,
            }
            movies.push(temp)
        }
        this.setData({
            movies: movies
        });
    }
})