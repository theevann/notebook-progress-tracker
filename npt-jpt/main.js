define([
    'base/js/namespace'
], function (Jupyter) {
    function load_ipython_extension() {
        var action = {
            icon: 'fa-sort-numeric-asc',
            help: 'NPT - Renumber send',
            help_index: 'zz',
            handler: renumber
        };
        var prefix = 'npt';
        var action_name = 'renumber-send';

        var full_action_name = Jupyter.actions.register(action, action_name, prefix);
        Jupyter.toolbar.add_buttons_group([full_action_name]);

        var action2 = {
            icon: 'fa-eye-slash',
            help: 'NPT - Create student initial version',
            help_index: 'zz',
            handler: create_init
        };
        var prefix = 'npt';
        var action2_name = 'create-student-initial-version';

        var full_action2_name = Jupyter.actions.register(action2, action2_name, prefix);
        Jupyter.toolbar.add_buttons_group([full_action2_name]);
    }

    function create_init(){
        let path = Jupyter.notebook.notebook_path.replace(".ipynb", "_init_student_version.ipynb");
        let model_json = Jupyter.notebook.toJSON();

        model_json.cells.forEach((c) => {
            let text = c.source;
            c.source = text.replace(/#+\s*TO\s*DO(.|\n)*?(#+\s*END\s*TO\s*DO)/g, "\n#\n#\n# YOUR CODE HERE\n#\n#\n");
        });

        var model = { type: "notebook", content: model_json };

        Jupyter.notebook.contents.save(path, model);
    }

    function renumber() {
        let nb = 0;

        Jupyter.notebook.get_cells().forEach(cell => {
            let text = cell.get_text();
            let new_text = text.replace(/send\(\s*(\S+.*?)\s*,\s*(\d+)\s*\)/g, (_, obj) => `send(${obj}, ${nb++})`);
            
            if (text !== new_text)
                cell.set_text(new_text);
        });
    }

    return {
        load_ipython_extension: load_ipython_extension,
        renumber: renumber
    };
});