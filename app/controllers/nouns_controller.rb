class NounsController < ApplicationController

  def index
    @nouns = Noun.all
  end

  def new
  end

  def create
    @noun = Noun.new(noun_params)

    @noun.save
    redirect_to @noun
  end

  def show
    @noun = Noun.find(params[:id])
  end

  private 

  def noun_params
    params.require(:noun).permit(:english, :nomative, :genative, :gender)
  end
end
