/* eslint-disable react-hooks/rules-of-hooks */
import {
	BaseBoxShapeUtil,
	HTMLContainer,
	TLVideoShape,
	toDomPrecision,
	useIsEditing,
	videoShapeMigrations,
	videoShapeProps,
} from '@tldraw/editor'
import { ReactEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { BrokenAssetIcon } from '../shared/BrokenAssetIcon'
import { HyperlinkButton } from '../shared/HyperlinkButton'
import { getSvgFromString } from '../shared/svgs'
import { usePrefersReducedMotion } from '../shared/usePrefersReducedMotion'

/** @public */
export class VideoShapeUtil extends BaseBoxShapeUtil<TLVideoShape> {
	static override type = 'video' as const
	static override props = videoShapeProps
	static override migrations = videoShapeMigrations

	override canEdit = () => true
	override isAspectRatioLocked = () => true

	override getDefaultProps(): TLVideoShape['props'] {
		return {
			w: 100,
			h: 100,
			assetId: null,
			time: 0,
			playing: true,
			url: '',
		}
	}

	component(shape: TLVideoShape) {
		const { editor } = this
		const showControls = editor.getShapeGeometry(shape).bounds.w * editor.getZoomLevel() >= 110

		const { time, playing, assetId } = shape.props

		const asset = assetId ? editor.getAsset(assetId) : null

		const rVideo = useRef<HTMLVideoElement>(null!)

		const [isLoaded, setIsLoaded] = useState(false)

		const isEditing = useIsEditing(shape.id)

		const prefersReducedMotion = usePrefersReducedMotion()

		const handlePlay = useCallback<ReactEventHandler<HTMLVideoElement>>(
			(e) => {
				const video = e.currentTarget

				editor.updateShapes([
					{
						type: 'video',
						id: shape.id,
						props: {
							playing: true,
							time: video.currentTime,
						},
					},
				])
			},
			[shape.id, editor]
		)

		const handlePause = useCallback<ReactEventHandler<HTMLVideoElement>>(
			(e) => {
				const video = e.currentTarget

				editor.updateShapes([
					{
						type: 'video',
						id: shape.id,
						props: {
							playing: false,
							time: video.currentTime,
						},
					},
				])
			},
			[shape.id, editor]
		)

		const handleSetCurrentTime = useCallback<ReactEventHandler<HTMLVideoElement>>(
			(e) => {
				const video = e.currentTarget

				if (isEditing) {
					editor.updateShapes([
						{
							type: 'video',
							id: shape.id,
							props: {
								time: video.currentTime,
							},
						},
					])
				}
			},
			[isEditing, shape.id, editor]
		)

		const handleLoadedData = useCallback<ReactEventHandler<HTMLVideoElement>>(
			(e) => {
				const video = e.currentTarget
				if (time !== video.currentTime) {
					video.currentTime = time
				}

				if (!playing) {
					video.pause()
				}

				setIsLoaded(true)
			},
			[playing, time]
		)

		// If the current time changes and we're not editing the video, update the video time
		useEffect(() => {
			const video = rVideo.current

			if (!video) return

			if (isLoaded && !isEditing && time !== video.currentTime) {
				video.currentTime = time
			}

			if (isEditing) {
				if (document.activeElement !== video) {
					video.focus()
				}
			}
		}, [isEditing, isLoaded, time])

		useEffect(() => {
			if (prefersReducedMotion) {
				const video = rVideo.current
				video.pause()
				video.currentTime = 0
			}
		}, [rVideo, prefersReducedMotion])

		return (
			<>
				<HTMLContainer
					id={shape.id}
					className="tl-video-container tl-counter-scaled"
					style={{
						color: 'var(--color-text-3)',
						backgroundColor: asset ? 'transparent' : 'var(--color-low)',
						border: asset ? 'none' : '1px solid var(--color-low-border)',
					}}
				>
					{asset?.props.src ? (
						<video
							ref={rVideo}
							style={isEditing ? { pointerEvents: 'all' } : undefined}
							className={`tl-video tl-video-shape-${shape.id.split(':')[1]}`}
							width="100%"
							height="100%"
							draggable={false}
							playsInline
							autoPlay
							muted
							loop
							disableRemotePlayback
							disablePictureInPicture
							controls={isEditing && showControls}
							onPlay={handlePlay}
							onPause={handlePause}
							onTimeUpdate={handleSetCurrentTime}
							onLoadedData={handleLoadedData}
							hidden={!isLoaded}
						>
							<source src={asset.props.src} />
						</video>
					) : (
						<BrokenAssetIcon />
					)}
				</HTMLContainer>
				{'url' in shape.props && shape.props.url && (
					<HyperlinkButton url={shape.props.url} zoomLevel={editor.getZoomLevel()} />
				)}
			</>
		)
	}

	indicator(shape: TLVideoShape) {
		return <rect width={toDomPrecision(shape.props.w)} height={toDomPrecision(shape.props.h)} />
	}

	override toSvg(shape: TLVideoShape) {
		return getSvgFromString(
			`<g><image href="${serializeVideo(shape.id)}" width="${shape.props.w}" height="${shape.props.h}" /></g>`
		)
	}
}

// Function from v1, could be improved but explicitly using this.model.time (?)
function serializeVideo(id: string): string {
	const splitId = id.split(':')[1]
	// todo: create the video element rather than get it from the DOM
	const video = document.querySelector(`#video-${splitId}`) as HTMLVideoElement
	if (video) {
		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		canvas.getContext('2d')!.drawImage(video, 0, 0)
		return canvas.toDataURL('image/png')
	} else throw new Error('Video with not found when attempting serialization.')
}
