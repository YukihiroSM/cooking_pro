import requests

from fastapi import APIRouter

from constants.constants import BASE_URL

router = APIRouter(prefix="/meals")


@router.get("/random")
async def getRandomMeal():
    url = BASE_URL + "/random.php"
    data = requests.get(url)
    print(data)
