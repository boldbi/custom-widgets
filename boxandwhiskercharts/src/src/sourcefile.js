/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

    guid:"666b74a1-ce19-4981-bc02-f475ed39d477",

    widgetName:"CustomBoxandWhiskerChart",

	/* init method will be called when the widget is initialized */
    init: function () {
        this.widget = document.createElement("div");
        this.widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
        this.element.appendChild(this.widget);
		if(this.model.dataSource.length > 0 && this.model.boundColumns.yValue.length > 0 && this.model.boundColumns.xValue.length > 0){
			this.designId = $(this.element).closest(".e-customwidget-item").attr("id").split("_" + this.model.widgetId)[0];
			this.designerObj = $("#" + this.designId).data("BoldBIDashboardDesigner");
			this.formattingInfo = {};
			this.editedColumnNames = {};
			var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
			for(var j = 0; j<widgetInstance.dataGroupInfo.FieldContainers.length; j++){
				if(widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0 && widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length > 0){
					var length = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos.length;
					for(var i = 0; i < length; i++){
						this.editedColumnNames[widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].IsDisplayNameEdited ? widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].DisplayName : widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].Name;
						this.formattingInfo[widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].UniqueColumnName] = widgetInstance.dataGroupInfo.FieldContainers[j].FieldInfos[i].MeasureFormatting;
					}
				}
			}
		}
		
		this.chart = new ej2Controls.charts.Chart({
			height:this.element.clientHeight+'px',
			width:this.element.clientWidth+'px',
			primaryXAxis: {
				visible:this.model.properties.showCategoryAxis,
				title:this.model.properties.showCategoryAxisTitle ? this.model.properties.showCategoryAxisTitletext:"",
				valueType: 'Category',
				majorGridLines: { width: this.model.properties.showGridLineForXaxis? 1:0 },
				labelRotation:this.model.properties.labelRotation,
				labelIntersectAction: this.model.properties.labelOverflowMode,
				labelStyle:{size:this.model.properties.xlabelFontSize}
			},
			primaryYAxis:
			{ 
				visible:this.model.properties.showPrimaryAxis,
				title:this.model.properties.showPrimaryAxisTitle ? this.model.properties.showPrimaryAxisTitletext:"",
				majorGridLines: { width: this.model.properties.showGridLineForYaxis },
				labelStyle:{size:this.model.properties.ylabelFontSize}
			},
			series: this.getSeries(),
			tooltip: this.tooltipEnable(),
			legendSettings:{visible:this.model.properties.showLegend, position:this.model.properties.legendPosition},
			pointRender: $.proxy(this.pointRender, this),
			pointClick: $.proxy(this.pointClick, this),
			tooltipRender: $.proxy(this.tooltipRender, this),
			axisLabelRender:$.proxy(this.axisLabelRender, this),
			textRender:$.proxy(this.textRender, this),
		});
		this.chart.appendTo(this.widget);
    },
	textRender: function(args){
		if(this.model.dataSource.length > 0 && this.model.boundColumns.xValue.length > 0 && this.model.boundColumns.yValue.length > 0){
			var formatInfo = this.formattingInfo[this.model.boundColumns.yValue[0].uniqueColumnName];
			args.text = BoldBIDashboard.DashboardUtil.formattedText(Number(args.text), formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		}
	},
	axisLabelRender: function(args){
		if(this.model.dataSource.length > 0 && this.model.boundColumns.xValue.length > 0 && this.model.boundColumns.yValue.length > 0){
			if(args.axis.orientation == "Vertical"){
				var formatInfo = JSON.parse("{\"Culture\":\"auto\",\"DecimalPoints\":2,\"FormatType\":\"Number\",\"Prefix\":\"\",\"Suffix\":\"\",\"DecimalSeparator\":{\"AliasValue\":\".\",\"CurrentValue\":\".\"},\"GroupSeparator\":{\"AliasValue\":\",\",\"CurrentValue\":\",\"},\"Unit\":\"Auto\"}");
				args.text = BoldBIDashboard.DashboardUtil.formattedText(Number(args.text), formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
			}
		}
	},
	getSeries: function(){
		var series = [];
		if(this.model.dataSource.length > 0 && this.model.boundColumns.xValue.length > 0 && this.model.boundColumns.yValue.length > 0){
			if(this.model.boundColumns.row.length > 0){
				var rUCN = this.model.boundColumns.row[0].uniqueColumnName;
				var uniqueRowValues = [...new Set(this.model.dataSource.map((item) => item[rUCN]))];
				for(var i = 0; i < uniqueRowValues.length; i++){
					series.push(
						{
							type: 'BoxAndWhisker',
							showMean: this.model.properties.mean,
							dataSource: this.getData(0,uniqueRowValues[i]),
							xName: 'x',
							yName: 'y',
							marker: {
								visible: false,
								dataLabel:{visible:this.model.properties.showDatalabels,font:{size:this.model.properties.datalabelFontSize}}
							},
							animation:{enable:this.model.properties.enableAnimation},
							name: uniqueRowValues[i]
						}
					);
				}
			} else {
				series.push(
					{
						type: 'BoxAndWhisker',
						showMean: this.model.properties.mean,
						dataSource: this.getData(0),
						xName: 'x',
						yName: 'y',
						marker: {
							visible: false,
							dataLabel:{visible:this.model.properties.showDatalabels,font:{size:this.model.properties.datalabelFontSize}}
						},
						animation:{enable:this.model.properties.enableAnimation},
						name: this.editedColumnNames[this.model.boundColumns.yValue[0].uniqueColumnName]
					}
				);
			}
		} else {
			series.push(
				{
					type: 'BoxAndWhisker',
					showMean: this.model.properties.mean,
					dataSource: [
						{ x: 'Item1', y: [10,22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38,58] },
						{ x: 'Item2', y: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
						{ x: 'Item3', y: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
						{ x: 'Item4', y: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
						{ x: 'Item5', y: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] }
					],
					xName: 'x',
					yName: 'y',
					marker: {
						visible: false,
						dataLabel:{visible:this.model.properties.showDatalabels,font:{size:this.model.properties.datalabelFontSize}}
					},
					animation:{enable:this.model.properties.enableAnimation},
					name: "Series 1"
				}
			);
		}
		return series;
	},
	getData: function(index,seriesName){
		var data = [];
		if(seriesName != null && seriesName != undefined){
			var xUCN = this.model.boundColumns.xValue[0].uniqueColumnName;
			var rUCN = this.model.boundColumns.row[0].uniqueColumnName;
			var uniqueXValues = [...new Set(this.model.dataSource.map((item) => item[xUCN]))];
			for(var i = 0; i < uniqueXValues.length; i++){
				var fData = this.model.dataSource.filter(function(e){return (e[rUCN] == seriesName && e[xUCN] == uniqueXValues[i])});
				var tempYValue = [];
				for(var j = 0; j < fData.length; j++){
					tempYValue.push(fData[j][this.model.boundColumns.yValue[index].uniqueColumnName]);
				}
				data.push({x:uniqueXValues[i], y:tempYValue});
			}
		} else {
			var xUCN = this.model.boundColumns.xValue[0].uniqueColumnName;
			var uniqueXValues = [...new Set(this.model.dataSource.map((item) => item[xUCN]))];
			for(var i = 0; i < uniqueXValues.length; i++){
				var fData = this.model.dataSource.filter(function(e){return (e[xUCN] == uniqueXValues[i])});
				var tempYValue = [];
				for(var j = 0; j < fData.length; j++){
					tempYValue.push(fData[j][this.model.boundColumns.yValue[index].uniqueColumnName]);
				}
				data.push({x:uniqueXValues[i], y:tempYValue});
			}
		}
		return data;
	},
	
	/*To enable tooltip*/
	tooltipEnable: function(){
		if (this.model.dataSource.length > 0 && this.model.boundColumns.yValue.length > 0 && this.model.boundColumns.xValue.length > 0){
			return {
				enable: true,
				template: "<div>Text</div>"
			};
		}
		else{
			return {
				enable: true,
			};
		}
	},
	
	/*tooltipRender method is used for rendering tooltip*/
	tooltipRender: function(args){
		if ($("#" + this.element.id).length > 0 && this.model.dataSource.length>0 && this.model.boundColumns.yValue.length > 0 && this.model.boundColumns.xValue.length > 0) {
			var seriesName = this.model.boundColumns.row.length > 0 ? args.series.name:this.editedColumnNames[this.model.boundColumns.yValue[0].uniqueColumnName];
			var tooltipTemplate = '<div style="background:white;border: 1px solid #d4d4d4";><table><tr><td>X : </td><td>' + args.point.x + '</td></tr>' + '<tr><td>Y : </td><td>' + args.point.y + '</td></tr></table>';
			tooltipTemplate = '<div style="background:white;border: 1px solid #d4d4d4;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12);border-radius: 4px;padding: 5px;"><table>'
			+ '<tr><td class="column-name" colspan="2" style="text-align:center;text-transform:uppercase; font-weight:bold;">' + seriesName
			+ '<tr><td class="column-name" style="text-align:right;">' + this.editedColumnNames[this.model.boundColumns.xValue[0].uniqueColumnName] + ' :</td><td><b>' +args.series.dataSource[args.data.pointIndex]["x"]+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Maximum :</td><td><b>' +this.formatNumber(args.point.maximum)+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Q3 :</td><td><b>' +this.formatNumber(args.point.upperQuartile)+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Median :</td><td><b>' +this.formatNumber(args.point.median)+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Q1 :</td><td><b>' +this.formatNumber(args.point.lowerQuartile)+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Minimum :</td><td><b>' +this.formatNumber(args.point.minimum)+ '</b></td></tr>'			
			+ '</table></div>';
			args.template = tooltipTemplate;
		}
	},
	formatNumber: function(value){
		if(this.model.boundColumns.yValue.length > 0){
			var formatInfo = this.formattingInfo[this.model.boundColumns.yValue[0].uniqueColumnName];
			return BoldBIDashboard.DashboardUtil.formattedText(Number(value), formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
		} else {
			return value;
		}
		
	},

	/*pointClick method is called to apply colors for the series*/
	pointRender: function(args){
		if(this.model.boundColumns.row.length > 0){
			var color = this.model.properties['color'+((args.series.index%10)+1)];
			args.fill = color;
		} else {
			var color = this.model.properties['color'+((args.point.index%10)+1)];
			args.fill = color;
		}
	},
	
	/*This event triggers on point click and is used for filtering*/
	pointClick: function (args) {
		var widgetIns = $(this.element).closest('.e-customwidget-item').data('widgetInstance');
		if (this.model.boundColumns.yValue.length > 0 && this.model.boundColumns.xValue.length > 0 && widgetIns.designerInstance.model.mode != 'design') {
			var selectedColumnsFilter = [];
			var filterColumn = new bbicustom.dashboard.selectedColumnInfo();
			filterColumn.condition = "include";
			filterColumn.uniqueColumnName = this.model.boundColumns.xValue[0].uniqueColumnName;
			filterColumn.values = [args.point.x];
			selectedColumnsFilter.push(filterColumn);
			bbicustom.dashboard.filterData(this, selectedColumnsFilter);
		}
	},

	/* update method will be called when any update needs to be performed in the widget. */
    update: function (option) {
		this.chart.destroy();
		this.element.innerHTML = "";
		this.init();
    }
});