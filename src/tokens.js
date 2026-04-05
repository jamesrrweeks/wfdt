export const C = {
  primary:      "#CDEA45",
  red:          "#BC4749",
  textStrong:   "#3D331A",
  textWeak:     "#7A7059",
  strokeStrong: "#A69A80",
  strokeWeak:   "#F0ECE4",
  fill:         "#FAF8F5",
  background:   "#FFFFFF",
  pill:         "#3D331A",
  pillText:     "#FAF8F5",
  get dark()    { return this.textStrong  },
  get lime()    { return this.primary     },
  get muted()   { return this.textWeak    },
  get border()  { return this.strokeStrong },
  get bg()      { return this.strokeWeak  },
  get white()   { return this.background  },
  get inputBg() { return this.fill        },
  shadow:       "rgba(61,51,26,0.08)",
};

export const SPACE = {
  nil:0, xxs:4, xs:8, s:16, m:24, l:32, xl:48, xxl:80,
};

export const F  = "'Atkinson Hyperlegible', sans-serif";
export const FD = "'Gasoek One', sans-serif";

export const T = {
  h1:    { fontSize:"40px", lineHeight:"48px", fontFamily:FD, fontWeight:"400" },
  h2:    { fontSize:"32px", lineHeight:"40px", fontFamily:F,  fontWeight:"700" },
  h3:    { fontSize:"20px", lineHeight:"28px", fontFamily:F,  fontWeight:"700" },
  h4:    { fontSize:"20px", lineHeight:"28px", fontFamily:F,  fontWeight:"400" },
  small: { fontSize:"16px", lineHeight:"24px", fontFamily:F,  fontWeight:"400" },
  tiny:  { fontSize:"14px", lineHeight:"20px", fontFamily:F,  fontWeight:"400" },
};

export const SHADOW = {
  raised:  "0px 2px 2px rgba(51,61,26,0.1)",
  overlay: "0px 8px 6px -2px rgba(61,51,26,0.15)",
};