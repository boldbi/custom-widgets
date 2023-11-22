bbicustom.dashboard.registerWidget({

    guid:"fffbbfe5-c9fc-4951-a1d8-2a7e953781a0",

    widgetName:"TagCloud",

    init: function () {
		this.widget = document.createElement("div");
        this.widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
		$(this.widget).css("overflow","auto");
        this.element.appendChild(this.widget);
		var data = [{ text: "Item1", frequency: 12 },{ text: "Item2",  frequency: 3 },{ text: "Item3",  frequency: 8 },{ text: "Item4", frequency: 2 }];
	    if (this.model.boundColumns.Text.length > 0 && this.model.boundColumns.Frequency.length > 0) {
			data = [];
			for( var i=0; i < this.model.dataSource.length;i++) {
				if(!BoldBIDashboard.isNullOrUndefined(this.model.dataSource[i][this.model.boundColumns.Text[0].uniqueColumnName])&& !BoldBIDashboard.isNullOrUndefined(this.model.dataSource[i][this.model.boundColumns.Frequency[0].uniqueColumnName])){
					data.push({text:this.model.dataSource[i][this.model.boundColumns.Text[0].uniqueColumnName],frequency:this.model.dataSource[i][this.model.boundColumns.Frequency[0].uniqueColumnName]});
				}
			}
	    }
	    $(this.widget).ejTagCloud({ 
			dataSource:data, 
			click: $.proxy(this.selectionChanged,this), 
			showTitle: this.model.properties.showTitle, 
			titleText: this.model.properties.titleText
		});
		$(this.widget).css({"width":$(this.element).width(), "height": $(this.element).height(), "minFontSize" :this.model.properties.minTextSize, "maxFontSize":this.model.properties.maxTextSize });
		this.setTagCloudProperties();
    },
	formatData : function (dataSource) {
		var data = [];
		for( var i=0; i < dataSource.length;i++) {
			if(!BoldBIDashboard.isNullOrUndefined(dataSource[i][this.model.boundColumns.Text[0].uniqueColumnName]) && !BoldBIDashboard.isNullOrUndefined(dataSource[i][this.model.boundColumns.Frequency[0].uniqueColumnName])){
				data.push({text:dataSource[i][this.model.boundColumns.Text[0].uniqueColumnName],frequency:dataSource[i][this.model.boundColumns.Frequency[0].uniqueColumnName]});
			}
		}
		
		return data;
	},
	selectionChanged : function (e) {
		if(e.value !== null && e.value !== undefined){
			var selectedFilterInfos = [];
			var filterinfo = new bbicustom.dashboard.selectedColumnInfo();
			filterinfo.condition = "Include";
			filterinfo.uniqueColumnName = this.model.boundColumns.Text[0].uniqueColumnName;
			filterinfo.values.push(e.value);
			selectedFilterInfos.push(filterinfo);
			bbicustom.dashboard.filterData(this,selectedFilterInfos);
		}
	},
    update: function (option) {
		var widgetObj = $(this.widget).data("ejTagCloud");
        if (option.type == "resize") {
			$(this.widget).css({"width": option.size.width, height:option.size.height });
        }
        else if (option.type == "refresh") {
			if(this.model.boundColumns.Text.length > 0 && this.model.boundColumns.Frequency.length > 0){
				widgetObj.option("dataSource", this.formatData(option.data), true);
				this.setTagCloudProperties();
			}
        }
        else if (option.type == "propertyChange") {
				switch (option.property.name)
				{
					case "showTitle":
					case "titleText":
					case "titleBackground":
					case "titleColor":
					case "titleSize":
					case "titleStyle":
					case "textBackground":
					case "textColor":
					case "minTextSize":
					case "maxTextSize":
					case "textStyle":
						this.element.innerHTML = '';
						this.init();
						break;
				}
        }
    },
	setTitleBackground: function(value) {
		$(this.element).find(".e-header").css("background-color", (value.length > 7) ? "#"+ value.substring(3): value);
	},
	setTitleColor: function(value) {
		$(this.element).find(".e-header").css("color", (value.length > 7) ? "#"+ value.substring(3): value);
	},
	setTitleSize: function(value) {
		$(this.element).find(".e-header span").css("font-size", value);
	},
	setTitleStyle: function(value) {
		$(this.element).find(".e-header span").css("font-style", value);
	},
	setTextBackground: function(value) {
		$(this.element).find(".e-ul").css("background-color", (value.length > 7) ? "#"+ value.substring(3): value);
	},
	setTextColor: function(value) {
		$(this.element).find(".e-ul li a").css("color", (value.length > 7) ? "#"+ value.substring(3): value);
	},
	setTextStyle: function(value) {
		$(this.element).find(".e-ul li a").css("font-style", value);
	},
	
	setTagCloudProperties: function() {
		this.setTitleBackground(this.model.properties.titleBackground);
		this.setTitleColor(this.model.properties.titleColor);
		this.setTitleSize(this.model.properties.titleSize);
		this.setTitleStyle(this.model.properties.titleStyle);
		this.setTextBackground(this.model.properties.textBackground);
		this.setTextColor(this.model.properties.textColor);
		this.setTextStyle(this.model.properties.textStyle);
	}
});