import os
import secrets
from PIL import Image
from flask import url_for, current_app
from flask_mail import Message
from budgetblox import mail
import locale



def save_picture(form_picture):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(form_picture.filename)
    picture_fn = random_hex + f_ext
    picture_path = os.path.join(current_app.root_path, 'static/assets/profile_pics', picture_fn)
    
    # Resize the image
    output_size = (125, 125)
    i = Image.open(form_picture)
    i.thumbnail(output_size)
    i.save(picture_path)

    return picture_fn

def delete_old_picture(picture_fn):
    picture_path = os.path.join(current_app.root_path, 'static/assets/profile_pics', picture_fn)
    if os.path.exists(picture_path):
        os.remove(picture_path)

def send_reset_email(user):
    token = user.get_reset_token()
    msg = Message('Password Reset Request', sender=current_app.config['MAIL_USERNAME'], recipients=[user.email])
    msg.body = f'''To reset your password, visit the following link:
{url_for('users.reset_token', token=token, _external=True)}
If you did not make this request, simply ignore this email and no changes will be made.
'''
    mail.send(msg)
