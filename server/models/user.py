from typing import Optional
import pydantic


class UserAuthData(pydantic.BaseModel):
    username: str
    hashed_password: str

class UserData(pydantic.BaseModel):
    id: int
    email: str
    displayName: str
    streak_days: int = 0
    avatar_url: str = None
    userAuth: UserAuthData
