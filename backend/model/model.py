from peewee import AutoField, CharField
from peewee import ForeignKeyField
from peewee import Model as PeeweeModel
from .database import db


class Model(PeeweeModel):
    id = AutoField()
    name = CharField()
    file_path = CharField()
    thumbnail_path = CharField()

    class Meta:
        database = db


class BgColor(PeeweeModel):
    id = AutoField()
    color_code = CharField()
    model = ForeignKeyField(Model, backref='bg_colors', on_delete="CASCADE")

    class Meta:
        database = db


class Fiber(PeeweeModel):
    id = AutoField()
    image_path = CharField()
    model = ForeignKeyField(Model, backref='fibers', on_delete="CASCADE")

    class Meta:
        database = db
