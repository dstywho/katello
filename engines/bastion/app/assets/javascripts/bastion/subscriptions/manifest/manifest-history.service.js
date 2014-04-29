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
*/

/**
 * @ngdoc service
 * @name  Bastion.subscriptions.service:ManifestHistoryService
 *
 * @requires Subscription
 *
 * @description
 *   Service used to retrieve manifest histories and contains logic to truncate results.
 */
angular.module('Bastion.subscriptions').service('ManifestHistoryService',
    ['Subscription', function (Subscription) {

        var histories;
        this.isManifestHistoryTruncate = false;
        this.numManifestHistoryShownDuringTruncation = 3;

        this.getHistories = function () { return histories };

        this.isManifestHistoryEventRowHidden = function (index) {
            return this.isManifestHistoryTruncate === true && index >= this.numManifestHistoryShownDuringTruncation;
        };

        this.fetchManifestHistory = function () {
            histories = Subscription.manifestHistory();
        };

        this.isTruncating = function (truncatingAction) {
            this.getHistories().$promise.then(function (result) {
                if (result.length > this.numManifestHistoryShownDuringTruncation) {
                    truncatingAction.call();
                }
            });
        };

    }]
);
