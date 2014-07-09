require 'qpid_messaging'
require 'debugger'

module Katello
  class QpidQueueObserver
   TIMEOUT =  Qpid::Messaging::Duration::SECOND

    def initialize(url, options, address)
      @address = address
      @connection = Qpid::Messaging::Connection.new({:url => url, :options => options})
      @observers ||= []
    end

    def loop_forever(&block)
      loop do
        retreive_and_notify
        yield if block_given?
      end
    end

    def retrieve(&block)
      message = nil
      begin
        message = @receiver.fetch(TIMEOUT)
        yield(message) if block_given?
        @session.acknowledge message
      rescue NoMessageAvailable
        #no message that's fine
      end
    end

    def retreive_and_notify
      retrieve do |message|
        debugger
        notify_observers(message)
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
