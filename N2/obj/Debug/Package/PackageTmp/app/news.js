app.controller('n2Controller', ['$scope', 'testCache', '$http','$filter', function ($scope, testCache, $http, $filter) {
    var vm = this;
    vm.type = "All";

       var cache = testCache.get('test');  
       
       var url = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";

       vm.loadData = function () {
            
           var datahold = [];
           var newData = [];
           //get new stories
               $http.get(url)
                   .then(function (response) {
                       response.data.forEach(function (obj) {
                           var nurl = "https://hacker-news.firebaseio.com/v0/item/" + obj.toString() + ".json?print=pretty";
                           $http.get(nurl)
                               .then(function (response1) {
                                       var feed = { title: response1.data.title, by: response1.data.by, url: response1.data.url, score: response1.data.score};
                                       datahold.push(feed);
                                       newData.push(feed);
                               });
                       });
                       testCache.put('new', newData);
                   });

           //get best stories
               var bestData = [];
               url = "https://hacker-news.firebaseio.com/v0/beststories.json?print=pretty";
               $http.get(url)
                   .then(function (response) {
                       response.data.forEach(function (obj) {
                           var nurl = "https://hacker-news.firebaseio.com/v0/item/" + obj.toString() + ".json?print=pretty";
                           $http.get(nurl)
                               .then(function (response1) {
                                   var feed = { title: response1.data.title, by: response1.data.by, url: response1.data.url, score: response1.data.score };
                                   datahold.push(feed);
                                   bestData.push(feed);
                               });
                       });
                       testCache.put('best', bestData);
                   });

               testCache.put('test',  datahold);
               vm.hold = datahold;
               vm.holdNew = newData;
               vm.holdBest = bestData;
                
        }

        vm.clearSearch = function () {
            var cache = testCache.get('test');
            if (cache) {
                vm.myType()
            }
            else {
                vm.loadData();
            }
            vm.searchWord = '';
       };

        vm.myFilter = function (newVal) {
            var cache = testCache.get('test');
            if (cache) {
                //vm.hold = cache;
                vm.myType()
            }
            else {
                vm.loadData();
            }
            vm.hold = $filter('filter')(vm.hold, newVal);
        };

        vm.myType = function () {
            if (vm.type === "New") {
                vm.hold = testCache.get('new');
            }
            else if (vm.type === "Best") {
                vm.hold = testCache.get('best');
            }
            else {
                vm.hold = testCache.get('test');
            }
            vm.searchWord = '';
        }

        vm.loadData();
 
    }

]);