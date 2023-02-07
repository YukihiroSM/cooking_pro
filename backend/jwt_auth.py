import hashlib
from typing import Dict
import os
import jwt

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"


def get_encoded_jwt(data: Dict) -> str:
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_jwt(token: str) -> Dict:
    decoded_jwt = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    return decoded_jwt


def verify_password(hashed_password: str, password: str) -> bool:
    return hashlib.sha256(password.encode()).hexdigest() == hashed_password


def get_authorisation(request):
    auth = request.headers.get('Authorization')
    if auth:
        token = auth.split(' ')[1]
        return token
    return None
