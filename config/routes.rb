Rails.application.routes.draw do

  resources :nouns

  root 'welcome#index'
end
