from peewee import SqliteDatabase
from config import DATABASE_URL

db = SqliteDatabase(DATABASE_URL)
