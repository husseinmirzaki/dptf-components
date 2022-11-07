import { Component } from "vue";

export class CustomLayerItems {
  mapToolsButton: Array<any> = [];
  mapToolWindow: Array<any> = [];
  mapExtensions: Array<any> = [];

  get hasMapToolsButton() {
    return this.mapToolsButton.length > 0;
  }

  get hasMapToolWindow() {
    return this.mapToolWindow.length > 0;
  }

  get hasMapExtensions() {
    return this.mapExtensions.length > 0;
  }

  add(item: Record<"type", Component>) {
    if (!item["type"].name) {
      return;
    }
    const componentName = item["type"].name.toLowerCase();
    if (componentName.startsWith("maptoolsbutton")) {
      this.mapToolsButton.push(item);
    } else if (componentName.startsWith("maptoolswindow")) {
      this.mapToolWindow.push(item);
    } else if (componentName.startsWith("mapextension")) {
      this.mapExtensions.push(item);
    }
  }
}
