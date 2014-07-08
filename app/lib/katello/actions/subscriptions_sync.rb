#
# Copyright 2014 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

module Katello
  module Actions
    class SubscriptionsSync < Dynflow::Action

      def plan
        plan_self
      end

      def run
        notifier = QpidNotifier.new(Katello.config.qpid.url, {:transport => 'ssl'}, Katello.config.qpid.subscriptions_queue_address)
        notifier.start
        notifier.register(SubscriptionsSyncObserver.new)
        output[:notifier] = notifier
        notifier.loop_forever
      end

      def finalize
        output[:notify].close
      end
    end

    class SubscriptionsSyncObserver
      def notify(message)
        logger.debug("message received from subscriptions queue ")
        logger.debug("message subject: #{message.subject}")

        content = JSON.parse(message.content)
        system_uuid = content['principalStore']['name']
        pool_id = content['referenceId']
        system = System.find_by_uuid!(system_uuid)
        organization = system.organization
        pool = Katello::Pool.find_pool(cp_pool['id'])
        case message.subject
        when "entitlement.delete"
          logger.info "reindexing #{pool_id}."
          Katello::Pool.index_pools([pool])
        when "entitlement.create"
          logger.info "reindexing #{pool_id}."
          Katello::Pool.index_pools([pool])
        else
          logger.fatal "message subject unexpected."
        end
      end
    end

  end
end
