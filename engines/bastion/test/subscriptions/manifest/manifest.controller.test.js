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

describe('Controller: ManifestController', function() {
    var $scope;

    beforeEach(module('Bastion.subscriptions', 'Bastion.test-mocks'));

    beforeEach(inject(function($controller, $rootScope, $injector) {
        var translate;

        translate = function(a) { return a };
        $scope = $rootScope.$new();
        Subscription = $injector.get('Subscription');
        $controller('ManifestController', {
            $scope: $scope,
            translate: translate,
            Subscription: Subscription
        });
    }));

    it('should attach manifestHistory object to the scope', function() {
        expect($scope.manifestHistory).toBeDefined();
    });

    it('should be able to fetch histories from manifestHistory object', function() {
        expect($scope.manifestHistory.fetchManifestHistory).toBeDefined();
        spyOn(Subscription, 'manifestHistory');
        $scope.manifestHistory.fetchManifestHistory();
        expect(Subscription.manifestHistory).toHaveBeenCalled();
    });

    it('should be provide a means of getting fetched manifest history results', function() {
        expect($scope.manifestHistory.getHistories).toBeDefined();

        var results = {};
        spyOn(Subscription, 'manifestHistory').andReturn(results);
        $scope.manifestHistory.fetchManifestHistory();

        expect($scope.manifestHistory.getHistories()).toBeDefined();
        expect($scope.manifestHistory.getHistories()).toBe(results);

        expect($scope.manifestHistory.getHistories()).toBe(results);
    });

    it('should be provide a means of truncating manifestHistory', function() {
        var numToDisplay = 10
        var minIndexOfHidden = numToDisplay;
        var maxIndexOfShown = numToDisplay - 1;

        expect($scope.manifestHistory.isManifestHistoryEventRowHidden).toBeDefined();
        $scope.manifestHistory.numManifestHistoryShownDuringTruncation = numToDisplay;
        $scope.manifestHistory.isManifestHistoryTruncate = true;
        expect($scope.manifestHistory.isManifestHistoryEventRowHidden(minIndexOfHidden)).toBe(true);
        expect($scope.manifestHistory.isManifestHistoryEventRowHidden(minIndexOfHidden + 1)).toBe(true);
        expect($scope.manifestHistory.isManifestHistoryEventRowHidden(maxIndexOfShown)).toBe(false);
        expect($scope.manifestHistory.isManifestHistoryEventRowHidden(maxIndexOfShown - 1)).toBe(false);
    });

});
