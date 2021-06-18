
// Define function to load external script

function loadScript(url, callback=(() => { })) {
    var temp_define = define;
    define = null;

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) {  //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" ||
                script.readyState == "complete") {
                script.onreadystatechange = null;
                define = temp_define;
                callback();
            }
        };
    } else {  //Others
        script.onload = function () {
            define = temp_define;
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}


// Define function to load external css

function loadCss(url, callback=(() => { }), id="") {
    var tag = document.createElement("link");
    tag.id = id;
    tag.rel = "stylesheet";
    tag.type = "text/css";
    tag.media = "all";
    tag.href = url;
    tag.onload = callback;
    document.head.appendChild(tag);
}


// Define functions to initiate Pusher connections

function init_pusher () {
    Pusher.logToConsole = true;

    var pusher = new Pusher('16ffc3f1f686b61fea62', {
        cluster: 'eu'
    });

    if (window._npt_pusher_own_channel !== undefined) {
        window._npt_pusher_own_channel.unbind_all();
        window._npt_pusher_own_channel.unsubscribe();
    }
    window._npt_pusher_own_channel = subscribe_to_channel(pusher, window._npt_own_channel);    

    if (window._npt_pusher_all_channel !== undefined) {
        window._npt_pusher_all_channel.unbind_all();
        window._npt_pusher_all_channel.unsubscribe();
    }
    window._npt_pusher_all_channel = subscribe_to_channel(pusher, window._npt_all_channel);

}

function subscribe_to_channel(pusher, channel_name) {
    var channel = pusher.subscribe(channel_name);
    channel.bind('message', function (data) {
        VanillaToasts.create({
            title: data['title'],
            text: data['body'],
            code: data['code'],
            type: data['type'],
            positionClass: "right",
            timeout: data["timeout"]
        });
    });
   return channel;
}


// Define VanillaToasts

window.VanillaToasts = (function () {
    var VanillaToasts = {
        toasts: {},
    };
    var autoincrement = 0;
    
    if (document.readyState === "complete") {
        init();
    } else {
        window.addEventListener("DOMContentLoaded", init);
    }
    
    function init() {
        // Toast container
        var container = document.createElement("div");
        container.id = "vanillatoasts-container";
        document.getElementById("header").prepend(container);
        
        // @Override
        // Replace create method when DOM has finished loading
        VanillaToasts.create = function (options) {
            var toast = document.createElement("div");
            toast.id = ++autoincrement;
            toast.id = "toast-" + toast.id;
            toast.className = "vanillatoasts-toast";
            
            // title
            if (options.title) {
                var h4 = document.createElement("h4");
                h4.className = "vanillatoasts-title";
                h4.innerHTML = options.title;
                toast.appendChild(h4);
            }
            
            // text
            if (options.text) {
                var p = document.createElement("p");
                p.className = "vanillatoasts-text";
                p.innerHTML = options.text;
                toast.appendChild(p);
            }

            // code
            if (options.code) {
                var code_div = document.createElement("div");
                code_div.className = "vanillatoasts-code";
                toast.appendChild(code_div);

                var myCodeMirror = CodeMirror(code_div, {
                    value: options.code,
                    mode: "python"
                });

                setTimeout(function() {
                    myCodeMirror.refresh();
                }, 1);
            }


            // icon
            if (options.icon) {
                var img = document.createElement("img");
                img.src = options.icon;
                img.className = "vanillatoasts-icon";
                toast.appendChild(img);
            }


            // Add bottom buttons
            var bottom = document.createElement("div");
            bottom.classList.add("vanillatoasts-buttons-container")

            var close_btn = document.createElement("button");
            close_btn.classList.add("btn", "btn-default");
            close_btn.innerHTML = "Close";
            close_btn.onclick = () => toast.hide();

            var copy_btn = document.createElement("button");
            copy_btn.classList.add("btn", "btn-default");
            copy_btn.innerHTML = "Copy text";
            copy_btn.onclick = () => {
                var to_copy = [];
                to_copy.push(options.text ? p.textContent : "");
                to_copy.push(options.code ? myCodeMirror.getValue() : "");

                navigator.clipboard.writeText(to_copy.join("\n")).then(() => {}, () => { alert("Copy failed"); });
            };

            var enlarge_btn = document.createElement("button");
            enlarge_btn.classList.add("btn", "btn-default");
            enlarge_btn.innerHTML = "Enlarge";
            enlarge_btn.onclick = () => {
                if (enlarge_btn.innerHTML == "Enlarge") {
                    toast.style.width = "90%";
                    enlarge_btn.innerHTML = "Reduce";
                }
                else {
                    toast.style.width = "30%";
                    enlarge_btn.innerHTML = "Enlarge";
                }
            };

            bottom.appendChild(enlarge_btn);
            bottom.appendChild(copy_btn);
            bottom.appendChild(close_btn);
            toast.appendChild(bottom);

            
            // position
            var position = options.positionClass;

            switch (position) {
                case "right":
                    toast.classList.add("toasts-right");
                    break;
                case "center":
                    toast.classList.add("toasts-center");
                    break;
                case "left":
                    toast.classList.add("toasts-left");
                    break;
                default:
                    toast.classList.add("toasts-right");
                    break;
            }
            
            // click callback
            if (typeof options.callback === "function") {
                toast.addEventListener("click", options.callback);
            }
            
            // toast api
            toast.hide = function () {
                toast.className += " vanillatoasts-fadeOut";
                toast.addEventListener("animationend", removeToast, false);
            };
            
            // autohide
            if (options.timeout) {
                setTimeout(toast.hide, options.timeout);
            }
            
            if (options.type) {
                toast.className += " vanillatoasts-" + options.type;
            }
            
            // toast.addEventListener("click", toast.hide);
            
            function removeToast() {
                document.getElementById("vanillatoasts-container").removeChild(toast);
                delete VanillaToasts.toasts[toast.id]; //remove toast from object
            }
            
            document.getElementById("vanillatoasts-container").appendChild(toast);
            
            //add toast to object so its easily gettable by its id
            VanillaToasts.toasts[toast.id] = toast;
            
            return toast;
        };
        
        /*
        custom function to manually initiate timeout of
        the toast.  Useful if toast is created as persistant
        because we don't want it to start to timeout until
        we tell it to
        */
        VanillaToasts.setTimeout = function (toastid, val) {
            if (VanillaToasts.toasts[toastid]) {
                setTimeout(VanillaToasts.toasts[toastid].hide, val);
            }
        };
    }
    
    return VanillaToasts;
})();


// load external scripts and css

setTimeout(() => {
    loadScript("https://js.pusher.com/7.0/pusher.js", init_pusher);
    loadCss(`${window._npt_server_url}css/jpt-client.css`);
}, 2000);
