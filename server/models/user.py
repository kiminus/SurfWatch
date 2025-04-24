import pydantic

class UserAuthData(pydantic.BaseModel):
    username: str
    password: str

class UserData(pydantic.BaseModel):
    displayName: str
    streak_days: int
    userAuth: UserAuthData
