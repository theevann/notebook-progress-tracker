define([
    'base/js/namespace'
], function (Jupyter) {
    function load_ipython_extension() {
        var prefix = 'npt';

        var action = {
            icon: 'fa-sort-numeric-asc',
            help: 'NPT - Renumber send',
            help_index: 'zz',
            handler: renumber
        };
        var action_name = 'renumber-send';

        
        var action2 = {
            icon: 'fa-eye-slash',
            help: 'NPT - Create student initial version',
            help_index: 'zz',
            handler: create_init
        };
        var action2_name = 'create-student-initial-version';
        
        var full_action = Jupyter.actions.register(action, action_name, prefix);
        var full_action2 = Jupyter.actions.register(action2, action2_name, prefix);
        Jupyter.toolbar.add_buttons_group([full_action, full_action2]);
    }

    function create_init(){
        let replace_text = Jupyter.notebook.config.data.text_replace_todo || "# YOUR CODE HERE"
        let prefix = Jupyter.notebook.config.data["file_prefix"] || "";
        let suffix = Jupyter.notebook.config.data["file_suffix"] || "_init_student_version";
        
        let path = prefix + Jupyter.notebook.notebook_path.replace(".ipynb", suffix + ".ipynb");
        let model_json = Jupyter.notebook.toJSON();
        let model = { type: "notebook", content: model_json };

        model_json.cells.forEach(c => {
            c.source = c.source.replace(/( *)#+ *TO *DO(.|\n)*?(#+ *END *TO *DO)/g,
                                        (_, s) => `${s}\n${s}#\n${s}#\n${s}${replace_text}\n${s}#\n${s}#\n${s}`);
        });

        Jupyter.notebook.contents.save(path, model);
    }

    function renumber() {
        let nb = Jupyter.notebook.config.data["starting_question_number"] || 0;

        Jupyter.notebook.get_cells().forEach(cell => {
            let text = cell.get_text();
            let new_text = text.replace(/send\( *(\S.*) *, *(\d+) *\)/g, (_, obj) => `send(${obj}, ${nb++})`);
            
            if (text !== new_text)
                cell.set_text(new_text);
        });
    }

    return {
        load_ipython_extension: load_ipython_extension,
        renumber: renumber
    };
});