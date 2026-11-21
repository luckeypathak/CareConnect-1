import pymysql
from django.db.backends.mysql.features import DatabaseFeatures

pymysql.install_as_MySQLdb()
DatabaseFeatures.minimum_database_version = (8, 0, 0)
