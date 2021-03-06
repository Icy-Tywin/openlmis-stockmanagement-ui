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

(function() {

    'use strict';

    /**
     * @ngdoc filter
     * @name stock-product-name.filter:productName
     *
     * @description
     * Returns product name from given orderable.
     * If has dispensing unit, returns full product name with dispensing unit.
     *
     * @param  {String} msg        the message to return
     * @param  {Array}  parameters parameters
     * @return {String}            message
     */
    angular
        .module('stock-product-name')
        .filter('productName', productNameFilter);

    productNameFilter.$inject = ['messageService'];

    function productNameFilter(messageService) {
        return function(orderable) {
            if (orderable.dispensable.displayUnit) {
                return messageService.get('stockProductName.productWithDisplayUnit', {
                    fullProductName: orderable.fullProductName,
                    displayUnit: orderable.dispensable.displayUnit
                });
            }
            return orderable.fullProductName;

        };
    }

})();
