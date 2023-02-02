from fastapi import APIRouter

router = APIRouter(prefix="/api/ingredients")


@router.get("/", response_model=str)
def getIngredients():
    return "successful operation"

