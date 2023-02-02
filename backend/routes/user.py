from fastapi import APIRouter

router = APIRouter(prefix="/user")


@router.get("/ingredients")
def get_ingredients(user_token):
    pass


@router.post("/add_ingredient")
def add_ingredient()
