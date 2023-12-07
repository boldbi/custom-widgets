# Bold BI Custom Widget Samples 

Welcome to the Bold BI Custom Widgets Repository!

## Overview

This repository serves as a hub for custom widgets designed to enhance your experience with Bold BI applications. Whether you're looking to create new widgets or modify existing samples, this space is dedicated to fostering collaboration and innovation.

## Getting the custom widget samples

To use the sample custom widgets, clone this GitHub repository using Git.

```csharp
    git clone https://github.com/boldbi/custom-widgets
    cd custom-widgets
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

## Building the custom widget
1.  [Building a custom widget with Static Data](assets/DefaultData.md)
2.  [Defining the Data Binding](assets/DataBinding.md)
3.  [Defining the Properties](assets/PropertyPanel.md)
4.  [Filter Interaction](assets/FilterInteraction.md)
5.  [Defining Filters Section](assets/FiltersSection.md)