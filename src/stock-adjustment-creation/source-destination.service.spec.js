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

describe('sourceDestinationService', function() {

    beforeEach(function() {
        this.offlineService = jasmine.createSpyObj('offlineService', ['isOffline', 'checkConnection']);
        this.storage = jasmine.createSpyObj('offlineStorage', ['put', 'search', 'getAll']);

        var storage = this.storage,
            offlineService = this.offlineService;

        module('stock-adjustment-creation', function($provide) {
            $provide.service('offlineService', function() {
                return offlineService;
            });

            $provide.factory('localStorageFactory', function() {
                return jasmine.createSpy('localStorageFactory').andReturn(storage);
            });
        });

        inject(function($injector) {
            this.$q = $injector.get('$q');
            this.$httpBackend = $injector.get('$httpBackend');
            this.$rootScope = $injector.get('$rootScope');
            this.stockmanagementUrlFactory = $injector.get('stockmanagementUrlFactory');
            this.sourceDestinationService = $injector.get('sourceDestinationService');
            this.offlineService = $injector.get('offlineService');
        });

        this.homeFacilityId = 'home-facility-id';

        this.validSources = [
            {
                facilityTypeId: 'fac-type-id-1',
                id: 'source-id-1',
                name: 'source one',
                programId: 'program-id-1',
                facilityId: this.homeFacilityId
            }
        ];

        this.validDestinations = [
            {
                facilityTypeId: 'fac-type-id-1',
                id: 'dest-id-1',
                name: 'destination one',
                programId: 'program-id-1',
                facilityId: this.homeFacilityId
            }
        ];
    });

    describe('getSourceAssignments', function() {

        it('should get source assignments', function() {
            this.offlineService.isOffline.andReturn(false);

            this.$httpBackend
                .whenGET(this.stockmanagementUrlFactory('/api/validSources?programId=' +
                    this.validSources[0].programId + '&facilityId=' + this.homeFacilityId))
                .respond(200, this.validSources);

            var result;
            this.sourceDestinationService.getSourceAssignments(this.validSources[0].programId, this.homeFacilityId)
                .then(function(response) {
                    result = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result[0])).toBe(angular.toJson(this.validSources[0]));
        });

        it('should search source assignments while offline', function() {
            this.offlineService.isOffline.andReturn(true);

            var result;

            this.storage.search.andReturn(this.$q.resolve(this.validSources));
            this.sourceDestinationService.getSourceAssignments(this.validSources[0].programId, this.homeFacilityId)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();

            expect(this.storage.search).toHaveBeenCalledWith({
                programId: this.validSources[0].programId,
                facilityId: this.homeFacilityId
            });

            expect(result[0]).toBe(this.validSources[0]);
        });
    });

    describe('getDestinationAssignments', function() {

        it('should get destination assignments', function() {
            this.offlineService.isOffline.andReturn(false);

            this.$httpBackend
                .whenGET(this.stockmanagementUrlFactory('/api/validDestinations?programId=' +
                    this.validDestinations[0].programId + '&facilityId=' + this.homeFacilityId))
                .respond(200, this.validDestinations);

            var result;
            this.sourceDestinationService
                .getDestinationAssignments(this.validDestinations[0].programId, this.homeFacilityId)
                .then(function(response) {
                    result = response;
                });

            this.$httpBackend.flush();
            this.$rootScope.$apply();

            expect(angular.toJson(result[0])).toBe(angular.toJson(this.validDestinations[0]));
        });

        it('should search destination assignments while offline', function() {
            this.offlineService.isOffline.andReturn(true);

            var result;

            this.storage.search.andReturn(this.$q.resolve(this.validDestinations));
            this.sourceDestinationService.getDestinationAssignments(this.validDestinations[0].programId,
                this.homeFacilityId)
                .then(function(response) {
                    result = response;
                });
            this.$rootScope.$apply();

            expect(this.offlineService.isOffline).toHaveBeenCalled();

            expect(this.storage.search).toHaveBeenCalledWith({
                programId: this.validSources[0].programId,
                facilityId: this.homeFacilityId
            });

            expect(result[0]).toBe(this.validDestinations[0]);
        });

    });

    afterEach(function() {
        this.$httpBackend.verifyNoOutstandingExpectation();
        this.$httpBackend.verifyNoOutstandingRequest();
    });
});
