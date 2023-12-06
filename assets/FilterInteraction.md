# Custom Widget Interaction 

Enable interaction between the custom widget and built-in widgets using the following APIs.

To obtain the values for applying filtering, you can associate the click event with the corresponding control. By doing so, you will be able to retrieve the values when that event occurs. 

Retrieve unique column names and values from the custom widget model (**this.model.dataSource** and **this.model.boundColumns**).

```javascript

	var selectedColumnsFilter = [];
	var filterColumn = new bbicustom.dashboard.selectedColumnInfo();
	filterColumn.condition = "condition";
	filterColumn.uniqueColumnName = "unique column name";     // Utilize the custom widget model to obtain the unique name of the respective data column for filter interaction.
	filterColumn.values =["value1", "value2", "value3"…] ;    // Obtain the values associated with the corresponding control click event and transfer them to this location.
	selectedColumnsFilter.push(filterColumn);
	bbicustom.dashboard.filterData(this, selectedColumnsFilter); /* selectedColumnsFilter is the list of selected column and its value send from custom widget for interaction. */

```
This code snippet demonstrates how to communicate selected columns and values from the custom widget to enable interaction with other widgets.To gain a deeper understanding of applying filter interaction in custom widgets, you may consult the [Documentation](https://help.boldbi.com/visualizing-data/visualization-widgets/custom-widget/v5.2.48-or-later/create-new-custom-widget/#dimension-type-column) provided by Bold BI