import pytest
from datetime import datetime, timedelta
from sqlmodel import Session, SQLModel, create_engine
from app.services.event_service import EventService
from app.schemas.event import EventCreate
from app.models.event import EventStatus

@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture
def service(session):
    return EventService(db=session)

def test_create_event(service):
    data = EventCreate(
        title="Test Event",
        description="A test event",
        date=(datetime.now().date() + timedelta(days=1)).strftime("%Y-%m-%d"),
        start_time="10:00",
        end_time="12:00",
        organizer="Test User",
        capacity=100
    )
    event = service.create_event(data)
    assert event.id is not None
    assert event.title == "Test Event"
    assert event.organizer == "Test User"
    assert event.capacity == 100
    assert event.attendees == 0
    assert event.status == EventStatus.PROGRAMADO