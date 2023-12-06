/* Register the widget in dashboard.*/
ej.dashboard.registerWidget({

    guid:"ebc96be7-9237-49db-8661-83748b9cd955",

    widgetName:"3DChart",

    init: function () {
		this.widget = document.createElement("div");
        this.widget.setAttribute("id", this.element.id+"_widget");
		$(this.widget).css({"width":this.element.clientWidth,"height":this.element.clientHeight});
        this.element.appendChild(this.widget);
		this.designId = $(this.element).closest(".e-reportitem").attr("id").split("_" + this.model.widgetId)[0];
		this.designerObj = $("#" + this.designId).data("ejDashboardDesigner");
		this.formattingInfo = {};
		this.editedColumnNames = {};
		var widgetInstance = $(this.element).closest(".e-reportitem").data("widgetInstance");
		for(var j = 0; j<widgetInstance.dataGroupInfo.FieldContainers.length; j++){
			if(widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0 && widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0){
				var length = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length;
				for(var i = 0; i < length; i++){
					this.formattingInfo[widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].MeasureFormatting;
					this.editedColumnNames[widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].IsDisplayNameEdited ? widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].DisplayName : widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].Name;
				}
			}
		}	
		this.renderWidget();
    },
	
	renderWidget: function(){
		this.chart = $("#"+this.element.id+"_widget").ejChart({
			 primaryXAxis:
            {    
				visible: this.model.properties.showxAxis,
				valueType: 'category',
				labelIntersectAction: this.model.properties.xlabelintersect.toLowerCase(), 
				font : {size : this.model.properties.xfontsize, color : this.model.properties.xfontcolor.slice(0,7)},       
                title: { 
					visible: this.model.properties.xshowTitle, 
					text: this.model.properties.xtitleText,
					font:{
						size : this.model.properties.xtitleSize+"px",
						color : this.model.properties.xtitleColor.slice(0,7),
					},
				},
                majorGridLines: { 
					visible: this.model.properties.xshowgridLine, 
					color: this.model.properties.xlineColor.slice(0,7), 
					width : this.model.properties.xlineWidth
				},
				majorTickLines: {
                    visible: this.model.properties.xshowticks, 
					color: this.model.properties.xticksColor.slice(0,7),
					width : this.model.properties.xticksWidth,
                    size : this.model.properties.xtickSize,
                },
            },	
            primaryYAxis:
            {   
				visible: this.model.properties.showyAxis,
				labelIntersectAction: this.model.properties.ylabelintersect.toLowerCase(), 
				font : {size : this.model.properties.yfontsize, color : this.model.properties.yfontcolor.slice(0,7)},        
				title: { 
					visible: this.model.properties.yshowTitle, 
					text: this.model.properties.ytitleText,
					font:{
						size : this.model.properties.ytitleSize+"px",
						color : this.model.properties.ytitleColor.slice(0,7),
					},
				},
                majorGridLines: { 
					visible: this.model.properties.yshowgridLine, 
					color: this.model.properties.ylineColor.slice(0,7),
					width : this.model.properties.ylineWidth
				},
				majorTickLines: {
                    visible: this.model.properties.yshowticks, 
					color: this.model.properties.yticksColor.slice(0,7),
					width : this.model.properties.yticksWidth,
                    size : this.model.properties.ytickSize,
                },
            },
			commonSeriesOptions:
			{
				tooltip: { visible: this.model.properties.showTooltip, format: "#series.name#<br/>#point.x# : #point.y#mg" },     
				marker:
				{
					dataLabel: 
					{  
						visible: this.model.properties.showdataLabels, 
						//offset: {x:10, y: 10},
						font: {size: this.model.properties.datalabelFontSize+'px', color : this.model.properties.datalabelColor.slice(0,7)},
						textPosition : this.model.properties.datalabelPosition.toLowerCase(),
						horizontalTextAlignment : "center",
						verticalTextAlignment : "center",
						angle: this.model.properties.datalabelAngle.slice(0,(this.model.properties.datalabelAngle.length-1))
					}
                },
            },
			series: this.getSeries(),
			enable3D: true,	
			enableRotation: this.model.properties.enableRotation,			
            depth: this.model.properties.chartDepth,
            wallSize: this.model.properties.wallsize,
            tilt: this.model.properties.chartTilt,
			rotation: this.model.properties.rotation,
            perspectiveAngle: 90,
            sideBySideSeriesPlacement: this.model.properties.sidebyside,           
            canResize: true,            
			size: { height: "100%", width:"100%"},
			title: {
				visible: this.model.properties.showTitle,	
				text: this.model.properties.titleText,
				font:{
                    size : this.model.properties.titleSize+"px",
                    color : this.model.properties.titleColor.slice(0,7),
                },
	        },
            legend: {
				visible: this.model.properties.showLegend,
				position: this.model.properties.legendPosition.toLowerCase(),
				shape: this.model.properties.legendshape.toLowerCase(),
			},
			pointRegionClick: $.proxy(this.onClick, this),
			toolTipInitialize: $.proxy(this.tooltipInitialize, this),
			legendItemRendering: $.proxy(this.legendItemRendering, this),
			displayTextRendering: $.proxy(this.displayTextRendering, this)
		});
	},
	legendItemRendering: function(e){
		e.data.legendItem.Text = e.data.legendItem.Text.split('~')[0];
	},
	displayTextRendering: function(e){
		var index = e.data.series.name.split('~')[1];
		if(this.isWidgetConfigured() && index != undefined){
			var formatInfo = this.formattingInfo[this.model.boundColumns.value[Number(index)].uniqueColumnName];
			e.data.Text = ej.DashboardUtil.formattedText(Number(e.data.Text), formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
			
		}
	},
	getSeries: function(){
		var series =[];
		if(this.isWidgetConfigured()){
			for (var i = 0; i < this.model.boundColumns.value.length; i++) {
				series.push({
					points: this.getData(i),
					name: this.editedColumnNames[this.model.boundColumns.value[i].uniqueColumnName]+'~'+i, 
					xName: "x", 
					yName: "y",
					type: this.model.properties.chartType.toLowerCase(),
					fill: this.model.properties["chartcolor" + i].slice(0,7),
				});
			}
		}
		else{
			series = [                                                                                   
                {
                    points: [{ x: "Calcium", y: 11 }, { x: "Phosphorus", y: 20 }, { x: "Sodium", y: 8}, 
					{ x: "Magnesium", y: 19 }, { x: "Manganese", y: 8.5}, { x: "Iron", y: 6.3 }], 							 
					name: 'Minerals Content in Apple',
					type: this.model.properties.chartType.toLowerCase(),
                },               
				{
                     points: [{ x: "Calcium", y: 6 }, { x: "Phosphorus", y: 26 }, { x: "Sodium", y: 7 }, 
                              { x: "Magnesium", y: 32 }, { x: "Manganese", y: 9.6 }, { x: "Iron", y: 8.1 }], 					
					name: 'Minerals Content in Banana',
					type: this.model.properties.chartType.toLowerCase(),
                },
				{
                     points: [{ x: "Calcium", y: 7 }, { x: "Phosphorus", y: 36 }, { x: "Sodium", y: 5 }, 
                              { x: "Magnesium", y: 30 }, { x: "Manganese", y: 7.2 }, { x: "Iron", y: 9.1 }], 					
					name: 'Minerals Content in Orange',
					type: this.model.properties.chartType.toLowerCase(),
                }
            ];
		}
		return series;
	},
	
	getData: function(valIndex){
		var data = [];
		if(this.isWidgetConfigured()){
			for(var i=0; i<this.model.dataSource.length; i++){
				data.push({
					x: this.model.dataSource[i][this.model.boundColumns.column[0].uniqueColumnName],
					y: this.model.dataSource[i][this.model.boundColumns.value[valIndex].uniqueColumnName],
				});
			}
		}
		return data;
	},
	
	tooltipInitialize : function(args){
		var widgetInstance = $(this.element).closest(".e-reportitem").data("widgetInstance");
		var isTooltioCustomizationDone = false;
		for(var i = 0; i < this.model.dataSource.length; i++){
			if(args.data.currentText.indexOf(this.model.dataSource[i][this.model.boundColumns.column[0].uniqueColumnName]) > -1){
				if(this.model.boundColumns.tooltip.length > 0){
							args.data.currentText = this.editedColumnNames[this.model.boundColumns.value[args.data.seriesIndex].uniqueColumnName] + "<br/>" + this.model.dataSource[args.data.pointIndex][this.model.boundColumns.column[0].uniqueColumnName] + " : " + this.formatDataNumber(this.model.dataSource[args.data.pointIndex][this.model.boundColumns.value[args.data.seriesIndex].uniqueColumnName], args.data.seriesIndex);
							for(var k = 0; k < this.model.boundColumns.tooltip.length; k++){
								args.data.currentText += "</br>" + widgetInstance.dataColumnBindings[this.model.boundColumns.tooltip[k].uniqueColumnName] + " : " + this.formatTooltipNumber(this.model.dataSource[i][this.model.boundColumns.tooltip[k].uniqueColumnName],k);
							}
						}
						else{
							args.data.currentText = this.editedColumnNames[this.model.boundColumns.value[args.data.seriesIndex].uniqueColumnName] + "<br/>" + this.model.dataSource[args.data.pointIndex][this.model.boundColumns.column[0].uniqueColumnName] + " : " + this.formatDataNumber(this.model.dataSource[args.data.pointIndex][this.model.boundColumns.value[args.data.seriesIndex].uniqueColumnName], args.data.seriesIndex);
						}
						isTooltioCustomizationDone = true;
						break;
			}
			if(isTooltioCustomizationDone){break;}
		}
	},
	
	formatDataNumber: function (number, valIndex) {
		var number = Number(number);
		var formatInfo = this.formattingInfo[this.model.boundColumns.value[valIndex].uniqueColumnName];
		number = ej.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		return number;
	},
	
	formatTooltipNumber: function (number,index) {
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
	
	isWidgetConfigured: function () {
		return (this.model.boundColumns.value.length > 0 && this.model.boundColumns.column.length > 0 && this.model.dataSource.length > 0);
	},

    update: function (option) {
        this.element.innerHTML = "";
		this.init();
    }
});