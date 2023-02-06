from typing import Dict
import jwt
import hashlib

SECRET_KEY = "my_secret_key"
ALGORITHM = "HS256"


def get_encoded_jwt(data: Dict) -> str:
    encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_jwt(jwt: str) -> Dict:
    decoded_jwt = jwt.decode(jwt, SECRET_KEY, algorithm=ALGORITHM)
    return decoded_jwt

def verify_password(hashed_password: str, password: str) -> bool:
    return hashlib.sha256(password.encode()).hexdigest() == hashed_password