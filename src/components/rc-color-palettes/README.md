# 颜色面板

### 参数

| -        | 类型        | 说明                              |
| -------- | ----------- | --------------------------------- |
| onChange | (color)=>{} | color：tinyColor(详见 tinyColor2) |

### 样例

```jsx
import React from "react";
import { render } from "react-dom";
import ColorPalettes from "./components/rc-color-palettes";

render(
  <ColorPalettes
    onChange={(c) => {
      console.log(c.toHexString());
      console.log(c.toHsvString());
      console.log(c.toRgbString());
    }}
  />,
  document.getElementById("root")
);
```
