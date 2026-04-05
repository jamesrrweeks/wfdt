# WFDT Design System

## Colour tokens
| Token | Value | Usage |
|---|---|---|
| primary | #CDEA45 | Lime — selected state, CTA, brand |
| red | #BC4749 | Errors, destructive |
| textStrong | #3D331A | Primary text, icons, interactions |
| textWeak | #7A7059 | Secondary / muted text |
| strokeStrong | #A69A80 | Borders, dividers |
| strokeWeak | #F0ECE4 | Page background |
| fill | #FAF8F5 | Input fields, stepper buttons, chip container |
| background | #FFFFFF | Cards, chip backgrounds |
| pill | #3D331A | Selected ingredient pill bg |
| pillText | #FAF8F5 | Selected ingredient pill text |

## Spacing tokens
| Token | Value |
|---|---|
| nil | 0px |
| xxs | 4px |
| xs | 8px |
| s | 16px |
| m | 24px |
| l | 32px |
| xl | 48px |
| xxl | 80px |

## Typography
All Atkinson Hyperlegible
| Token | Size | Line height | Weight |
|---|---|---|---|
| h1 | 40px | 48px | 700 |
| h2 | 32px | 40px | 700 |
| h3 | 20px | 28px | 700 |
| small | 16px | 24px | 400 |
| tiny | 14px | 20px | 400 |

## Elevation
| Token | Value |
|---|---|
| raised | 0px 2px 2px rgba(51,61,26,0.1) |
| overlay | 0px 8px 6px -2px rgba(61,51,26,0.15) |

## Component specs

### CategoryTab
- Size: hugs content, height 64px
- Padding: xs top/bottom, m left/right
- Active: textStrong bg, no border, white label
- Inactive: fill bg, 1px strokeStrong border
- Shadow: raised
- Icon: 24×24, gap xxs to label
- Label: T.tiny weight 400

### Chip / Pill (item selection)
- Height: 36px, border-radius: 32px
- Padding: xs top/bottom, s left/right
- Unselected: background bg, strokeStrong border
- Selected: primary bg, primary border
- Label: T.tiny, textStrong

### Search field
- Height: 40px, border-radius: 32px
- Padding: xs top/bottom, s left/right
- Border: 1px strokeStrong
- Background: background
- Leading icon: SearchIcon 16×16 in textStrong

### Chip container
- Background: fill
- Border: 1px strokeStrong
- Border-radius: 16px
- Shadow: overlay
- overflow: hidden
- Pills section padding: m top, s sides
- Search section padding: 0 top, s sides, s bottom
- Gap between pills: xs
- No divider between pills and search

### Stepper
- Total width: 120px, height: 40px
- Left button: border-radius 48px 0 0 48px, fill bg
- Centre: 31px wide, border top/bottom only
- Right button: border-radius 0 48px 48px 0, fill bg
- Icons: PlusIcon / MinusIcon SVG in textStrong
