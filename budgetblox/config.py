
class Config:
    SECRET_KEY = '54e3a6920cc789cda473d57ce367588c'
    SECURITY_PASSWORD_SALT = '8642460902a177cfd3352ab877ee5bfa'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MAIL_SERVER = 'smtp.googlemail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'aviopneuma@gmail.com'
    MAIL_PASSWORD = "XXXXXXXXXXXXXXXX"