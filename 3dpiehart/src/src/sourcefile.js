/* Register the widget in dashboard.*/
ej.dashboard.registerWidget({

    guid:"4b77ebe6-c9bd-48be-a8ab-a525554c6b77",

    widgetName:"3DPieChart",

    init: function () {
		this.widget = document.createElement("div");
        this.widget.setAttribute("id", this.element.id+"_widget");
		$(this.widget).css({"width":this.element.clientWidth,"height":this.element.clientHeight});
        this.element.appendChild(this.widget);
		this.designId = $(this.element).closest(".e-reportitem").attr("id").split("_" + this.model.widgetId)[0];
		this.designerObj = $("#" + this.designId).data("ejDashboardDesigner");
		this.formattingInfo = {};
		var widgetInstance = $(this.element).closest(".e-reportitem").data("widgetInstance");
				for(var j = 0; j<widgetInstance.dataGroupInfo.FieldContainers.length; j++){
					if(widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0 && widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0){
						var length = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length;
						for(var i = 0; i < length; i++){
							this.formattingInfo[widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].MeasureFormatting;
						}
					}
				}
		this.renderWidget();
    },
	
	renderWidget: function(){
		this.chart = $("#"+this.element.id+"_widget").ejChart({
			commonSeriesOptions: 
			{
                labelPosition: 'inside',
                tooltip: { visible: this.model.properties.showTooltip, format: "#point.x# : #point.y#" },
		        marker:
				{
					dataLabel: 
					{ 
						shape: 'none', 
						visible: this.model.properties.showdataLabels, 
						font: {size: this.model.properties.datalabelFontSize+'px', color : this.model.properties.datalabelColor.slice(0,7)},	
					}
                }
            },
			title: {
				visible: this.model.properties.showTitle,	
				text: this.model.properties.titleText,
				font:{
                    size : this.model.properties.titleSize+"px",
                    color : this.model.properties.titleColor,
                },
	        },
			series: 
			[
                {
                    points: this.getData(), 	
					xName: "x", 
					yName: "y",
					type: this.model.properties.chartType, 
					doughnutCoefficient: 0.3, 
					doughnutSize:1,
					pieCoefficient: 1, 
					explodeIndex: this.model.properties.enableExplode ? this.model.properties.explodeIndex : -1,  
					explodeOffset:this.model.properties.explodeOffset    
                }
            ], 
			enable3D: true,	
			enableRotation: this.model.properties.enableRotation,			
            depth: this.model.properties.chartDepth,
            tilt: this.model.properties.chartTilt,
			rotation: this.model.properties.rotation,
            canResize: true,                   
            size: { height: "100%", width:"100%"},               
            legend: { 
				visible: this.model.properties.showLegend,
				position: this.model.properties.legendPosition,
			},
			pointRegionClick: $.proxy(this.onClick, this),
			toolTipInitialize: $.proxy(this.tooltipInitialize, this),
			displayTextRendering: $.proxy(this.displayTextRendering, this)
		});
	},
	displayTextRendering: function(e){
		if(this.isWidgetConfigured()){
		}
	},
	tooltipInitialize : function(args){
		if(this.isWidgetConfigured()){
			var widgetInstance = $(this.element).closest(".e-reportitem").data("widgetInstance");
			var isTooltioCustomizationDone = false;
			
			var valUCN = this.model.boundColumns.value[0].uniqueColumnName;
			var sum = this.model.dataSource.reduce((total, obj) => obj[valUCN] + total,0);
			var value = args.model.series[args.data.seriesIndex].points[args.data.pointIndex].y;
			var fVal = this.formatDataNumber(value);
			var percent = ((value/sum)*100).toFixed(2) +'%';
			var lText = "";
			switch(this.model.properties.dLabel){
				case "Category":
					lText = percent;
					break;
				case "Value":
					lText = fVal;
					break;
				case "Percentange":
					lText = percent;
					break;
				case "Category and Value":
					lText = fVal;
					break;
				case "Category and Percentange":
					lText = percent;
					break;
				case "Value and Percentange":
					lText = '(' + fVal + ')' + '(' + percent + ')';
					break;
			}
			for(var i = 0; i < this.model.dataSource.length; i++){
				if(args.data.currentText.indexOf(this.model.dataSource[i][this.model.boundColumns.column[0].uniqueColumnName]) > -1){
					if(this.model.boundColumns.tooltip.length > 0){
								args.data.currentText = args.data.currentText.split(":")[0] + ": " + lText;
								for(var k = 0; k < this.model.boundColumns.tooltip.length; k++){
									args.data.currentText += "</br>" + widgetInstance.dataColumnBindings[this.model.boundColumns.tooltip[k].uniqueColumnName] + " : " + this.formatTooltipNumber(k,this.model.dataSource[i][this.model.boundColumns.tooltip[k].uniqueColumnName]);
								}
							}
							else{
								args.data.currentText = args.data.currentText.split(":")[0]+ ": " + lText;
							}
							isTooltioCustomizationDone = true;
							break;
				}
				if(isTooltioCustomizationDone){break;}
			}
		}
	},
	
	formatDataNumber: function (number) {
		var number = Number(number);
		var formatInfo = this.formattingInfo[this.model.boundColumns.value[0].uniqueColumnName];
		number = ej.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		return number;
	},
	
	formatTooltipNumber: function (index,number) {
		var formatInfo = JSON.parse(JSON.stringify(this.formattingInfo[this.model.boundColumns.tooltip[index].uniqueColumnName]));
		var number = ej.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		return number;
	},
	
	onClick: function(args){
		if(this.isWidgetConfigured()){
			var selectedFilterInfos = [];
			var filterinfo = new ej.dashboard.selectedColumnInfo();
				filterinfo.condition = "include";
				filterinfo.uniqueColumnName = this.model.boundColumns.column[0].uniqueColumnName;
				filterinfo.values.push(args.model.series[0].points[args.data.pointData.pointIndex].x);
			selectedFilterInfos.push(filterinfo);
			ej.dashboard.filterData(this,selectedFilterInfos);
		}
	},
	
	getData: function(){
		var data = [];
		if(this.isWidgetConfigured()){
			for(var i = 0; i < this.model.dataSource.length; i++){
				var valUCN = this.model.boundColumns.value[0].uniqueColumnName;
				var sum = this.model.dataSource.reduce((total, obj) => obj[valUCN] + total,0)
				var column = this.model.dataSource[i][this.model.boundColumns.column[0].uniqueColumnName];
				var value = this.model.dataSource[i][valUCN];
				var index = i >= 10 ? i % 10 : i;
				
				var fVal = this.formatDataNumber(value);
				var percent = ((value/sum)*100).toFixed(2) +'%';
				var lText =  "";
				switch(this.model.properties.dLabel){
					case "Category":
						lText = column;
						break;
					case "Value":
						lText = fVal;
						break;
					case "Percentange":
						lText = percent;
						break;
					case "Category and Value":
						lText = column + ' (' + fVal + ')';
						break;
					case "Category and Percentange":
						lText = column + ' (' + percent + ')';
						break;
					case "Value and Percentange":
						lText = '(' + fVal + ')' + '(' + percent + ')';
						break;
				}
				
				data.push({
					x: column,
					y: value,
					text: lText,
					fill: this.model.properties["chartcolor"+index].slice(0,7),
				});
			}
		}
		else{
			data = [
				{ x: "Watching TV", text: "Watching TV", y: 56, fill: this.model.properties.chartcolor0},
				{ x: "Socializing", text: "Socializing", y: 26, fill: this.model.properties.chartcolor1}, 
				{ x: "Reading", text: "Reading", y: 3, fill: this.model.properties.chartcolor2}, 
				{ x: "Sports", text: "Sports", y: 7, fill: this.model.properties.chartcolor3}, 
				{ x: "Others", text: "Others", y: 8, fill: this.model.properties.chartcolor4}
			];
		}
		return data;
	},
	
	isWidgetConfigured: function () {
		return (this.model.boundColumns.value.length > 0 && this.model.boundColumns.column.length > 0 && this.model.dataSource.length > 0);
	},

    update: function (option) {
        this.element.innerHTML = "";
		this.init();
    }
});