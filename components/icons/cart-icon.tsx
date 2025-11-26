const CartIcon = ({
	color = "currentColor",
	width = "36px", // Updated default width
	height = "36px", // Updated default height
	className = "w-9 h-9", // Adjust default className for Tailwind users
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={width}
			height={height}
			viewBox="0 0 24 24"
			className={className}
			fill={color}
		>
			<path d="M7 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 1.99-.9 1.99-2-.89-2-1.99-2ZM7.16 14h9.72c.83 0 1.57-.5 1.89-1.26l3.31-7.59a1 1 0 0 0-.91-1.41H5.21L4.27 2H1v2h2.4l3.6 8-1.35 2.4A2 2 0 0 0 7 18h11v-2H7.16l1.1-2Zm10.23-2H8.53L6.16 6h14.54l-2.3 6Z" />
		</svg>
	);
};

export default CartIcon;
