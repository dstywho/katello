/**
 * Copyright 2014 Red Hat, Inc.
 *
 * This software is licensed to you under the GNU General Public
 * License as published by the Free Software Foundation; either version
 * 2 of the License (GPLv2) or (at your option) any later version.
 * There is NO WARRANTY for this software, express or implied,
 * including the implied warranties of MERCHANTABILITY,
 * NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
 * have received a copy of GPLv2 along with this software; if not, see
 * http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
 **/

describe('Controller: SystemGroupAddContentHostsController', function() {
    var $scope,
        SystemGroup,
        ContentHost,
        Nutupane;

    beforeEach(module('Bastion.system-groups', 'Bastion.test-mocks'));

    beforeEach(function() {
        Nutupane = function() {
            this.table = {
                showColumns: function() {},
                getSelected: function() {
                    return [{uuid: 'abcd'}]
                }
            };
            this.get = function() {};
        };
        SystemGroup = {addContentHosts: function(){}};
        System = {};
    });

    beforeEach(inject(function($controller, $rootScope, $location) {
        $scope = $rootScope.$new();
        $scope.group = {id: 5};

        $controller('SystemGroupAddContentHostsController', {
            $scope: $scope,
            $location: $location,
            Nutupane: Nutupane,
            translate: function(){},
            SystemGroup: SystemGroup,
            ContentHost: ContentHost,
            CurrentOrganization: 'CurrentOrganization'
        });
    }));

    it('attaches the nutupane table to the scope', function() {
        expect($scope.addContentHostsTable).toBeDefined();
    });

    it('sets the closeItem function to not do anything', function() {
        spyOn($scope, "transitionTo");
        $scope.addContentHostsTable.closeItem();
        expect($scope.transitionTo).not.toHaveBeenCalled();
    });

    it('adds selected content hosts', function(){
        spyOn(SystemGroup, "addContentHosts");
        $scope.addSelected();
        expected_params = {id: $scope.group.id, 'system_ids': ['abcd']};
        expect(SystemGroup.addContentHosts).toHaveBeenCalledWith(expected_params, jasmine.any(Function), jasmine.any(Function));
    });

});
