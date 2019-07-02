"""empty message

Revision ID: 4ba98280334c
Revises: 46d17fe8df71
Create Date: 2019-07-02 18:10:13.557024

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4ba98280334c'
down_revision = '46d17fe8df71'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('session_parts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=True),
    sa.Column('number', sa.Integer(), nullable=True),
    sa.Column('description', sa.String(length=300), nullable=True),
    sa.Column('session_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['session_id'], ['sessions.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('records', sa.Column('part_id', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'records', 'session_parts', ['part_id'], ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'records', type_='foreignkey')
    op.drop_column('records', 'part_id')
    op.drop_table('session_parts')
    # ### end Alembic commands ###
