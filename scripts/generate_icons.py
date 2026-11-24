import base64
import os

with open('public/icons/collecte-white.png', 'rb') as f:
    b64_1 = base64.b64encode(f.read()).decode('utf-8')
with open('public/icons/bureaux-white.png', 'rb') as f:
    b64_2 = base64.b64encode(f.read()).decode('utf-8')
with open('public/icons/system-logo.png', 'rb') as f:
    b64_logo = base64.b64encode(f.read()).decode('utf-8')

code = f'''import React from "react";

export const COLLECTE_ICON_DATA_URI = "data:image/png;base64,{b64_1}";
export const BUREAUX_ICON_DATA_URI = "data:image/png;base64,{b64_2}";
export const SYSTEM_LOGO_DATA_URI = "data:image/png;base64,{b64_logo}";

interface CustomIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {{
  className?: string;
  size?: string | number;
  strokeWidth?: string | number;
  color?: string;
  [key: string]: any;
}}

export function CollecteIcon({{ className = "w-[22px] h-[22px]", strokeWidth, size = 22, color, style, ...props }}: CustomIconProps) {{
  const pxSize = typeof size === "number" ? `${{size}}px` : size || "22px";
  return (
    <img
      src={{COLLECTE_ICON_DATA_URI}}
      alt="Collecte des résultats"
      className={{`inline-block shrink-0 object-contain ${{className}}`}}
      style={{{{ width: pxSize, height: pxSize, minWidth: pxSize, minHeight: pxSize, ...style }}}}
      {{...props}}
    />
  );
}}

export function BureauxIcon({{ className = "w-[22px] h-[22px]", strokeWidth, size = 22, color, style, ...props }}: CustomIconProps) {{
  const pxSize = typeof size === "number" ? `${{size}}px` : size || "22px";
  return (
    <img
      src={{BUREAUX_ICON_DATA_URI}}
      alt="Bureaux de vote"
      className={{`inline-block shrink-0 object-contain ${{className}}`}}
      style={{{{ width: pxSize, height: pxSize, minWidth: pxSize, minHeight: pxSize, ...style }}}}
      {{...props}}
    />
  );
}}

export function SystemLogoIcon({{ className = "w-16 h-16", ...props }}: CustomIconProps) {{
  return (
    <img
      src={{SYSTEM_LOGO_DATA_URI}}
      alt="Logo Système CDT"
      className={{`inline-block shrink-0 object-contain ${{className}}`}}
      {{...props}}
    />
  );
}}
'''

with open('src/components/layout/CustomIcons.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("CustomIcons.tsx successfully generated!")
