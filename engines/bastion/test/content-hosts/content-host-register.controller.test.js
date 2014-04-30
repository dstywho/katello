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

describe('Controller: ContentHostRegisterController', function() {
    var $scope;

    beforeEach(module('Bastion.content-hosts', 'Bastion.test-mocks'));

    beforeEach(inject(function($injector) {
        var $controller = $injector.get('$controller'),
            $location = $injector.get('$location'),
            Node = $injector.get('MockResource').$new(),
            BastionConfig = {consumerCertRPM: 'katello-ca.rpm'};

        $scope = $injector.get('$rootScope').$new();
        $controller('ContentHostRegisterController', {
            $scope: $scope,
            $location: $location,
            Node: Node,
            CurrentOrganization: 'ACME',
            BastionConfig: BastionConfig
        });
    }));

    it("puts the current organization on the scope", function() {
        expect($scope.organization).toBeDefined();
    });

    it('puts the current domain on the scope', function() {
        expect($scope.baseURL).toBeDefined();
    });

    it('should fetch a list of nodes', function(){
        expect($scope.nodes).toBeDefined();
        expect($scope.selectedNode).toBeDefined();
    });

});
