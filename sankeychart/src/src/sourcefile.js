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
				emphasis: {
					focus: 'adjacency'
				},
				left: ((this.model.properties.labelPosition.toLowerCase() == 'left')?"15%":"7.5%"),
				right:((this.model.properties.labelPosition.toLowerCase() == 'right')?"15%":"7.5%"),
				lineStyle: {
					color: this.model.properties.linkColor.toLowerCase(),
					curveness: 0.5
				},
				orient: this.model.properties.orient.toLowerCase(),
				label: {
					position: this.model.properties.labelPosition.toLowerCase(),
					color: this.model.properties.labelColor,
					fontFamily: 'Arial',
					fontSize: this.model.properties.labelFontSize
				},
				levels: [
					{
					  depth: 0
					},
					{
					  depth: 1
					},
					{
					  depth: 2
					},
					{
					  depth: 3
					}
				],
				layoutIterations: this.model.properties.nodeAdjustment ? 32:0
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
		myChart.on('click', $.proxy(this.sankeyClick, this));
    },
	
	sankeyClick: function(params) {
		if(this.model.dataSource.length > 0 && this.widgetInstance.designerInstance.model.mode != 'design'){
			this.widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
			var uniqueColumnName = [];
			var data = [];
			var selectedFilterInfos = [];
			for(var k = 0; k < this.model.boundColumns.column.length; k++){
				var ucn = this.model.boundColumns.column[k].uniqueColumnName;
				var value = [...new Set(this.model.dataSource.map((item) => item[ucn]))].indexOf(params.name) > -1 ? params.name:"";
				if(value != ""){
					var filterinfo = new bbicustom.dashboard.selectedColumnInfo();
					filterinfo.condition = "Include";
					filterinfo.uniqueColumnName = ucn;
					filterinfo.values = value;
					selectedFilterInfos.push(filterinfo);	
					break;
				}
			}
			bbicustom.dashboard.filterData(this, selectedFilterInfos);
		}
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
			for(var i = 0; i < this.model.boundColumns.column.length; i++){
				var nodes = [];
				var ucn = this.model.boundColumns.column[i].uniqueColumnName;
				nodes = [...new Set(this.model.dataSource.filter((item) => item[ucn] != "(Blanks)" && item[ucn] != "(Null)" && item[ucn] != null).map((item) => item[ucn]))];
				
				for(var j = 0; j < nodes.length; j++){
					data.push({
						name : nodes[j],
						itemStyle: this.getSourceColors(j),
						depth: i
					});
				}
			}
			
		}
		else{
			data = [
				{name: 'Item 1', itemStyle: {color:this.model.properties.sourceColor0,borderColor:this.model.properties.sourceColor0}},
				{name: 'Item 2', itemStyle: {color:this.model.properties.sourceColor1,borderColor:this.model.properties.sourceColor1}},
				{name: 'Value 1', itemStyle: {color:this.model.properties.targetColor0,borderColor:this.model.properties.targetColor0}},
				{name: 'Value 2', itemStyle: {color:this.model.properties.targetColor1,borderColor:this.model.properties.targetColor1}},
				{name: 'Value 3', itemStyle: {color:this.model.properties.sourceColor2,borderColor:this.model.properties.sourceColor2}},
				{name: 'Value 4', itemStyle: {color:this.model.properties.targetColor2,borderColor:this.model.properties.targetColor2}},
				{name: 'Value 5', itemStyle: {color:this.model.properties.targetColor2,borderColor:this.model.properties.targetColor2}},
				{name: 'Value 6', itemStyle: {color:this.model.properties.targetColor2,borderColor:this.model.properties.targetColor2}}
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
			var unicSourceValues = [];
			for(var x = 0; x < this.model.boundColumns.column.length-1; x++){
				var sUCN = this.model.boundColumns.column[x].uniqueColumnName;
				unicSourceValues = [...new Set(this.model.dataSource.map((item) => item[sUCN]))];
				for(var i = 0; i < unicSourceValues.length; i++){
					var filterValues = this.model.dataSource.filter(function(e){return (e[sUCN] == unicSourceValues[i])});
					var tUCN = this.model.boundColumns.column[x+1].uniqueColumnName;
					var uTargetValues = [];
					for(var j = 0; j < filterValues.length; j++){
						if(uTargetValues.indexOf(filterValues[j][tUCN]) === -1 && filterValues[j][tUCN] != "(Blanks)" && filterValues[j][tUCN] != "(Null)" && filterValues[j][tUCN] != null){
							uTargetValues.push(filterValues[j][tUCN]);
							linkObj.push({
								source : unicSourceValues[i], 
								target: filterValues[j][tUCN],
								value: filterValues.filter((item)=> item[tUCN] == filterValues[j][tUCN]).reduce((total, obj) => obj[this.model.boundColumns.value[0].uniqueColumnName] + total,0)
							});
						}
					}
				}
			}
		}
		else{
			linkObj = [
			  {source: 'Item 1',target: 'Value 1',value: 5},
			  {source: 'Item 1',target: 'Value 2',value: 3},
			  {source: 'Item 2',target: 'Value 4',value: 8},
			  {source: 'Item 1',target: 'Value 3',value: 3},
			  {source: 'Item 1',target: 'Value 5',value: 5},
			  {source: 'Item 1',target: 'Value 6',value: 3},
			];
		}
		return linkObj;
	},
	getValue: function(srcName, tarName){
		var value = 10;
		if(this.isWidgetConfigured()){
			var srcUCN = this.model.boundColumns.source[0].uniqueColumnName;
			var tarUCN = this.model.boundColumns.target[0].uniqueColumnName;
			var ucnVal = this.model.boundColumns.value[0].uniqueColumnName
			var colData = this.model.dataSource.filter(function(e){return e[srcUCN] == srcName && e[tarUCN] == tarName});
			if(colData.length > 0){
				value = colData.map(e => e[ucnVal]).reduce(function(prev,cur){return prev+cur;},0);
			}
			
		}
		return value;
	},
	isWidgetConfigured: function () {
		return (this.model.dataSource.length > 0 && this.model.boundColumns.value.length > 0 && this.model.boundColumns.column.length > 1);
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