from peewee import AutoField, CharField
from .database import db
from peewee import Model as PeeweeModel


class Admin(PeeweeModel):
    id = AutoField()
    username = CharField(unique=True)
    password_hash = CharField()

    class Meta:
        database = db
