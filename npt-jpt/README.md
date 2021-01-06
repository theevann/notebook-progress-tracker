NPT - Renumber Send and Remove TODOs to Create Initial Version
---

This jupyter extension adds two buttons to the toolbar.

Upon clicking on the renumbering button, the extension finds all send(obj, N) functions in the notebook and renumber them in increasing order starting from 0.

Upon clicking on the init_student_version button, the extension finds all code matching a specific pattern described below and either hides it or replaces it by a given string. The newly created notebook has no output and is saved in the same folder with a suffix "init_student_version".

The patterns can be:

```python
# HIDE + [CELL|BLOCK|LINE|OPERAND]
# TODO + [BLOCK|LINE|OPERAND]   
```

For blocks, you need to define the end of the HIDE/TODO with `# END TODO BLOCK` or `# END HIDE BLOCK`.

Examples:
```python
A = 42

# Compute the square of A
A_square = A**2  # TODO OPERAND

### HIDE BLOCK
# Everything in this block will be removed in the student version
A_square == 42 * 42
### END HIDE BLOCK

```

These parameters can be changed in the Nbextensions Configuration Panel.
