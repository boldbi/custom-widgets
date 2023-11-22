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
		var data = [
                    { x: 'Item1', y: [10,22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38,58] },
                    { x: 'Item2', y: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
                    { x: 'Item3', y: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
                    { x: 'Item4', y: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
                    { x: 'Item5', y: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] }
                ];
		var seriesName = '';
		if(this.model.dataSource.length > 0 && this.model.boundColumns.xValue.length > 0 && this.model.boundColumns.yValue.length > 0){
			data = [];
			seriesName = this.editedColumnNames[this.model.boundColumns.yValue[0].uniqueColumnName];
			var uniqueXValues = [];
			for(var i = 0; i < this.model.dataSource.length; i++){
				if(uniqueXValues.indexOf(this.model.dataSource[i][this.model.boundColumns.xValue[0].uniqueColumnName]) == -1 && this.model.dataSource[i][this.model.boundColumns.xValue[0].uniqueColumnName] != "(Null)" && this.model.dataSource[i][this.model.boundColumns.xValue[0].uniqueColumnName] != "(Blanks)"){
					uniqueXValues.push(this.model.dataSource[i][this.model.boundColumns.xValue[0].uniqueColumnName]); 
					var tempYValue = [];
					for(var j = 0; j < this.model.dataSource.length; j++){
						if(uniqueXValues[uniqueXValues.length-1] == this.model.dataSource[j][this.model.boundColumns.xValue[0].uniqueColumnName]){
							tempYValue.push(this.model.dataSource[j][this.model.boundColumns.yValue[0].uniqueColumnName]);
						}
					}
					data.push({x:uniqueXValues[uniqueXValues.length-1], y:tempYValue});
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
			series: [
				{
					type: 'BoxAndWhisker',
					showMean: this.model.properties.mean,
					dataSource: data,
					xName: 'x',
					yName: 'y',
					marker: {
						visible: false,
						dataLabel:{visible:this.model.properties.showDatalabels,font:{size:this.model.properties.datalabelFontSize}}
					},
					animation:{enable:this.model.properties.enableAnimation},
					name: seriesName
				}
			],
			tooltip: this.tooltipEnable(),
			legendSettings:{visible:this.model.properties.showLegend, position:this.model.properties.legendPosition},
			pointRender: $.proxy(this.pointRender, this),
			pointClick: $.proxy(this.pointClick, this),
			tooltipRender: $.proxy(this.tooltipRender, this),
		});
		this.chart.appendTo(this.widget);
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
			var tooltipTemplate = '<div style="background:white;border: 1px solid #d4d4d4";><table><tr><td>X : </td><td>' + args.point.x + '</td></tr>' + '<tr><td>Y : </td><td>' + args.point.y + '</td></tr></table>';
			tooltipTemplate = '<div style="background:white;border: 1px solid #d4d4d4;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12);border-radius: 4px;padding: 5px;"><table>'
			+ '<tr><td class="column-name" colspan="2" style="text-align:center;text-transform:uppercase; font-weight:bold;">' + this.editedColumnNames[this.model.boundColumns.yValue[0].uniqueColumnName]
			+ '<tr><td class="column-name" style="text-align:right;">' + this.editedColumnNames[this.model.boundColumns.xValue[0].uniqueColumnName] + ' :</td><td><b>' +args.series.dataSource[args.data.pointIndex]["x"]+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Maximum :</td><td><b>' +args.point.maximum+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Q3 :</td><td><b>' +args.point.upperQuartile+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Median :</td><td><b>' +args.point.median+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Q1 :</td><td><b>' +args.point.lowerQuartile+ '</b></td></tr>'
			+ '<tr><td class="column-name" style="text-align:right;">Minimum :</td><td><b>' +args.point.minimum+ '</b></td></tr>'			
			+ '</table></div>';
			args.template = tooltipTemplate;
		}
	},

	/*pointClick method is called to apply colors for the series*/
	pointRender: function(args){
		var color = this.model.properties['color'+((args.point.index%10)+1)];
		args.fill = color;
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
		/* update type will be 'resize' if the widget is being resized. */
        if (option.type == "resize") {
			this.chart.destroy();
			this.element.innerHTML = "";
			this.init();
			return;
        }
		/* update type will be 'refresh' when the data is refreshed. */
        else if (option.type == "refresh") {
			this.chart.destroy();
			this.element.innerHTML = "";
			this.init();
			return;
        }
		/* update type will be 'propertyChange' when any property value is changed in the designer. */
        else if (option.type == "propertyChange") {
            switch (option.property.name) {
                case "showGridLineForXaxis":
                case "showGridLineForYaxis":
				case "mean":
                case "enableAnimation":
                case "showLegend":
                case "legendPosition":
				case "showDatalabels":
				case "datalabelFontSize":
				case "showCategoryAxis":
				case "showCategoryAxisTitle":
				case "showCategoryAxisTitletext":
				case "labelOverflowMode":
				case "labelRotation":
				case "xlabelFontSize":
				case "showPrimaryAxis":
				case "showPrimaryAxisTitle":
				case "showPrimaryAxisTitletext":
				case "ylabelFontSize":
				case "color1":
				case "color3":
				case "color4":
				case "color5":
				case "color6":
				case "color7":
				case "color8":
				case "color9":
				case "color2":
				case "color10":
					this.chart.destroy();
					this.element.innerHTML = "";
					this.init();
					return;
            }
        }
    }
});