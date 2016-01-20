class Noun < ActiveRecord::Base
  enum gender: [:Male, :Female, :Neutral]
end
