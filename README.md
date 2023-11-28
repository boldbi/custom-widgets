# Custom Widget Component 

You can pack and create the custom widgets with the use of below details. 

## Development Environment

* Node.js version – 16.17.0 +
* NPM version – 8.15.0 +

## Prepare Environment

You can checkout the source from below repository.
https://github.com/boldbi/custom-widgets

once checkout the source, open command prompt and change the working directory to root directory of gulp.js file. 
 

* Install node.js in your machine. You can download node.js from below link.
  https://nodejs.org/en/download/ 

* Install gulp in your machine by below command. 

```csharp
npm install  gulp -g
```

* Install required packages by below command. 

```csharp
npm install
```


* To pack all custom widgets in a common location.

```csharp
gulp pack-all-customwidgets
```

* To pack specific custom widget.

```csharp
gulp pack-customwidget --widgetname "sunburst"
```

* To create a custom widget.

```csharp
gulp create-customwidget --widgetname "testwidget"
```