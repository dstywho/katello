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
 * @ngdoc object
 * @name  Bastion.content-hosts.controller:ContentHostPackagesController
 *
 * @requires $scope
 * @requires ContentHostPackage
 * @requires ContentHostTask
 * @requires translate
 * @requires Nutupane
 *
 * @description
 *   Provides the functionality for the content host packages list and actions.
 */
angular.module('Bastion.content-hosts').controller('ContentHostPackagesController',
    ['$scope', 'ContentHostPackage', 'ContentHostTask', 'translate', 'Nutupane',
    function ($scope, ContentHostPackage, ContentHostTask, translate, Nutupane) {
        var packagesNutupane, packageActions, openEventInfo;

        openEventInfo = function (event) {
            // when the event has label defined, it means it comes
            // from foreman-tasks
            if (event.label) {
                $scope.transitionTo('content-hosts.details.tasks.details', {taskId: event.id});
            } else {
                $scope.transitionTo('content-hosts.details.events.details', {eventId: event.id});
            }
        };

        $scope.packageAction = {actionType: 'packageInstall'}; //default to packageInstall

        $scope.updateAll = function () {
            ContentHostPackage.updateAll({uuid: $scope.contentHost.uuid}, openEventInfo);
        };

        $scope.performPackageAction = function () {
            var action, terms;
            action = $scope.packageAction.actionType;
            terms = $scope.packageAction.term.split(/ *, */);
            packageActions[action](terms);
        };

        packageActions = {
            packageInstall: function (termList) {
                ContentHostPackage.install({uuid: $scope.contentHost.uuid, packages: termList}, openEventInfo);
            },
            packageUpdate: function (termList) {
                ContentHostPackage.update({uuid: $scope.contentHost.uuid, packages: termList}, openEventInfo);
            },
            packageRemove: function (termList) {
                ContentHostPackage.remove({uuid: $scope.contentHost.uuid, packages: termList}, openEventInfo);
            },
            groupInstall: function (termList) {
                ContentHostPackage.install({uuid: $scope.contentHost.uuid, groups: termList}, openEventInfo);
            },
            groupRemove: function (termList) {
                ContentHostPackage.remove({uuid: $scope.contentHost.uuid, groups: termList}, openEventInfo);
            }
        };

        packagesNutupane = new Nutupane(ContentHostPackage, { 'id': $scope.$stateParams.contentHostId }, 'get');
        $scope.currentPackagesTable = packagesNutupane.table;
        $scope.currentPackagesTable.openEventInfo = openEventInfo;
        $scope.currentPackagesTable.contentHost = $scope.contentHost;

        $scope.currentPackagesTable.taskFailed = function (task) {
            return task === undefined || task.failed || task['affected_units'] === 0;
        };

        $scope.currentPackagesTable.removePackage = function (pkg) {
            ContentHostPackage.remove({
                uuid: $scope.contentHost.uuid,
                packages: [{name: pkg.name, version: pkg.version,
                            arch: pkg.arch, release: pkg.release}]
            },
            function (scheduledTask) {
                pkg.removeTask = scheduledTask;
                scheduledTask.contentHostId = $scope.$stateParams.contentHostId;
                ContentHostTask.poll(scheduledTask, function (polledTask) {
                    pkg.removeTask = polledTask;
                });
            },
            function (data) {
                var message = translate("Error starting task ");
                if (data.data.displayMessage) {
                    message += ":" + data.data.displayMessage;
                }
                pkg.removeTask = {'human_readable_result': message, failed: true};
            });
        };
    }
]);
