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