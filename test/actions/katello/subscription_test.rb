
require 'katello_test_helper'

module Katello
  describe ::Actions::Katello::Subscription::ReindexPoolSubscriptionHandler do
    describe 'when notified with entitlement.deleted' do
      let(:mymessage) do
        result = {:subject => "entitlement.deleted" }
        result[:content] = JSON.generate({:referenceId => 123})
        OpenStruct.new(result)
      end

      it 'reindex the pool' do
        pool = rand(1100);
        ::Katello::Pool.stubs(:find_pool).returns(pool)
        ::Katello::Pool.expects(:index_pools).with([pool])

        ::Actions::Katello::Subscription::ReindexPoolSubscriptionHandler.new.notify(mymessage)
      end
    end

    describe 'when subject is unexpected' do
      let(:message) do
        result = {:subject => "entitlement.notexpected" }
        OpenStruct.new(result)
      end

      it 'raises an error' do
        assert_raises RuntimeError do
          ::Actions::Katello::Subscription::ReindexPoolSubscriptionHandler.new.notify(message)
        end
      end
    end
  end
end

