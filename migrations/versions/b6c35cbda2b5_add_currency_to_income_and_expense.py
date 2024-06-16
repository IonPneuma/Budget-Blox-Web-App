"""Add currency to Income and Expense

Revision ID: b6c35cbda2b5
Revises: 
Create Date: 2024-06-15 17:20:28.444363

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b6c35cbda2b5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('expense', schema=None) as batch_op:
        batch_op.add_column(sa.Column('currency', sa.String(length=10), nullable=False))

    with op.batch_alter_table('income', schema=None) as batch_op:
        batch_op.alter_column('currency',
               existing_type=sa.VARCHAR(length=3),
               type_=sa.String(length=10),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('income', schema=None) as batch_op:
        batch_op.alter_column('currency',
               existing_type=sa.String(length=10),
               type_=sa.VARCHAR(length=3),
               existing_nullable=False)

    with op.batch_alter_table('expense', schema=None) as batch_op:
        batch_op.drop_column('currency')

    # ### end Alembic commands ###