from typing import Optional
import pydantic


class UserAuth(pydantic.BaseModel):
    user_id: int
    username: str
    hashed_password: str

class UserLogin(pydantic.BaseModel):
    '''this is the form used to login'''
    username: str
    password: str

class UserRegister(pydantic.BaseModel):
    '''this is the form used to register'''
    username: str
    email: str
    password: str
    displayName: str = None

class UserSettings(pydantic.BaseModel):
    user_id: int
    show_streak: bool = True

class UserPreference(pydantic.BaseModel):
    user_id: int
    preferred_sites: Optional[list[int]] = None


class UserViewProfile(pydantic.BaseModel):
    '''this profile is displayed in public'''
    user_id: int
    displayName: str
    streak_days: int = 0
    avatar_url: str = None

class UserProfile(UserViewProfile):
    '''this profile is displayed in private'''
    email: str
    preferences: UserPreference = None
    settings: UserSettings = None
