import {
	defaultColorNames,
	TLDefaultColorStyle,
	TLDefaultColorTheme,
	TLDefaultFillStyle,
	useEditor,
	useSvgExportContext,
	useValue
} from '@tldraw/editor';
import React from 'react'
import { useGetHashPatternZoomName } from './defaultStyleDefs'

interface ShapeFillProps {
	d: string
	fill: TLDefaultFillStyle
	color: TLDefaultColorStyle | string
	theme: TLDefaultColorTheme
	scale: number
}

export const ShapeFill = React.memo(function ShapeFill({
	theme,
	d,
	color,
	fill,
	scale,
}: ShapeFillProps) {
	switch (fill) {
		case 'none': {
			return null
		}
		case 'solid': {
			return <path fill={defaultColorNames.includes(color as TLDefaultColorStyle) ? theme[color as TLDefaultColorStyle].semi : color} d={d} />
		}
		case 'semi': {
			return <path fill={theme.solid} d={d} />
		}
		case 'fill': {
			return <path fill={defaultColorNames.includes(color as TLDefaultColorStyle) ? theme[color as TLDefaultColorStyle].fill : color} d={d} />
		}
		case 'pattern': {
			return <PatternFill theme={theme} color={color} fill={fill} d={d} scale={scale} />
		}
	}
})

export function PatternFill({ d, color, theme }: ShapeFillProps) {
	const editor = useEditor()
	const svgExport = useSvgExportContext()
	const zoomLevel = useValue('zoomLevel', () => editor.getZoomLevel(), [editor])
	const getHashPatternZoomName = useGetHashPatternZoomName()

	const teenyTiny = editor.getZoomLevel() <= 0.18

	return (
		<>
			<path fill={defaultColorNames.includes(color as TLDefaultColorStyle) ? theme[color as TLDefaultColorStyle].pattern : color} d={d} />
			<path
				fill={
					svgExport
						? `url(#${getHashPatternZoomName(1, theme.id)})`
						: teenyTiny
							? (defaultColorNames.includes(color as TLDefaultColorStyle) ?theme[color as TLDefaultColorStyle].semi : color)
							: `url(#${getHashPatternZoomName(zoomLevel, theme.id)})`
				}
				d={d}
			/>
		</>
	)
}
