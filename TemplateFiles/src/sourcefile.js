/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

    guid: "",

    widgetName: "",

    init: function () {
        /* init method will be called when the widget is initialized */
        var widget = document.createElement("div");
        widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
        widget.innerHTML = this.model.properties.text;
        widget.style.display = (this.model.properties.showText) ? "block" : "none";
        widget.style.backgroundColor = this.model.properties.textBackground;
        widget.style.fontSize = this.model.properties.textSize + "px";
        widget.style.fontStyle = this.model.properties.textStyle;
        this.element.appendChild(widget);
    },

    update: function (option) {
        var widget = document.getElementById(this.element.getAttribute("id") + "_widget");

        /* update method will be called when any update needs to be performed in the widget. */

        if (option.type == "resize") {
            /* update type will be 'resize' if the widget is being resized. */
        }
        else if (option.type == "refresh") {
            /* update type will be 'refresh' when the data is refreshed. */
        }
        else if (option.type == "propertyChange") {
            /* update type will be 'propertyChange' when any property value is changed in the designer. */

            switch (option.property.name) {
                case "showText":
                    widget.style.display = (option.property.value) ? "block" : "none";
                    break;
                case "text":
                    widget.innerHTML = option.property.value;
                    break;
                case "textBackground":
                    widget.style.backgroundColor = option.property.value;
                    break;
                case "textSize":
                    widget.style.fontSize = option.property.value + "px";
                    break;
                case "textStyle":
                    widget.style.fontStyle = option.property.value;
                    break;
            }
        }
    }
});