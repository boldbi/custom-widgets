/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

    guid:"ec64d658-f6c6-43e7-b11d-95eb2f4c68ab",

    widgetName:"MultiComboBoxPopup",

   init: function () {
		this.updateHeaderElement();
        this.isFilterInteraction = false;
        this.comboBoxCount = 0;
        this.filterDataSource = [];
        this.filterUniqueName = [];
		this.designId = $(this.element).parents(".e-customwidget-item").attr("id").split("_" + this.model.widgetId)[0];
        this.defaultData = [{ "column": "Item1" }, { "column": "Item2" }, { "column": "Item3" }, { "column": "Item4" }, { "column": "Item5" }];
		$(this.element).css("text-align","center");
        var widget = document.createElement("div");
		
		var filter = document.createElement("BUTTON");
		$(filter).addClass("e-dbrd-custom-multiselect-filter-button").html("Filter");
		//$(filter).css({"margin":(this.element.clientHeight/14)+"px"});
		$(filter).css({"position": "absolute","top": "50%","left": "50%", "transform": "translate(-50%, -50%)"});
		this.element.appendChild(filter);
		$(this.element).find(".e-dbrd-custom-multiselect-filter-button").off("click", $.proxy(this.filterButton, this));
        $(this.element).find(".e-dbrd-custom-multiselect-filter-button").on("click", $.proxy(this.filterButton, this)); 
		$("#" + this.designId).off("mousedown touchstart", $.proxy(this.mouseDownAction, this));
		$("#" + this.designId).on("mousedown touchstart", $.proxy(this.mouseDownAction, this));
       
	   
	   
	    widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
        
		
		$(widget).css({"height": (this.model.properties.pHeight+'px'), "width": "300px", "border": "1px solide #b3b3b3", "display":"none", "box-shadow":"0 6px 14px 3px rgb(0 0 0 / 10%)", "background-color":"white","position": "absolute", "padding-top": "10px" , "z-index": "10020"}).addClass("e-dbrd-custom-dropdown-widget");
		$("#"+this.designId).append(widget);
        
		
		//this.element.appendChild(widget);
        this.renderElement();
		//this.widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
		this["FilteredWidgetValues"] = {};

    },
	
	updateHeaderElement: function () {
		$($(this.element).parents(".e-customwidget-item").find(".bbi-dbrd-content-container")).addClass("custom_multicombobox_popup");
        $(this.element).css({ "background-color": this.textBackground });
        var controlContainer = $(this.element).parents(".e-customwidget-item");
        controlContainer.css({ "background-color": this.textBackground});
        controlContainer.find(".bbi-background-waiting-popup").css({ "background-color": this.textBackground });
        controlContainer.find(".bbi-dbrd-control-container-wrapper").css({ "padding": '0px 8px 0px 8px'});
        controlContainer.find(".bbi-dbrd-content-container").css({ "padding": '0px'});
        //this.title = controlContainer.find('.bbi-dbrd-control-header .bbi-title-text').html();
        controlContainer.find(".bbi-dbrd-control-header").hide();
        controlContainer.find(".bbi-dbrd-control-sub-header").hide();
        controlContainer.find(".bbi-dbrd-content-container").css({ "height": "calc(100%)", "background-color": this.textBackground, "border-radius": "8px"});
        controlContainer.find('.bbi-dbrd-control-background').css('opacity','0');
    },

    renderElement: function () {
			var dialogDiv = $("#"+this.designId).find("#"+this.element.getAttribute("id") + "_widget");
        var marginTop = 0;
        if (this.isWidgetConfigured()) {
            var columnLen = this.model.boundColumns.column.length;
            marginTop = ($(this.element).height() - 55) <= (columnLen * 35) ? 0 : ((($(this.element).height() - 55) - (columnLen * 35)) / 2);
            var multiBoxDiv = $("<div>").attr("id", this.element.getAttribute("id") + "_widget_combobox_div").css({
                "width": dialogDiv.width() + "px",
                "height": (dialogDiv.height() - 55) + "px",
                "overflow": "hidden auto",
                "float": "left",
                "margin-bottom": "15px",
            }).addClass("e-dbrd-custom-multiple-dropdown-container");
            var divElement = $("<div>").addClass("e-dbrd-custom-multiple-dropdown-table").css({ "width": "100%", "height": (dialogDiv.height() - 55) + "px" });
            multiBoxDiv.append(divElement);
            dialogDiv.append(multiBoxDiv);
            for (var i = 0; i < columnLen; i++) {
                var id = this.element.getAttribute("id") + "_widget_combobox_";
				var padding = dialogDiv.width() >= 300 ? 0:10;
                var comboBoxDiv1 = $("<div>").attr({
                    "id": this.element.getAttribute("id") + "_widget_combobox_div",
                    "data-column": this.model.boundColumns.column[i].uniqueColumnName
                }).css({
                    "width": "100%",
                    "height": "50px",
					"margin-bottom": "20px",
					"margin-left": "8px",
					"margin-right": "3px",
					"max-width": "280px",
					"min-width": "10px",
					"display":'inline-block',
					"padding-right": padding+"px"
                });
                divElement[0].appendChild(comboBoxDiv1[0]);
				var titleEle1 = $("<div>").attr({
                    "id": (id + this.model.boundColumns.column[i].uniqueColumnName+ '_title')
                }).css({
                    "width": dialogDiv.width() + "px",
                    "height": "20px",
					"margin-bottom": "5px",
					"margin-left": "2px",
					"font-size": "15px",
					"color": "grey",
					"font-style": "italic"
                });
				var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
				var totalBoundedDataLength = widgetInstance.dataGroupInfo.FieldContainers[0].FieldInfos.length;
				var columnName = "";
				
				for(var j = 0; j < totalBoundedDataLength; j++){
					if(widgetInstance.dataGroupInfo.FieldContainers[0].FieldInfos[j].Name == this.model.boundColumns.column[i].columnName){
						columnName = widgetInstance.dataGroupInfo.FieldContainers[0].FieldInfos[j].DisplayName;
						break;
					}
				}
				
				titleEle1[0].innerHTML = columnName;
				comboBoxDiv1[0].appendChild(titleEle1[0]);
                var inputEle1 = $("<input>").attr({
                    "type": "text",
                    "id": (id + this.model.boundColumns.column[i].uniqueColumnName)
                }).css({
                    "width": dialogDiv.width() + "px",
                    "height": "30px"
                });
                comboBoxDiv1[0].appendChild(inputEle1[0]);
                var modifiedData = this.getData(this.model.boundColumns.column[i].uniqueColumnName);
                var comboBoxObject = this.getDropDownObject(modifiedData, { text: "text", value: "value" });
                comboBoxObject.appendTo("#" + id + this.model.boundColumns.column[i].uniqueColumnName);
            }
            var buttonDiv = $("<div>").attr("id", this.element.getAttribute("id") + "_widget_button_div").css({ "width": "100%", "height": "40px", "float": "left", "padding": "5px 0px", "text-align": "center" });
            var cancelButton = $("<div>").attr("id", this.element.getAttribute("id") + "_widget_cancel_button").css({"width": "47%","margin-right": "5px","min-width": "50px","max-width": "100px"}).addClass("e-dbrd-custom-multiselect-cancel-button").html("Cancel");
            var applyButton = $("<div>").attr("id", this.element.getAttribute("id") + "_widget_apply_button").css({"width": "47%","margin-right": "0px","min-width": "50px","max-width": "100px"}).addClass("e-dbrd-custom-multiselect-apply-button").html("Apply");
            buttonDiv.append(cancelButton, applyButton);
            dialogDiv.append(buttonDiv);
            dialogDiv.find(".e-dbrd-custom-multiselect-apply-button").off("click", $.proxy(this.applyFilter, this));
            dialogDiv.find(".e-dbrd-custom-multiselect-apply-button").on("click", $.proxy(this.applyFilter, this));
            dialogDiv.find(".e-dbrd-custom-multiselect-cancel-button").off("click", $.proxy(this.cancelFilter, this));
            dialogDiv.find(".e-dbrd-custom-multiselect-cancel-button").on("click", $.proxy(this.cancelFilter, this));
        } else {
            marginTop = dialogDiv.height() <= 35 ? 0 : ((dialogDiv.height() - 35) / 2);
            var comboBoxDiv = $("<div>").attr("id", this.element.getAttribute("id") + "_widget_combobox_div").css({
                "width": (dialogDiv.width()-20)+ "px",
                "height": "35px",
                "top": marginTop + "px",
                "position":"absolute",
                "padding": "0px 10px",
            });
            dialogDiv.append(comboBoxDiv);
            var inputEle = $("<input>").attr({
                "type": "text",
                "id": this.element.getAttribute("id") + "_widget_default"
            });
            comboBoxDiv.append(inputEle);
            var comboBoxObj = this.getDropDownObject(this.defaultData, { text: 'column', value: 'column' });
			//comboBoxObj.selectAll(false);
            comboBoxObj.appendTo("#" + this.element.getAttribute("id") + "_widget_default");
        }
    },

    filterButton: function(args) {  
		var filterElement = $(this.element).find(".e-dbrd-custom-multiselect-filter-button");
		var offsetVal = filterElement.offset();
		var widgetEle = $("#"+this.designId).find("#"+ this.element.getAttribute("id") + "_widget");
        widgetEle.css({"top": (args.pageY+25)+"px", "left":(args.pageX)+"px","border":"3px solid #dcdcdc"});
        widgetEle.toggle();			 
    }, 
	
	mouseDownAction:function(args){
		var target = $(args.target);
		if(target.parents("#"+this.element.getAttribute("id")).length === 0 && target.parents("#"+ this.element.getAttribute("id") + "_widget").length === 0 ){
			$("#"+this.designId).find("#"+ this.element.getAttribute("id") + "_widget").hide();
		}
	},
	  
	
    getDropDownObject: function (dropDownData, fieldInfo) {
        return new ej2CustomMultiComboBox.dropdowns.MultiSelect({
            dataSource: dropDownData,
            fields: fieldInfo,
            mode: this.model.properties.enablemultiselect ? "CheckBox" : "Default",
            placeholder: 'All',
            showDropDownIcon: true,
            popupHeight: '250px',
            showClearButton: false,
            showSelectAll: true,
            allowFiltering: this.model.properties.allowfilter,
            created: $.proxy(this.controlCreateEvent, this),
            change: $.proxy(this.onSelectData, this)
        });
    },
	
    onSelectData: function (args) {
		if(args.isInteracted){
		var filteredWidgetUCName = args.element.id.split('_')[args.element.id.split('_').length-1];
		var filteredWidgetValues = args.value;
		if(Object.keys(this.FilteredWidgetValues).length > 0){
			var keys = Object.keys(this.FilteredWidgetValues);
			var isKeyValueUpdated = false;
			var keysLength = keys.length;
			for(var i = 0; i < keysLength; i++){
				if(keys[i].indexOf(filteredWidgetUCName) > -1){
					isKeyValueUpdated = true;
					if(filteredWidgetValues.length > 0){
						this.FilteredWidgetValues[keys[i]] = filteredWidgetValues;
					} else {
						delete this.FilteredWidgetValues[keys[i]];
					}
				}
			}
			if(!isKeyValueUpdated){
				this.FilteredWidgetValues[(Object.keys(this.FilteredWidgetValues).length +1)+'_'+filteredWidgetUCName] = filteredWidgetValues;
			}
		} else {
			this.FilteredWidgetValues[(Object.keys(this.FilteredWidgetValues).length +1)+'_'+filteredWidgetUCName] = filteredWidgetValues;
		}
		var boundColumnsLength = this.model.boundColumns.column.length;
		for(var i = 0; i < boundColumnsLength; i++){
			var id = this.element.getAttribute("id") + "_widget_combobox_";
			var inputEle = $("#"+this.designId).find("#" + id + this.model.boundColumns.column[i].uniqueColumnName);
			var inputObj = ej2CustomMultiComboBox.base.getComponent(inputEle[0], "multiselect");
			this.updateComboboxDataBasedOnFilteredData(inputObj,this.FilteredWidgetValues,this.model.boundColumns.column[i].uniqueColumnName);
		}
		} else {
			bbicustom.dashboard.filterData(this, []);
			var widgetObj =  ej2CustomMultiComboBox.base.getComponent($('#'+args.element.id)[0], "multiselect");
			widgetObj.value = [];
			widgetObj.selectAll(false);
		}
    },
	updateComboboxDataBasedOnFilteredData: function(widgetObj, filterValues, UCN){
		var filterKeys = Object.keys(filterValues);
		var filterValues = Object.values(filterValues);
		var newdata = this.model.dataSource;
		var isCurrentControl = true;
		var flterKeysLength = filterKeys.length;
		for(var i = 0; i < flterKeysLength; i++){
			if(filterKeys[i].indexOf(UCN) == -1){
				isCurrentControl = false;
				var tempData = [];
				for(var j = 0; j < newdata.length; j++){
					if(filterValues[i].indexOf(newdata[j][filterKeys[i].split('_')[filterKeys[i].split('_').length-1]]) > -1){
						tempData.push(newdata[j]);
					}
				}
				newdata = tempData;
			}
		}
		if(!isCurrentControl || filterKeys.length == 0){
		var widgetData = [];
		newdata = newdata.sort((a,b)=> (a[UCN] > b[UCN] ? 1 : -1));
		var newDataLength = newdata.length;
		for(var i = 0; i < newDataLength; i++){
			if(widgetData.length == 0){
				widgetData.push({"text": newdata[i][UCN], "value":newdata[i][UCN]});
			} else if(widgetData[widgetData.length-1].text != newdata[i][UCN]){
				widgetData.push({"text": newdata[i][UCN], "value":newdata[i][UCN]});
			}
		}
		if(widgetObj.dataSource.length != widgetData.length){
			var temp = widgetObj.value;
			widgetObj.dataSource = widgetData
			widgetObj.value = temp;
			widgetObj.refresh();
		}
		}
	},
    getFilterData: function (uniqueName, value, currentUniqueName) {
        var data = [];
		var dataSourceLength = this.model.dataSource.length;
        for (var i = 0; i < dataSourceLength; i++) {
            if (this.model.dataSource[i][uniqueName] === value) {
                if (data.length === 0) {
                    data.push({ "text": this.model.dataSource[i][currentUniqueName], "value": this.model.dataSource[i][currentUniqueName] });
                } else {
                    var isAdded = false;
                    for (var j = 0; j < data.length; j++) {
                        if (data[j]["text"] === this.model.dataSource[i][currentUniqueName]) {
                            isAdded = true;
                            break;
                        }
                    }
                    if (!isAdded) {
                        data.push({ "text": this.model.dataSource[i][currentUniqueName], "value": this.model.dataSource[i][currentUniqueName] });
                    }
                }
            }
        }
        return data;
    },

    getData: function (uniqueColumnName) {
        var data = [];
		var tempData = this.model.dataSource;
		tempData = tempData.sort((a,b)=> (a[uniqueColumnName] > b[uniqueColumnName] ? 1 : -1));
        var tempDataLength = tempData.length;
		for (var i = 0; i < tempDataLength; i++) {
            if (data.length === 0) {
                data.push({ "text": tempData[i][uniqueColumnName], "value": tempData[i][uniqueColumnName] });
            } else {
                var isAdded = false;
                for (var j = 0; j < data.length; j++) {
                    if (data[j]["text"] === tempData[i][uniqueColumnName]) {
                        isAdded = true;
                        break;
                    }
                }
                if (!isAdded) {
                    data.push({ "text": tempData[i][uniqueColumnName], "value": tempData[i][uniqueColumnName] });
                }
            }
        }
        return data;
    },

    controlCreateEvent: function () {
        if (this.isWidgetConfigured()) {
            var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
            if (this.comboBoxCount === (this.model.boundColumns.column.length-1)) {
                if (widgetInstance.widgetJson.FilterSettings.ActAsMasterWidget && widgetInstance.widgetJson.SelectedFilterValues.length !== 0) {
                    var filterCollection = widgetInstance.widgetJson.SelectedFilterValues;
                    for (var i = 0; i < filterCollection.length; i++) {
                        for (var j = 0; j < this.model.boundColumns.column.length; j++) {
                            if (this.model.boundColumns.column[j].uniqueColumnName === filterCollection[i].UniqueColumnName && filterCollection[i].InitialDimensionFilter.Text.length > 0) {
                                this.updateInitialSelection(filterCollection[i].UniqueColumnName, filterCollection[i].InitialDimensionFilter.Text);
                                break;
                            }
                        }
                    }
                }
                this.comboBoxCount = 0;
            } else {
                this.comboBoxCount = this.comboBoxCount + 1;
            }
        }
    },

    updateInitialSelection: function (uniqueColumnName, valueList) {
        var inputEle = $("#"+this.designId).find("#" + this.element.getAttribute("id") + "_widget_combobox_" + uniqueColumnName);
        if (inputEle.length !== 0 && inputEle.hasClass("e-multiselect") && valueList.length !== 0) {
            var inputObject = ej2CustomMultiComboBox.base.getComponent(inputEle[0], "multiselect");
            var textValue = "";
            for (var i = 0; i < valueList.length; i++) {
                textValue = textValue === "" ? (textValue + valueList[i]) : (textValue + "," + valueList[i]);
            }
            inputObject.value = valueList;
            inputObject.text = textValue;
        }
    },

    applyFilter: function () {
        var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
        if (widgetInstance.widgetJson.FilterSettings.ActAsMasterWidget && widgetInstance.designer.model.mode !== "design") {
            var selectedFilterValue = [];
            for (var i = 0; i < this.model.boundColumns.column.length; i++) {
                var inputEle = $("#"+this.designId).find("#" + this.element.getAttribute("id") + "_widget_combobox_" + this.model.boundColumns.column[i].uniqueColumnName);
                if (inputEle.length !== 0) {
                    var inputObject = ej2CustomMultiComboBox.base.getComponent(inputEle[0], "multiselect");
                    if (inputObject !== null && inputObject.value !== null && inputObject.value !== undefined && inputObject.value.length !== 0) {
                        var filterColumn = new bbicustom.dashboard.selectedColumnInfo();
                        filterColumn.condition = "include";
                        filterColumn.uniqueColumnName = this.model.boundColumns.column[i].uniqueColumnName;
                        filterColumn.values = inputObject.value;
                        selectedFilterValue.push(filterColumn);
                    }
                }
            }
            if (selectedFilterValue.length !== 0) {
                this.isFilterInteraction = true;
                bbicustom.dashboard.filterData(this, selectedFilterValue);
            }
        }
		$("#"+this.designId).find("#"+ this.element.getAttribute("id") + "_widget").hide();
    },

    cancelFilter: function () {
        var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
		widgetInstance.clearFilter();
		$("#"+this.designId).find("#"+ this.element.getAttribute("id") + "_widget").hide();
		//bbicustom.dashboard.filterData(this, []);
		/*this["FilteredWidgetValues"] = {};
		var widget = document.getElementById(this.element.getAttribute("id") + "_widget");
        $(widget).css({
            "height": $(this.element).height() + "px", "width": $(this.element).width() + "px", "border": "1px solide #b3b3b3"
        });
        $(widget).children().remove();
		bbicustom.dashboard.filterData(this, []);
        this.renderElement();*/
    },

    isWidgetConfigured: function () {
        return this.model.boundColumns.column.length > 0 && this.model.dataSource.length > 0;
    },
 
    update: function (option) {
		//this.updateHeaderElement();
		$("#"+this.designId).find("#"+ this.element.getAttribute("id") + "_widget").hide();
        if (option.type === "resize") {
        }
        else if (option.type === "refresh") {
        }
		else if(option.type === "clearFilter"){
			//this.widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
			//this.widgetInstance.clearFilter();
			this["FilteredWidgetValues"] = {};
			var widget = document.getElementById(this.element.getAttribute("id") + "_widget");
			$(widget).css({"height": (this.model.properties.pHeight+'px'), "width": "300px", "border": "1px solide #b3b3b3", "display":"none", "box-shadow":"0 6px 14px 3px rgb(0 0 0 / 10%)", "background-color":"white","position": "absolute", "padding-top": "10px" , "z-index": "10020"}).addClass("e-dbrd-custom-dropdown-widget");
			//$(widget).css({
				//"height": $(this.element).height() + "px", "width": $(this.element).width() + "px", "border": "1px solide #b3b3b3"
			//});
			$(widget).children().remove();
			this.renderElement();
			return;
		}
        else if (option.type === "propertyChange") {
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
		if (this.isFilterInteraction) {
            this.isFilterInteraction = false;
            return;
        }
		
		this["FilteredWidgetValues"] = {};
		
        var widget = document.getElementById(this.element.getAttribute("id") + "_widget");
		$(widget).css({"height": (this.model.properties.pHeight+'px'), "width": "300px", "border": "1px solide #b3b3b3", "display":"none", "box-shadow":"0 6px 14px 3px rgb(0 0 0 / 10%)", "background-color":"white","position": "absolute", "padding-top": "10px" , "z-index": "10020"}).addClass("e-dbrd-custom-dropdown-widget");
        $(widget).children().remove();
        this.renderElement();
    }
});