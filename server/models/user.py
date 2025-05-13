from typing import Optional
import pydantic


class UserAuth(pydantic.BaseModel):
    user_id: int
    username: str
    hashed_password: str
    
    model_config = {
        'validate_by_name': True,
        'from_attributes': True,
    }

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


class UserViewProfile(pydantic.BaseModel):
    model_config = {
        'from_attributes': True,
        'validate_by_name': True,
    }
    '''this profile is displayed in public'''
    user_id: int
    display_name: str
    streak_days: int = 0
    avatar_url: Optional[str] = None

class UserProfile(UserViewProfile):
    '''this profile is displayed in private'''
    email: str
    show_streak: bool = True
    username: str