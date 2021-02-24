"""empty message

Revision ID: 88c6d73e2908
Revises: 5df1b198b62f
Create Date: 2021-02-23 18:46:19.570422

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '88c6d73e2908'
down_revision = '5df1b198b62f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('records', sa.Column('sender_uuid', sa.String(length=100), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('records', 'sender_uuid')
    # ### end Alembic commands ###
