(() => {
    'use strict';
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .controller('FoundItemsDirectiveController', FoundItemsDirectiveController)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBaseURL', 'https://davids-restaurant.herokuapp.com/menu_items.json')
        .directive('foundItems', FoundItems);

    function FoundItems() {
        return {
            restrict: 'E',
            templateUrl: 'found-items.template.html',
            scope: {
                items: '<',
                onRemove: '&'
            },
            // controller: 'FoundItemsDirectiveController as found',
            controller: FoundItemsDirectiveController,
            controllerAs: 'found',
            bindToController: true,
            link: FoundItemsDirectiveLink
        }
    }

    function FoundItemsDirectiveLink(scope, el) {
        scope.$watch('found.hasItems()', (newVal, oldVal) => {
            // console.log(newVal)
            if (newVal) displayEmptyResError();
            else removeEmptyResError()
        })

        function displayEmptyResError() {
            el.find("div.error").slideUp(900);
        }

        function removeEmptyResError() {
            el.find("div.error").slideDown(900);
        }
    }

    function FoundItemsDirectiveController() {
        const found = this;
        found.hasItems = () => {
            return found.items.length ? true : false;
        }
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        const narrowItDown = this;

        narrowItDown.foundItems = [];

        narrowItDown.removeItem = (idx) => {
            narrowItDown.foundItems.splice(idx, 1)
        }

        narrowItDown.getMatchedMenuItems = (searchTerm) => {
            if (!searchTerm || !searchTerm.length) return;

            MenuSearchService.getMatchedMenuItems(searchTerm)
                .then(items => {
                    narrowItDown.foundItems = items
                })
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBaseURL'];

    function MenuSearchService($http, ApiBaseURL) {
        const menuSearch = this;

        menuSearch.getMatchedMenuItems = (searchTerm) => {
            return $http({
                    method: 'GET',
                    url: (ApiBaseURL),
                    params: {}
                })
                .then(res => res.data)
                .then(({ menu_items }) => {
                    return menu_items.filter(item => item.name.includes(searchTerm));
                });
        }
    }

})();