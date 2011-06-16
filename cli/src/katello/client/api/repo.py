# -*- coding: utf-8 -*-
#
# Copyright © 2011 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public License,
# version 2 (GPLv2). There is NO WARRANTY for this software, express or
# implied, including the implied warranties of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. You should have received a copy of GPLv2
# along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.
#
# Red Hat trademarks are not licensed under GPLv2. No permission is
# granted to use or replicate Red Hat trademarks that are incorporated
# in this software or its documentation.

from katello.client.api.base import KatelloAPI

class RepoAPI(KatelloAPI):
    """
    Connection class to access repositories
    """
    def create(self, prod_id, name, url):
        repodata = {"product_id": prod_id,
                    "name": name,
                    "url": url}
        path = "/api/repositories/"
        return self.server.POST(path, repodata)[1]

    def repos_by_org_env(self, orgName, envId):
        path = "/api/organizations/%s/environments/%s/repositories" % (orgName, envId)
        list = self.server.GET(path)[1]
        return list

    def repos_by_org_env_product(self, orgName, envId, productId):
        path = "/api/organizations/%s/environments/%s/products/%s/repositories" % (orgName, envId, productId)
        list = self.server.GET(path)[1]
        return list

    def repo(self, id):
        path = "/api/repositories/%s/" % id
        data = self.server.GET(path)[1]
        return data
        
    def sync(self, id):
        path = "/api/repositories/%s/sync" % id
        data = self.server.POST(path)[1]
        return data
        
    def repo_discovery(self, url, repotype):
        discoverydata = {"url": url, "type": repotype}
        path = "/api/repositories/discovery"
        return self.server.POST(path, discoverydata)[1]
        
    def repo_discovery_status(self, discoveryTaskId):
        path = "/api/repositories/discovery/%s" % discoveryTaskId
        return self.server.GET(path)[1]

