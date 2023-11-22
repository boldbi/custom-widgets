bbicustom.dashboard.registerWidget({
		
		guid : "b0d5348d-f625-4b78-8db9-c5ed9d38eb45",
		
		pluginName : "SunburstChart",
		
		/* init method will be called when the widget is initialized */
		init : function () {
			this.widget = document.createElement("div");
			this.widget.setAttribute("id", this.element.getAttribute("id") + "_widget");
			this.element.appendChild(this.widget);
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
			this.renderSunburstChartWithDefaultData();
		},
		
		/* update method will be called when any update needs to be performed in the widget. */
		update : function (option) {
			if(option.type == "resize") {
				this.resizeWidget(option.size);
			}
			else if (option.type == "refresh") {
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
				var widgetObj = $(this.widget).data("ejSunburstChart");	
				if(this.model.boundColumns.Value.length > 0){
					for (var i=0; i<this.model.dataSource.length; i++) {
						this.model.dataSource[i][this.model.boundColumns.Value[0].uniqueColumnName] =  parseInt( this.model.dataSource[i][this.model.boundColumns.Value[0].uniqueColumnName]);     	
					}
					var valueMember = this.model.boundColumns.Value[0].uniqueColumnName;
					if (this.model.boundColumns.Levels.length > 0) {
						var levels = [];				
						for (var level = 0; level < this.model.boundColumns.Levels.length; level++) {
							levels.push({ groupMemberPath : this.model.boundColumns.Levels[level].uniqueColumnName });
						}
						widgetObj.model.levels= levels;
					}
					widgetObj.model.dataSource = this.model.dataSource;
					widgetObj.model.valueMemberPath = valueMember;
					widgetObj.redraw();
				} else {
					this.renderSunburstChartWithDefaultData();
				}
			} else if(option.type === "propertyChange"){
				var widgetObj = $(this.widget).data("ejSunburstChart");
				switch (option.property.name) {
					case "showLegend":
						widgetObj.model.legend.visible = this.model.properties.showLegend;
					case "legendPosition":
						widgetObj.model.legend.position = this.model.properties.legendPosition.toLowerCase();
					case "p1Color":
						widgetObj.model.palette[0] = this.model.properties.p1Color.slice(0,7);
					case "p2Color":
						widgetObj.model.palette[1] = this.model.properties.p2Color.slice(0,7);
					case "p3Color":
						widgetObj.model.palette[2] = this.model.properties.p3Color.slice(0,7);
					case "p4Color":
						widgetObj.model.palette[3] = this.model.properties.p4Color.slice(0,7);
					case "p5Color":
						widgetObj.model.palette[4] = this.model.properties.p5Color.slice(0,7);
					case "p6Color":
						widgetObj.model.palette[5] = this.model.properties.p6Color.slice(0,7);
					case "p7Color":
						widgetObj.model.palette[6] = this.model.properties.p7Color.slice(0,7);
					case "p8Color":
						widgetObj.model.palette[7] = this.model.properties.p8Color.slice(0,7);
					case "p9Color":
						widgetObj.model.palette[8] = this.model.properties.p9Color.slice(0,7);
					case "p10Color":
						widgetObj.model.palette[9] = this.model.properties.p10Color.slice(0,7);
					case "showDataLabel":
						widgetObj.model.dataLabelSettings.visible = this.model.properties.showDataLabel;
					case "labelOverflowMode":
						widgetObj.model.dataLabelSettings.labelOverflowMode = this.model.properties.labelOverflowMode.toLowerCase();
					case "animation":
						widgetObj.model.enableAnimation = this.model.properties.animation;
				}
				widgetObj.redraw();
			}			
		},
		
		/*This method is called for rendering the chart*/
		renderSunburstChartWithDefaultData : function () {			
			$(this.widget).css({"width":$(this.element).width(), "height":$(this.element).height()});
			var dataSource = [{ Item: "Item1", Value: 50 },{ Item: "Item2", Value: 60 },{ Item: "Item3", Value: 70 },{ Item: "Item4", Value: 80 },{ Item: "Item5", Value: 90 },{ Item: "Item6", Value: 90 },{ Item: "Item7", Value: 90 },{ Item: "Item8", Value: 90 },{ Item: "Item9", Value: 90 },{ Item: "Item10", Value: 90 },{ Item: "Item11", Value: 90 }];
			var levels = [];
			var valueMember = "Value";
			levels = [ { groupMemberPath: "Item" }];
			$(this.widget).ejSunburstChart({ 
							dataSource: dataSource, 
							valueMemberPath: valueMember, levels: levels,
							palette: [this.model.properties.p1Color.slice(0,7), this.model.properties.p2Color.slice(0,7), this.model.properties.p3Color.slice(0,7), this.model.properties.p4Color.slice(0,7),this.model.properties.p5Color.slice(0,7), this.model.properties.p6Color.slice(0,7), this.model.properties.p7Color.slice(0,7), this.model.properties.p8Color.slice(0,7), this.model.properties.p9Color.slice(0,7), this.model.properties.p10Color.slice(0,7)],
							tooltip: { visible: true},
							margin: (this.marginVisibility())? { left: 10, top: 10, bottom: 10, right: 10} :{ left: 0, top: 0, bottom: 0, right: 0} ,
							border: { width: (this.marginVisibility())? 2:0 },
							load: $.proxy(this.sunburstChartLoad),
							enableAnimation: false,
							animationType: 'Rotation',
							innerRadius: 0.2,							
							dataLabelSettings:{visible:(this.model.properties.showDataLabel?this.dataLabelVisibility():false), labelOverflowMode:this.model.properties.labelOverflowMode.toLowerCase()},
							size: { height: $(this.element).height(), width: $(this.element).width()},	 
							legend: { visible:  (this.model.properties.showLegend ? this.legendVisibility():false) , position: this.model.properties.legendPosition.toLowerCase() },
							highlightSettings: {enable: true},
							selectionSettings: {enable: true, mode : "parent"},
							pointRegionClick: $.proxy(this.pointRegionClick, this),
							tooltipInitialize: $.proxy(this.tooltipInitialize, this)
							});	
		},
		
		/*To render the tooltip*/
		tooltipInitialize : function(args){
			var widgetInstance = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
			var isTooltioCustomizationDone = false;
			for(var i = 0; i < this.model.dataSource.length; i++){
				for(var j = 0; j < args.model.levels.length; j++){
					if(args.data.currentText.indexOf(this.model.dataSource[i][args.model.levels[j].groupMemberPath]) > -1){
						if(this.model.boundColumns.tooltip.length > 0){
							args.data.currentText = args.data.currentText.split(":")[0] + ": " + this.formatDataNumber(args.data.currentText.split(":")[1]);
							for(var k = 0; k < this.model.boundColumns.tooltip.length; k++){
								args.data.currentText += "</br>" + widgetInstance.dataColumnBindings[this.model.boundColumns.tooltip[k].uniqueColumnName] + " : " + this.formatTooltipNumber(k,this.model.dataSource[i][this.model.boundColumns.tooltip[k].uniqueColumnName]);
							}
						}
						else{
							args.data.currentText = args.data.currentText.split(":")[0]+ ": " + this.formatDataNumber(args.data.currentText.split(":")[1]);
						}
						isTooltioCustomizationDone = true;
						break;
					}
				}if(isTooltioCustomizationDone){break;}
			}
		},
		
		/*formatTooltipNumber method is for formatting the measure values*/
		formatTooltipNumber: function (index,number) {
				var formatInfo = JSON.parse(JSON.stringify(this.formattingInfo[this.model.boundColumns.tooltip[index].uniqueColumnName]));
				var number = BoldBIDashboard.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
			return number;
		},
		
		/*formatDataNumber method is for formatting the measure values*/
		formatDataNumber: function (number) {
				var number = Number(number);
				var formatInfo = this.formattingInfo[this.model.boundColumns.Value[0].uniqueColumnName];
				number = BoldBIDashboard.DashboardUtil.formattedText(number, formatInfo.Culture, formatInfo.DecimalPoints, formatInfo.FormatType, formatInfo.DecimalSeparator, formatInfo.GroupSeparator, formatInfo.Prefix, formatInfo.Suffix, formatInfo.Unit, true, this.designerObj);
			return number;
		},
		
		pointRegionClick : function(e){
			debugger;
			if(this.model.initMode == "runtime"){
			var data = [];
			var levels = [];
			for(var k = 0; k < e.data.pointData[0].layerNumber; k++){
				levels.push(e.model.levels[k]);
			}
			var layerNumber = e.data.pointData[0].layerNumber - 1;
			for(var i = 0; i < this.model.dataSource.length; i++){
				
				if((e.data.pointData[0].x == this.model.dataSource[i][levels[levels.length-1].groupMemberPath]) && (e.model.points[e.data.pointData[0].legendIndex].x == this.model.dataSource[i][e.model.levels[0].groupMemberPath])){
					for(var j = 0; j < levels.length; j++){
						var temp = {};
						temp[levels[j].groupMemberPath] = this.model.dataSource[i][levels[j].groupMemberPath];
						data.push(temp);
					}
					for(var x = 0; x < this.model.boundColumns.filter.length; x++){
						var temp = {};
						temp[this.model.boundColumns.filter[x].uniqueColumnName] = this.model.dataSource[i][this.model.boundColumns.filter[x].uniqueColumnName];
						data.push(temp);
					}
					break;
				}
			}
			var zero = 0;
			var selectedFilterInfos = [];
			if (data.length > zero) {
				for (i = 0; i < data.length; i++) {
							var filterinfo = new bbicustom.dashboard.selectedColumnInfo();
							filterinfo.condition = "include";
							filterinfo.uniqueColumnName = Object.keys(data[i])[0];
							filterinfo.values.push(data[i][Object.keys(data[i])[0]]);
							selectedFilterInfos.push(filterinfo);
				}
			}
			if (this.model.enableLinking) {
				if (this.model.linkSettings.enableTabularUrlLinking) {
					for (var i = 0; i < this.model.linkSettings.urlPatterns.length; i++) {
						if (this.model.linkSettings.urlPatterns[i].uniqueColumnName === selectedFilterInfos[0].uniqueColumnName ) {
							urlCaption = this.model.linkSettings.urlPatterns[i].urlLink;
						}
					}
				}
				bbicustom.dashboard.navigateThroughLinking(this,selectedFilterInfos,urlCaption);
			}
			else {
				bbicustom.dashboard.filterData(this,selectedFilterInfos);
			}
			}
		},
		sunburstChartLoad : function (e) {
			this.elementSpacing = (this.element.width() > 200 && this.element.height() > 200) ? 10 : 0;
		},		
		
		resizeWidget : function (size) {
			$(this.widget).css({"width": size.width, "height": size.height});
			var sunburstObj = $(this.widget).data("ejSunburstChart");
			sunburstObj.model.size.height = size.height-5;
			sunburstObj.model.size.width = size.width; 
			sunburstObj.model.margin =(this.marginVisibility())? { left: 10, top: 10, bottom: 10, right: 10} :{ left: 0, top: 0, bottom: 0, right: 0} ,
			sunburstObj.model.legend.visible = this.model.properties.showLegend ? this.legendVisibility():false;
			sunburstObj.model.legend.position = this.model.properties.legendPosition.toLowerCase();
			sunburstObj.model.dataLabelSettings.visible = this.dataLabelVisibility();	
			sunburstObj.redraw();
		},
		
		marginVisibility : function () {
			return ($(this.widget).width() > 200 && $(this.widget).height() > 200);
		},
		
		legendVisibility : function (e) {
			return ($(this.element).width() > 300 && $(this.element).height() > 300);
		},
		
		dataLabelVisibility : function (e) {
			return !($(this.element).width() < 300 || $(this.element).height() < 300);
		},
		
		getAnimationType : function(animationType) {
			if (animationType === "FadeIn")
				return "fadein";
			else if(animationType === "Rotation")
				return "rotation";
		},
		
		getRotationMode : function(rotationMode) {
			if (rotationMode === "Normal")
				return "normal";
			else if(rotationMode === "Angle")
				return "angle";
		}
});