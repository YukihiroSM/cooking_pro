from fastapi import APIRouter

router = APIRouter(prefix="/ingredients")


@router.get("/", response_model=str)
def getIngredients():
    return "successful operation"

