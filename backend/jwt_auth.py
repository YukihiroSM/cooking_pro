import jwt

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"


def get_encoded_jwt(data):
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt