# Adding Properties to the Custom Widget.

Utilize properties to customize your custom widget based on specific requirements.

To add properties, make changes in the **widgetconfig.json** file.

![](images/properties.png)

A sample schema for custom widget properties as follows. Based on the need you can define number of properties and properties group inside the (**functionalities**) key as below.

```json

	"functionalities": [
		{
			"header": "Basic Properties",
				"properties": [
				{
				  "displayName": "Boolean",
				  "controlType": "bool",
				  "name": "showText",
				  "defaultValue": "true"
				},
				{
				  "displayName": "Text",
				  "controlType": "text",
				  "name": "text",
				  "defaultValue": "Sample Text"
				},
				{
				  "displayName": "Color",
				  "controlType": "color",
				  "name": "textBackground",
				  "defaultValue": "#FFE5E5"
				},
				{
				  "displayName": "Number",
				  "controlType": "number",
				  "name": "textSize",
				  "defaultValue": 17,
				  "min": 0,
				  "max": 600
				},
				{
				  "displayName": "Enumeration",
				  "controlType": "enumeration",
				  "name": "textStyle",
				  "defaultValue": "Item 1",
				  "listItems": [
					"Item 1",
					"Item 2"
				  ]
				}
			]
		}
	]

```
Access the custom widget property values in the custom widget model using **this.model.properties**.