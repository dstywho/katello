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

/**
 * @ngdoc service
 * @name  Bastion.content-hosts.factory:ContentHost
 *
 * @requires BastionResource
 *
 * @description
 *   Provides a BastionResource for one or more content hosts.
 */
angular.module('Bastion.content-hosts').factory('ContentHost',
    ['BastionResource', function (BastionResource) {

        return BastionResource('/api/v2/systems/:id/:action/:action2', {id: '@uuid'}, {
            get: {method: 'GET', params: {fields: 'full'}},
            update: {method: 'PUT'},
            releaseVersions: {method: 'GET', params: {action: 'releases'}},
            subscriptions: {method: 'GET', params: {action: 'subscriptions'}},
            available: {method: 'GET', params: {action: 'subscriptions', action2: 'available'}},
            removeSubscriptions: {method: 'PUT', isArray: false, params: {action: 'subscriptions'}},
            addSubscriptions: {method: 'POST', isArray: false, params: {action: 'subscriptions'}},
            tasks: {method: 'GET', params: {action: 'tasks', paged: true}},
            availableSystemGroups: {method: 'GET', params: {action: 'available_system_groups'}},
            systemGroups: {method: 'GET', transformResponse: function (data) {
                var contentHost = angular.fromJson(data);
                return {results: contentHost.systemGroups};
            }}
        });

    }]
);

/**
 * @ngdoc service
 * @name  Bastion.content-hosts.factory:ContentHostBulkAction
 *
 * @requires BastionResource
 *
 * @description
 *   Provides a BastionResource for bulk actions on content hosts.
 */
angular.module('Bastion.content-hosts').factory('ContentHostBulkAction',
    ['BastionResource', function (BastionResource) {

        return BastionResource('/api/v2/systems/bulk/:action', {}, {
            addSystemGroups: {method: 'PUT', params: {action: 'add_system_groups'}},
            applicableErrata: {method: 'POST', params: {action: 'applicable_errata'}},
            removeSystemGroups: {method: 'PUT', params: {action: 'remove_system_groups'}},
            installContent: {method: 'PUT', params: {action: 'install_content'}},
            updateContent: {method: 'PUT', params: {action: 'update_content'}},
            removeContent: {method: 'PUT', params: {action: 'remove_content'}},
            removeContentHosts: {method: 'PUT', params: {action: 'destroy'}},
            environmentContentView: {method: 'PUT', params: {action: 'environment_content_view'}}
        });

    }]
);
