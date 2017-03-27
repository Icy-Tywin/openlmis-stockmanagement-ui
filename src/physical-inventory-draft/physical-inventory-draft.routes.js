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
    .module('physical-inventory-draft')
    .config(routes);

  routes.$inject = ['$stateProvider', 'paginatedRouterProvider'];

  function routes($stateProvider, paginatedRouterProvider) {
    $stateProvider.state('stockmanagement.draftPhysicalInventory', {
      url: '/physicalInventory/draft?keyword&page&size',
      templateUrl: 'physical-inventory-draft/physical-inventory-draft.html',
      controller: 'PhysicalInventoryDraftController',
      controllerAs: 'vm',
      params: {
        program: undefined,
        facility: undefined,
        draft: undefined,
        searchResult: undefined,
      },
      onEnter: function ($state, $stateParams) {
        if (!$stateParams.program || !$stateParams.facility || !$stateParams.draft) {
          $state.go('stockmanagement.physicalInventory');
        }
      },
      resolve: paginatedRouterProvider.resolve({
        program: function ($stateParams) {
          return $stateParams.program;
        },
        facility: function ($stateParams) {
          return $stateParams.facility;
        },
        draft: function ($stateParams) {
          return $stateParams.draft;
        },
        searchResult: function ($stateParams) {
          return $stateParams.searchResult;
        }
      })
    });
  }
})();