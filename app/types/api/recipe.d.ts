type Recipe = {
  recipe_id: number
  title: string
  description: string
  image_url: string
  cuisine_name: Cuisine['name']
  goal_name: string
  diet_name: string
  allergy_name: string[]
}

type RecipeIngredients = {
  ingredient_id: number
  quantity: string
  unit: string
  name: string
}

type RecipeInstructions = {
  instruction_id: number
  step_number: number
  description: string
}

type FullRecipe = Recipe & {
  ingredients: RecipeIngredients[]
  instructions: RecipeInstructions[]
}
