NPT - Renumber Send and Remove TODOs to Create Initial Version
---

This jupyter extension adds two buttons to the toolbar.

Upon clicking on the renumbering button, the extension finds all send(obj, N) functions in the notebook and renumber them in increasing order starting from 0.

Upon clicking on the init_student_version button, the extension finds all code in between "### TO DO" and "### END TO DO" and replaces it by "# YOUR CODE HERE" (any number of # is acceptable). The new notebook is saved in the same folder with a suffix "init_student_version".

These parameters can be changed in the Nbextensions Configuration Panel.
