import classNames from 'classnames'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { TlaIcon } from '../TlaIcon/TlaIcon'
import styles from './button.module.css'

export const TlaButton = forwardRef<
	HTMLButtonElement,
	ButtonHTMLAttributes<HTMLButtonElement> & {
		isLoading?: boolean
		icon?: string
		iconRight?: string
		variant?: 'primary' | 'secondary' | 'warning'
	}
>(function TlaButton(
	{
		children,
		className = '',
		icon = '',
		iconRight = '',
		variant = 'primary',
		isLoading = false,
		onClick,
		...props
	},
	ref
) {
	return (
		<button
			{...props}
			onClick={isLoading ? undefined : onClick}
			ref={ref}
			data-state={isLoading ? 'loading' : 'ready'}
			className={classNames(
				'tla-text_ui__medium',
				styles.button,
				{
					[styles.primary]: variant === 'primary',
					[styles.secondary]: variant === 'secondary',
				},
				className
			)}
		>
			{isLoading && !iconRight ? (
				<div className={styles.spinner}>
					<TlaIcon className="tla-spinner" icon="spinner" />
				</div>
			) : (
				<>
					{icon && <TlaIcon icon={icon} />}
					{children && <span>{children}</span>}
					{iconRight &&
						(isLoading ? (
							<div className={styles.iconRight}>
								<TlaIcon icon={iconRight} className={classNames(styles.spinner)} />
							</div>
						) : (
							<TlaIcon icon={iconRight} className={styles.iconRight} />
						))}
				</>
			)}
		</button>
	)
})
