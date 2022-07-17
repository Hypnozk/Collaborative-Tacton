export const lightenDarkenColor = (col:string, amount:number):string => {
  let usePound = false;
  if (col[0] == "#") {
    col = col.slice(1);
    usePound = true;
  }

  const num = parseInt(col, 16);

  let r = (num >> 16) + amount;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amount;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amount;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  const string = "000000" + (g | (b << 8) | (r << 16)).toString(16);
  return (usePound ? "#" : "") + string.substr(string.length - 6);
};

export const defaultColors = ["#ff2d2d","#e6e600","#ffa22d","#07d248", "#009480", "#9b80ff", "#9933ff"]