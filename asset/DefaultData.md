# Building a Default View for Custom Widget 

Prioritize constructing the custom widget with static data before integrating Bold BI data binding. 

## Obtaining the Custom Widget with Static Data

Test your custom widget without data binding by incorporating static data. After adding the custom widget to the Bold BI application, upon drag and drop, retrieve the HTML div element (**this.element**) in the **sourcefile.js, init()** method. Then, render your custom widget and append it to the respective div element to visualize it with default data.

``` javascript
	init: function () {
        /* init method will be called when the widget is initialized */
        var data = [
			{ x: 'Item 1', y: 27},
			{ x: 'Item 2', y: 20},
			{ x: 'Item 3', y: 17},
			{ x: 'Item 4', y: 35},
			{ x: 'Item 5', y: 50}
		];

		var chart = new Chart({
			primaryXAxis: {
				valueType: 'Category'
			},
			series: [
				{
					type: 'Column', xName: 'x', yName: 'y',
					dataSource: data
				}
			]
		});
		chart.appendTo(this.element);
		
    }
```
**Note** : This sample default data is specifically intended for use with the Syncfusion EJ2 column chart control.