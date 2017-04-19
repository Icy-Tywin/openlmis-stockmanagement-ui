/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function () {
  'use strict';

  angular
    .module('stock-card')
    .config(routes);

  routes.$inject = ['$stateProvider', 'STOCKMANAGEMENT_RIGHTS'];

  function routes($stateProvider, STOCKMANAGEMENT_RIGHTS) {
    $stateProvider.state('stockmanagement.stockCard', {
      url: '/stockCard?stockCardId',
      showInNavigation: false,
      controller: 'StockCardController',
      controllerAs: 'vm',
      templateUrl: 'stock-card/stock-card.html',
      accessRights: [STOCKMANAGEMENT_RIGHTS.STOCK_CARDS_VIEW],
      params: {
        stockCardId: undefined
      },
      resolve: {
        stockCard: function ($stateParams, stockCardService) {
          return stockCardService.getStockCard($stateParams.stockCardId);
        }
      }
    });
  }
})();
