var app = angular.module('n2App', []);

app.config(function ($httpProvider) {
    $httpProvider.useApplyAsync(true);
})

app.factory('testCache', function ($cacheFactory) {
    return $cacheFactory('testCache');
});

 
     