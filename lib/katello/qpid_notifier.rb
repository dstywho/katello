require 'qpid_messaging'
require 'debugger'

module Katello
  class QpidNotifier
   TIMEOUT =  Qpid::Messaging::Duration::FOREVER

    def initialize(url, options, address)
      @address = address
      @connection = Qpid::Messaging::Connection.new({:url => url, :options => options})
      @observers ||= []
    end

    def loop_forever
      loop do
        begin
          message = @receiver.fetch(TIMEOUT)
          notify_observers(message)
          @session.acknowledge message
        rescue NoMessageAvailable
          #do nothing
        end
      end
    end

    def notify_observers(message)
      @observers.each do |o|
        o.notify(message)
      end
    end

    def register(observer)
      @observers.push(observer)
    end

    def start
      open
      create_session
      create_receiver
    end

    private

    def create_session
      @session = @connection.create_session
    end

    def create_receiver
      @receiver = @session.create_receiver(@address)
    end

    def open
      @connection.open
    end

    def close
      @connection.close
    end
  end
end
