class CreateNouns < ActiveRecord::Migration
  def change
    create_table :nouns do |t|
      t.string :english
      t.string :nomative
      t.string :genative
      t.integer :gender

      t.timestamps null: false
    end
  end
end
