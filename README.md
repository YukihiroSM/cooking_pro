# Cooling Pro Application
![CookingProDiagram.png](DocsAssets%2FCookingProDiagram.png)
## 1. Introduction

Cooking Pro application was created by the team of 4 guys from Ukraine for the Int20H hackathon.
The application is a web application that allows you to search for recipes, add ingredients to your storage, find meals
that you can cook using your ingredients.

The application is written in Python using the FastAPI framework and React using the TypeScript language. The
application uses MongoDB as a database.

It is worth noting that the application is not yet fully ready, but it is already possible to use it in full.

This git repository contains such modules:

1. Backend - FastAPI application. We are using FastAPI as a backend framework because it allows you to quickly create a
   REST API with asynchronous requests.
2. Frontend - React application. We are using React because it is a very popular framework for creating web
   applications. We are using TypeScript because it allows you to write code in a more structured way and it is easier
   to maintain.
3. Docker and Docker-compose - Docker files for building the application. We are using Docker because it allows you to
   quickly build and run the application on any machine.
4. Github Actions - Github Actions for building and pushing the application to deployment services.

Deployment is being performed using Heroku (for backend) and Google Cloud Firebase (for frontend) and MongoDB Atlas to deploy MongoDB.

**In this application we are using external api to collect the data about meals and
ingredients: [TheMealsDB](https://www.themealdb.com/api.php).**

You can find the application on the following links:
- Whole application: [Application](https://cooking-pro-376509.web.app/)
- Backend API: [API](https://cooking-pro-backend.herokuapp.com/docs)

## 2. Installation and run

You can install and run the application in several ways:

1. Using general docker-compose.yml file in the root of the project.
    1. Install Docker and Docker-compose on your machine.
    2. Find `.env` file in the `frontend` and change the `REACT_APP_API_URL` to `http://127.0.0.1:8000`.
    3. Using teriminal go to the root of the project and run the following command:
       ```bash docker-compose up --build```

    4. After the build is successful you can access the API by going to `https://127.0.0.1:8000` and the frontend by
       going to `https://127.0.0.1`.
    5. To stop the application run the following command: `docker-compose down` or push `Ctrl+C` in the terminal.

2. You can run the application in backend only mode.
    1. Install Python on your machine.
    2. Install the requirements by running the following command: `pip install -r requirements.txt`.
    3. Start the MongoDB server in the way you want. (You can use the docker-compose file in the root of the project.
       For this simply run the following command: `docker-compose up -d mongo`).
    4. Change you current directory to `backend` and run the following command: `uvicorn main:app`.
    5. After successful start you can access the API by going to `https://127.0.0.1:8000`.
    6. To stop the application push `Ctrl+C` in the terminal.

3. You can run the application in frontend only mode.
    1. Install Node.js on your machine.
    2. Install the requirements by running the following command: `npm install`.
    3. Change you current directory to `frontend` and run the following command: `npm start`.
    4. After successful start you can access the frontend by going to `https://127.0.0.1:3000`.
    5. To stop the application push `Ctrl+C` in the terminal.

The last two options are not recommended because you will not be able to use the application in full.

## 3. API Documentation
##  **User API** 

## Login Endpoint (api/user/login)

### POST request

The /login endpoint accepts a POST request with a JSON payload that contains a username and password field.

The request is expected to be in the following format:

``` json
{
    "username": <string>,
    "password": <string>
}
```

The endpoint performs a lookup in the database for the provided username. If the username is found, the password is
verified using JWT authentication. If the password is correct, a JSON Web Token (JWT) is generated and stored in the
database for the user. The token, along with the user's ID, is returned in the response.

The response for a successful login will be in the following format:

``` json
{
    "token": <string>,
    "id": <string>
}
```

The response status code for a successful login is 200 (OK).

If the provided username is not found in the database, a response with a status code of 404 (Not Found) and the
following JSON payload is returned:

``` json
{
    "message": "Login failed. User not found."
}
```

If the provided password is incorrect, a response with a status code of 400 (Bad Request) and the following JSON payload
is returned:

``` json
{
    "message": "Login failed. Wrong password."
}
```

## Register Endpoint (api/user/register)

### POST request

The /register endpoint accepts a POST request with a JSON payload that contains a username and password field.

The request is expected to be in the following format:

``` json
{
    "username": <string>,
    "password": <string>
}
```

The endpoint performs a lookup in the database to ensure that the provided username is not already taken. If the
username is not taken, a new user is created with the provided username and password. The password is hashed using the
SHA-256 algorithm before being stored in the database. A JSON Web Token (JWT) is generated for the new user and stored
in the database, along with the user's ID. The token, along with the user's ID, is returned in the response.

The response for a successful registration will be in the following format:

``` json
{
    "token": <string>,
    "id": <string>
}
```

The response status code for a successful registration is 200 (OK).

If the provided username is already taken, a response with a status code of 400 (Bad Request) and the following JSON
payload is returned:

``` json
{
    "message": "Registration failed. Username already taken."
}
```

## Logout Endpoint (api/user/logout)

### POST request

The /logout endpoint accepts a POST request with an Authorization header that contains a JSON Web Token (JWT).

The JWT is decoded to retrieve the username of the user who is attempting to log out. The token stored in the database
for the user is then removed.

The response for a successful logout will be in the following format:

``` json
{
    "token": <JWT>
}
```

The response status code for a successful logout is 200 (OK).

If the provided JWT is invalid or there is an error during the logout process, a response with a status code of 500 (
Internal Server Error) and the following JSON payload is returned:

``` json
{
    "message": "Logout failed."
}
```

If the user is not authorized (no Authorization header or an invalid JWT), a response with a status code of 401 (
Unauthorized) and the following JSON payload is returned:

``` json
{
    "message": "User not authorized."
}
```

## Create Ingredient Endpoint (api/user/{user_id}/create_ingredient)

### POST request

This endpoint is used to create an ingredient for a specific user.

#### Request Body

The request body should contain the following fields:

- `id`: ID of the ingredient to be created.
- `measure`: Measure of the ingredient to be created.

### Response

On successful creation of the ingredient, the API returns the following response:

- `id`: ID of the created ingredient.
- `label`: Label of the created ingredient.
- `category`: Category of the created ingredient.
- `measure`: Measure of the created ingredient.

On failure, the API returns the following response:

- `message`: Error message.
- `status_code`: HTTP status code.

## Get Ingredient Endpoint (api/user/{user_id}/get_user_ingredients)

This endpoint retrieves ingredients associated with a user, identified by user_id. If the user is authorized and the
user exists, the response will be a JSON object containing the ingredients and metadata.

### Path Parameters

- `user_id`: A string that identifies the user.

### Query Parameters

- `page`: A zero-indexed integer that specifies the page number to retrieve. Default value is 0.
- `perPage`: An integer that specifies the number of ingredients per page. Default value is 12.

### Responses

#### 200 OK

The request was successful and the response body contains the ingredients and metadata.

The response body is a JSON object with the following properties:

- `data`: An array of ingredients, each represented as a JSON object with the following properties:
    - `id`: A string that represents the unique identifier of the ingredient.
    - `label`: A string that represents the name of the ingredient.
    - `category`: A string that represents the category of the ingredient.
    - `measure`: A string that represents the unit of measure of the ingredient.
- `metadata`: A JSON object with the following properties:
    - `total`: An integer that represents the total number of ingredients.

#### 401 Unauthorized

The user is not authorized to access this resource. The response body is a JSON object with the following property:

- `message`: A string that contains the error message "User not authorized!"

#### 404 Not Found

The user identified by user_id was not found. The response body is a JSON object with the following property:

- `message`: A string that contains the error message "User not found!"

## Delete ingredient endpoint (api/user/{user_id}/delete_ingredient/{ingredient_id})

This endpoint allows a user to delete an ingredient associated with their account.

### Path Parameters

- `user_id` - the ID of the user
- `ingredient_id` - the ID of the ingredient to be deleted

### Responses

#### 200 OK

If the ingredient is successfully deleted, the following response will be returned:

``` json
{
    "message": "Ingredient deleted."
}
```

#### 401 Unauthorized

If the request does not include a valid JWT token in the Authorization header, the following response will be returned:

``` json
{
    "message": "User not authorized."
}
```

#### 404 Not Found

If the user or ingredient could not be found, the following response will be returned:

``` json
{
    "message": "User not found."
}
```

``` json
{
    "message": "Ingredient not found."
}
```

## Get possible meals (api/user/{user_id}/possible_meals)

Get a list of meals that can be made using the ingredients added to a user's account.

### URL Params

- `user_id` - The user's id.

- `page` - The page of the meal results. Defaults to 0.

- `perPage` - The number of results per page. Defaults to 12.

### Response

#### Code: 200

Content:

``` json
      {
        "data": [
          {
            "id": "52772",
            "name": "Beef and Mushroom Pie",
            "category": "Beef",
            "area": "British",
            "image": "https://www.themealdb.com/images/media/meals/wtsvxx1511296896.jpg",
            "instructions": "Preheat the oven to 200C/400F/Gas 6.\r\nHeat the oil in a frying pan and cook the beef and onion until browned.",
            "ingredients": [
              "Olive Oil",
              "Beef",
              "Onion",
              "Plain Flour",
              "Mushrooms",
              "Tomato Puree",
              "Worcestershire Sauce",
              "Beef Stock",
              "Rosemary",
              "Shortcrust Pastry"
            ]
          },
          ...
        ],
        "metadata": {
          "total": 20
        }
      }
```

### Error Response

#### Code: 401

``` json
{
    "message": "User not authorised!"
}
```

#### Code: 404

``` json
{
    "message": "User not found!"
}
```

- **Note:**
  The ingredients in a user's account are compared against the ingredients of meals from
      the [TheMealDB API](https://www.themealdb.com/api.php). If a meal has at least two ingredients matching the
      ingredients in a user's account, it will be returned as a possible meal.

## **Meals API**

# Get meals categories (/api/meals/categories)
This endpoint returns a list of all meal categories.

### Response

#### Code: 200
```json
[  
  {    
    "id": 1,   
    "name": "Beef",    
    "description": "Some description"
  },  
  {
    ...  
  }
]
```


# Get random meals (/api/meals/random)
Get random meal(s) from a meal database API.

### Response

List of 10 meals as in the example: 

```json
[
   {
      "id":"52771",
      "name":"Spicy Arrabiata Penne",
      "category":"Pasta",
      "area":"Italian",
      "thumbnail":"https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
      "instructions":"In a pan heat the olive oil, add the garlic and chilli flakes and fry until fragrant. Add the tinned tomatoes, salt and sugar, and simmer for 10 minutes. Cook the pasta in boiling salted water until al dente. Drain and toss in the sauce. Serve with freshly grated Parmesan cheese and torn basil leaves.",
      "ingredients":[
         "olive oil",
         "garlic",
         "chilli flakes",
         "tinned tomatoes",
         "salt",
         "sugar",
         "Pasta",
         "Parmesan cheese",
         "basil leaves"
      ]
   },
   "..."
]
```

# Get meals categories and ingredients grouped by categories (/api/meals/categories_and_ingredients)

Endpoint to retrieve all meals categories and ingredients grouped by categories.

### Response

#### Code 200:

```json
[
  {
    "label": "Recipes",
    "children": [
      {
        "label": "Beef"
      },
      {
      ...
      }
    ]
  },
  {
    "label": "Ingredients",
    "children": [
      {
        "label": "Alcohol",
        "children": [
          {
            "id": "29",
            "label": "Brandy",
            "measure": "tbsp"
          },
          {
            "id": "107",
            "label": "Dry White Wine",
            "measure": "ml"
          }
        ]
      }
    ]
  }
]
```

# Get filtered meals by category or ingredients (/api/meals/filter)

This endpoint returns a filtered list of meals based on ingredients or category.

### Query Params
- `ingredients` - A comma separated list of ingredients.
- `category` - A category name.
- `page` - The page of the meal results. Defaults to 0.
- `perPage` - The number of results per page. Defaults to 12.


### Response

```json
{
  "data": [
    {
      "id": "52942",
      "name": "Roast fennel and aubergine paella",
      "category": "Vegan",
      "area": "Spanish",
      "instructions": "1 Put the fennel, aubergine, pepper and courgette in a roasting tray. Add a glug of olive oil, season with salt and pepper and toss around to coat the veggies in the oil. ",
      "image": "https://www.themealdb.com/images/media/meals/1520081754.jpg",
      "video": "https://www.youtube.com/embed/H5SmjR-fxUs?autoplay=1&mute=1",
      "ingredients": [
        "Baby Aubergine",
        "Fennel",
        ...
      ],
      "measures": [
        "6 small",
        "4 small",
       ...
      ]
    },
    ...
  ],
  "metadata": {
    "total": 3
  }
}
```

### Error response:
- When both category and ingredients are provided, the following error is returned:

```json
{
  "message": "Bad request. Need to specify only one of parameters: [category, ingredients]"
}
```

- When nothing of category or ingredients is provided, the following error is returned:

```json
{
  "message": "Bad request. Need to specify one of parameters: [category, ingredients]"
}
```

- When nothing was found, the following error is returned:

```json
{
  "message": "Meals were not found"
}
```

# Get meal by ID (api/meals/{meal_id})
Retrieve information about a meal with a given ID.

## Path Parameters
- `meal_id`: integer representing the ID of the meal that needs to be retrieved.

## Response
#### Code: 200
```json
    {
    "id": "52942",
    "name": "Roast fennel and aubergine paella",
    "category": "Vegan",
    "area": "Spanish",
    "instructions": "1 Put the fennel, aubergine, pepper and courgette in a roasting tray. Add a glug of olive oil, season with salt and pepper and toss around to coat the veggies in the oil. ",
    "image": "https://www.themealdb.com/images/media/meals/1520081754.jpg",
    "video": "https://www.youtube.com/embed/H5SmjR-fxUs?autoplay=1&mute=1",
    "ingredients": [
        "Baby Aubergine",
        "Fennel",
        ...
    ],
    "measures": [
        "6 small",
        "4 small",
        ...
    ]
    }
```


### Error response:
#### Code: 404
- When the meal with the given ID is not found, the following error is returned:

```json
{
  "message": "Meal with this ID does not exist!"
}
```
