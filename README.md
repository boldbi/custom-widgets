# Bold BI Custom Widget Samples 

You can create a new custom widget and pack the sample custom widgets that are already available using the details provided below.

## Getting the custom widget samples

To use the sample custom widgets, clone this GitHub repository using Git.

```csharp
    git clone https://github.com/boldbi/custom-widgets
    cd BoldBI-customwidget-Samples
```

* Install required packages by below command. 

```csharp
npm install
```

* To create a new custom widget.

```csharp
npm run create -- --widgetname=testwidget
```

* To pack all custom widgets in a common location.

```csharp
npm run packall
```

* To pack specific custom widget.

```csharp
npm run pack -- --widgetname=sunburst
```