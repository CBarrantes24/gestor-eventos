import pytest
from sqlmodel import Session, SQLModel, create_engine
from app.services.user_service import UserService
from app.schemas.user import UserCreate

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture
def service(session):
    return UserService(db=session)

def test_create_event(service):
    data = UserCreate(
        identificacion="111111111",
        nombre="Carlos Test",
        email="carlos@test.com",
        rol="Administrador",
        password="Abc123*"
    )
    
    user = service.create_user(data)
    assert user.id is not None
    assert user.identificacion == "111111111"
    assert user.email == "carlos@test.com"
    assert user.rol == "Administrador"
    
