module SearchHelperMethods
  def setup_search options = {}, &block
    unless block_given?

      results = options[:results] || []

      Tire::Search::Search.instance_eval do
        define_method(:perform) do
          data = to_hash
          (data[:fields].should == options[:fields]) if options.has_key?(:fields)
          (data[:query].should == options[:query]) if options.has_key?(:query)
          (SearchHelperMethods.compare_filter_params(options[:filter], data[:filter]).should == true) if options.has_key?:filter 
          (data[:size].should == options[:size]) if options.has_key?(:size)
          (data[:sort].should == options[:sort] )if options.has_key?(:sort)
          (data[:from].should == options[:from] )if options.has_key?(:from)
          Array.instance_eval do
            define_method(:total) do
              size
            end
          end

          #http://www.fngtps.com/2007/using-openstruct-as-mock-for-activerecord/
          OpenStruct.instance_eval do
            define_method(:id) do
              @table[:id]
            end
          end

          OpenStruct.new(:results => results)
        end
      end
    else
      Tire::Search::Search.instance_eval(&block)
    end
  end

  def reset_search
    Tire::Search::Search.instance_eval do
      define_method(:perform) do
        OpenStruct.new(:results => OpenStruct.new(:total => 0, :results => []))
      end
    end
  end

  def SearchHelperMethods.compare_filter_params(expected, actual)
    return false if expected.class != actual.class
    return expected == actual unless Hash === expected || Array === expected

    if Array === expected
      return false if expected.size != actual.size
      expected.all? do |item|
        unless actual.include? item
          actual.any? do |act|
            compare_filter_params(item, act)
          end
        else
          true
        end
      end
    else
      expected.each do |key, value|
        actual_value = actual[key]
        return false unless compare_filter_params(value, actual_value)
      end
      true
    end
  end
end