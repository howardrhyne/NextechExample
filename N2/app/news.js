app.controller('n2Controller', ['$scope', 'testCache', '$http','$filter', function ($scope, testCache, $http, $filter) {
    var vm = this;
    vm.type = "All";
    vm.bar = true;
    var cache = testCache.get('test');  
       
    var url = "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";

    vm.loadData = function () {
        var datahold = [];
        var newData = [];
      
        //get best stories
        var bestData = [];
        url = "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";
        $http.get(url)
            .then(function (response) {
                var rtp = response.data.length;
                var pm = 0;
                response.data.forEach(function (obj) {
                    var nurl = "https://hacker-news.firebaseio.com/v0/item/" + obj.toString() + ".json?print=pretty";
                    $http.get(nurl)
                        .then(function (response1) {
                            var feed = { title: response1.data.title, by: response1.data.by, url: response1.data.url, score: response1.data.score };
                            datahold.push(feed);
                            bestData.push(feed);
                            pm++;
                            if (pm === rtp) {
                                vm.hold = datahold; 
                                vm.bar = false;
                            }
                        });
                });
                testCache.put('best', bestData);
            });

        //get new stories
        url = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";
        $http.get(url)
            .then(function (response) {
                var rtp = response.data.length;
                var pm = 0;
                response.data.forEach(function (obj) {
                    var nurl = "https://hacker-news.firebaseio.com/v0/item/" + obj.toString() + ".json?print=pretty";
                     var promise2 = $http.get(nurl)
                        .then(function (response1) {
                                var feed = { title: response1.data.title, by: response1.data.by, url: response1.data.url, score: response1.data.score};
                                datahold.push(feed);
                                newData.push(feed);
                        });
                });
                testCache.put('new', newData);
            });

 

        testCache.put('test',  datahold);
    }

    vm.clearSearch = function () {
        var cache = testCache.get('test');
        if (cache) {
            vm.reloadData()
        }
        else {
            vm.loadData();
        }
        vm.searchWord = '';
    };

    vm.myFilter = function (newVal) {
        vm.reloadData();
        vm.hold = $filter('filter')(vm.hold, newVal);
    };

    vm.myType = function () {
        vm.reloadData();
        vm.myFilter(vm.searchWord);
    };

    vm.reloadData = function () {
        var cache = testCache.get('test');
        if (!cache) {
            vm.loadData();
        }
        if (vm.type === "New") {
            vm.hold = testCache.get('new');
        }
        else if (vm.type === "Best") {
            vm.hold = testCache.get('best');
        }
        else {
            vm.hold = testCache.get('test');
        }
    };
        
    vm.loadData();
 
}

]);