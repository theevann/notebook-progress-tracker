"""empty message

Revision ID: 5df1b198b62f
Revises: 4ba98280334c
Create Date: 2020-12-18 05:17:05.704751

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5df1b198b62f'
down_revision = '4ba98280334c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('session_sharing',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('shared_user_id', sa.Integer(), nullable=False),
    sa.Column('session_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ),
    sa.ForeignKeyConstraint(['shared_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('session_sharing')
    # ### end Alembic commands ###
