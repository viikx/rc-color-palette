import React, { useState, useCallback, useRef, useEffect } from "react";
import tinycolor from "tinycolor2";
import "./index.css";

function useRange() {
  const [value, setValue] = useState(0);
  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  return {
    value,
    onChange,
  };
}

export default function ColorPalettes(params) {
  const hue = useRange();
  const [Initial, setInitial] = useState();
  const [color, setcolor] = useState();
  const [isDrag, setIsDrag] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const dragRef = useRef();
  const dragCloneRef = useRef();

  useEffect(() => {
    setcolor(
      tinycolor({
        h: hue.value,
        s: pos.current.x / 2,
        v: 100 - pos.current.y / 2,
      })
    );
  }, [hue.value]);

  const limit = useCallback((x, y) => {
    x = x < 0 ? 0 : x;
    x = x > 200 ? 200 : x;
    y = y < 0 ? 0 : y;
    y = y > 200 ? 200 : y;
    return { x, y };
  }, []);

  return (
    <article>
      <section
        className="palettes"
        style={{
          background: `linear-gradient(to right, transparent, ${
            tinycolor({ h: hue.value, s: 100, v: 100 })?.toHexString() ?? "#f00"
          })`,
        }}
        onDrop={(e) => {
          e.preventDefault();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          let { x, y } = limit(
            pos.current.x + e.clientX - Initial.x,
            pos.current.y + e.clientY - Initial.y
          );
          setcolor(tinycolor({ h: hue.value, s: x / 2, v: 100 - y / 2 }));
          dragCloneRef.current.style.transform = `translate(${x - 5}px, ${
            y - 5
          }px)`;
        }}
      >
        <div
          className="color-picker"
          style={{ visibility: !isDrag ? "hidden" : "visible" }}
          ref={dragCloneRef}
        />
        <div
          className="color-picker"
          ref={dragRef}
          style={{
            transform: `translate(${pos.current.x - 5}px, ${
              pos.current.y - 5
            }px)`,
            background: `${color?.toHexString()}`,
            opacity: isDrag ? 0 : 1,
          }}
          draggable="true"
          onDragStart={(e) => {
            setInitial({ x: e.clientX, y: e.clientY });
            const img = new Image();
            img.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
            e.dataTransfer.setDragImage(img, 0, 0);
            setIsDrag(true);
          }}
          onDragEnd={(e) => {
            let { x, y } = limit(
              pos.current.x + e.clientX - Initial.x,
              pos.current.y + e.clientY - Initial.y
            );

            pos.current = { x, y };
            setcolor(tinycolor({ h: hue.value, s: x / 2, v: 100 - y / 2 }));
            setIsDrag(false);
          }}
        />
      </section>

      <section className="select-hue">
        <input type="range" {...hue} min={0} max={360} />
      </section>
      <section>
        {color?.toHexString()}
        <br />
        {color?.toHsvString()}
        <br />
        {color?.toRgbString()}
        <br />
      </section>
    </article>
  );
}
