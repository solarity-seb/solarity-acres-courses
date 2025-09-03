<script>
	export let text = "";
</script>

<style>
.tooltip-wrapper {
	position: relative;
	display: inline-block;
	vertical-align: top; /* fixes small baseline issues */
}




.tooltip-content {
	position: absolute;
	bottom: 125%; /* show above by default */
	left: 50%;
	transform: translateX(-50%);
	background-color: var(--dark);
	color: var(--light);
	padding: 0.4em 0.6em;
	border-radius: 4px;
	font-size: var(--text-xs);
	white-space: nowrap;
	opacity: 0;
	transition: opacity 0.2s var(--cubic);
	pointer-events: none;
	z-index: 10;
}

.tooltip-wrapper:hover .tooltip-content,
.tooltip-wrapper:focus-within .tooltip-content {
	opacity: 1;
}

.tooltip-arrow {
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-left: 6px solid transparent;
	border-right: 6px solid transparent;
	border-top: 6px solid var(--dark);
}
</style>

<span class="tooltip-wrapper" tabindex="0">
	<slot />
	<span class="tooltip-content">
		{text}
		<span class="tooltip-arrow"></span>
	</span>
</span>
