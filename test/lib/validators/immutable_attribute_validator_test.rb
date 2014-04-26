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

require 'katello_test_helper'

module Katello
class ImmutableAttributeValidatorTest < ActiveSupport::TestCase

  def setup
    @validator = Validators::ImmutableAttributeValidator.new({:attributes => [:name]})
    @model = OpenStruct.new(:errors => {:name => []})
  end

  def test_validate_each
    @validator.validate_each(@model, :name, "Test2Name_underline-dash")
    assert_empty @model.errors[:name]
  end

  test "fails when attribute is modified" do
    @model.expects(:changed_attributes).returns({:name => 'something'}).once
    @validator.validate_each(@model, :name, "Test2Name_underline-dash")
    refute_empty @model.errors[:name]
  end
end
end
