/* Register the widget in dashboard.*/
bbicustom.dashboard.registerWidget({

	guid: "a0989731-56f4-4af9-ac36-cd0b7a9edb80",

	widgetName: "TreeView",

	init: function (CN, SN, EN) {
		var checkedValues = (CN == undefined) ? [] : CN;
		this.selectedNodeForExport = (SN == undefined) ? [] : SN;
		var selectedValues = (SN == undefined) ? [] : SN;
		this.expandedTreeNodes = (EN == undefined) ? [] : EN;
		var expandedNodes = (EN == undefined) ? [] : EN;
		var widgetIns = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
		var isExporting = !this.isNullOrUndefined(widgetIns.designer.model.dashboardFromData) && widgetIns.designer.model.dashboardFromData.loadFromData;
		if (isExporting && this.model.dataSource.length > 0 && this.model.exportParameters != null) {
			var isExpanded = false;
			var isSelected = false;
			var isChecked = false;
			var s = 0;
			var g = 0;
			var p = 0;
			var exportingValues = widgetIns.designer.model.dashboardFromData.isControl ? this.model.exportParameters : this.isJSON(this.model.exportParameters);
			for (var r = 0; r < exportingValues.length; r++) {
				if (exportingValues[r] === "ExpandedNodes") {
					isExpanded = true;
					isSelected = false;
					isChecked = false;
				}
				if (exportingValues[r] === "SelectedNodes") {
					isExpanded = false;
					isSelected = true;
					isChecked = false;
				}
				if (exportingValues[r] === "CheckedNodes") {
					isExpanded = false;
					isSelected = false;
					isChecked = true;
				}
				if (isExpanded) {
					expandedNodes[g] = exportingValues[r];
					g++;
				}
				if (isChecked) {
					checkedValues[s] = exportingValues[r];
					s++;
				}
				if (isSelected) {
					selectedValues[p] = exportingValues[r];
					p++;
				}
			}
		}
		this.nodeSelected = false;
		this.widget = document.createElement("div");
		this.widget.setAttribute('id', this.element.id + 'treeview');
		$(this.element).css({ "overflow": 'auto', "background-color": "transparent" });
		this.defaultData = [
			{ "id": 1, "name": "Item1", "hasChild": true },
			{ "id": 2, "pid": 1, "name": "subItem11"},
			{ "id": 3, "pid": 1, "name": "subItem12"},
			{ "id": 7, "name": "Item2", "hasChild": true },
			{ "id": 8, "pid": 7, "name": "subItem21" },
			{ "id": 9, "pid": 7, "name": "subItem22" }
		];
		this.treeObj = new ej2Treeview.navigations.TreeView({
			fields: {
				dataSource: this.getData(),
				id: 'id',
				parentID: 'pid',
				text: 'name',
				hasChildren: 'hasChild'
			},
			showCheckBox: this.model.properties.multiSelect,
			allowMultiSelection: this.model.properties.multiSelect,
			checkedNodes: checkedValues,
			selectedNodes: selectedValues,
			expandedNodes: expandedNodes,
			nodeChecked: $.proxy(this.nodeChecked, this),
			nodeSelecting: $.proxy(this.nodeSelecting, this),
			nodeClicked: $.proxy(this.nodeClicked, this),
			nodeExpanded: $.proxy(this.nodeExpanded, this),
			created: $.proxy(this.widgetCreated, this),
			nodeCollapsed: $.proxy(this.nodeCollapsed, this),
			nodeChecking: $.proxy(this.nodeChecking, this)

		});
		this.treeObj.appendTo(this.widget);
		this.element.appendChild(this.widget);
		$(".e-treeview>.e-ul").css({ 'overflow-x': 'hidden' });
		if (isExporting && !this.isNullOrUndefined($('.e-control.e-treeview .e-list-item.e-active .e-list-text')[0])) {
			$('.e-control.e-treeview .e-list-item.e-active .e-list-text')[0].style.color = this.model.properties.selectedTextColor;
		}
		if (this.model.properties.expand) {
			this.treeObj.expandAll();
		}
	},
	isNullOrUndefined: function (value) {
		return value === null || value === undefined;
	},
	isJSON: function (data) {
		try {
			return JSON.parse(data);
		} catch (e) {
			return data
		}
	},
	nodeCollapsed: function (args) {
		this.expandedTreeNodes = this.treeObj.expandedNodes;
		this.getExportedNodesForMultiSelect();
	},
	widgetCreated: function (args) {
		$(".e-treeview>.e-ul").css({ 'overflow-x': 'hidden' });
	},
	nodeExpanded: function (args) {
		this.expandedTreeNodes = this.treeObj.expandedNodes;
		this.getExportedNodesForMultiSelect();
	},
	nodeChecking: function (args) {
		this.treeObj.selectedNodes = [args.data[0].id];
	},
	nodeSelecting: function (args) {
		if (!this.isNullOrUndefined(args.nodeData)) {
			this.selectedNodeForExport = [];
			this.selectedNodeForExport[0] = args.nodeData.id;
			this.getExportedNodesForMultiSelect();
		}
	},
	nodeClicked: function (args) {
		var checkedNode = [args.node];
		if (args.event.target.classList.contains('e-fullrow') || args.event.key == "Enter") {
			var getNodeDetails = this.treeObj.getNode(args.node);
			if (getNodeDetails.isChecked == 'true') {
				this.treeObj.uncheckAll(checkedNode);
			} else {
				this.treeObj.checkAll(checkedNode);
			}
		}
	},
	nodeChecked: function (args) {
		if (args.action === "uncheck") {
			var fullrow = $(args.node).parents('li').children('.e-fullrow');
			var text = $(args.node).parents('li').children('.e-text-content').children('.e-list-text');
			$(fullrow).css({ 'background-color': 'white', 'border-color': 'white' });
			$(text)[0].style.color = 'rgba(0,0,0,0.87)';
			$(args.node).removeClass('e-active-check');
			var activeElement = $(this.element).find('.e-checkbox-wrapper.e-css.e-active-check');
			if ($(activeElement).length > 0) {
				var activerownew = $(activeElement).parents('li').children('.e-fullrow');
				var activetextnew = $(activeElement).parents('li').children('.e-text-content').children('.e-list-text');
				$(activerownew).css({ 'background-color': 'white', 'border-color': 'white' });
				$(activetextnew)[0].style.color = 'rgba(0,0,0,0.87)';
				$('.e-checkbox-wrapper.e-css.e-active-check').removeClass('e-active-check')
			}
		}
		if (args.action === "check") {
			var activeEle = $(this.element).find('.e-checkbox-wrapper.e-css.e-active-check');
			if ($(activeEle).length > 0) {
				var activerow = $(activeEle).parents('li').children('.e-fullrow');
				var activetext = $(activeEle).parents('li').children('.e-text-content').children('.e-list-text');
				$(activerow).css({ 'background-color': 'white', 'border-color': 'white' });
				$(activetext)[0].style.color = 'rgba(0,0,0,0.87)';
				$('.e-checkbox-wrapper.e-css.e-active-check').removeClass('e-active-check')
			}
			var fullrow = $(args.node).parents('li').children('.e-fullrow');
			var text = $(args.node).parents('li').children('.e-text-content').children('.e-list-text');
			$(fullrow).css({ 'background-color': '#eee', 'border-color': '#eee' });
			$(text)[0].style.color = this.model.properties.selectedTextColor;
			$(args.node).addClass('e-active-check');
		}
		this.nodeSelected = true;
		this.treeViweIns = $($('#' + this.element.id + 'treeview')[0]).closest('.e-customwidget-item').data('widgetInstance');
		this.getExportedNodesForMultiSelect();
		if (this.model.initMode === "runtime") {
			var selectedFilterInfos = [];
			var customWidgetObject = $(this.element).closest('.e-customwidget-item').data('widgetInstance');
			if (this.treeObj.getAllCheckedNodes().length > 0) {
				var checkedItems = this.treeObj.getAllCheckedNodes();
				var treeData = this.treeObj.treeData;
				var tempItems = [];
				for (var j = 0; j < checkedItems.length; j++) {
					tempItems.push(checkedItems[j]);
					var pId = checkedItems[j];
					for (var k = 0; k < this.model.boundColumns.pcolumn.length; k++) {
						if (!this.isNullOrUndefined(treeData[pId - 1].pid)) {
							tempItems.push(treeData[pId - 1].pid.toString());
							pId = treeData[pId - 1].pid;
						}
					}
				}
				for (var i = 0; i < treeData.length; i++) {
					if (tempItems.indexOf(this.treeObj.treeData[i].id.toString()) > -1) {
						var itemAdded = false;
						if (selectedFilterInfos.length > 0) {
							for (var j = 0; j < selectedFilterInfos.length; j++) {
								if (selectedFilterInfos[j].uniqueColumnName == this.treeObj.treeData[i].columnName) {
									selectedFilterInfos[j].values.push(this.treeObj.treeData[i].name);
									itemAdded = true;
								}
							}
						}
						if (!itemAdded) {
							var filterinfo = new bbicustom.dashboard.selectedColumnInfo();
							filterinfo.condition = "Include";
							filterinfo.values = [this.treeObj.treeData[i].name];
							filterinfo.uniqueColumnName = this.treeObj.treeData[i].columnName;
							selectedFilterInfos.push(filterinfo);
						}
						if (selectedFilterInfos.length == tempItems.length) {
							break;
						}
					}
				}
			}
			if (customWidgetObject.widgetJson.FilterSettings.ActAsMasterWidget) {
				if (selectedFilterInfos.length > 0) {
					bbicustom.dashboard.filterData(this, selectedFilterInfos);
				} else {
					bbicustom.dashboard.filterData(this, selectedFilterInfos);
					BoldBIDashboard.Dashboard.WidgetHelper.disableClearFilter(customWidgetObject);
				}
			}
		}	
	},
	
	getData: function(){
		if(this.model.dataSource.length > 0 && this.model.boundColumns.pcolumn.length > 0){
			var treeDataObj = [];
			var tempNames = [];
			var childIndex = 0;
			this['id'] = 0;
			for(var i = 0; i < this.model.dataSource.length; i++){
				if(tempNames.indexOf(this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName]) == -1 && !this.isNullOrUndefined(this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName]) && this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName] != "(Null)" && this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName] != "(Blanks)"){
					this['id'] = this['id'] +1;
					tempNames.push(this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName]);
					if(this.model.boundColumns.pcolumn.length > 1){
						treeDataObj.push({"id":this['id'],"name":this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName],"hasChild":this.model.boundColumns.pcolumn.length > 1,"columnName":this.model.boundColumns.pcolumn[0].uniqueColumnName, "expanded": this.model.properties.expand});
					} 
					else {
						treeDataObj.push({"id":this['id'],"name":this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName],"columnName":this.model.boundColumns.pcolumn[0].uniqueColumnName});
					}
					if(this.model.boundColumns.pcolumn.length > 1){
						this.getchildLevel(treeDataObj,this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName],this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName],this['id'],childIndex);
					}
				}
			}
			return treeDataObj;
		}
		else{
			return this.defaultData
		}
	},
	
	getchildLevel: function(treeDataObj,parentName,gParentName,parentID,childIndex){
		var tempNames = [];
		childIndex++;
		for (var i = 0; i < this.model.dataSource.length; i++) {
			if (parentName == this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex-1].uniqueColumnName] && gParentName == this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName]) {
				if(tempNames.indexOf(this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName]) == -1 && !this.isNullOrUndefined(this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName]) && this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName] != "(Null)" && this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName] != "(Blanks)"){
					this['id'] = this['id']+1;
					tempNames.push(this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName]);
					if(this.model.boundColumns.pcolumn.length > (childIndex+1)){
						treeDataObj.push({"id":this['id'],"pid":parentID,"name":this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName],"hasChild":this.model.boundColumns.pcolumn.length > (childIndex+1),"columnName":this.model.boundColumns.pcolumn[childIndex].uniqueColumnName, "expanded": this.model.properties.expand});
					} 
					else {
						treeDataObj.push({"id":this['id'],"pid":parentID,"name":this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName],"columnName":this.model.boundColumns.pcolumn[childIndex].uniqueColumnName});
					}
					if(this.model.boundColumns.pcolumn.length > (childIndex+1)){
						this.getchildLevel(treeDataObj,this.model.dataSource[i][this.model.boundColumns.pcolumn[childIndex].uniqueColumnName],this.model.dataSource[i][this.model.boundColumns.pcolumn[0].uniqueColumnName],this['id'],childIndex);
					}
				}
			}
			
		}
	},

	getExportedNodesForMultiSelect : function() {
		var nodes = [];
		if(this.expandedTreeNodes != [] && this.expandedTreeNodes.length > 0) {
		for(var i=0;i <= this.expandedTreeNodes.length;i++) {
					if(i===0) {
						nodes[0] = "ExpandedNodes";
					} else {
						nodes[i] = this.expandedTreeNodes[i-1];
					}
				}
		}  
		if (this.selectedNodeForExport.length > 0){
			var k = 0;
			var selectedNodes = JSON.parse(JSON.stringify(this.selectedNodeForExport));
			nodes[nodes.length] = "SelectedNodes";
			var nodeslength = nodes.length;
			for(var n = nodeslength; n < (nodeslength + selectedNodes.length);n++) {
					nodes[n] = this.selectedNodeForExport[k];
					k++
				}
		}
		if(this.treeObj.getAllCheckedNodes().length > 0){
			var m = 0;
			var checkedNodes = JSON.parse(JSON.stringify( this.treeObj.getAllCheckedNodes()));
			nodes[nodes.length] = "CheckedNodes";
				var nodelength = nodes.length;
			    for(var p = nodelength; p < (nodelength + checkedNodes.length);p++) {
					nodes[p] = checkedNodes[m];
					m++
				}
		}
		this.model.exportParameters = JSON.stringify(nodes);
	},
	createStyle : function() {
            var styleTag = '<style' + ' >\n';
            styleTag = styleTag + '.bbi-dashboarddesigner-bannerPanel-iconcontainer' + '\n{\n' + 'display:none' + '\n}\n';
            styleTag = styleTag + '</style>';
            return styleTag;
        },
    update: function (option) {
		var widgetIns = $(this.element).closest(".e-customwidget-item").data("widgetInstance");
        var isExporting = !this.isNullOrUndefined(widgetIns.designer.model.dashboardFromData) && widgetIns.designer.model.dashboardFromData.loadFromData;
		if(!isExporting && this.model.dataSource.length > 0){
	        this.getExportedNodesForMultiSelect();
		}
        if (option.type == "resize") {
			this.nodeSelected = false;
            this.element.innerHTML = '';
            this.init(this.treeObj.getAllCheckedNodes(),this.selectedNodeForExport,this.expandedTreeNodes);
			if(!this.isNullOrUndefined($('.e-control.e-treeview .e-list-item.e-active .e-list-text')[0])){
			$('.e-control.e-treeview .e-list-item.e-active .e-list-text')[0].style.color = this.model.properties.selectedTextColor;
		    }
            return;
        }
        else if (option.type == "refresh") {
			if(true) {
				this.element.innerHTML = '';
				this.init(this.treeObj.getAllCheckedNodes(),this.selectedNodeForExport,this.expandedTreeNodes);
				this.nodeSelected = false;
			} else {
				this.nodeSelected = false;
			}
			return;
        }
		else if (option.type == "clearFilter") {
            this.element.innerHTML = '';
            this.init();
			this.model.exportParameters = "[]";
            return;
        }
        else if (option.type == "propertyChange") {

            switch (option.property.name) {
                case "expand":
				case "multiSelect":
				case "selectedTextColor":
                    this.element.innerHTML = '';
                    this.init();
            }
        }
    }
});