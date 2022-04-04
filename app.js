angular.module('app', ['components'])
 
.controller('gartner', function($scope, $http) {
    $scope.loading = false;
    $scope.loading2 = false;
    $scope.loading3 = false;
    $scope.categoria = null;
    $scope.posts = [];
    $scope.products = [];
    $scope.categorias2 = [];
    $scope.page = 1;
    $scope.pagePost = 1;
    $scope.pageCat = 1;
    $scope.testimonios = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.loadingTestimonios = false;
    
    $scope.categorias = [
        {name: 'Mujer', id: 210, store: 19},
        {name: 'Hombre', id: 209, store: 17},
        {name: 'Niño', id: 211, store: 21},
        {name: 'Niña', id: 212, store: 22},
    ];

    $scope.getPosts = function(cat) {
        $scope.categoria = cat;
        if($scope.pagePost == 1) {
            $scope.loading = true;
        }

        $http.get("https://gartner-store.com/wp-json/wp/v2/posts?_embed&categories=" + cat.id + '&per_page=100&page=' + $scope.pagePost)
        .then(function(response) {
            $scope.loading = false;
            $scope.pagePost++;
            console.log('response', response);
            $scope.posts.push(...shuffle(response.data));
            $scope.getPosts(cat);
        });

        $scope.getCategorias();
    }

    $scope.back = function() {
        $scope.categoria = null; 
        $scope.posts = [];
        $scope.products = [];
        $scope.categorias2 = [];
        $scope.pagePost = 1;
        $scope.page = 1;
        $scope.pageCat = 1;
    }

    $scope.close = function() {
        $scope.products = [];
        $scope.loading3 = false;
        $scope.page = 1;
    }

    $scope.getCategorias = function() {
        $scope.loading2 = true;

        $http({
            method: 'GET',
            url: "https://gartner-store.com//wp-json/wc/v2/products/categories/?consumer_key=ck_5f7420d42fe10eded82dc3bee5d0d9c11f4eaa11&consumer_secret=cs_85587d3b211d189b1b966843e10967795f031768&per_page=20&page=" + $scope.pageCat + "&parent=" + $scope.categoria.store
        }).then(function successCallback(response) {
            $scope.loading2 = false;
            $scope.pageCat++;
            console.log('response3', response);
            $scope.categorias2.push(...response.data);
            if(response.data.length) {
                $scope.getCategorias();
            }
        }, function errorCallback() {});
    }

    $scope.getProductos = function(id) {
        if($scope.page == 1) {
            $scope.loading3 = true;
        }

        $http.get("https://gartner-store.com//wp-json/wc/v2/products/?consumer_key=ck_5f7420d42fe10eded82dc3bee5d0d9c11f4eaa11&consumer_secret=cs_85587d3b211d189b1b966843e10967795f031768&per_page=10&page=" + $scope.page + "&category=" + id)
        .then(function(response) {
            $scope.page++;
            console.log('response productos', response);
            $scope.products.push(...response.data);
            if(response.data.length) {
                $scope.getProductos(id);
            }
        });
    }

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

    $scope.openTestimonios = function() {
        $scope.loadingTestimonios = !$scope.loadingTestimonios;
        _gaq.push(['_trackEvent', 'Clicks', 'Testimonios', 'Testimonios abiertos ' + $scope.loadingTestimonios]);

    }
});
