/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

	guid: "f38e534c-8b22-4f97-a418-065409e577c4",

	widgetName: "Histogram",

	init: function () {
		/* init method will be called when the widget is initialized */
		this.widget = document.createElement("div");
		this.widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
		this.element.appendChild(this.widget);
		this.xDataType = 'Number';
		if (this.isWidgetConfigured()){
			var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
			switch (widgetInstance.dataGroupInfo.FieldContainers[0].FieldInfos[0].FieldActualType) {
				case "bbi-designer-dataset-number":
					this.xDataType = "Number";
					break;
				case "bbi-designer-dataset-string":
					this.xDataType = "String";
					break;
				case "bbi-designer-dataset-datetime":
					this.xDataType = "DateTime";
					break;
				}
		}
		if(this.xDataType == "Number"){
			this.data = [];
			var points = [5.250, 7.750, 0, 8.275, 9.750, 7.750, 8.275, 6.250, 5.750,
				5.250, 23.000, 26.500, 27.750, 25.025, 26.500, 26.500, 28.025, 29.250, 26.750, 27.250,
				26.250, 25.250, 34.500, 25.625, 25.500, 26.625, 36.275, 36.250, 26.875, 40.000, 43.000,
				46.500, 47.750, 45.025, 56.500, 56.500, 58.025, 59.250, 56.750, 57.250,
				46.250, 55.250, 44.500, 45.525, 55.500, 46.625, 46.275, 56.250, 46.875, 43.000,
				46.250, 55.250, 44.500, 45.425, 55.500, 56.625, 46.275, 56.250, 46.875, 43.000,
				46.250, 55.250, 44.500, 45.425, 55.500, 46.625, 56.275, 46.250, 56.875, 41.000, 63.000,
				66.500, 67.750, 65.025, 66.500, 76.500, 78.025, 79.250, 76.750, 77.250,
				66.250, 75.250, 74.500, 65.625, 75.500, 76.625, 76.275, 66.250, 66.875, 80.000, 85.250,
				87.750, 89.000, 88.275, 89.750, 97.750, 98.275, 96.250, 95.750, 95.250
			];
			if (this.model.boundColumns.value.length > 0 && this.model.dataSource.length > 0) {
				for (var i = 0; i < this.model.dataSource.length; i++) {
					if (!this.isNullOrUndefined(this.model.dataSource[i][this.model.boundColumns.value[0].uniqueColumnName]) && this.model.dataSource[i][this.model.boundColumns.value[0].uniqueColumnName] != "(Blanks)" && this.model.dataSource[i][this.model.boundColumns.value[0].uniqueColumnName] != "(Null)") {
						this.data.push({ 'y': Number((this.model.dataSource[i][this.model.boundColumns.value[0].uniqueColumnName]).toFixed(3)) });
					}
				}
				this.data.push({ 'y': 0 });
			} else {
				for (var i = 0; i < points.length; i++) {
					this.data.push({ 'y': points[i] });
				}
			}
			var that = this;
			this.chart = new ej2histogram.charts.Chart({
				width: this.element.clientWidth.toString(),
				height: this.element.clientHeight.toString(),
				primaryXAxis: {
					majorGridLines: { width: this.model.properties.showGridLineForXaxis ? 1 : 0 },
					titleStyle: { size: this.model.properties.showxaxistitle ? 12 : 0 },
					title: (this.model.properties.xAxisTitle === "" || this.model.properties.xAxisTitle === " ") ? "X-Axis" : this.model.properties.xAxisTitle
				},
				primaryYAxis: {
					majorGridLines: { width: this.model.properties.showGridLineForYaxis ? 1 : 0 },
					title: (this.model.properties.yAxisTitle === "" || this.model.properties.yAxisTitle === " ") ? "Y-Axis" : this.model.properties.yAxisTitle,
					majorTickLines: { width: 0 },
					lineStyle: { width: 0 },
					titleStyle: { size: this.model.properties.showyaxistitle ? 12 : 0 }
				},
				chartArea: { border: { width: 0 } },
				legendSettings: { visible: false },
				series: [
					{
						type: 'Histogram', width: 2, yName: 'y',
						dataSource: this.data,
						animation: { enable: this.model.properties.animation, delay: 1 },
						binInterval: (this.model.properties.binInterval == 0) ? null : this.model.properties.binInterval,
						marker: { dataLabel: { labelIntersectAction: 'hide', visible: true, position: 'Top', font: { fontWeight: '600', color: this.model.properties.datalabelcolor } } },
						showNormalDistribution: this.model.properties.normalDistribution,
						columnWidth: 0.99,
						fill: this.model.properties.columnColor
					}
				],
				pointClick: $.proxy(this.pointClick, this),
				title: this.model.properties.title,
				tooltip: { enable: true },
				loaded: function (args) {
					var id = document.getElementById(that.element.getAttribute("id") + "_widget_Series_0_NDLine");
					if (id != null && id != undefined) {
						id.style.stroke = that.model.properties.splineColor;
						id.style.strokeDasharray = '1,0';
					}
				}
			});
			this.chart.appendTo('#' + this.element.getAttribute("id") + "_widget");
			$('#' + this.element.getAttribute("id") + "_widget").closest('.bbi-customwidget-element').css({'background':"transparent"});
			$("#" +this.element.id+ "_widget_ChartBorder").attr("fill","transparent");
		}
		else{
			$(this.element).css({"display":"table"});
			this.parentDiv = document.createElement("div");
			this.parentDiv.setAttribute("id", this.element.getAttribute("id") + "_parentDiv");
			$(this.parentDiv).css({"vertical-align": "middle","max-width": $(this.element).width(),"display":"table-cell"});
			this.element.appendChild(this.parentDiv);

			var image='<img src='+ErrorImage+' style="height:25px;width:25px;">';
			this.errorIcon = document.createElement("div");
			this.errorIcon.setAttribute("id", this.element.getAttribute("id") + "_errorIcon");
			$(this.errorIcon).css({'align-items':'center','display':'flex','justify-content':'center','padding-bottom':'5px'});
			this.errorIcon.innerHTML = image;
			this.parentDiv.appendChild(this.errorIcon);
			
			this.errorMessage = document.createElement("div");
			this.errorMessage.setAttribute("id", this.element.getAttribute("id") + "_errorMessage");
			$(this.errorMessage).css({'align-items':'center','display':'flex','justify-content':'center', 'font-size':'12px', 'font-family':'Times New Roman', 'font-weight':'bold', 'text-align':'center'});
			this.errorMessage.innerHTML = "Required measure type column data to render the widget.";
			this.parentDiv.appendChild(this.errorMessage); 
		}
	},
	
	/*This event triggers on point click and is used for filtering*/
	pointClick: function (args) {
		var widgetIns = $(this.element).closest('.e-customwidget-item').data('widgetInstance');
		if (this.model.boundColumns.value.length > 0 && widgetIns.designerInstance.model.mode != 'design') {
			var selectedColumnsFilter = [];
			var filterColumn = new bbicustom.dashboard.selectedColumnInfo();
			filterColumn.condition = "include";
			filterColumn.uniqueColumnName = this.model.boundColumns.value[0].uniqueColumnName;
			filterColumn.values = [args.point.x];
			selectedColumnsFilter.push(filterColumn);
			bbicustom.dashboard.filterData(this, selectedColumnsFilter);
		}
	},
	
	isWidgetConfigured: function () {
		return (this.model.boundColumns.value.length > 0 && this.model.dataSource.length > 0);
	},
	
	isNullOrUndefined: function (value) {
		return value === undefined || value === null;
	},
	
	/* update method will be called when any update needs to be performed in the widget. */
	update: function (option) {
		var widget = document.getElementById(this.element.getAttribute("id") + "_widget");
		/* update type will be 'resize' if the widget is being resized. */
		if (option.type == "resize") {
			$(this.widget).css({'width':option.size.width, 'height': option.size.height});
			this.chart.width = this.element.clientWidth.toString();
			this.chart.height = this.element.clientHeight.toString();
			this.chart.refresh();
		}
		/* update type will be 'refresh' when the data is refreshed. */
		else if (option.type == "refresh") {
			this.chart.destroy();
			this.element.innerHTML = "";
			this.init();
		}
		/* update type will be 'propertyChange' when any property value is changed in the designer. */
		else if (option.type == "propertyChange") {
			var chartObj = widget.ej2_instances[0];
			switch (option.property.name) {
				case "xAxisTitle":
					chartObj.primaryXAxis.title = (option.property.value === "" || option.property.value === " ") ? "X-Axis" : option.property.value;
					break;
				case "yAxisTitle":
					chartObj.primaryYAxis.title = (option.property.value === "" || option.property.value === " ") ? "Y-Axis" : option.property.value;
					break;
				case "showGridLineForXaxis":
					chartObj.primaryXAxis.majorGridLines.width = (option.property.value) ? 1 : 0;
					break;
				case "showGridLineForYaxis":
					chartObj.primaryYAxis.majorGridLines.width = (option.property.value) ? 1 : 0;
					break;
				case "binInterval":
					chartObj.series[0].binInterval = option.property.value;
					break;
				case "columnColor":
					chartObj.series[0].fill = option.property.value;
					break;
				case "splineColor":
					this.model.properties.splineColor = option.property.value;
					this.chart.destroy();
					this.element.innerHTML = "";
					this.init();
					break;
				case "normalDistribution":
					chartObj.series[0].showNormalDistribution = option.property.value;
					break;
				case "title":
					chartObj.title = option.property.value;
					break;
				case "animation":
					this.model.properties.animation = option.property.value;
					this.chart.destroy();
					this.element.innerHTML = "";
					this.init();
					return;
				case "showxaxistitle":
					this.model.properties.showxaxistitle = option.property.value;
					this.chart.destroy();
					this.element.innerHTML = "";
					this.init();
					return;
				case "showyaxistitle":
					this.model.properties.showyaxistitle = option.property.value;
					this.element.innerHTML = "";
					this.init();
					return;
				case "datalabelcolor":
					this.model.properties.datalabelcolor = option.property.value;
					this.element.innerHTML = "";
					this.init();
					return;
			}
			chartObj.refresh();
		}

	}
});