/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

    guid:"0e38aa64-4b45-4a50-8457-cad3957adeec",

    widgetName:"SankeyChart",

    init: function () {
		this.widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
		window.that = this;
        this.widget = document.createElement("div");
        this.widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
        this.element.appendChild(this.widget);
		var myChart = echarts.init(this.element,null, { renderer: 'svg'});
		this.formattingInfo = {};
		for(var j = 0; j<this.widgetInstance.dataGroupInfo.FieldContainers.length; j++){
			if(this.widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0 && this.widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0){
				var length = this.widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length;
				for(var i = 0; i < length; i++){
					this.formattingInfo[this.widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = this.widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].MeasureFormatting;
				}
			}
		}
		var option = {
			backgroundColor: '#FFFFFF',
			animation:this.model.properties.enableAnimation,			
			series: [
			{
				type: 'sankey',
				data: this.getData(),
				links: this.getLink(),
				left: ((this.model.properties.labelPosition == 'left')?"15%":"7.5%"),
				right:((this.model.properties.labelPosition == 'right')?"15%":"7.5%"),
				lineStyle: {
					color: this.model.properties.linkColor,
					curveness: 0.5
				},
				orient: this.model.properties.orient,
				label: {
					position: this.model.properties.labelPosition,
					color: this.model.properties.labelColor,
					fontFamily: 'Arial',
					fontSize: this.model.properties.labelFontSize
				} 
			}],
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					var that = window.that;
					return params.name + " : " + that.formatDataNumber(params.value);
				},	
				padding:5,
				confine: true,
				textStyle: {
					fontSize: 11,
				}
			},
		};
		if (option && typeof option === 'object') {
			myChart.setOption(option);
		}
		myChart.on('click', function(params){
			var that = window.that;
			if(that.model.dataSource.length > 0 && that.widgetInstance.designerInstance.model.mode != 'design'){
				that.widgetInstance = $(that.element).closest(".e-customwidget-item").data("widgetInstance");
				var uniqueColumnName = [];
				var data = [];
				var selectedFilterInfos = [];
				for(var k = 1; k < that.widgetInstance.dataGroupInfo.FieldContainers.length; k++){
					for(var i = 0; i< that.model.dataSource.length; i++){
						var tempText = that.model.dataSource[i][that.widgetInstance.dataGroupInfo.FieldContainers[k].FieldInfos[0].UniqueColumnName];
						if(params.data.source != undefined && params.data.target != undefined){
							if (tempText == params.data.source || tempText == params.data.target) {
								if (data.indexOf(tempText) == -1 && tempText != '(Null)') {
									uniqueColumnName.push(that.widgetInstance.dataGroupInfo.FieldContainers[k].FieldInfos[0].UniqueColumnName);
									data.push(tempText);
								}
							}
						}
						else{
							if (tempText == params.data.name) {
								if (data.indexOf(tempText) == -1 && tempText != '(Null)') {
									uniqueColumnName.push(that.widgetInstance.dataGroupInfo.FieldContainers[k].FieldInfos[0].UniqueColumnName);
									data.push(tempText);									
								}
							}
						}
					}
				}
				for(var i = 0; i <data.length; i++){
					var filterinfo = new bbicustom.dashboard.selectedColumnInfo();
					filterinfo.condition = "Include";
					filterinfo.uniqueColumnName = uniqueColumnName[i];
					filterinfo.values = data[i];
					selectedFilterInfos.push(filterinfo);	
				}
				bbicustom.dashboard.filterData(that, selectedFilterInfos);
			}
		});
    },
	
	formatDataNumber: function (number) {
		var number = Number(number);
		var formatInfo = this.formattingInfo[this.model.boundColumns.value[0].uniqueColumnName];
		number = BoldBIDashboard.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		return number;
	},
	
	getData: function(){
		var data = [];
		this.uniqueSourceValues = [];
		this.uniqueTargetValues = [];
		if(this.isWidgetConfigured()){
			for(var i=0; i<this.model.dataSource.length; i++){
				var tempText = this.model.dataSource[i][this.model.boundColumns.source[0].uniqueColumnName];
				if(this.uniqueSourceValues.indexOf(tempText) == -1 && tempText != '(Null)'){
					this.uniqueSourceValues.push(tempText);
				}
			}
			for(var i=0; i<this.model.dataSource.length; i++){
				var tempText = this.model.dataSource[i][this.model.boundColumns.target[0].uniqueColumnName];
				if(this.uniqueTargetValues.indexOf(tempText) == -1 && tempText != '(Null)'){
					this.uniqueTargetValues.push(tempText);
				}
			}
			for(var i=0; i<this.uniqueSourceValues.length; i++){
				data.push({
					name : this.uniqueSourceValues[i],
					itemStyle: this.getSourceColors(i)
				});
			}
			for(var i=0; i<this.uniqueTargetValues.length; i++){
				data.push({
					name : this.uniqueTargetValues[i],
					itemStyle: this.getTargetColors(i)
				});
			}
		}
		else{
			data = [
				{name: 'a', itemStyle: {color:this.model.properties.sourceColor0,borderColor:this.model.properties.sourceColor0}},
				{name: 'b', itemStyle: {color:this.model.properties.sourceColor1,borderColor:this.model.properties.sourceColor1}},
				{name: 'a1', itemStyle: {color:this.model.properties.targetColor0,borderColor:this.model.properties.targetColor0}},
				{name: 'a2', itemStyle: {color:this.model.properties.targetColor1,borderColor:this.model.properties.targetColor1}},
				{name: 'b1', itemStyle: {color:this.model.properties.sourceColor2,borderColor:this.model.properties.sourceColor2}},
				{name: 'c', itemStyle: {color:this.model.properties.targetColor2,borderColor:this.model.properties.targetColor2}}
			];
		}
		return data;
	},
	
	getSourceColors: function(colorIndex){
		var itemStyle = {};
		if(this.isWidgetConfigured()){
			var index = colorIndex >= 5 ? colorIndex % 5 : colorIndex;
			itemStyle = {
				color: this.model.properties["sourceColor"+index].slice(0,7),
				borderColor: this.model.properties["sourceColor"+index].slice(0,7)
			};	
		}
		return itemStyle;
	},
	
	getTargetColors: function(colorIndex){
		var itemStyle = {};
		if(this.isWidgetConfigured()){
			var index = colorIndex >= 5 ? colorIndex % 5 : colorIndex;
			itemStyle = {
				color: this.model.properties["targetColor"+index].slice(0,7),
				borderColor: this.model.properties["targetColor"+index].slice(0,7)
			};	
		}
		return itemStyle;
	},
	
	getLink: function(){
		var linkObj = [];
		if(this.isWidgetConfigured()){
			for(var i=0; i<this.model.dataSource.length; i++){
				linkObj.push({
					source : this.model.dataSource[i][this.model.boundColumns.source[0].uniqueColumnName], 
					target: this.model.dataSource[i][this.model.boundColumns.target[0].uniqueColumnName],
					value: this.model.dataSource[i][this.model.boundColumns.value[0].uniqueColumnName]
				});
			}
		}
		else{
			linkObj = [
			  {source: 'a',target: 'a1',value: 5},
			  {source: 'a',target: 'a2',value: 3},
			  {source: 'b',target: 'b1',value: 8},
			  {source: 'a',target: 'b1',value: 3},
			  {source: 'b1',target: 'a1',value: 1},
			  {source: 'b1',target: 'c',value: 2}
			];
		}
		return linkObj;
	},

	isWidgetConfigured: function () {
		return (this.model.dataSource.length > 0 && this.model.boundColumns.value.length > 0 && this.model.boundColumns.source.length > 0 && this.model.boundColumns.target.length > 0);
	},

       update: function (option) {
        if (option.type == "resize") {
			this.element.innerHTML = '';
			$(this.element).removeAttr("_echarts_instance_");
            this.init();  
        }
        else if (option.type == "refresh") {
            this.element.innerHTML = '';
			$(this.element).removeAttr("_echarts_instance_");
            this.init();
        }
        else if (option.type == "propertyChange") {
			this.element.innerHTML = '';
			$(this.element).removeAttr("_echarts_instance_");
            this.init();
        }

    }
});