/**
 * Copyright 2013-2014 Red Hat, Inc.
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
 * @ngdoc object
 * @name  Bastion.subscriptions.controller:ManifestImportController
 *
 * @requires $scope
 * @requires $q
 * @requires translate
 * @requires CurrentOrganization
 * @requires Provider
 * @requires Organization
 * @requires Task
 *
 * @description
 *   Controls the import of a manifest.
 */
angular.module('Bastion.subscriptions').controller('ManifestImportController',
    ['$scope', '$q', 'translate', 'CurrentOrganization', 'Provider', 'Organization', 'Task', 'Subscription',
    function ($scope, $q, translate, CurrentOrganization, Provider, Organization, Task, Subscription) {

        $scope.uploadErrorMessages = [];
        $scope.progress = {uploading: false};
        $scope.showHistoryMoreLink = false;
        $scope.uploadURL = $scope.RootURL + '/api/v2/organizations/' + CurrentOrganization + '/subscriptions/upload';

        $scope.organization = Organization.get({id: CurrentOrganization});

        $q.all([$scope.provider.$promise, $scope.organization.$promise]).then(function () {
            $scope.panel.loading = false;
            initializeManifestDetails($scope.organization);
        });

        $scope.$on('$destroy', function () {
            $scope.unregisterSearch();
        });

        $scope.unregisterSearch = function () {
            Task.unregisterSearch($scope.searchId);
            $scope.searchId = undefined;
        };

        $scope.updateTask = function (task) {
            $scope.task = task;
            if (!$scope.task.pending) {
                $scope.unregisterSearch();
                if ($scope.task.result === 'success') {
                    $scope.refreshProviderInfo();
                    $scope.successMessages.push(translate("Manifest successfully imported."));
                    $scope.refreshTable();
                }
            } else if ($scope.task.result === 'error') {
                $scope.manifestHistory = Subscription.manifestHistory();
                $scope.errorMessages.push(translate("Error importing manifest."));
            }
        };

        $scope.save = function (provider) {
            var deferred = $q.defer();

            provider.$update(function (response) {
                deferred.resolve(response);
                $scope.saveSuccess = true;
                $scope.successMessages.push(translate("Red Hat provider successfully updated."));
            }, function (response) {
                deferred.reject(response);
                $scope.saveError = true;
                $scope.errors = response.data.errors;
            });

            return deferred.promise;
        };

        $scope.deleteManifest = function (provider) {
            provider.$deleteManifest(function () {
                $scope.saveSuccess = true;
                $scope.successMessages.push(translate("Manifest successfully deleted."));
                $scope.refreshTable();
                $scope.refreshProviderInfo();
            }, function (response) {
                $scope.manifestHistory = Subscription.manifestHistory();
                $scope.saveError = true;
                $scope.errors = response.data.errors;
            });
        };

        $scope.refreshProviderInfo = function () {
            $scope.manifestHistory = Subscription.manifestHistory();
            $scope.provider = Provider.get({id: $scope.$stateParams.providerId});
            $scope.organization = Organization.get({id: CurrentOrganization});
            $q.all([$scope.provider.$promise, $scope.organization.$promise]).then(function () {
                initializeManifestDetails($scope.organization, $scope.provider);
            });
        };

        $scope.refreshManifest = function (provider) {
            provider.$refreshManifest(function () {
                $scope.saveSuccess = true;
                $scope.successMessages.push(translate("Manifest successfully refreshed."));
                $scope.refreshTable();
                $scope.transitionTo('subscriptions.index');
            }, function (response) {
                $scope.manifestHistory = Subscription.manifestHistory();
                $scope.saveError = true;
                $scope.errors = response.data.errors;
            });
        };

        function buildManifestLink(upstream) {
            var url = upstream['webUrl'],
                upstreamId = upstream['uuid'];

            if (!url.match(/^http/)) {
                url = "https://" + url;
            }
            if (!url.match(/\/$/)) {
                url = url + "/";
            }

            url += upstreamId;

            return url;
        }

        $scope.uploadManifest = function (content) {
            var returnData;
            if (content) {
                try {
                    returnData = JSON.parse(angular.element(content).html());
                } catch (err) {
                    returnData = content;
                }

                if (!returnData) {
                    returnData = content;
                }

                if (returnData !== null && returnData.errors === undefined) {
                    $scope.task =  returnData;
                    $scope.searchId = Task.registerSearch({ 'type': 'task', 'task_id':  $scope.task.id }, $scope.updateTask);
                } else {
                    $scope.uploadErrorMessages = [translate('Error during upload: ') + returnData.displayMessage];
                }

                $scope.progress.uploading = false;
            }
        };

        function initializeManifestDetails(organization) {
            $scope.details = organization['owner_details'];
            $scope.upstream = $scope.details.upstreamConsumer;

            if (!_.isNull($scope.upstream)) {
                $scope.manifestLink = buildManifestLink($scope.upstream);
                $scope.manifestName = $scope.upstream["name"] || $scope.upstream["uuid"];
            }
        }

        //$scope.manifestHistory = Subscription.manifestHistory();
        $scope.isManifestHistoryTruncate = true;
        $scope.manifestHistory.$promise.then(function (result) {
            $scope.showHistoryMoreLink = (result.length > $scope.numManifestHistoryShownDuringTruncation) ? true : false;
        });
    }]
);
