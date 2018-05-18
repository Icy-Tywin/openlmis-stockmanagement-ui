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

ddescribe('currentUserHomeFacilityService', function() {

    var currentUserHomeFacilityService, $rootScope, FacilityDataBuilder, facility, currentUserService, UserDataBuilder,
        user, facilityService, localStorageService, $q, HOME_FACILITY = 'homeFacility';

    beforeEach(function() {
        module('stock-program-util');

        inject(function($injector) {
            currentUserHomeFacilityService = $injector.get('currentUserHomeFacilityService');
            currentUserService = $injector.get('currentUserService');
            facilityService = $injector.get('facilityService');
            $rootScope = $injector.get('$rootScope');
            FacilityDataBuilder = $injector.get('FacilityDataBuilder');
            UserDataBuilder = $injector.get('UserDataBuilder');
            localStorageService = $injector.get('localStorageService');
            $q = $injector.get('$q');
        });

        facility = new FacilityDataBuilder().build();

        user = new UserDataBuilder()
            .withHomeFacilityId(facility.id)
            .build();

        spyOn(localStorageService, 'get').andCallThrough();
        spyOn(currentUserService, 'getUserInfo');
        spyOn(facilityService, 'get');
    });

    describe('getHomeFacility', function() {
    
        it('should fetch home facility from the back-end on first call', function() {
            currentUserService.getUserInfo.andReturn($q.resolve(user));
            facilityService.get.andReturn($q.resolve(facility));

            var result;
            currentUserHomeFacilityService.getHomeFacility()
            .then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(result).toEqual(facility);
            expect(currentUserService.getUserInfo).toHaveBeenCalledWith();
            expect(facilityService.get).toHaveBeenCalledWith(user.homeFacilityId);
        });

        it('should save home facility in the local storage after first call', function() {
            currentUserService.getUserInfo.andReturn($q.resolve(user));
            facilityService.get.andReturn($q.resolve(facility));

            var result;
            currentUserHomeFacilityService.getHomeFacility()
            .then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(localStorageService.get(HOME_FACILITY)).toEqual(facility);
        });

        it('should fetch home facility from local storage for subsequent calls', function() {
            localStorageService.add(HOME_FACILITY, angular.toJson(facility));
            currentUserService.getUserInfo.andReturn($q.resolve(user));

            var result;
            currentUserHomeFacilityService.getHomeFacility()
            .then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(result).toEqual(facility);
            expect(localStorageService.get).toHaveBeenCalledWith(HOME_FACILITY);
            expect(facilityService.get).not.toHaveBeenCalled();
        });

        it('should reject if fetching facility from the back-end fails', function() {
            currentUserService.getUserInfo.andReturn($q.resolve(user));
            facilityService.get.andReturn($q.reject());

            var rejected;
            currentUserHomeFacilityService.getHomeFacility()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
            expect(currentUserService.getUserInfo).toHaveBeenCalledWith();
            expect(facilityService.get).toHaveBeenCalledWith(user.homeFacilityId);
        });

        it('should resolve if user has no home facility', function() {
            user = new UserDataBuilder()
                .withHomeFacilityId(undefined)
                .build();

            currentUserService.getUserInfo.andReturn($q.resolve(user));

            var result;
            currentUserHomeFacilityService.getHomeFacility()
            .then(function(facility) {
                result = facility;
            });
            $rootScope.$apply();

            expect(result).toBeUndefined();
            expect(currentUserService.getUserInfo).toHaveBeenCalledWith();
            expect(facilityService.get).not.toHaveBeenCalled();
        });

        it('should reject if fetching user failed', function() {
            currentUserService.getUserInfo.andReturn($q.reject());

            var rejected;
            currentUserHomeFacilityService.getHomeFacility()
            .catch(function() {
                rejected = true;
            });
            $rootScope.$apply();

            expect(rejected).toEqual(true);
            expect(currentUserService.getUserInfo).toHaveBeenCalledWith();
            expect(facilityService.get).not.toHaveBeenCalledWith(user.homeFacilityId);
        });
    
    });

    describe('clearCache', function() {
    
        
    
    });

    afterEach(function() {
        localStorageService.remove(HOME_FACILITY);
    })

});